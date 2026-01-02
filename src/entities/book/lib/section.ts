import { SectionKey } from '../model/question';

/**
 * Get Russian name for a section key
 */
export const getSectionName = (key: SectionKey): string => {
  if (key === 'verbs') {
    return 'Глаголы и Времена';
  }
  if (key === 'articles') {
    return 'Артикли';
  }
  if (key === 'prepositions') {
    return 'Предлоги';
  }
  if (key === 'wordFormation') {
    return 'Словообразование';
  }
  if (key === 'translation') {
    return 'Перевод слов';
  }
  return '';
};
