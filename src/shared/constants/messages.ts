/**
 * Congratulatory messages for correct answers
 */
export const congratulatoryMessages: string[] = [
  'Твоя Ци течет свободно. Ответ правильный.',
  'Отлично! Ты на верном пути к мастерству.',
  'Превосходно! Твои знания крепнут.',
  'Великолепно! Ты постигаешь истину.',
  'Замечательно! Твоя духовная сила растет.',
  'Правильно! Ты движешься к просветлению.',
  'Молодец! Твоя практика приносит плоды.',
  'Отлично! Ты понимаешь суть учения.',
  'Правильно! Твоя мудрость увеличивается.',
  'Верно! Ты на пути к совершенству.',
  'Превосходно! Твои навыки улучшаются.',
  'Замечательно! Ты усваиваешь знания.',
  'Отлично! Твоя концентрация работает.',
  'Правильно! Ты постигаешь секреты языка.',
  'Верно! Твоя практика эффективна.',
];

/**
 * Get a random congratulatory message
 */
export const getRandomCongratulatoryMessage = (): string => {
  const randomIndex = Math.floor(Math.random() * congratulatoryMessages.length);
  return congratulatoryMessages[randomIndex];
};

