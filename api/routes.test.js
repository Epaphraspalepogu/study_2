// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import health from './health.js';
import generate from './generate.js';

function createResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: undefined,
    setHeader(name, value) {
      this.headers[name] = value;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

function validModelResponse() {
  return new Response(JSON.stringify({
    candidates: [{ content: { parts: [{ text: JSON.stringify({
      topic: 'Photosynthesis',
      summary: 'Plants convert light into chemical energy.',
      flashcards: [{ id: 'f1', question: 'What absorbs light?', answer: 'Chlorophyll.' }],
      quiz: [{
        id: 'q1',
        question: 'What absorbs light?',
        options: ['Chlorophyll', 'Glucose', 'Oxygen', 'Water'],
        correctAnswer: 0,
        explanation: 'Chlorophyll absorbs light.',
      }],
    }) }] } }],
  }), { status: 200, headers: { 'content-type': 'application/json' } });
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('Vercel API functions', () => {
  it('returns the health response for GET', () => {
    const res = createResponse();
    health({ method: 'GET' }, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('rejects unsupported health methods', () => {
    const res = createResponse();
    health({ method: 'POST' }, res);

    expect(res.statusCode).toBe(405);
    expect(res.headers.Allow).toBe('GET');
  });

  it('rejects unsupported generation methods', async () => {
    const res = createResponse();
    await generate({ method: 'GET' }, res);

    expect(res.statusCode).toBe(405);
    expect(res.headers.Allow).toBe('POST');
  });

  it('returns a structured study set from a POST request', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'test-key');
    const fetchMock = vi.fn().mockResolvedValue(validModelResponse());
    vi.stubGlobal('fetch', fetchMock);
    const res = createResponse();

    await generate({ method: 'POST', body: { input: 'Photosynthesis notes' } }, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.topic).toBe('Photosynthesis');
    expect(res.body.flashcards).toHaveLength(1);
    expect(res.body.quiz).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain('/models/gemini-3.5-flash-lite:generateContent');
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).contents[0].parts[0].text).toBe('Photosynthesis notes');
  });

  it('returns 400 for invalid POST input', async () => {
    const res = createResponse();
    await generate({ method: 'POST', body: { input: '  ' } }, res);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Study material is required.');
  });

  it('returns 500 when the server key is not configured', async () => {
    vi.stubEnv('GEMINI_API_KEY', '');
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const res = createResponse();

    await generate({ method: 'POST', body: { input: 'Notes' } }, res);

    expect(res.statusCode).toBe(500);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
