import { describe, expect, it } from 'vitest';
import { validateResult } from './validateResult';

const validResult = {
  topic: 'Topic',
  summary: 'Summary',
  flashcards: [{ id: 'f1', question: 'Question', answer: 'Answer' }],
  quiz: [{
    id: 'q1',
    question: 'Question',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 0,
    explanation: 'Explanation',
  }],
};

describe('validateResult', () => {
  it('accepts a complete result', () => {
    expect(validateResult(validResult).valid).toBe(true);
  });

  it.each([
    ['missing topic', { ...validResult, topic: undefined }],
    ['non-string summary', { ...validResult, summary: 4 }],
    ['empty flashcards', { ...validResult, flashcards: [] }],
    ['missing flashcard ID', { ...validResult, flashcards: [{ question: 'Q', answer: 'A' }] }],
    ['non-string flashcard answer', { ...validResult, flashcards: [{ id: 'f1', question: 'Q', answer: 5 }] }],
    ['duplicate flashcard IDs', { ...validResult, flashcards: [{ id: 'f1', question: 'Q', answer: 'A' }, { id: 'f1', question: 'Q2', answer: 'A2' }] }],
    ['empty quiz', { ...validResult, quiz: [] }],
    ['missing quiz ID', { ...validResult, quiz: [{ ...validResult.quiz[0], id: undefined }] }],
    ['duplicate quiz IDs', { ...validResult, quiz: [{ ...validResult.quiz[0] }, { ...validResult.quiz[0], question: 'Second question' }] }],
    ['non-string option', { ...validResult, quiz: [{ ...validResult.quiz[0], options: ['A', 2, 'C', 'D'] }] }],
    ['invalid answer index', { ...validResult, quiz: [{ ...validResult.quiz[0], correctAnswer: 4 }] }],
    ['empty explanation', { ...validResult, quiz: [{ ...validResult.quiz[0], explanation: ' ' }] }],
  ])('rejects %s', (_name, result) => {
    expect(validateResult(result).valid).toBe(false);
  });
});
