export default function Header({ onReset }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <button className="logo" onClick={onReset} aria-label="Flam Study Assistant home">
          <span className="logo-mark">FLAM</span>
          <span className="logo-text">Study Assistant</span>
        </button>
      </div>
    </header>
  );
}
