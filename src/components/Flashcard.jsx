import { useLayoutEffect, useRef, useState } from 'react';

export default function Flashcard({ card, index, total, onKnown, onUnknown, onPrev, onNext }) {
  const [revealed, setRevealed] = useState(false);
  const frontButtonRef = useRef(null);
  const backButtonRef = useRef(null);
  const hasMountedRef = useRef(false);

  useLayoutEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    const activeFaceButton = revealed ? backButtonRef.current : frontButtonRef.current;
    activeFaceButton?.focus({ preventScroll: true });
  }, [revealed]);

  function toggleRevealed(event) {
    event.currentTarget.blur();
    setRevealed((current) => !current);
  }

  function handleKnown() {
    onKnown(index);
  }

  function handleUnknown() {
    onUnknown(index);
  }

  return (
    <div className="flashcard-wrap">
      <div className={`flashcard ${revealed ? 'flashcard--revealed' : ''}`}>
        <div className="flashcard-inner">
          <div className="flashcard-face flashcard-face--front" aria-hidden={revealed}>
            <button
              ref={frontButtonRef}
              className="flashcard-face-content"
              type="button"
              aria-label={`Show answer for ${card.question}`}
              aria-pressed={revealed}
              tabIndex={revealed ? -1 : 0}
              onClick={toggleRevealed}
            >
              <span className="flashcard-label">Question</span>
              <span className="flashcard-text">{card.question}</span>
              <span className="flashcard-flip-label">Reveal Answer</span>
            </button>
          </div>
          <div className="flashcard-face flashcard-face--back" aria-hidden={!revealed}>
            <button
              ref={backButtonRef}
              className="flashcard-face-content"
              type="button"
              aria-label={`Show question for ${card.question}`}
              aria-pressed={!revealed}
              tabIndex={revealed ? 0 : -1}
              onClick={toggleRevealed}
            >
              <span className="flashcard-label">Answer</span>
              <span className="flashcard-text">{card.answer}</span>
              <span className="flashcard-flip-label">Show Question</span>
            </button>
          </div>
        </div>
      </div>

      {revealed && (
        <div className="flashcard-actions">
          <button className="btn btn-success" onClick={handleKnown} type="button">
            ✓ I knew this
          </button>
          <button className="btn btn-danger" onClick={handleUnknown} type="button">
            ✕ I didn't know
          </button>
        </div>
      )}

      <div className="flashcard-nav">
        <button className="btn btn-ghost" onClick={onPrev} disabled={index === 0} type="button">
          Previous
        </button>
        <span className="flashcard-count">Card {index + 1} of {total}</span>
        <button className="btn btn-ghost" onClick={onNext} disabled={index === total - 1} type="button">
          Next
        </button>
      </div>
    </div>
  );
}
