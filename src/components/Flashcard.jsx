import { useState } from 'react';

export default function Flashcard({ card, index, total, onKnown, onUnknown, onPrev, onNext }) {
  const [revealed, setRevealed] = useState(false);

  function reveal() {
    setRevealed(true);
  }

  function handleKnown() {
    onKnown(index);
    setRevealed(false);
  }

  function handleUnknown() {
    onUnknown(index);
    setRevealed(false);
  }

  return (
    <div className="flashcard-wrap">
      <div className={`flashcard ${revealed ? 'flashcard--revealed' : ''}`}>
        <div className="flashcard-face flashcard-face--front">
          <span className="flashcard-label">Question</span>
          <p className="flashcard-text">{card.question}</p>
          <button className="btn btn-secondary" onClick={reveal} type="button">
            Reveal Answer
          </button>
        </div>
        <div className="flashcard-face flashcard-face--back">
          <span className="flashcard-label">Answer</span>
          <p className="flashcard-text">{card.answer}</p>
          <div className="flashcard-actions">
            <button className="btn btn-success" onClick={handleKnown} type="button">
              ✓ I knew this
            </button>
            <button className="btn btn-danger" onClick={handleUnknown} type="button">
              ✕ I didn't know
            </button>
          </div>
        </div>
      </div>

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
