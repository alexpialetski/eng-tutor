import { SectionKey } from '../constants/sections';

export interface Question {
  section: SectionKey;
  context: string;
  text: string;
  correct: string[];
  rule: string;
  examples: string[];
}

export interface Book {
  id: string;
  title: string;
  subtitle: string;
  questions: Question[];
}

export interface User {
  id?: number;
  name: string;
  createdAt: Date;
}

export interface Progress {
  id?: number;
  userId: number;
  bookId: string;
  section: SectionKey;
  correctCount: number;
  totalCount: number;
  lastAttempt: Date;
}

export interface Session {
  id?: number;
  userId: number;
  bookId: string;
  score: number;
  totalQuestions: number;
  completedAt: Date;
}

export interface SectionStats {
  section: SectionKey;
  accuracy: number;
  correctCount: number;
  totalCount: number;
}
