export default function ScoreCard({ score, total, onRetry, onRetryWrong, wrongCount }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  return (
    <div className="score-card">
      <h3 className="score-title">Your Score</h3>
      <div className="score-display">
        <span className="score-fraction">{score} / {total}</span>
        <span className="score-percent">{pct}%</span>
      </div>
      <div className="score-breakdown">
        <div className="score-stat score-stat--correct">
          <span className="score-stat-num">{score}</span>
          <span className="score-stat-label">Correct</span>
        </div>
        <div className="score-stat score-stat--wrong">
          <span className="score-stat-num">{total - score}</span>
          <span className="score-stat-label">Wrong</span>
        </div>
      </div>
      <div className="score-actions">
        <button className="btn btn-primary" onClick={onRetry} type="button">
          Retry Quiz
        </button>
        {wrongCount > 0 && (
          <button className="btn btn-secondary" onClick={onRetryWrong} type="button">
            Retry Wrong Answers
          </button>
        )}
      </div>
    </div>
  );
}
