# Computing Technology Stage 5 Showcase

A polished white-and-gold display website for Year 8 students choosing Year 9 electives.

## Run Locally

```bash
npm install
npm run dev
```

## Production Build With Chatbot Backend

```bash
npm run build
DEEPSEEK_API_KEY=your_key npm start
```

The chatbot API key stays server-side in `server.js`. If no key is configured, the bot uses a local course-information fallback so the showcase still works during demos.
