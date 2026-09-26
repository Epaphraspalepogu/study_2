export default function ErrorState({ message, onRetry, retryLabel }) {
  return (
    <div className="error-state" role="alert">
      <div className="error-icon" aria-hidden="true">!</div>
      <h2 className="error-title">Something went wrong</h2>
      <p className="error-message">{message}</p>
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry}>
          {retryLabel || 'Try Again'}
        </button>
      )}
    </div>
  );
}
