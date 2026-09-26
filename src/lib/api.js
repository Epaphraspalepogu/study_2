const BASE_URL = '/api';

/**
 * Calls the backend to generate a study set from free-form input.
 * Supports an AbortSignal so callers can cancel stale requests.
 *
 * @param {string} input - The user's study material / topic.
 * @param {AbortSignal} [signal] - Optional abort signal.
 * @returns {Promise<object>} The validated-ish study set from the server.
 */
export async function generateStudySet(input, signal) {
  let res;
  try {
    res = await fetch(`${BASE_URL}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
      signal,
    });
  } catch (err) {
    if (err && err.name === 'AbortError') throw err;
    const error = new Error('Unable to connect to the server.');
    error.type = 'network';
    throw error;
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // ignore parse failure, handle via status below
  }

  if (!res.ok) {
    const message = (data && data.error) || 'Unable to generate study content';
    const error = new Error(message);
    error.type = res.status >= 500 ? 'server' : 'client';
    error.status = res.status;
    throw error;
  }

  return data;
}
