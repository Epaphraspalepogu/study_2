export default function LoadingState() {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <h2 className="loading-title">Preparing your study material...</h2>
      <p className="loading-subtitle">Building flashcards and a quiz from your notes or topic.</p>
    </div>
  );
}
