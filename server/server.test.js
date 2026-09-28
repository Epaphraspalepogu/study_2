// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApp } from './server';
import { validateResult } from '../src/lib/validateResult.js';

const servers = [];

afterEach(async () => {
  vi.restoreAllMocks();
  await Promise.all(servers.splice(0).map((server) => new Promise((resolve) => {
    server.close(resolve);
    server.closeAllConnections();
  })));
});

async function withServer(options, callback) {
  const server = createApp({ apiKey: 'test-key', ...options }).listen(0);
  servers.push(server);
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();
  return callback(`http://127.0.0.1:${port}`);
}

function modelResponse(text) {
  return new Response(JSON.stringify({
    candidates: [{ content: { parts: [{ text }] } }],
  }), { status: 200, headers: { 'content-type': 'application/json' } });
}

async function generate(baseUrl) {
  return fetch(`${baseUrl}/api/generate`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ input: 'test topic' }),
  });
}

describe('Gemini backend error handling', () => {
  it('returns a useful error for malformed JSON', async () => {
    await withServer({ fetchImpl: vi.fn().mockResolvedValue(modelResponse('{not json')) }, async (baseUrl) => {
      const response = await generate(baseUrl);
      expect(response.status).toBe(502);
      expect((await response.json()).error).toBe('The AI returned an invalid response.');
    });
  });

  it('returns an error for an empty AI response', async () => {
    await withServer({
      fetchImpl: vi.fn().mockResolvedValue(new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: '' }] } }] }), { status: 200 })),
    }, async (baseUrl) => {
      const response = await generate(baseUrl);
      expect(response.status).toBe(502);
      expect((await response.json()).error).toBe('No study content was generated.');
    });
  });

  it('passes parseable wrong-shape data to validation, which rejects it', async () => {
    await withServer({ fetchImpl: vi.fn().mockResolvedValue(modelResponse(JSON.stringify({ topic: 'Topic' }))) }, async (baseUrl) => {
      const response = await generate(baseUrl);
      expect(response.status).toBe(200);
      expect(validateResult(await response.json()).valid).toBe(false);
    });
  });

  it('returns an error when the Gemini request fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    await withServer({ fetchImpl: vi.fn().mockRejectedValue(new Error('provider unavailable')) }, async (baseUrl) => {
      const response = await generate(baseUrl);
      expect(response.status).toBe(500);
      expect((await response.json()).error).toBe('Unable to generate study content');
    });
  });

  it('aborts a slow Gemini request and returns HTTP 504', async () => {
    const fetchImpl = vi.fn((_url, { signal }) => new Promise((_resolve, reject) => {
      signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
    }));

    await withServer({ fetchImpl, timeoutMs: 15 }, async (baseUrl) => {
      const response = await generate(baseUrl);
      expect(response.status).toBe(504);
      expect((await response.json()).error).toContain('took too long');
      expect(fetchImpl.mock.calls[0][1].signal.aborted).toBe(true);
    });
  });
});
