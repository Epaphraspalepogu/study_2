import { useState, useRef, useCallback } from 'react';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import EmptyState from './components/EmptyState';
import ResultView from './components/ResultView';
import { generateStudySet } from './lib/api';
import { validateResult } from './lib/validateResult';

export default function App() {
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [input, setInput] = useState('');

  const requestIdRef = useRef(0);
  const abortRef = useRef(null);

  const handleGenerate = useCallback(async (input) => {
    const myId = ++requestIdRef.current;
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus('loading');
    setError('');

    try {
      const data = await generateStudySet(input, controller.signal);
      if (myId !== requestIdRef.current) return;

      const { valid, error: validationError } = validateResult(data);
      if (!valid) {
        setStatus('error');
        setError(validationError);
        return;
      }

      setResult(data);
      setStatus('success');
    } catch (err) {
      if (err && err.name === 'AbortError') return;
      if (myId !== requestIdRef.current) return;
      setStatus('error');
      if (err?.type === 'network') {
        setError('Unable to connect to the server.');
      } else if (err?.type === 'server') {
        setError(err?.message || 'The AI service is currently unavailable.');
      } else {
        setError(err?.message || 'Unable to generate study content');
      }
    }
  }, []);

  const handleReset = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    requestIdRef.current++;
    setStatus('idle');
    setResult(null);
    setError('');
    setInput('');
  }, []);

  const handlePickExample = useCallback((text) => {
    setInput(text);
  }, []);

  return (
    <div className="app">
      <Header onReset={handleReset} />

      <main className="app-main">
        <div className="container">
          {status === 'idle' && (
            <>
              <div className="hero">
                <p className="hero-subtitle">
                  Turn your notes into interactive flashcards and quizzes.
                </p>
              </div>
              <PromptInput
                value={input}
                onChange={setInput}
                onSubmit={handleGenerate}
                disabled={false}
              />
              {!input.trim() && <EmptyState onPick={handlePickExample} />}
            </>
          )}

          {status === 'loading' && <LoadingState />}

          {status === 'error' && (
            <ErrorState
              message={error}
              onRetry={() => handleGenerate(input)}
              retryLabel="Try Again"
            />
          )}

          {status === 'success' && result && (
            <ResultView result={result} onReset={handleReset} />
          )}
        </div>
      </main>

    </div>
  );
}
