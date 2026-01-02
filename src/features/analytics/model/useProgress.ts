import { useCallback } from 'react';

import { SectionKey, SECTIONS } from '~/entities/book';

import { db } from '../lib/db';
import { SectionStats } from './session';

/**
 * Hook for managing user progress and quiz generation.
 * Provides functions to record answers, get statistics, and generate adaptive quizzes.
 * All data now comes from the attempts table only.
 */
export function useProgress() {
  /**
   * Records an answer attempt in the database.
   * This is the source of truth for all analytics.
   */
  const recordAnswer = useCallback(
    async (section: SectionKey, isCorrect: boolean, questionId: string) => {
      await db.attempts.add({
        questionId,
        section,
        isCorrect: isCorrect ? 1 : 0,
        timestamp: Date.now(),
      });
    },
    [],
  );

  /**
   * Gets IDs of questions that have been answered correctly (mastered).
   * Derived from attempts table - questions with at least one correct answer.
   */
  const getCompletedQuestionIds = useCallback(async (): Promise<
    Set<string>
  > => {
    // Get all questions that have been answered correctly at least once
    // Convert boolean to number (1) for IndexedDB - isCorrect stored as 0/1
    const correctAttempts = await db.attempts
      .where('isCorrect')
      .equals(1)
      .toArray();

    return new Set(correctAttempts.map((a) => a.questionId));
  }, []);

  /**
   * Gets section statistics for adaptive selection.
   * Uses the attempts table to calculate accuracy per section.
   */
  const getSectionStats = useCallback(async (): Promise<SectionStats[]> => {
    const stats = await Promise.all(
      SECTIONS.map(async (section) => {
        // Use compound index [section+isCorrect] for fast counting
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
          accuracy: total > 0 ? correct / total : 0,
          correctCount: correct,
          totalCount: total,
        };
      }),
    );

    return stats;
  }, []);

  /**
   * Gets a snapshot of current statistics (synchronous version for immediate use).
   * Note: This is a simplified version. For real-time updates, use async getSectionStats.
   */
  const getStatsSnapshot = useCallback((): SectionStats[] => {
    // Return empty array as placeholder - actual implementation would need state
    // For now, components should use async getSectionStats
    return [];
  }, []);

  // Legacy function - kept for compatibility but no longer needed
  const recordQuestionAnswer = useCallback(
    async (questionId: string, isCorrect: boolean) => {
      // No-op - question completion is now derived from attempts table
      // This function is kept for backward compatibility but does nothing
    },
    [],
  );

  return {
    recordAnswer,
    getSectionStats,
    recordQuestionAnswer,
    getCompletedQuestionIds,
    getStatsSnapshot,
  };
}
