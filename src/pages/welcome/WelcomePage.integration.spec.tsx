import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter, resetDatabase } from '../../test-utils';
import App from '../../app/app';

describe('WelcomePage Integration', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it('should render welcome form', () => {
    renderWithRouter(<App />);

    expect(screen.getByText(/Безмятежный Лотос/i)).toBeInTheDocument();
    expect(screen.getByText(/Добро пожаловать/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Как тебя зовут/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Введи свое имя/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Начать обучение/i }),
    ).toBeInTheDocument();
  });

  it('should disable submit button when name is empty', () => {
    renderWithRouter(<App />);

    const submitButton = screen.getByRole('button', {
      name: /Начать обучение/i,
    });
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when name is entered', async () => {
    const user = userEvent.setup();
    renderWithRouter(<App />);

    const input = screen.getByPlaceholderText(/Введи свое имя/i);
    const submitButton = screen.getByRole('button', {
      name: /Начать обучение/i,
    });

    await user.type(input, 'Test User');

    expect(submitButton).not.toBeDisabled();
  });

  it('should create user and navigate to books page on submit', async () => {
    const user = userEvent.setup();
    renderWithRouter(<App />);

    const input = screen.getByPlaceholderText(/Введи свое имя/i);
    const submitButton = screen.getByRole('button', {
      name: /Начать обучение/i,
    });

    await user.type(input, 'Test User');
    await user.click(submitButton);

    // Wait for navigation
    await waitFor(
      () => {
        // After navigation, we should see the book selection page
        expect(
          screen.getByText(/Выбери книгу для изучения/i),
        ).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it('should trim whitespace from name input', async () => {
    const user = userEvent.setup();
    renderWithRouter(<App />);

    const input = screen.getByPlaceholderText(/Введи свое имя/i);
    const submitButton = screen.getByRole('button', {
      name: /Начать обучение/i,
    });

    await user.type(input, '  Test User  ');
    await user.click(submitButton);

    await waitFor(
      () => {
        expect(
          screen.getByText(/Выбери книгу для изучения/i),
        ).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });
});
