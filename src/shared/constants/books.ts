import { Book } from '../types';
import { lotusQuestions } from './lotus';

export const books: Book[] = [
  {
    id: 'lotus',
    title: 'Безмятежный Лотос',
    subtitle: 'Полный цикл подготовки (8 класс)',
    questions: lotusQuestions,
  },
];

export const getBookById = (id: string): Book | undefined => {
  return books.find((book) => book.id === id);
};
