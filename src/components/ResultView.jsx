import { useState } from 'react';
import FlashcardDeck from './FlashcardDeck';
import Quiz from './Quiz';

const TABS = ['Flashcards', 'Quiz'];

export default function ResultView({ result, onReset }) {
  const [tab, setTab] = useState('Flashcards');

  return (
    <div className="result-view">
      <div className="result-header">
        <div>
          <p>Your Study Assistant Session</p>
          <h1 className="result-topic">{result.topic}</h1>
          <p className="result-summary">{result.summary}</p>
        </div>
        <button className="btn btn-ghost" onClick={onReset} type="button">
          + New Session
        </button>
      </div>

      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            className={`tab ${tab === t ? 'tab--active' : ''}`}
            onClick={() => setTab(t)}
            type="button"
          >
            {t}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {tab === 'Flashcards' && <FlashcardDeck flashcards={result.flashcards} />}
        {tab === 'Quiz' && <Quiz quiz={result.quiz} />}
      </div>
    </div>
  );
}
