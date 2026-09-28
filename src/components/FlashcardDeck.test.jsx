import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import FlashcardDeck from './FlashcardDeck';

afterEach(cleanup);

describe('FlashcardDeck', () => {
  it('flips in both directions and starts the next card on its question side', () => {
    render(<FlashcardDeck flashcards={[
      { id: 'card-1', question: 'Question one', answer: 'Answer one' },
      { id: 'card-2', question: 'Question two', answer: 'Answer two' },
    ]} />);

    fireEvent.click(screen.getByRole('button', { name: 'Show answer for Question one' }));
    expect(document.querySelector('.flashcard--revealed')).not.toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Show question for Question one' }));
    expect(document.querySelector('.flashcard--revealed')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Show answer for Question one' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByText('Question two')).not.toBeNull();
    expect(document.querySelector('.flashcard--revealed')).toBeNull();
    expect(screen.getByRole('button', { name: 'Show answer for Question two' })).not.toBeNull();
  });
});
