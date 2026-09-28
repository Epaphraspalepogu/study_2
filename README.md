# Flam Study AI

## Overview

Flam Study AI is an AI-powered study assistant that turns free-form notes or topics into interactive flashcards and quizzes. Users paste their study material, the frontend sends it to a Node.js/Express backend, which calls the Gemini API with a strict prompt that returns structured JSON. The frontend validates that JSON and renders it as real interactive UI components — not a chatbot.

**Tagline:** Turn your notes into interactive learning.

## Features

- AI-generated flashcards (5–10 per study set)
- AI-generated multiple-choice quizzes (5 questions, 4 options each)
- Structured JSON output enforced by a strict system prompt
- Response validation against a schema (never renders invalid data)
- Defensive JSON parsing (handles markdown fences, malformed JSON, empty responses)
- Comprehensive error handling (network, server, invalid JSON, wrong shape, empty)
- Stale request protection via AbortController + request IDs
- Interactive flashcard deck with flip, known/unknown tracking, and wrong-card review
- Interactive quiz with per-question feedback, explanations, score card, and wrong-answer retry
- Loading state with animated indicator
- Empty state with clickable example topics
- Responsive design (375px / 768px / 1440px)
- Backend API proxy — Gemini API key never reaches the browser

## Tech Stack

- React (functional components + hooks)
- Vite
- JavaScript
- Node.js serverless API routes on Vercel (Express wrapper for local development)
- Gemini API (`gemini-3.5-flash-lite`)
- CSS (no UI framework)

## Architecture

```
React frontend
    ↓  POST /api/generate
Vercel serverless API (local Express wrapper during development)
    ↓  Gemini API call
Gemini
    ↓  Structured JSON
Frontend validation
    ↓  validateResult.js
Interactive UI (flashcards + quiz)
```

The browser calls relative `/api/generate` and `/api/health` URLs. Vercel serves the root `api/` functions alongside the Vite frontend. The Gemini API key is read only by the server-side handler and is never exposed to the client.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env` file in the project root using the placeholder from `.env.example`, then replace it with a key from [Google AI Studio](https://aistudio.google.com/apikey):

```
GEMINI_API_KEY=your_gemini_api_key_here
```

Keep the real key only in `.env`. This file is ignored by Git. Never put the key in frontend variables or commit it.

### 3. Run the app

```bash
npm run dev
```

This starts the local Express wrapper (port 3001) and Vite dev server (port 5173) concurrently. Open `http://localhost:5173`.

### Alternative scripts

- `npm run client` — start only the Vite frontend
- `npm run server` — start only the Express backend
- `npm run build` — production build of the frontend
- `npm run preview` — preview the production build
- `npm test` — run the regression tests

The Vite dev server proxies `/api/*` requests to Express on port 3001. Production requests are handled directly by Vercel functions and do not use the development proxy. Gemini requests have a 30-second timeout and return HTTP 504 if they take too long.

### Start services separately

Run these in separate terminals from the project root:

```bash
npm run server
npm run client
```

### Use the application

1. Paste notes or enter a topic in the study input, or choose an example.
2. Select **Generate Study Set** and wait for the generated overview.
3. Open **Flashcards** to reveal answers and mark cards known or needing review.
4. Open **Quiz**, answer each question, review the score, and retry incorrect answers.

Run the regression suite with `npm test`.

## API

### `GET /api/health`

Returns `{ "status": "ok" }`.

### `POST /api/generate`

**Request:**
```json
{ "input": "Explain operating systems scheduling" }
```

**Response:**
```json
{
  "topic": "Operating System Scheduling",
  "summary": "Short summary of the topic",
  "flashcards": [
    { "id": "fc1", "question": "What is CPU scheduling?", "answer": "..." }
  ],
  "quiz": [
    {
      "id": "q1",
      "question": "Which algorithm uses a time quantum?",
      "options": ["FCFS", "Round Robin", "SJF", "Priority Scheduling"],
      "correctAnswer": 1,
      "explanation": "Round Robin uses a fixed time quantum."
    }
  ]
}
```

**Error response:**
```json
{ "error": "Unable to generate study content" }
```

## AI Usage

AI tools were used during development for brainstorming, debugging assistance, code suggestions, and improving UI ideas. The final implementation was reviewed and understood by the developer.

## Known Limitations

- AI output quality depends on model response
- API availability depends on Gemini
- Gemini rate limits or capacity issues can prevent generation; provider failures are reported as a generic generation error
- No authentication
- No persistent database — study sets are not saved between sessions

## Production Deployment

Deploy the repository root to Vercel. Vercel builds the Vite frontend with `npm run build` and discovers `api/health.js` and `api/generate.js` as serverless functions. The minimal `vercel.json` sets the function duration above the backend's 30-second Gemini timeout; no rewrites or separate backend host are needed.

In the Vercel project settings, add `GEMINI_API_KEY` for the Preview and Production environments. Keep `.env` local and ignored by Git; never use a `VITE_`-prefixed key or commit a real key. Local development continues to use the Vite proxy and Express wrapper.

## Time Spent

Approximately 8 hours.
