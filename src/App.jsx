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
  const [status, setStatus] = useState('idle'); // idle | loading | error | success
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [prefill, setPrefill] = useState('');

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
      if (myId !== requestIdRef.current) return; // stale

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
      if (myId !== requestIdRef.current) return; // stale
      setStatus('error');
      if (err?.type === 'network') {
        setError('Unable to connect to the server.');
      } else if (err?.type === 'server') {
        setError('The AI service is currently unavailable.');
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
    setPrefill('');
  }, []);

  const handlePickExample = useCallback((text) => {
    setPrefill(text);
  }, []);

  return (
    <div className="app">
      <Header onReset={handleReset} />

      <main className="app-main">
        <div className="container">
          {status === 'idle' && (
            <>
              <div className="hero">
                <h1 className="hero-title">Turn your notes into interactive learning.</h1>
                <p className="hero-subtitle">
                  Flam Study AI transforms any topic or set of notes into flashcards and a quiz you can actually use.
                </p>
              </div>
              <PromptInput onSubmit={handleGenerate} disabled={false} />
              {!prefill && <EmptyState onPick={handlePickExample} />}
            </>
          )}

          {status === 'loading' && <LoadingState />}

          {status === 'error' && (
            <ErrorState
              message={error}
              onRetry={() => {
                setStatus('idle');
                setError('');
              }}
              retryLabel="Try Again"
            />
          )}

          {status === 'success' && result && (
            <ResultView result={result} onReset={handleReset} />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Flam Study AI — Turn your notes into interactive learning.</p>
      </footer>
    </div>
  );
}
