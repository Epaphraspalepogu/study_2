import { useState, useMemo } from 'react';
import QuizQuestion from './QuizQuestion';
import ScoreCard from './ScoreCard';

export default function Quiz({ quiz }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [retryWrong, setRetryWrong] = useState(false);

  const wrongAnswers = useMemo(
    () => answers.filter((a) => a.selected !== a.correct),
    [answers]
  );

  const deck = useMemo(() => {
    if (retryWrong) {
      const wrongIds = new Set(wrongAnswers.map((a) => a.id));
      return quiz.filter((q) => wrongIds.has(q.id));
    }
    return quiz;
  }, [quiz, retryWrong, wrongAnswers]);

  const question = deck[currentQuestion];

  function handleSelect(optionIndex) {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optionIndex);
    setAnswers((prev) => [
      ...prev,
      { id: question.id, selected: optionIndex, correct: question.correctAnswer },
    ]);
  }

  function handleNext() {
    if (currentQuestion < deck.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setCompleted(true);
    }
  }

  function retry() {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setCompleted(false);
    setRetryWrong(false);
  }

  function retryWrongOnly() {
    setRetryWrong(true);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setCompleted(false);
  }

  const score = answers.filter((a) => a.selected === a.correct).length;

  if (completed) {
    return (
      <ScoreCard
        score={score}
        total={deck.length}
        onRetry={retry}
        onRetryWrong={wrongAnswers.length > 0 ? retryWrongOnly : null}
        wrongCount={wrongAnswers.length}
      />
    );
  }

  if (!question) {
    return <p className="muted">No quiz questions available.</p>;
  }

  return (
    <QuizQuestion
      question={question}
      index={currentQuestion}
      total={deck.length}
      selectedAnswer={selectedAnswer}
      onSelect={handleSelect}
      onNext={handleNext}
      isLast={currentQuestion === deck.length - 1}
    />
  );
}
