import { lotusBook } from './lotus';
import { Book } from '../model/book';

export const books: Book[] = [lotusBook];

export const getBookById = (id: string): Book | null => {
  return books.find((book) => book.id === id) || null;
};
