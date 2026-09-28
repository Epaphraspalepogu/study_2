import { useState } from 'react';

const MAX_CHARS = 5000;

export default function PromptInput({ value, onChange, onSubmit, disabled }) {
  const [localError, setLocalError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setLocalError('Enter notes or a topic to continue.');
      return;
    }
    setLocalError('');
    onSubmit(trimmed);
  }

  function handleClear() {
    onChange('');
    setLocalError('');
  }

  return (
    <section className="prompt-section">
      <div className="prompt-card">
        <h1 className="prompt-title">What do you want to study?</h1>
        <form onSubmit={handleSubmit} className="prompt-form">
          <label htmlFor="study-input" className="sr-only">
            Notes or Topic
          </label>
          <textarea
            id="study-input"
            className="prompt-textarea"
            placeholder="Paste your notes or enter a topic..."
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
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
            {disabled ? 'Generating...' : 'Generate Study Material'}
          </button>
        </form>

      </div>
    </section>
  );
}
