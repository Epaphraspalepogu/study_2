import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

dotenv.config();

const PORT = process.env.PORT || 3001;
const GEMINI_TIMEOUT_MS = 30_000;

export function createApp({
  apiKey = process.env.GEMINI_API_KEY,
  fetchImpl = fetch,
  timeoutMs = GEMINI_TIMEOUT_MS,
} = {}) {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '1mb' }));

const SYSTEM_PROMPT = `You are a study-material generator.

Convert the user's study material into structured learning content.

Return ONLY valid JSON.
Never return Markdown.
Never return code fences.
Never return explanations outside JSON.

The JSON must exactly follow this structure:

{
  "topic": "string",
  "summary": "string",
  "flashcards": [
    {
      "id": "string",
      "question": "string",
      "answer": "string"
    }
  ],
  "quiz": [
    {
      "id": "string",
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": 0,
      "explanation": "string"
    }
  ]
}

Rules:
- Generate 5-10 flashcards.
- Generate 5 quiz questions.
- Every quiz question must have exactly 4 options.
- correctAnswer must be a zero-based integer from 0 to 3.
- Questions must be based only on the supplied study material/topic.
- Keep answers concise.
- Avoid duplicate questions.
- Make the quiz educational and clear.
- Return valid JSON only.`;

function extractJson(text) {
  if (!text) return null;
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  return cleaned;
}

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/generate', async (req, res) => {
    const { input } = req.body || {};
    if (!input || typeof input !== 'string' || !input.trim()) {
      return res.status(400).json({ error: 'Study material is required.' });
    }
    if (!apiKey) {
      return res.status(500).json({ error: 'Server is not configured with a Gemini API key.' });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${encodeURIComponent(apiKey)}`;

    try {
      const geminiRes = await fetchImpl(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ parts: [{ text: input.trim() }] }],
          generationConfig: {
            temperature: 0.4,
            responseMimeType: 'application/json',
          },
        }),
      });

      if (!geminiRes.ok) {
        const errText = await geminiRes.text().catch(() => '');
        console.error('Gemini API error:', geminiRes.status, errText);
        return res.status(502).json({ error: 'Unable to generate study content' });
      }

      const data = await geminiRes.json();
      const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (typeof raw !== 'string' || !raw.trim()) {
        return res.status(502).json({ error: 'No study content was generated.' });
      }

      const cleaned = extractJson(raw);
      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch (e) {
        console.error('JSON parse failed:', e.message);
        return res.status(502).json({ error: 'The AI returned an invalid response.' });
      }

      return res.json(parsed);
    } catch (err) {
      if (controller.signal.aborted) {
        return res.status(504).json({ error: 'Gemini took too long to respond. Please try again.' });
      }
      console.error('Server error:', err instanceof Error ? err.message : 'Unknown error');
      return res.status(500).json({ error: 'Unable to generate study content' });
    } finally {
      clearTimeout(timeout);
    }
  });

  return app;
}

const isMainModule = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isMainModule) {
  createApp().listen(PORT, () => {
    console.log(`Flam Study AI server running on http://localhost:${PORT}`);
  });
}
