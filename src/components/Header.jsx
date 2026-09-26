export default function Header({ onReset }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <button className="logo" onClick={onReset} aria-label="Flam Study AI home">
          <span className="logo-mark">FLAM</span>
          <span className="logo-text">Study AI</span>
        </button>
        <div className="header-right">
          <span className="header-badge">AI Study Assistant</span>
        </div>
      </div>
    </header>
  );
}
