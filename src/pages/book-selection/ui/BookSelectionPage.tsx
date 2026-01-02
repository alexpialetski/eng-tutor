import React from 'react';

import { books } from '~/entities/book';
import {
  AnalyticsCard,
  ProgressDashboard,
  SectionStatsCard,
} from '~/features/analytics';
import { Card } from '~/shared/ui/Card';

import { AvailableBook } from './AvailableBook';

export const BookSelectionPage: React.FC = () => {
  return (
    <div className="flex justify-center items-start min-h-screen p-5">
      <Card>
        <h1>Безмятежный Лотос</h1>
        <div className="text-center italic text-gray-600 mb-8 text-sm">
          Выбери книгу для изучения
        </div>

        <div className="mt-10">
          <h2 className="text-primary text-2xl mb-5 font-normal">
            Доступные книги
          </h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5">
            {books.map((book) => (
              <AvailableBook key={book.id} book={book} />
            ))}
          </div>
        </div>

        <SectionStatsCard />

        <div className="my-10">
          <AnalyticsCard />
        </div>

        <div className="my-10">
          <ProgressDashboard />
        </div>
      </Card>
    </div>
  );
};
