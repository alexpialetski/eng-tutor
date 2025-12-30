import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { resetDatabase } from '../test-utils';
import App from './app';

describe('App', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );
    expect(baseElement).toBeTruthy();
  });

  it('should show welcome page on root route', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );
    expect(screen.getByText(/Безмятежный Лотос/i)).toBeInTheDocument();
    expect(screen.getByText(/Добро пожаловать/i)).toBeInTheDocument();
  });
});
