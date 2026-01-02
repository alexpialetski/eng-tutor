import { Question } from '../../model/question';

export const articlesQuestions: Question[] = [
  {
    id: '613b47a5-413f-450d-a5f9-5a49360b92c6',
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
    id: '01cf8a6b-0cdf-46e9-b2f0-6eebffc852f7',
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
    id: '28a17483-ac02-4c3f-87c0-8b96719f02fa',
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
    id: '9cc4321d-1ca8-44af-9fe9-9952aa12a091',
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
