const GEMINI_TIMEOUT_MS = 30_000;

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
  return text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
}

export function handleHealth(_req, res) {
  return res.status(200).json({ status: 'ok' });
}

export async function handleGenerate(req, res, {
  apiKey = process.env.GEMINI_API_KEY,
  fetchImpl = fetch,
  timeoutMs = GEMINI_TIMEOUT_MS,
} = {}) {
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
      console.error('Gemini API request failed with status:', geminiRes.status);
      return res.status(502).json({ error: 'Unable to generate study content' });
    }

    const data = await geminiRes.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof raw !== 'string' || !raw.trim()) {
      return res.status(502).json({ error: 'No study content was generated.' });
    }

    let parsed;
    try {
      parsed = JSON.parse(extractJson(raw));
    } catch (error) {
      console.error('Gemini returned invalid JSON:', error.message);
      return res.status(502).json({ error: 'The AI returned an invalid response.' });
    }

    return res.status(200).json(parsed);
  } catch (error) {
    if (controller.signal.aborted) {
      return res.status(504).json({ error: 'Gemini took too long to respond. Please try again.' });
    }
    console.error('Gemini request failed:', error instanceof Error ? error.message : 'Unknown error');
    return res.status(500).json({ error: 'Unable to generate study content' });
  } finally {
    clearTimeout(timeout);
  }
}
