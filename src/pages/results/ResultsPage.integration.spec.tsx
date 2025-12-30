import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter, resetDatabase } from '../../test-utils';
import App from '../../app/app';
import { db } from '../../features/progress/lib/db';
import { books } from '../../shared/constants/books';

describe('ResultsPage Integration', () => {
  beforeEach(async () => {
    await resetDatabase();
    // Create a test user
    await db.users.add({
      id: 1,
      name: 'Test User',
      createdAt: new Date(),
    });
  });

  it('should redirect to welcome if no user', async () => {
    await resetDatabase();
    renderWithRouter(<App />, { 
      initialEntries: [{ pathname: '/books/lotus/results', state: { score: 5, totalQuestions: 10 } }] 
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Добро пожаловать/i)).toBeInTheDocument();
    });
  });

  it('should display results with score', async () => {
    const book = books[0];
    if (!book) {
      throw new Error('No book found');
    }

    renderWithRouter(<App />, { 
      initialEntries: [{ 
        pathname: `/books/${book.id}/results`, 
        state: { score: 8, totalQuestions: 10 } 
      }] 
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Испытание завершено/i)).toBeInTheDocument();
      expect(screen.getByText(/8 \/ 10/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should show appropriate message for 100% score', async () => {
    const book = books[0];
    if (!book) {
      throw new Error('No book found');
    }

    renderWithRouter(<App />, { 
      initialEntries: [{ 
        pathname: `/books/${book.id}/results`, 
        state: { score: 10, totalQuestions: 10 } 
      }] 
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Потрясающе/i)).toBeInTheDocument();
      expect(screen.getByText(/Золотого Ядра/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should show appropriate message for 80%+ score', async () => {
    const book = books[0];
    if (!book) {
      throw new Error('No book found');
    }

    renderWithRouter(<App />, { 
      initialEntries: [{ 
        pathname: `/books/${book.id}/results`, 
        state: { score: 8, totalQuestions: 10 } 
      }] 
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Отличный результат/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should show appropriate message for 50%+ score', async () => {
    const book = books[0];
    if (!book) {
      throw new Error('No book found');
    }

    renderWithRouter(<App />, { 
      initialEntries: [{ 
        pathname: `/books/${book.id}/results`, 
        state: { score: 6, totalQuestions: 10 } 
      }] 
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Ты на верном пути/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should show appropriate message for <50% score', async () => {
    const book = books[0];
    if (!book) {
      throw new Error('No book found');
    }

    renderWithRouter(<App />, { 
      initialEntries: [{ 
        pathname: `/books/${book.id}/results`, 
        state: { score: 3, totalQuestions: 10 } 
      }] 
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Твоя ци нестабильна/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should navigate to quiz when retry button is clicked', async () => {
    const user = userEvent.setup();
    const book = books[0];
    if (!book) {
      throw new Error('No book found');
    }

    renderWithRouter(<App />, { 
      initialEntries: [{ 
        pathname: `/books/${book.id}/results`, 
        state: { score: 5, totalQuestions: 10 } 
      }] 
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Испытание завершено/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    const retryButton = screen.getByRole('button', { name: /Пройти заново/i });
    await user.click(retryButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Безмятежный Лотос/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should navigate to book selection when back button is clicked', async () => {
    const user = userEvent.setup();
    const book = books[0];
    if (!book) {
      throw new Error('No book found');
    }

    renderWithRouter(<App />, { 
      initialEntries: [{ 
        pathname: `/books/${book.id}/results`, 
        state: { score: 5, totalQuestions: 10 } 
      }] 
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Испытание завершено/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    const backButton = screen.getByRole('button', { name: /Выбрать другую книгу/i });
    await user.click(backButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Выбери книгу для изучения/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should save session to database', async () => {
    const book = books[0];
    if (!book) {
      throw new Error('No book found');
    }

    renderWithRouter(<App />, { 
      initialEntries: [{ 
        pathname: `/books/${book.id}/results`, 
        state: { score: 7, totalQuestions: 10 } 
      }] 
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Испытание завершено/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Wait a bit for the session to be saved
    await waitFor(async () => {
      const sessions = await db.sessions.toArray();
      expect(sessions.length).toBeGreaterThan(0);
      expect(sessions[0].score).toBe(7);
      expect(sessions[0].totalQuestions).toBe(10);
    }, { timeout: 3000 });
  });
});

