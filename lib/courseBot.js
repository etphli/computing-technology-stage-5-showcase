export const courseContext = `
COURSE OVERVIEW
Computing Technology Stage 5 is a Year 9 and Year 10 elective for students who want to design, code, build, test and improve real digital technologies.
Students learn through practical creation, problem solving, experimentation, design, debugging and iteration.

UNITS AND POSSIBLE BUILDS
1. Web Development: HTML, CSS, JavaScript basics, responsive design, user interface design, website structure and online publishing. Students might plan and publish a polished responsive website, interactive page, portfolio or product-style site.
2. Game Development: game design principles, player interaction, sprites and assets, game logic, scoring, levels, difficulty, testing and improvement. Students might prototype a playable game with controls, goals, feedback, scoring and increasing challenge.
3. Mechatronics: robotics, sensors, motors, circuits, microcontrollers, inputs, outputs and automation. Students might build a smart system that senses its environment and responds with movement, light, sound or another automated action.
4. Python and App Development: Python, variables, conditions, loops, functions, app interfaces, problem solving and debugging. Students might code a useful Python program, interactive tool, quiz, calculator or app-interface prototype.

PROJECT INSPIRATION SHOWN ON THE WEBSITE
- NYX LLM (https://nyx-llm.vercel.app): an AI-style web experience showing how interfaces can make complex tools approachable.
- Runeforge (https://runeforge-six.vercel.app): a game-flavoured web project with interactive design, atmosphere and online publishing.
- Lazeecloth (https://lazeecloth.lovable.app): a product-style website demonstrating layout, branding and polished visual presentation.
These are inspiration examples, not guaranteed assessment tasks. Exact projects may change.

WHO MAY ENJOY IT
Students who enjoy making things, solving problems, experimenting, design, technology, games, websites, apps, robotics or understanding how digital systems work. Beginners can learn step by step; students do not need to arrive as expert programmers.

WHY IT IS USEFUL
The course develops computational thinking, creativity, project planning, testing, debugging and communication. It connects with software development, web design, cybersecurity, robotics, data, game design, engineering, product design and other technology-rich pathways.

TEACHER
Teacher details have not yet been supplied. Never invent a teacher name, room, email or teaching style. If asked, say that this information will be added soon.
`;

export const courseBotInstructions = `
You are the friendly Computing Technology Stage 5 course guide for Year 8 students choosing Year 9 electives.

Rules:
- Answer only from the supplied course context. Never invent course requirements, assessment tasks, costs, prerequisites, teacher details or facilities.
- Be concise: normally use 2-5 short sentences and stay under 110 words. Use up to 150 words only when the student explicitly asks for detail or a comparison.
- Lead with the direct answer. Avoid introductions, repetition, filler and generic encouragement.
- Use Markdown when it improves scanning: **bold** the key idea, and use a short bullet list for multiple items.
- When asked what students make or build, always use a one-sentence lead, 3-4 Markdown bullets, then briefly say that exact projects may change.
- Treat NYX LLM, Runeforge and Lazeecloth only as website inspiration. Never claim that students will recreate them or their mechanics.
- When a showcased project is relevant, you may provide its Markdown link using the URL in the context.
- Use at most one small heading. Do not use tables unless the student asks for a comparison.
- Mention that builds are examples and may change when that distinction matters.
- Keep language clear, specific and suitable for a Year 8 student.
- If a question is unrelated, briefly redirect it to Computing Technology Stage 5.
`;

export function fallbackAnswer(question = "") {
  const lower = question.toLowerCase();

  if (lower.includes("teacher") || lower.includes("teach") || lower.includes("room")) {
    return "**Teacher details have not been added yet.** Check with the school or ask again once the course page has been updated.";
  }
  if (lower.includes("make") || lower.includes("build") || lower.includes("project")) {
    return "You might build:\n\n- A **responsive website**\n- A **playable game prototype**\n- A **sensor-controlled smart system**\n- A **Python program or app prototype**\n\nExact projects may change.";
  }
  if (lower.includes("game")) {
    return "In **Game Development**, you explore controls, sprites, game logic, scoring, levels and testing. You might create a playable prototype with clear goals and increasing difficulty.";
  }
  if (lower.includes("robot") || lower.includes("mechatronic") || lower.includes("sensor")) {
    return "In **Mechatronics**, code meets hardware. You might use sensors, circuits, motors and microcontrollers to build a smart system that senses and responds.";
  }
  if (lower.includes("python") || lower.includes("app")) {
    return "In **Python and App Development**, you learn variables, conditions, loops, functions and debugging. You might create a useful program, quiz, calculator or app-interface prototype.";
  }
  if (lower.includes("web") || lower.includes("website")) {
    return "In **Web Development**, you use HTML, CSS and JavaScript basics to design responsive interfaces. You might publish a portfolio, interactive page or polished product-style website.";
  }
  if (lower.includes("career") || lower.includes("future") || lower.includes("useful")) {
    return "The course builds **creative problem-solving and practical coding skills**. It connects with pathways such as software, web design, cybersecurity, robotics, games, engineering and product design.";
  }

  return "**Computing Technology Stage 5** is a practical Year 9 and 10 elective where you design, code and improve real digital projects. You explore websites, games, mechatronics, Python and app development.";
}
