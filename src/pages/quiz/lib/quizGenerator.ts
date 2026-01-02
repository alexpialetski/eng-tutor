import { Question, SectionKey } from '~/entities/book';
import { db } from '~/features/analytics';

// Configuration for weighted selection
const BASE_WEIGHT = 1; // Base weight for all sections
const ERROR_BOOST = 3; // Multiplier for sections with lower success rates

/**
 * Service for generating adaptive quizzes based on user performance.
 * Questions are stored as constants in JS, not in IndexedDB.
 * IndexedDB only stores user attempt history for analytics.
 */
export const quizGenerator = {
  /**
   * Gets statistics and calculates weights for each section.
   * Lower success rate = higher weight (more likely to be selected).
   * Uses compound index [section+isCorrect] for instant statistics.
   */
  async getSectionWeights(): Promise<Record<SectionKey, number>> {
    const sections: SectionKey[] = [
      'verbs',
      'articles',
      'prepositions',
      'wordFormation',
      'translation',
    ];
    const weights: Partial<Record<SectionKey, number>> = {};

    // Use Promise.all for parallel queries (faster than sequential)
    await Promise.all(
      sections.map(async (section) => {
        // Dexie count() is very fast using index [section+isCorrect]
        // Convert boolean to number (1) for IndexedDB
        const correct = await db.attempts
          .where('[section+isCorrect]')
          .equals([section, 1])
          .count();
        const total = await db.attempts
          .where('section')
          .equals(section)
          .count();

        // If no attempts yet, default to 0.5 (neutral) to avoid overwhelming new users
        const successRate = total === 0 ? 0.5 : correct / total;

        // Formula: Lower success rate = higher weight
        // (1 - successRate) converts 20% success (0.2) to multiplier 0.8
        weights[section] = BASE_WEIGHT + (1 - successRate) * ERROR_BOOST;
      }),
    );

    return weights as Record<SectionKey, number>;
  },

  /**
   * Generates a quiz of specified size with adaptive selection.
   * Algorithm:
   * 1. Get IDs of questions answered correctly (to exclude them)
   * 2. Filter available questions from static data
   * 3. Calculate section weights based on performance
   * 4. Select questions using weighted random selection
   */
  async getNewQuiz(allQuestions: Question[], size = 10): Promise<Question[]> {
    return db.transaction('r', db.attempts, async () => {
      // 1. Get IDs of questions answered correctly (mastered questions)
      // Using toArray() and filtering in memory is efficient for small datasets
      // Convert boolean to number (1) for IndexedDB
      const passedAttempts = await db.attempts
        .where('isCorrect')
        .equals(1)
        .toArray();

      // Create Set for O(1) lookup
      const passedIds = new Set(passedAttempts.map((a) => a.questionId));

      // 2. Filter questions in memory (JS is fast for arrays up to 10-20k items)
      const candidates = allQuestions.filter((q) => !passedIds.has(q.id));

      if (candidates.length === 0) {
        // Edge case: All questions mastered
        // Return random questions from all (review mode)
        console.warn(
          'All questions completed! Returning random questions for review.',
        );
        return allQuestions.sort(() => 0.5 - Math.random()).slice(0, size);
      }

      // 3. Get section weights based on performance
      const weights = await this.getSectionWeights();

      // 4. Group candidates by section
      const pools: Partial<Record<SectionKey, Question[]>> = {};
      candidates.forEach((q) => {
        if (!pools[q.section]) pools[q.section] = [];
        pools[q.section]!.push(q);
      });

      const quiz: Question[] = [];

      // 5. Select questions using weighted random selection
      // Continue until we have enough questions or run out of candidates
      while (quiz.length < size && quiz.length < candidates.length) {
        const section = pickWeightedSection(weights, pools);

        if (!section) break; // No more available sections

        const pool = pools[section]!;
        // Pick random question from this section
        const randomIndex = Math.floor(Math.random() * pool.length);
        const question = pool[randomIndex];

        quiz.push(question);

        // Remove question from pool to avoid duplicates in same quiz
        pool.splice(randomIndex, 1);
        if (pool.length === 0) delete pools[section];
      }

      // Final shuffle to mix topics (optional, but improves UX)
      return quiz.sort(() => 0.5 - Math.random());
    });
  },
};

/**
 * Helper function for weighted random section selection.
 * Only considers sections that still have available questions.
 */
function pickWeightedSection(
  weights: Record<string, number>,
  availablePools: Partial<Record<SectionKey, Question[]>>,
): SectionKey | null {
  // Only consider sections with remaining questions
  const activeSections = Object.keys(availablePools) as SectionKey[];
  if (activeSections.length === 0) return null;

  // Calculate total weight of available sections
  const totalWeight = activeSections.reduce(
    (sum, sec) => sum + (weights[sec] || 1),
    0,
  );

  let random = Math.random() * totalWeight;

  for (const section of activeSections) {
    random -= weights[section] || 1;
    if (random <= 0) {
      return section;
    }
  }

  // Fallback (rarely needed, but ensures robustness with float math)
  return activeSections[activeSections.length - 1];
}
