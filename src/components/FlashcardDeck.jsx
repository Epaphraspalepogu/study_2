import { useState, useMemo } from 'react';
import Flashcard from './Flashcard';

export default function FlashcardDeck({ flashcards }) {
  const [index, setIndex] = useState(0);
  const [known, setKnown] = useState(new Set());
  const [unknown, setUnknown] = useState(new Set());
  const [completed, setCompleted] = useState(false);
  const [reviewWrong, setReviewWrong] = useState(false);

  const deck = useMemo(() => {
    if (reviewWrong) {
      return flashcards.filter((_, i) => unknown.has(i));
    }
    return flashcards;
  }, [flashcards, reviewWrong, unknown]);

  const card = deck[index];

  function next() {
    if (index < deck.length - 1) setIndex(index + 1);
  }
  function prev() {
    if (index > 0) setIndex(index - 1);
  }

  function markKnown(originalIdx) {
    setKnown((prev) => new Set(prev).add(originalIdx));
    setUnknown((prev) => {
      const n = new Set(prev);
      n.delete(originalIdx);
      return n;
    });
    advance();
  }

  function markUnknown(originalIdx) {
    setUnknown((prev) => new Set(prev).add(originalIdx));
    advance();
  }

  function advance() {
    if (index < deck.length - 1) {
      setIndex(index + 1);
    } else {
      setCompleted(true);
    }
  }

  function restart() {
    setIndex(0);
    setCompleted(false);
    setReviewWrong(false);
  }

  function reviewWrongCards() {
    setReviewWrong(true);
    setIndex(0);
    setCompleted(false);
  }

  // Map deck index back to original flashcards index
  const originalIdx = reviewWrong
    ? flashcards.findIndex((fc) => fc.id === card?.id)
    : index;

  if (completed) {
    return (
      <div className="deck-complete">
        <h3 className="deck-complete-title">Flashcards Complete</h3>
        <div className="deck-stats">
          <div className="deck-stat deck-stat--known">
            <span className="deck-stat-num">{known.size}</span>
            <span className="deck-stat-label">Known</span>
          </div>
          <div className="deck-stat deck-stat--unknown">
            <span className="deck-stat-num">{unknown.size}</span>
            <span className="deck-stat-label">Needs Review</span>
          </div>
          <div className="deck-stat">
            <span className="deck-stat-num">{flashcards.length}</span>
            <span className="deck-stat-label">Total</span>
          </div>
        </div>
        <div className="deck-complete-actions">
          <button className="btn btn-primary" onClick={restart} type="button">
            Review All Cards
          </button>
          {unknown.size > 0 && (
            <button className="btn btn-secondary" onClick={reviewWrongCards} type="button">
              Review Wrong Cards
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!card) {
    return <p className="muted">No flashcards available.</p>;
  }

  return (
    <Flashcard
      card={card}
      index={index}
      total={deck.length}
      onKnown={() => markKnown(originalIdx)}
      onUnknown={() => markUnknown(originalIdx)}
      onPrev={prev}
      onNext={next}
    />
  );
}
