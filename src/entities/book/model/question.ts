/**
 * Section keys in English (used in code)
 */

export type SectionKey =
  | 'verbs'
  | 'articles'
  | 'prepositions'
  | 'wordFormation'
  | 'translation';

export interface Question {
  id: string;
  section: SectionKey;
  context: string;
  text: string;
  correct: string[];
  rule: string;
  examples: string[];
}

export const SECTIONS: SectionKey[] = [
  'verbs',
  'articles',
  'prepositions',
  'wordFormation',
  'translation',
];
