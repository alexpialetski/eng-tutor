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

  it('should protect routes and redirect unauthenticated users', async () => {
    // Try to access protected route without user
    renderWithRouter(<App />, { initialEntries: ['/books'] });
    
    await waitFor(() => {
      // Should redirect to welcome page
      expect(screen.getByText(/Добро пожаловать/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should handle 404 routes', async () => {
    renderWithRouter(<App />, { initialEntries: ['/non-existent-route'] });
    
    await waitFor(() => {
      // Should redirect to welcome page
      expect(screen.getByText(/Добро пожаловать/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});

