import { Book } from '../model/book';
import { evilPathBook } from './evilPath';
import { lotusBook } from './lotus';

export const books: Book[] = [lotusBook, evilPathBook];

export const getBookById = (id: string): Book | null => {
  return books.find((book) => book.id === id) || null;
};
