/**
 * @typedef {Object} Flashcard
 * @property {string} id
 * @property {string} question
 * @property {string} answer
 */

/**
 * @typedef {Object} QuizQuestion
 * @property {string} id
 * @property {string} question
 * @property {string[]} options
 * @property {number} correctAnswer
 * @property {string} explanation
 */

/**
 * @typedef {Object} StudySet
 * @property {string} topic
 * @property {string} summary
 * @property {Flashcard[]} flashcards
 * @property {QuizQuestion[]} quiz
 */

export {};
