import Dexie from 'dexie';

import { SectionKey } from '~/entities/book';

import { Attempt, db } from './db';

export interface TrendResult {
  section: SectionKey;
  currentAccuracy: number; // e.g., 80%
  previousAccuracy: number; // e.g., 60%
  improvement: number; // e.g., +20%
  status: 'improving' | 'declining' | 'stable' | 'insufficient_data';
}

export interface DailyStat {
  date: string; // ISO Date "2023-10-01"
  total: number;
  correct: number;
}

/**
 * Service for analyzing user progress trends.
 * Uses sliding window approach to compare recent performance vs. older performance.
 */
export const analyticsService = {
  /**
   * Calculates improvement trend for a specific section.
   * Method: Sliding Window. Compares the last N attempts with the N attempts before that.
   * Uses compound index [section+timestamp] for efficient chronological queries.
   */
  async getSectionTrend(
    section: SectionKey,
    windowSize = 10,
  ): Promise<TrendResult> {
    // 1. Fetch the last 2 * windowSize attempts (e.g., last 20 attempts)
    // Using reverse() to get newest first, then limit to avoid loading entire history
    const history = await db.attempts
      .where('[section+timestamp]')
      .between([section, Dexie.minKey], [section, Dexie.maxKey]) // Range query for section
      .reverse() // Newest first
      .limit(windowSize * 2)
      .toArray();

    // 2. Check if we have enough data
    if (history.length < windowSize) {
      return {
        section,
        currentAccuracy: 0,
        previousAccuracy: 0,
        improvement: 0,
        status: 'insufficient_data',
      };
    }

    // 3. Split into "Recent" (Window 1) and "Previous" (Window 2)
    const recentAttempts = history.slice(0, windowSize);
    const previousAttempts = history.slice(windowSize, windowSize * 2);

    // 4. Calculate accuracy helper
    // Note: isCorrect is stored as 0/1 in DB, convert to boolean for filtering
    const calculateAccuracy = (attempts: Attempt[]) => {
      if (attempts.length === 0) return 0;
      const correctCount = attempts.filter((a) => a.isCorrect === 1).length;
      return (correctCount / attempts.length) * 100;
    };

    const currentAcc = calculateAccuracy(recentAttempts);

    // If user hasn't played enough for the second window, compare against current or handle separately
    const prevAcc =
      previousAttempts.length > 0
        ? calculateAccuracy(previousAttempts)
        : currentAcc; // Fallback: no trend yet

    const diff = currentAcc - prevAcc;

    // 5. Determine status based on threshold
    let status: TrendResult['status'] = 'stable';
    if (previousAttempts.length === 0) status = 'stable';
    else if (diff >= 10)
      status = 'improving'; // Threshold: 10% improvement
    else if (diff <= -10) status = 'declining'; // Threshold: 10% decline

    return {
      section,
      currentAccuracy: Math.round(currentAcc),
      previousAccuracy: Math.round(prevAcc),
      improvement: Math.round(diff),
      status,
    };
  },

  /**
   * Aggregates stats by day for chart visualization (e.g., "Last 7 days").
   * Groups attempts by date and calculates daily accuracy.
   */
  async getDailyProgress(daysBack = 7): Promise<DailyStat[]> {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - daysBack);

    // Normalize to start of day timestamp
    startDate.setHours(0, 0, 0, 0);
    const startTimestamp = startDate.getTime();

    // Fetch all attempts since startTimestamp
    // Using index on timestamp for efficient range query
    const recentAttempts = await db.attempts
      .where('timestamp')
      .aboveOrEqual(startTimestamp)
      .toArray();

    // Group by Date string (YYYY-MM-DD)
    const grouped: Record<string, DailyStat> = {};

    recentAttempts.forEach((att) => {
      const dateKey = new Date(att.timestamp).toISOString().split('T')[0];

      if (!grouped[dateKey]) {
        grouped[dateKey] = { date: dateKey, total: 0, correct: 0 };
      }

      grouped[dateKey].total++;
      // isCorrect is stored as 0/1 in IndexedDB
      if (att.isCorrect === 1) grouped[dateKey].correct++;
    });

    // Convert object to array and sort by date
    return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
  },

  /**
   * Gets overall statistics for all sections.
   * Uses compound index [section+isCorrect] for instant calculation.
   */
  async getAllSectionStats(): Promise<
    Array<{
      section: SectionKey;
      total: number;
      correct: number;
      accuracy: number;
    }>
  > {
    const sections: SectionKey[] = [
      'verbs',
      'articles',
      'prepositions',
      'wordFormation',
      'translation',
    ];

    // Parallel queries for all sections
    const stats = await Promise.all(
      sections.map(async (section) => {
        // Convert boolean to number (1) for IndexedDB
        const correct = await db.attempts
          .where('[section+isCorrect]')
          .equals([section, 1])
          .count();
        const total = await db.attempts
          .where('section')
          .equals(section)
          .count();

        return {
          section,
          total,
          correct,
          accuracy: total > 0 ? correct / total : 0,
        };
      }),
    );

    return stats;
  },
};
