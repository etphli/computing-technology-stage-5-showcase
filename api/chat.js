import https from "node:https";
import { courseBotInstructions, courseContext, directCourseAnswer, fallbackAnswer } from "../lib/courseBot.js";

function postOpenRouterChat(payload) {
  const body = JSON.stringify(payload);
  const allowSelfSignedCert = process.env.OPENROUTER_ALLOW_SELF_SIGNED_CERT === "true";
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
          "HTTP-Referer": process.env.SITE_URL || "https://computing-technology-stage-5.vercel.app",
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

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const userMessage = String(req.body?.message || "").trim().slice(0, 1200);
  if (!userMessage) {
    return res.status(400).json({ error: "Please enter a question." });
  }

  const directAnswer = directCourseAnswer(userMessage);
  if (directAnswer) {
    return res.json({ answer: directAnswer, grounded: true });
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return res.json({ answer: fallbackAnswer(userMessage), demo: true });
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
    return res.json({
      answer: fallbackAnswer(userMessage),
      degraded: true
    });
  }
}
