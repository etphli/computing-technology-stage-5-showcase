import https from "node:https";

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

function fallbackAnswer(question = "") {
  const lower = question.toLowerCase();
  if (lower.includes("game")) {
    return "In Game Development, you learn how games are planned and coded: player controls, sprites, scoring, levels, difficulty, testing, and improving the experience.";
  }
  if (lower.includes("robot") || lower.includes("mechatronic") || lower.includes("sensor")) {
    return "Mechatronics is where software meets hardware. You explore sensors, motors, circuits, microcontrollers, inputs and outputs, then use them to build smart automated systems.";
  }
  if (lower.includes("python") || lower.includes("app")) {
    return "Python and App Development helps you learn variables, conditions, loops, functions, debugging, problem solving, and app interface ideas.";
  }
  if (lower.includes("web") || lower.includes("website")) {
    return "Web Development is about designing and building interactive websites using HTML, CSS, JavaScript basics, responsive design, user interface design, site structure, and publishing online.";
  }
  return "Computing Technology Stage 5 is a creative Year 9 and Year 10 elective where you design, code, build and improve websites, games, mechatronics systems, Python programs and app ideas.";
}

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

  if (!process.env.OPENROUTER_API_KEY) {
    return res.json({ answer: fallbackAnswer(userMessage), demo: true });
  }

  try {
    const response = await postOpenRouterChat({
      model: process.env.OPENROUTER_MODEL || "google/gemma-4-31b-it:free",
      temperature: 0.6,
      max_tokens: 420,
      messages: [
        {
          role: "system",
          content:
            "You are a friendly course guide for Year 8 students choosing Year 9 electives. Answer only using the supplied Computing Technology Stage 5 course context. Be clear, encouraging, concise, and student-friendly."
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

    return res.json({ answer });
  } catch (error) {
    console.error(error);
    return res.status(502).json({
      answer: fallbackAnswer(userMessage),
      error: "The live course bot is unavailable, so a local course answer was used."
    });
  }
}
