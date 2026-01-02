export const allowsEmptyAnswer = (correctAnswers: string[]): boolean => {
  return (
    correctAnswers.includes('') ||
    correctAnswers.includes('-') ||
    correctAnswers.includes('--')
  );
};

export const validateAnswer = (
  userAnswer: string,
  correctAnswers: string[],
): boolean => {
  const normalized = userAnswer.trim().toLowerCase();

  // Check for empty answer (for questions that accept empty string)
  if (allowsEmptyAnswer(correctAnswers)) {
    if (
      normalized === '' ||
      normalized === '-' ||
      normalized === '--' ||
      normalized === 'no preposition'
    ) {
      return true;
    }
  }

  // Check if answer matches any correct answer
  return correctAnswers.some((correct) => correct.toLowerCase() === normalized);
};
