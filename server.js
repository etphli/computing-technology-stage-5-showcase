import express from "express";
import fs from "node:fs";
import https from "node:https";
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
const allowSelfSignedCert = process.env.DEEPSEEK_ALLOW_SELF_SIGNED_CERT === "true";

const courseContext = `
Computing Technology Stage 5 is a Year 9 and Year 10 elective for students who want to design, code, build, test and improve real digital technologies.
Main units: Web Development, Game Development, Mechatronics, and Python and App Development.
Web Development includes HTML, CSS, JavaScript basics, responsive design, user interface design, website structure, and publishing online.
Game Development includes game design principles, player interaction, sprites and assets, game logic, scoring systems, levels, difficulty, testing, and improvement.
Mechatronics includes robotics, sensors, motors, circuits, microcontrollers, inputs, outputs, and automated systems.
Python and App Development includes Python programming, variables, conditions, loops, functions, app interfaces, problem solving, and debugging.
The subject suits students who enjoy creating, problem solving, experimenting, designing, technology, games, websites, apps, robotics, or learning how digital systems work.
It connects to future pathways in software development, web design, cybersecurity, robotics, data, game design, engineering, product design, and many technology-rich careers.
`;

app.use(express.json({ limit: "1mb" }));

function postDeepSeekChat(payload) {
  const body = JSON.stringify(payload);
  const agent = allowSelfSignedCert
    ? new https.Agent({ rejectUnauthorized: false })
    : undefined;

  return new Promise((resolve, reject) => {
    const request = https.request(
      {
        method: "POST",
        hostname: "api.deepseek.com",
        path: "/chat/completions",
        agent,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`
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
    request.write(body);
    request.end();
  });
}

function fallbackAnswer(question = "") {
  const lower = question.toLowerCase();
  if (lower.includes("game")) {
    return "In Game Development, you learn how games are planned and coded: player controls, sprites, scoring, levels, difficulty, testing, and improving the experience. It is a great fit if you like creative problem solving and interactive design.";
  }
  if (lower.includes("robot") || lower.includes("mechatronic") || lower.includes("sensor")) {
    return "Mechatronics is where software meets hardware. You explore sensors, motors, circuits, microcontrollers, inputs and outputs, then use them to build smart automated systems.";
  }
  if (lower.includes("python") || lower.includes("app")) {
    return "Python and App Development helps you learn programming step by step through variables, conditions, loops, functions, debugging, problem solving, and interface ideas for apps.";
  }
  if (lower.includes("web") || lower.includes("website")) {
    return "Web Development is about designing and building interactive websites. You learn HTML, CSS, JavaScript basics, responsive design, user interface design, site structure, and how websites get published online.";
  }
  if (lower.includes("career") || lower.includes("future") || lower.includes("useful")) {
    return "Computing Technology is useful because digital skills appear in almost every future field: software, design, business, engineering, science, media, robotics, cybersecurity, and game development. You practise thinking like a creator, not just a user.";
  }
  return "Computing Technology Stage 5 is a creative Year 9 and Year 10 elective where you design, code, build and improve real digital technologies. You explore websites, games, robotics-style mechatronics, Python and app development, so it suits students who like making things and solving problems.";
}

app.post("/api/chat", async (req, res) => {
  const userMessage = String(req.body?.message || "").trim().slice(0, 1200);

  if (!userMessage) {
    return res.status(400).json({ error: "Please enter a question." });
  }

  if (!process.env.DEEPSEEK_API_KEY) {
    return res.json({
      answer: fallbackAnswer(userMessage),
      demo: true
    });
  }

  try {
    const response = await postDeepSeekChat({
        model: process.env.DEEPSEEK_MODEL || "deepseek-v4-flash",
        temperature: 0.6,
        max_tokens: 420,
        messages: [
          {
            role: "system",
            content:
              "You are a friendly course guide for Year 8 students choosing Year 9 electives. Answer only using the supplied Computing Technology Stage 5 course context. Be clear, encouraging, concise, and student-friendly. If a question is unrelated, gently bring it back to the course."
          },
          {
            role: "user",
            content: `Course context:\n${courseContext}\n\nStudent question: ${userMessage}`
          }
        ]
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error ${response.status}: ${response.text}`);
    }

    const data = JSON.parse(response.text);
    const answer = data?.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      throw new Error("DeepSeek returned an empty response.");
    }

    res.json({ answer });
  } catch (error) {
    console.error(error);
    res.status(502).json({
      answer: fallbackAnswer(userMessage),
      error: "The live course bot is unavailable, so a local course answer was used."
    });
  }
});

app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Computing Technology Stage 5 site running on http://localhost:${port}`);
  console.log(`DeepSeek API key loaded: ${process.env.DEEPSEEK_API_KEY ? "yes" : "no"}`);
  console.log(`DeepSeek self-signed certificate workaround: ${allowSelfSignedCert ? "on" : "off"}`);
});
