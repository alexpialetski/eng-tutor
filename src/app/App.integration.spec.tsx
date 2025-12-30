import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter, resetDatabase } from '../test-utils';
import App from './app';
import { db } from '../features/progress/lib/db';
import { books } from '../shared/constants/books';

describe('App Integration - Full User Flow', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it(
    'should complete full user journey: welcome -> books -> quiz -> results',
    { timeout: 30000 },
    async () => {
      const user = userEvent.setup();

      // Start at welcome page
      renderWithRouter(<App />, { initialEntries: ['/'] });

      // Step 1: Welcome page - enter name
      expect(screen.getByText(/Безмятежный Лотос/i)).toBeInTheDocument();
      expect(screen.getByText(/Добро пожаловать/i)).toBeInTheDocument();

      const nameInput = screen.getByPlaceholderText(/Введи свое имя/i);
      const startButton = screen.getByRole('button', {
        name: /Начать обучение/i,
      });

      await user.type(nameInput, 'Integration Test User');
      await user.click(startButton);

      // Step 2: Book selection page
      await waitFor(
        () => {
          expect(
            screen.getByText(/Привет, Integration Test User!/i),
          ).toBeInTheDocument();
          expect(
            screen.getByText(/Выбери книгу для изучения/i),
          ).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

      const book = books[0];
      if (!book) {
        throw new Error('No book found');
      }

      expect(screen.getByText(book.title)).toBeInTheDocument();
      const quizButton = screen.getByRole('button', { name: /Начать тест/i });
      await user.click(quizButton);

      // Step 3: Quiz page
      await waitFor(
        () => {
          expect(screen.getByText(/Безмятежный Лотос/i)).toBeInTheDocument();
          expect(
            screen.getByText(/Полный цикл подготовки/i),
          ).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

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
              return true;
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

      // Step 4: Results page
      await waitFor(
        () => {
          expect(screen.getByText(/Испытание завершено/i)).toBeInTheDocument();
        },
        { timeout: 10000 },
      );

      // Verify session was saved
      await waitFor(
        async () => {
          const sessions = await db.sessions.toArray();
          expect(sessions.length).toBeGreaterThan(0);
        },
        { timeout: 5000 },
      );
    },
  );

  it('should protect routes and redirect unauthenticated users', async () => {
    // Try to access protected route without user
    renderWithRouter(<App />, { initialEntries: ['/books'] });

    await waitFor(
      () => {
        // Should redirect to welcome page
        expect(screen.getByText(/Добро пожаловать/i)).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it('should handle navigation between pages', async () => {
    const user = userEvent.setup();

    // Create user first
    await db.users.add({
      id: 1,
      name: 'Test User',
      createdAt: new Date(),
    });

    // Start at book selection
    renderWithRouter(<App />, { initialEntries: ['/books'] });

    await waitFor(
      () => {
        expect(
          screen.getByText(/Выбери книгу для изучения/i),
        ).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    // Navigate to quiz
    const book = books[0];
    if (!book) {
      throw new Error('No book found');
    }

    const quizButton = screen.getByRole('button', { name: /Начать тест/i });
    await user.click(quizButton);

    await waitFor(
      () => {
        expect(screen.getByText(/Безмятежный Лотос/i)).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    // Navigate back
    const backButton = screen.getByRole('button', { name: /Назад/i });
    await user.click(backButton);

    await waitFor(
      () => {
        expect(
          screen.getByText(/Выбери книгу для изучения/i),
        ).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it('should handle 404 routes', async () => {
    renderWithRouter(<App />, { initialEntries: ['/non-existent-route'] });

    await waitFor(
      () => {
        // Should redirect to welcome page
        expect(screen.getByText(/Добро пожаловать/i)).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });
});
