import Dexie, { Table } from 'dexie';

import { SectionKey } from '~/entities/book';

// Interface for attempt tracking
// Note: isCorrect is stored as number (0/1) in IndexedDB because IndexedDB doesn't support boolean indexes
export interface Attempt {
  id?: number;
  questionId: string;
  bookId: string; // Book identifier to filter attempts by book
  section: SectionKey;
  isCorrect: number; // Stored as 0 (false) or 1 (true) - IndexedDB doesn't support boolean indexes
  timestamp: number; // Critical for chronological sorting and progress tracking
}

class EngTutorDB extends Dexie {
  attempts!: Table<Attempt, number>;

  constructor() {
    super('EngTutorDBv2');

    // Version 1: Initial schema with bookId field
    // Indexes:
    // - isCorrect: enables queries for all correct (1) / incorrect (0) attempts
    // - [section+isCorrect]: enables instant statistics calculation per section
    // - [section+timestamp]: enables efficient chronological queries per section
    // - bookId: enables queries filtered by book
    // - [bookId+isCorrect]: enables instant statistics calculation per book
    // - [bookId+section]: enables book-specific section queries
    // - [bookId+section+isCorrect]: enables book-specific section statistics
    // - [bookId+timestamp]: enables book-specific chronological queries
    this.version(1).stores({
      attempts:
        '++id, questionId, bookId, section, isCorrect, [section+isCorrect], [bookId+isCorrect], [bookId+section], [bookId+section+isCorrect], timestamp, [section+timestamp], [bookId+timestamp]',
    });
  }
}

export const db = new EngTutorDB();
