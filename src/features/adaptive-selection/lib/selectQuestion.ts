import { Question } from '../../../shared/types';
import { SectionStats } from '../../../shared/types';
import { SectionKey } from '../../../shared/constants/sections';

export const selectQuestion = (
  questions: Question[],
  sectionStats: SectionStats[]
): Question => {
  // If no stats, return random question
  if (sectionStats.length === 0) {
    return questions[Math.floor(Math.random() * questions.length)];
  }

  // Create a map of section to accuracy
  const accuracyMap = new Map<SectionKey, number>();
  sectionStats.forEach((stat) => {
    accuracyMap.set(stat.section, stat.accuracy);
  });

  // Group questions by section
  const questionsBySection = new Map<SectionKey, Question[]>();
  questions.forEach((q) => {
    const existing = questionsBySection.get(q.section) || [];
    existing.push(q);
    questionsBySection.set(q.section, existing);
  });

  // Calculate weights: lower accuracy = higher weight
  const weights: Array<{ section: SectionKey; weight: number; questions: Question[] }> = [];
  let totalWeight = 0;

  questionsBySection.forEach((sectionQuestions, section) => {
    const accuracy = accuracyMap.get(section) ?? 0.5; // Default to 0.5 if no data
    const weight = 1 - accuracy; // Inverse: lower accuracy = higher weight
    weights.push({ section, weight, questions: sectionQuestions });
    totalWeight += weight;
  });

  // If all sections have perfect accuracy, fall back to uniform random
  if (totalWeight === 0) {
    return questions[Math.floor(Math.random() * questions.length)];
  }

  // Normalize weights
  const normalizedWeights = weights.map((w) => ({
    ...w,
    weight: w.weight / totalWeight,
  }));

  // Select section based on weights
  const random = Math.random();
  let cumulative = 0;
  let selectedSection = normalizedWeights[0];

  for (const section of normalizedWeights) {
    cumulative += section.weight;
    if (random <= cumulative) {
      selectedSection = section;
      break;
    }
  }

  // Randomly select a question from the selected section
  const sectionQuestions = selectedSection.questions;
  return sectionQuestions[Math.floor(Math.random() * sectionQuestions.length)];
};

