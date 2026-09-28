export function validateResult(result) {
  if (result == null) {
    return { valid: false, error: 'No study content was generated.' };
  }
  if (typeof result !== 'object' || Array.isArray(result)) {
    return { valid: false, error: 'The generated study set could not be validated.' };
  }

  if (typeof result.topic !== 'string' || result.topic.trim() === '') {
    return { valid: false, error: 'The generated study set could not be validated.' };
  }
  if (typeof result.summary !== 'string' || result.summary.trim() === '') {
    return { valid: false, error: 'The generated study set could not be validated.' };
  }

  if (!Array.isArray(result.flashcards) || result.flashcards.length === 0) {
    return { valid: false, error: 'The generated study set could not be validated.' };
  }
  const flashcardIds = new Set();
  for (const card of result.flashcards) {
    if (!card || typeof card.id !== 'string' || card.id.trim() === '' ||
        flashcardIds.has(card.id) ||
        typeof card.question !== 'string' || card.question.trim() === '' ||
        typeof card.answer !== 'string' || card.answer.trim() === '') {
      return { valid: false, error: 'The generated study set could not be validated.' };
    }
    flashcardIds.add(card.id);
  }

  if (!Array.isArray(result.quiz) || result.quiz.length === 0) {
    return { valid: false, error: 'The generated study set could not be validated.' };
  }
  const quizIds = new Set();
  for (const q of result.quiz) {
    if (!q || typeof q.id !== 'string' || q.id.trim() === '' || quizIds.has(q.id) ||
        typeof q.question !== 'string' || q.question.trim() === '') {
      return { valid: false, error: 'The generated study set could not be validated.' };
    }
    if (!Array.isArray(q.options) || q.options.length !== 4 ||
        q.options.some((option) => typeof option !== 'string' || option.trim() === '')) {
      return { valid: false, error: 'The generated study set could not be validated.' };
    }
    if (!Number.isInteger(q.correctAnswer) || q.correctAnswer < 0 || q.correctAnswer > 3) {
      return { valid: false, error: 'The generated study set could not be validated.' };
    }
    if (typeof q.explanation !== 'string' || q.explanation.trim() === '') {
      return { valid: false, error: 'The generated study set could not be validated.' };
    }
    quizIds.add(q.id);
  }

  return { valid: true, error: null };
}
