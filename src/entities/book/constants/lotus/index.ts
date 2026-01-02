import { verbsQuestions } from './verbs';
import { articlesQuestions } from './articles';
import { prepositionsQuestions } from './prepositions';
import { wordFormationQuestions } from './wordFormation';
import { translationQuestions } from './translation';
import { Book } from '../../model/book';

export const lotusBook = new Book('lotus', 'Безмятежный Лотос')
  .setQuestions('verbs', verbsQuestions)
  .setQuestions('articles', articlesQuestions)
  .setQuestions('prepositions', prepositionsQuestions)
  .setQuestions('wordFormation', wordFormationQuestions)
  .setQuestions('translation', translationQuestions);
