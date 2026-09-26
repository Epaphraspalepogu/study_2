/**
 * Validates the AI study set result against the expected schema.
 * Returns { valid: boolean, error: string|null }.
 *
 * @param {any} result
 * @returns {{ valid: boolean, error: string|null }}
 */
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
  for (const card of result.flashcards) {
    if (!card || typeof card.question !== 'string' || card.question.trim() === '' ||
        typeof card.answer !== 'string' || card.answer.trim() === '') {
      return { valid: false, error: 'The generated study set could not be validated.' };
    }
  }

  if (!Array.isArray(result.quiz) || result.quiz.length === 0) {
    return { valid: false, error: 'The generated study set could not be validated.' };
  }
  for (const q of result.quiz) {
    if (!q || typeof q.question !== 'string' || q.question.trim() === '') {
      return { valid: false, error: 'The generated study set could not be validated.' };
    }
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      return { valid: false, error: 'The generated study set could not be validated.' };
    }
    if (!Number.isInteger(q.correctAnswer) || q.correctAnswer < 0 || q.correctAnswer > 3) {
      return { valid: false, error: 'The generated study set could not be validated.' };
    }
    if (typeof q.explanation !== 'string' || q.explanation.trim() === '') {
      return { valid: false, error: 'The generated study set could not be validated.' };
    }
  }

  return { valid: true, error: null };
}
