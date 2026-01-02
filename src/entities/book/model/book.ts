import { Question, SectionKey } from './question';

export class Book {
  id: string;
  title: string;
  subtitle = '';
  questions: Record<SectionKey, Question[]> = {
    verbs: [],
    articles: [],
    prepositions: [],
    wordFormation: [],
    translation: [],
  };

  constructor(id: string, title: string) {
    this.id = id;
    this.title = title;
  }

  setQuestions(key: SectionKey, questions: Question[]) {
    this.questions[key] = questions;

    return this;
  }

  getQuestions(key?: SectionKey) {
    return key ? this.questions[key] : Object.values(this.questions).flat();
  }
}
