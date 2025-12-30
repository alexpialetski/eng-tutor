import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter, To } from 'react-router-dom';
import { db } from './features/progress/lib/db';

// Clean up database before each test
export const resetDatabase = async () => {
  try {
    // Clear all tables
    await Promise.all([
      db.users.clear(),
      db.progress.clear(),
      db.sessions.clear(),
    ]);
  } catch (error) {
    // If clearing fails, the database might need to be reinitialized
    // This can happen with fake-indexeddb in some edge cases
    console.warn('Database reset warning:', error);
    // Try to continue anyway - the next operation will reopen the database if needed
  }
};

// Test wrapper with router
interface TestWrapperProps {
  children: React.ReactNode;
  initialEntries?: To[];
}

export const TestWrapper: React.FC<TestWrapperProps> = ({
  children,
  initialEntries = ['/'],
}) => {
  return (
    <MemoryRouter
      initialEntries={initialEntries}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      {children}
    </MemoryRouter>
  );
};

// Custom render function with router
export const renderWithRouter = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    initialEntries?: To[];
  },
) => {
  const { initialEntries = ['/'], ...renderOptions } = options || {};

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <TestWrapper initialEntries={initialEntries}>{children}</TestWrapper>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Helper to wait for async operations
export const waitForAsync = () =>
  new Promise((resolve) => setTimeout(resolve, 0));
