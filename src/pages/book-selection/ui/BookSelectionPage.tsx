import React from 'react';

import { books } from '~/entities/book';
import {
  AnalyticsCard,
  ProgressDashboard,
  SectionStatsCard,
} from '~/features/analytics';
import { Card } from '~/shared/ui/Card';

import { AvailableBook } from './AvailableBook';

import './BookSelectionPage.css';

export const BookSelectionPage: React.FC = () => {
  return (
    <div className="book-selection-container">
      <Card>
        <h1>Безмятежный Лотос</h1>
        <div className="subtitle">Выбери книгу для изучения</div>

        <div className="books-section">
          <h2>Доступные книги</h2>
          <div className="books-grid">
            {books.map((book) => (
              <AvailableBook key={book.id} book={book} />
            ))}
          </div>
        </div>

        <SectionStatsCard />

        <div className="analytics-section">
          <AnalyticsCard />
        </div>

        <div className="analytics-section">
          <ProgressDashboard />
        </div>
      </Card>
    </div>
  );
};
