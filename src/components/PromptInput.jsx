import { useState } from 'react';

const EXAMPLES = [
  'DBMS normalization',
  'Operating system processes',
  'Machine learning basics',
];

const MAX_CHARS = 5000;

export default function PromptInput({ onSubmit, disabled }) {
  const [value, setValue] = useState('');
  const [localError, setLocalError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setLocalError('Please enter some study material.');
      return;
    }
    setLocalError('');
    onSubmit(trimmed);
  }

  function handleClear() {
    setValue('');
    setLocalError('');
  }

  function handleExample(text) {
    setValue(text);
    setLocalError('');
  }

  return (
    <section className="prompt-section">
      <div className="prompt-card">
        <h2 className="prompt-title">Ready to study?</h2>
        <p className="prompt-subtitle">
          Paste your notes or enter a topic and let AI create an interactive study set.
        </p>

        <form onSubmit={handleSubmit} className="prompt-form">
          <label htmlFor="study-input" className="sr-only">
            Study material input
          </label>
          <textarea
            id="study-input"
            className="prompt-textarea"
            placeholder="Paste your notes or enter a topic you want to study…"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (localError) setLocalError('');
            }}
            maxLength={MAX_CHARS}
            rows={6}
            disabled={disabled}
            aria-describedby="char-count"
          />
          <div className="prompt-meta">
            <span id="char-count" className="char-count">
              {value.length} / {MAX_CHARS}
            </span>
            {value.length > 0 && (
              <button type="button" className="link-btn" onClick={handleClear} disabled={disabled}>
                Clear
              </button>
            )}
          </div>

          {localError && (
            <p className="inline-error" role="alert">{localError}</p>
          )}

          <button type="submit" className="btn btn-primary btn-lg" disabled={disabled}>
            {disabled ? 'Generating…' : 'Generate Study Set'}
          </button>
        </form>

        <div className="examples">
          <p className="examples-label">Try an example:</p>
          <div className="examples-list">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                className="example-chip"
                onClick={() => handleExample(ex)}
                disabled={disabled}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
