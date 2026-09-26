export default function LoadingState() {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <div className="loading-orb" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <h2 className="loading-title">Creating your study set…</h2>
      <p className="loading-subtitle">The AI is analyzing your notes and building flashcards and a quiz.</p>
    </div>
  );
}
