import { Question } from './shared/types';

// Mock questions for testing
export const mockQuestions: Question[] = [
  {
    section: 'verbs',
    context: 'Test context 1',
    text: "The student <input type='text' id='answer-input'> (study) when the bell rang.",
    correct: ['was studying'],
    rule: 'Test rule for verbs',
    examples: ['Example 1', 'Example 2'],
  },
  {
    section: 'articles',
    context: 'Test context 2',
    text: "I saw <input type='text' id='answer-input'> elephant in the zoo.",
    correct: ['an'],
    rule: 'Test rule for articles',
    examples: ['Example 1'],
  },
  {
    section: 'prepositions',
    context: 'Test context 3',
    text: "The book is <input type='text' id='answer-input'> the table.",
    correct: ['on'],
    rule: 'Test rule for prepositions',
    examples: ['Example 1'],
  },
];

