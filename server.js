import express from "express";
import fs from "node:fs";
import https from "node:https";
import { courseBotInstructions, courseContext, directCourseAnswer, fallbackAnswer } from "./lib/courseBot.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadLocalEnv() {
  const envPath = path.join(__dirname, ".env");

  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadLocalEnv();

const app = express();
const port = process.env.PORT || 4173;
const allowSelfSignedCert = process.env.OPENROUTER_ALLOW_SELF_SIGNED_CERT === "true";

app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json({ limit: "1mb" }));

function postOpenRouterChat(payload) {
  const body = JSON.stringify(payload);
  const agent = allowSelfSignedCert
    ? new https.Agent({ rejectUnauthorized: false })
    : undefined;

  return new Promise((resolve, reject) => {
    const request = https.request(
      {
        method: "POST",
        hostname: "openrouter.ai",
        path: "/api/v1/chat/completions",
        agent,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.SITE_URL || "http://localhost:4173",
          "X-Title": "Computing Technology Stage 5"
        }
      },
      (response) => {
        let responseBody = "";

        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          responseBody += chunk;
        });
        response.on("end", () => {
          resolve({
            ok: response.statusCode >= 200 && response.statusCode < 300,
            status: response.statusCode,
            text: responseBody
          });
        });
      }
    );

    request.on("error", reject);
    request.setTimeout(8000, () => {
      request.destroy(new Error("OpenRouter request timed out."));
    });
    request.write(body);
    request.end();
  });
}

app.post("/api/chat", async (req, res) => {
  const userMessage = String(req.body?.message || "").trim().slice(0, 1200);

  if (!userMessage) {
    return res.status(400).json({ error: "Please enter a question." });
  }

  const directAnswer = directCourseAnswer(userMessage);
  if (directAnswer) {
    return res.json({ answer: directAnswer, grounded: true });
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return res.json({
      answer: fallbackAnswer(userMessage),
      demo: true
    });
  }

  try {
    const models = [
      process.env.OPENROUTER_MODEL || "liquid/lfm-2.5-1.2b-instruct:free",
      process.env.OPENROUTER_FALLBACK_MODEL || "openrouter/free"
    ].filter((model, index, all) => all.indexOf(model) === index);
    let lastError;

    for (const model of models) {
      try {
        const response = await postOpenRouterChat({
        model,
        temperature: 0.35,
        max_tokens: 220,
        messages: [
          {
            role: "system",
            content: courseBotInstructions
          },
          {
            role: "user",
            content: `Course context:\n${courseContext}\n\nStudent question: ${userMessage}`
          }
        ]
        });

        if (!response.ok) {
          throw new Error(`OpenRouter API error ${response.status}: ${response.text}`);
        }

        const data = JSON.parse(response.text);
        const answer = data?.choices?.[0]?.message?.content?.trim();
        if (!answer) {
          throw new Error("OpenRouter returned an empty response.");
        }

        return res.json({ answer, model: data.model || model });
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError || new Error("No OpenRouter model was available.");
  } catch (error) {
    console.error(error);
    res.json({
      answer: fallbackAnswer(userMessage),
      degraded: true
    });
  }
});

app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Computing Technology Stage 5 site running on http://localhost:${port}`);
  console.log(`OpenRouter API key loaded: ${process.env.OPENROUTER_API_KEY ? "yes" : "no"}`);
  console.log(`OpenRouter model: ${process.env.OPENROUTER_MODEL || "liquid/lfm-2.5-1.2b-instruct:free"}`);
  console.log(`OpenRouter fallback: ${process.env.OPENROUTER_FALLBACK_MODEL || "openrouter/free"}`);
  console.log(`OpenRouter self-signed certificate workaround: ${allowSelfSignedCert ? "on" : "off"}`);
});
