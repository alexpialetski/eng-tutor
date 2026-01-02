import { SectionKey } from '~/entities/book';

/**
 * Statistics for a specific section (topic).
 * Used for displaying progress and adaptive question selection.
 */
export interface SectionStats {
  section: SectionKey;
  accuracy: number; // 0 to 1 (e.g., 0.8 = 80%)
  correctCount: number;
  totalCount: number;
}
