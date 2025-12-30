import { Question } from '../../types';
import { verbsQuestions } from './verbs';
import { articlesQuestions } from './articles';
import { prepositionsQuestions } from './prepositions';
import { wordFormationQuestions } from './wordFormation';
import { translationQuestions } from './translation';

export const lotusQuestions: Question[] = [
  ...verbsQuestions,
  ...articlesQuestions,
  ...prepositionsQuestions,
  ...wordFormationQuestions,
  ...translationQuestions,
];

