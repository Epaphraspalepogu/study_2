const LETTERS = ['A', 'B', 'C', 'D'];

export default function QuizQuestion({ question, index, total, selectedAnswer, onSelect, onNext, isLast }) {
  const answered = selectedAnswer !== null;
  const isCorrect = answered && selectedAnswer === question.correctAnswer;

  return (
    <div className="quiz-question">
      <div className="quiz-q-header">
        <span className="quiz-q-counter">Question {index + 1} of {total}</span>
      </div>
      <p className="quiz-q-text">{question.question}</p>

      <div className="quiz-options" role="radiogroup" aria-label={`Question ${index + 1}`}>
        {question.options.map((opt, i) => {
          const isSelected = selectedAnswer === i;
          const showCorrect = answered && i === question.correctAnswer;
          const showWrong = answered && isSelected && i !== question.correctAnswer;
          let cls = 'quiz-option';
          if (showCorrect) cls += ' quiz-option--correct';
          else if (showWrong) cls += ' quiz-option--wrong';
          else if (isSelected) cls += ' quiz-option--selected';

          return (
            <button
              key={i}
              type="button"
              className={cls}
              role="radio"
              aria-checked={isSelected}
              disabled={answered}
              onClick={() => onSelect(i)}
            >
              <span className="quiz-option-letter">{LETTERS[i]}</span>
              <span className="quiz-option-text">{opt}</span>
              {showCorrect && <span className="quiz-option-mark" aria-hidden="true">✓</span>}
              {showWrong && <span className="quiz-option-mark" aria-hidden="true">✕</span>}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className={`quiz-explanation ${isCorrect ? 'quiz-explanation--correct' : 'quiz-explanation--wrong'}`}>
          <p className="quiz-explanation-label">{isCorrect ? 'Correct!' : 'Not quite.'}</p>
          <p className="quiz-explanation-text">{question.explanation}</p>
        </div>
      )}

      {answered && (
        <button className="btn btn-primary" onClick={onNext} type="button">
          {isLast ? 'See Results' : 'Next Question'}
        </button>
      )}
    </div>
  );
}
