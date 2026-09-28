import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { generateStudySet } from './lib/api';

vi.mock('./lib/api', () => ({ generateStudySet: vi.fn() }));

afterEach(cleanup);

beforeEach(() => {
  vi.clearAllMocks();
});

function validStudySet() {
  return {
    topic: 'Photosynthesis',
    summary: 'Plants convert light into chemical energy.',
    flashcards: [{ id: 'flashcard-1', question: 'What absorbs light?', answer: 'Chlorophyll.' }],
    quiz: [{
      id: 'quiz-1',
      question: 'What absorbs light?',
      options: ['Chlorophyll', 'Glucose', 'Oxygen', 'Water'],
      correctAnswer: 0,
      explanation: 'Chlorophyll absorbs light energy.',
    }],
  };
}

describe('App request flow', () => {
  it.each([
    'DBMS normalization',
    'Operating system processes',
    'Machine learning basics',
  ])('prefills the input with the example %s', (example) => {
    const { container } = render(<App />);
    const emptyStateButton = [...container.querySelectorAll('.empty-state button')]
      .find((button) => button.textContent === example);

    fireEvent.click(emptyStateButton);

    expect(screen.getByLabelText('Notes or Topic').value).toBe(example);
  });

  it('retries a failed generation with the same input', async () => {
    const input = 'Photosynthesis in plants';
    generateStudySet
      .mockRejectedValueOnce(Object.assign(new Error('Service unavailable'), { type: 'server' }))
      .mockResolvedValueOnce(validStudySet());
    render(<App />);

    fireEvent.change(screen.getByLabelText('Notes or Topic'), { target: { value: input } });
    fireEvent.click(screen.getByRole('button', { name: 'Generate Study Material' }));
    await screen.findByRole('alert');
    fireEvent.click(screen.getByRole('button', { name: 'Try Again' }));

    expect(await screen.findByRole('heading', { name: 'Photosynthesis' })).not.toBeNull();
    expect(generateStudySet).toHaveBeenNthCalledWith(1, input, expect.any(AbortSignal));
    expect(generateStudySet).toHaveBeenNthCalledWith(2, input, expect.any(AbortSignal));
  });

  it('renders an error instead of invalid response data', async () => {
    generateStudySet.mockResolvedValue({
      topic: 'Photosynthesis',
      summary: 'Plants convert light.',
      flashcards: [{ question: 'Q', answer: 'A' }],
      quiz: [],
    });
    render(<App />);

    fireEvent.change(screen.getByLabelText('Notes or Topic'), { target: { value: 'topic' } });
    fireEvent.click(screen.getByRole('button', { name: 'Generate Study Material' }));

    expect((await screen.findByRole('alert')).textContent).toContain('could not be validated');
    expect(document.querySelector('.result-view')).toBeNull();
  });

  it('shows a network error and preserves input for retry', async () => {
    const input = 'Cell division';
    generateStudySet
      .mockRejectedValueOnce(Object.assign(new Error('offline'), { type: 'network' }))
      .mockResolvedValueOnce(validStudySet());
    render(<App />);

    fireEvent.change(screen.getByLabelText('Notes or Topic'), { target: { value: input } });
    fireEvent.click(screen.getByRole('button', { name: 'Generate Study Material' }));

    expect((await screen.findByRole('alert')).textContent).toContain('Unable to connect to the server');
    fireEvent.click(screen.getByRole('button', { name: 'Try Again' }));
    expect(await screen.findByRole('heading', { name: 'Photosynthesis' })).not.toBeNull();
    await waitFor(() => expect(generateStudySet).toHaveBeenCalledTimes(2));
    expect(generateStudySet).toHaveBeenNthCalledWith(2, input, expect.any(AbortSignal));
  });

  it('shows the backend timeout message in the error state', async () => {
    generateStudySet.mockRejectedValueOnce(Object.assign(
      new Error('Gemini took too long to respond. Please try again.'),
      { type: 'server' },
    ));
    render(<App />);

    fireEvent.change(screen.getByLabelText('Notes or Topic'), { target: { value: 'A slow topic' } });
    fireEvent.click(screen.getByRole('button', { name: 'Generate Study Material' }));

    expect((await screen.findByRole('alert')).textContent).toContain('Gemini took too long');
  });
});
