const SUGGESTIONS = [
  'DBMS normalization',
  'Operating system processes',
  'Machine learning basics',
];

export default function EmptyState({ onPick }) {
  return (
    <div className="empty-state">
      <p className="empty-subtitle">Or start with an example:</p>
      <div className="empty-suggestions">
        {SUGGESTIONS.map((s) => (
          <button key={s} className="example-chip" onClick={() => onPick(s)} type="button">
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
