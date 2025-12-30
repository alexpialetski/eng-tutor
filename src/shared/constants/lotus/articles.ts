import { Question } from '../../types';

export const articlesQuestions: Question[] = [
  {
    section: 'articles',
    context:
      'Речь идет о конкретной Истине (абстрактное понятие с большой буквы).',
    text: "Finding <input type='text' id='answer-input'> (a/an/the) Truth is the ultimate goal.",
    correct: ['the'],
    rule: "Обычно перед абстрактными понятиями артикль не нужен, но здесь 'The Truth' как конкретная, единственная истина (часто в религиозном контексте).",
    examples: [
      'Tell me <b>the truth</b>.',
      '<b>Truth</b> is stranger than fiction (общий смысл).',
      'He searches for <b>the truth</b>.',
    ],
  },
  {
    section: 'articles',
    context: 'Уникальное сооружение (Название храма).',
    text: "They approached <input type='text' id='answer-input'> (a/an/the) Temple of Truth.",
    correct: ['the'],
    rule: 'Перед названиями уникальных зданий, музеев, памятников (особенно с предлогом of) ставится The.',
    examples: [
      '<b>The</b> Tower of London.',
      '<b>The</b> Great Wall of China.',
      '<b>The</b> British Museum.',
    ],
  },
  {
    section: 'articles',
    context: 'Превосходная степень прилагательного.',
    text: "It was <input type='text' id='answer-input'> (a/an/the) most powerful weapon in the world.",
    correct: ['the'],
    rule: 'Перед превосходной степенью (самый-самый) всегда ставится The.',
    examples: [
      'He is <b>the best</b> student.',
      'This is <b>the most interesting</b> book.',
      'It is <b>the oldest</b> tree.',
    ],
  },
  {
    section: 'articles',
    context: 'Сторона света.',
    text: "He decided to go to <input type='text' id='answer-input'> (a/an/the) East to find his master.",
    correct: ['the'],
    rule: 'Стороны света (North, South, East, West) используются с артиклем The.',
    examples: [
      'The sun rises in <b>the East</b>.',
      'He lives in <b>the North</b>.',
      'Go to <b>the West</b>.',
    ],
  },
];
