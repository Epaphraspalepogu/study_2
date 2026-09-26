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
- Node.js + Express
- Gemini API (gemini-1.5-flash)
- CSS (no UI framework)

## Architecture

```
React frontend
    ↓  POST /api/generate
Backend API (Express)
    ↓  Gemini API call
Gemini
    ↓  Structured JSON
Frontend validation
    ↓  validateResult.js
Interactive UI (flashcards + quiz)
```

The browser only ever calls `/api/generate` and `/api/health`. The Gemini API key lives exclusively in the server's environment variables and is never exposed to the client.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env` file in the project root (see `.env.example`):

```
GEMINI_API_KEY=your_key_here
```

Get a key from [Google AI Studio](https://aistudio.google.com/apikey).

### 3. Run the app

```bash
npm run dev
```

This starts both the backend server (port 3001) and the Vite dev server (port 5173) concurrently. Open `http://localhost:5173`.

### Alternative scripts

- `npm run client` — start only the Vite frontend
- `npm run server` — start only the Express backend
- `npm run build` — production build of the frontend
- `npm run preview` — preview the production build

The Vite dev server proxies `/api/*` requests to the Express server, so there are no CORS issues during development.

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
- No authentication
- No persistent database — study sets are not saved between sessions

## Time Spent

Approximately 8 hours.
