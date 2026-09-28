import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import Quiz from './Quiz';

afterEach(cleanup);

function makeQuiz() {
  return [
    { id: 'q1', question: 'Question one', options: ['Right one', 'Wrong one', 'Other one', 'Other two'], correctAnswer: 0, explanation: 'Answer one.' },
    { id: 'q2', question: 'Question two', options: ['Right two', 'Wrong two', 'Other one', 'Other two'], correctAnswer: 0, explanation: 'Answer two.' },
    { id: 'q3', question: 'Question three', options: ['Right three', 'Wrong three', 'Other one', 'Other two'], correctAnswer: 0, explanation: 'Answer three.' },
  ];
}

function answerCurrentQuestion(optionIndex) {
  fireEvent.click(document.querySelectorAll('.quiz-option')[optionIndex]);
}

describe('Quiz', () => {
  it('retests only wrong questions and calculates the retry score', () => {
    render(<Quiz quiz={makeQuiz()} />);

    answerCurrentQuestion(1);
    fireEvent.click(screen.getByRole('button', { name: 'Next Question' }));
    answerCurrentQuestion(0);
    fireEvent.click(screen.getByRole('button', { name: 'Next Question' }));
    answerCurrentQuestion(2);
    fireEvent.click(screen.getByRole('button', { name: 'See Results' }));

    expect(screen.getByText('1 / 3')).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Retry Wrong Answers' }));

    expect(screen.getByText('Question one')).not.toBeNull();
    expect(screen.getByText('Question 1 of 2')).not.toBeNull();
    expect(screen.queryByText('Question two')).toBeNull();

    answerCurrentQuestion(0);
    fireEvent.click(screen.getByRole('button', { name: 'Next Question' }));
    expect(screen.getByText('Question three')).not.toBeNull();
    answerCurrentQuestion(0);
    fireEvent.click(screen.getByRole('button', { name: 'See Results' }));

    expect(screen.getByText('2 / 2')).not.toBeNull();
  });
});
