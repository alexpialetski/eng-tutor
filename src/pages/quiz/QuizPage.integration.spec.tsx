import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter, resetDatabase } from '../../test-utils';
import App from '../../app/app';
import { db } from '../../features/progress/lib/db';
import { books } from '../../shared/constants/books';

describe('QuizPage Integration', () => {
  beforeEach(async () => {
    await resetDatabase();
    // Create a test user - let Dexie auto-generate the ID
    await db.users.add({
      name: 'Test User',
      createdAt: new Date(),
    });
  });

  it('should redirect to welcome if no user', async () => {
    await resetDatabase();
    renderWithRouter(<App />, { initialEntries: ['/books/lotus'] });

    await waitFor(() => {
      expect(screen.getByText(/Добро пожаловать/i)).toBeInTheDocument();
    });
  });

  it('should redirect to books if invalid bookId', async () => {
    // User is already created in beforeEach, so we can just render
    renderWithRouter(<App />, { initialEntries: ['/books/invalid'] });

    await waitFor(
      () => {
        // Should redirect to books page
        expect(
          screen.getByText(/Выбери книгу для изучения/i),
        ).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });

  it('should render quiz page with question', async () => {
    const book = books[0];
    if (!book) {
      throw new Error('No book found');
    }

    renderWithRouter(<App />, { initialEntries: [`/books/${book.id}`] });

    await waitFor(
      () => {
        expect(screen.getByText(/Безмятежный Лотос/i)).toBeInTheDocument();
        expect(screen.getByText(/Полный цикл подготовки/i)).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    // Should show a question (check for input field)
    await waitFor(
      () => {
        const answerInput =
          screen.queryByRole('textbox') ||
          document.getElementById('answer-input');
        expect(answerInput).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it('should allow answering a question', async () => {
    const user = userEvent.setup();
    const book = books[0];
    if (!book) {
      throw new Error('No book found');
    }

    renderWithRouter(<App />, { initialEntries: [`/books/${book.id}`] });

    await waitFor(
      () => {
        const answerInput = screen.queryByRole('textbox');
        expect(answerInput).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    const answerInput = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button', { name: /Ответить/i });

    // Type an answer
    await user.type(answerInput, 'test answer');

    // Submit answer
    await user.click(submitButton);

    // Should show feedback
    await waitFor(() => {
      const nextButton = screen.queryByRole('button', {
        name: /Следующий вопрос/i,
      });
      const finishButton = screen.queryByRole('button', { name: /Завершить/i });
      expect(nextButton || finishButton).toBeInTheDocument();
    });
  });

  it(
    'should navigate to results when quiz is complete',
    { timeout: 30000 },
    async () => {
      const user = userEvent.setup();
      const book = books[0];
      if (!book) {
        throw new Error('No book found');
      }

      renderWithRouter(<App />, { initialEntries: [`/books/${book.id}`] });

      // Answer all questions to complete the quiz
      // Keep answering until we see the results page
      const maxIterations = book.questions.length * 2; // Safety limit
      let iterations = 0;

      while (iterations < maxIterations) {
        // Check if we're already on results page
        const resultsText = screen.queryByText(/Испытание завершено/i);
        if (resultsText) {
          break;
        }

        await waitFor(
          () => {
            const answerInput =
              screen.queryByRole('textbox') ||
              document.getElementById('answer-input');
            expect(answerInput).toBeInTheDocument();
          },
          { timeout: 5000 },
        );

        const answerInput = (screen.getByRole('textbox') ||
          document.getElementById('answer-input')) as HTMLInputElement;
        const submitButton = screen.queryByRole('button', {
          name: /Ответить/i,
        });

        if (!submitButton) {
          // No submit button means we might be on results page
          break;
        }

        await user.clear(answerInput);
        await user.type(answerInput, 'test answer');
        await user.click(submitButton);

        // Wait for feedback and next/finish button
        await waitFor(
          async () => {
            const nextButton = screen.queryByRole('button', {
              name: /Следующий вопрос/i,
            });
            const finishButton = screen.queryByRole('button', {
              name: /Завершить/i,
            });

            if (finishButton) {
              // Last question, finish quiz
              await user.click(finishButton);
              return true; // Signal completion
            } else if (nextButton) {
              await user.click(nextButton);
              return true;
            }
            return false;
          },
          { timeout: 5000 },
        );

        iterations++;
      }

      // Should navigate to results page
      await waitFor(
        () => {
          expect(screen.getByText(/Испытание завершено/i)).toBeInTheDocument();
        },
        { timeout: 10000 },
      );
    },
  );

  it('should handle Enter key to submit answer', async () => {
    const user = userEvent.setup();
    const book = books[0];
    if (!book) {
      throw new Error('No book found');
    }

    renderWithRouter(<App />, { initialEntries: [`/books/${book.id}`] });

    await waitFor(
      () => {
        const answerInput =
          screen.queryByRole('textbox') ||
          document.getElementById('answer-input');
        expect(answerInput).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    const answerInput = (screen.getByRole('textbox') ||
      document.getElementById('answer-input')) as HTMLInputElement;
    await user.type(answerInput, 'test answer{Enter}');

    await waitFor(() => {
      const nextButton = screen.queryByRole('button', {
        name: /Следующий вопрос/i,
      });
      const finishButton = screen.queryByRole('button', { name: /Завершить/i });
      expect(nextButton || finishButton).toBeInTheDocument();
    });
  });

  it('should show progress bar', async () => {
    const book = books[0];
    if (!book) {
      throw new Error('No book found');
    }

    renderWithRouter(<App />, { initialEntries: [`/books/${book.id}`] });

    await waitFor(
      () => {
        expect(screen.getByText(/Безмятежный Лотос/i)).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    // Progress bar should be present (check by role or class)
    const progressBar =
      document.querySelector('[role="progressbar"]') ||
      document.querySelector('.progress-bar') ||
      document.querySelector('[class*="progress"]');
    expect(progressBar).toBeInTheDocument();
  });
});
