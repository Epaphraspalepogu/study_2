const SUGGESTIONS = [
  'DBMS normalization',
  'Operating system processes',
  'Machine learning basics',
];

export default function EmptyState({ onPick }) {
  return (
    <div className="empty-state">
      <div className="empty-icon" aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      </div>
      <h2 className="empty-title">Ready to study?</h2>
      <p className="empty-subtitle">
        Paste your notes or enter a topic and let AI create an interactive study set.
      </p>
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
