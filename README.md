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
OPENROUTER_API_KEY=your_key npm start
```

The OpenRouter API key stays server-side in `server.js`. The default model is the free `google/gemma-4-31b-it:free` variant. If no key is configured, the bot uses a local course-information fallback so the showcase still works during demos.

## Deploying the Chatbot

The chatbot needs a server-side API route. Static hosting such as GitHub Pages cannot securely run the OpenRouter key by itself.

For Vercel, set these environment variables in the project settings:

```bash
OPENROUTER_API_KEY=your_key
OPENROUTER_MODEL=google/gemma-4-31b-it:free
SITE_URL=https://your-site.example
```

The included `api/chat.js` function will handle `/api/chat` on Vercel.
