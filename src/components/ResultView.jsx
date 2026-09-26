import { useState } from 'react';
import FlashcardDeck from './FlashcardDeck';
import Quiz from './Quiz';

const TABS = ['Overview', 'Flashcards', 'Quiz'];

export default function ResultView({ result, onReset }) {
  const [tab, setTab] = useState('Overview');

  const studyTime = Math.max(5, Math.ceil((result.flashcards.length + result.quiz.length) * 1.5));

  return (
    <div className="result-view">
      <div className="result-header">
        <div>
          <h1 className="result-topic">{result.topic}</h1>
          <p className="result-summary">{result.summary}</p>
        </div>
        <button className="btn btn-ghost" onClick={onReset} type="button">
          + New Study Set
        </button>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-num">{result.flashcards.length}</span>
          <span className="stat-label">Flashcards</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{result.quiz.length}</span>
          <span className="stat-label">Quiz Questions</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{studyTime} min</span>
          <span className="stat-label">Estimated Study Time</span>
        </div>
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
        {tab === 'Overview' && (
          <div className="overview">
            <p className="overview-text">{result.summary}</p>
            <div className="overview-grid">
              <div className="overview-card">
                <h3 className="overview-card-title">Flashcards</h3>
                <p className="overview-card-desc">
                  {result.flashcards.length} cards to test your recall. Flip each card to reveal the answer and track what you know.
                </p>
                <button className="btn btn-secondary" onClick={() => setTab('Flashcards')} type="button">
                  Start Flashcards
                </button>
              </div>
              <div className="overview-card">
                <h3 className="overview-card-title">Quiz</h3>
                <p className="overview-card-desc">
                  {result.quiz.length} multiple-choice questions with explanations. See your score and retry wrong answers.
                </p>
                <button className="btn btn-secondary" onClick={() => setTab('Quiz')} type="button">
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === 'Flashcards' && <FlashcardDeck flashcards={result.flashcards} />}
        {tab === 'Quiz' && <Quiz quiz={result.quiz} />}
      </div>
    </div>
  );
}
