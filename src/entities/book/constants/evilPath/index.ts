import { Book } from '../../model/book';
import { articlesQuestions } from './articles';
import { prepositionsQuestions } from './prepositions';
import { translationQuestions } from './translation';
import { verbsQuestions } from './verbs';
import { wordFormationQuestions } from './wordFormation';

export const evilPathBook = new Book('evilPath', 'Злодейский путь')
  .setQuestions('verbs', verbsQuestions)
  .setQuestions('articles', articlesQuestions)
  .setQuestions('prepositions', prepositionsQuestions)
  .setQuestions('wordFormation', wordFormationQuestions)
  .setQuestions('translation', translationQuestions);
