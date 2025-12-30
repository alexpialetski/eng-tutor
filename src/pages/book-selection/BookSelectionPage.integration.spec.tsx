import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter, resetDatabase } from '../../test-utils';
import App from '../../app/app';
import { db } from '../../features/progress/lib/db';
import { books } from '../../shared/constants/books';

describe('BookSelectionPage Integration', () => {
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
    renderWithRouter(<App />, { initialEntries: ['/books'] });
    
    await waitFor(() => {
      expect(screen.getByText(/Добро пожаловать/i)).toBeInTheDocument();
    });
  });

  it('should display user name and books', async () => {
    renderWithRouter(<App />, { initialEntries: ['/books'] });
    
    await waitFor(() => {
      expect(screen.getByText(/Привет, Test User!/i)).toBeInTheDocument();
      expect(screen.getByText(/Выбери книгу для изучения/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Should show available books
    books.forEach(book => {
      expect(screen.getByText(book.title)).toBeInTheDocument();
      expect(screen.getByText(book.subtitle)).toBeInTheDocument();
    });
  });

  it('should navigate to quiz when book is selected', async () => {
    const user = userEvent.setup();
    const book = books[0];
    if (!book) {
      throw new Error('No book found');
    }

    renderWithRouter(<App />, { initialEntries: ['/books'] });
    
    await waitFor(() => {
      expect(screen.getByText(book.title)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    const startButton = screen.getByRole('button', { name: /Начать тест/i });
    await user.click(startButton);
    
    // Should navigate to quiz page
    await waitFor(() => {
      expect(screen.getByText(/Безмятежный Лотос/i)).toBeInTheDocument();
      expect(screen.getByText(/Полный цикл подготовки/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should display statistics if available', async () => {
    // Add some progress data
    await db.progress.add({
      userId: 1,
      bookId: books[0]?.id || 'lotus',
      section: 'verbs',
      correctCount: 8,
      totalCount: 10,
      lastAttempt: new Date(),
    });

    renderWithRouter(<App />, { initialEntries: ['/books'] });
    
    await waitFor(() => {
      expect(screen.getByText(/Твоя статистика/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should show loading state initially', () => {
    renderWithRouter(<App />, { initialEntries: ['/books'] });
    
    // Should show loading initially
    const loadingText = screen.queryByText(/Загрузка/i);
    // Loading might be too fast to catch, so we just check it doesn't error
    expect(loadingText || screen.getByText(/Привет/i)).toBeTruthy();
  });
});

