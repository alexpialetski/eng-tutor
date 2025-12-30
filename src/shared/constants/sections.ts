/**
 * Section keys in English (used in code)
 */
export type SectionKey =
  | 'verbs'
  | 'articles'
  | 'prepositions'
  | 'wordFormation'
  | 'translation';

/**
 * Translation map from English section keys to Russian names
 */
export const sectionTranslations: Record<SectionKey, string> = {
  verbs: 'Глаголы и Времена',
  articles: 'Артикли',
  prepositions: 'Предлоги',
  wordFormation: 'Словообразование',
  translation: 'Перевод слов',
};

/**
 * Get Russian name for a section key
 */
export const getSectionName = (key: SectionKey): string => {
  return sectionTranslations[key];
};

