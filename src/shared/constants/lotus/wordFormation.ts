import { Question } from '../../types';

export const wordFormationQuestions: Question[] = [
  {
    section: 'wordFormation',
    context: 'Существительное от DARK.',
    text: "The forest was filled with a mysterious <input type='text' id='answer-input'> (DARK).",
    correct: ['darkness'],
    rule: 'Суффикс -N ESS превращает прилагательное в существительное.',
    examples: [
      'Sad -> <b>Sadness</b>',
      'Happy -> <b>Happiness</b>',
      'Weak -> <b>Weakness</b>',
    ],
  },
  {
    section: 'wordFormation',
    context: 'Прилагательное от DANGER.',
    text: "It was a <input type='text' id='answer-input'> (DANGER) journey.",
    correct: ['dangerous'],
    rule: 'Суффикс -OUS образует прилагательное.',
    examples: [
      'Fame -> <b>Famous</b>',
      'Mystery -> <b>Mysterious</b>',
      'Nerve -> <b>Nervous</b>',
    ],
  },
  {
    section: 'wordFormation',
    context: 'Прилагательное от BEAUTY.',
    text: "The melody of the flute was very <input type='text' id='answer-input'> (BEAUTY).",
    correct: ['beautiful'],
    rule: "Суффикс -FUL (полный качества). Обратите внимание: 'y' меняется на 'i'.",
    examples: [
      'Use -> <b>Useful</b>',
      'Help -> <b>Helpful</b>',
      'Color -> <b>Colorful</b>',
    ],
  },
  {
    section: 'wordFormation',
    context: 'Существительное от PATIENT.',
    text: "To become an immortal, you need a lot of <input type='text' id='answer-input'> (PATIENT).",
    correct: ['patience'],
    rule: 'Patient (терпеливый) -> Patience (терпение). t меняется на ce.',
    examples: [
      'Silent -> <b>Silence</b>',
      'Important -> <b>Importance</b>',
      'Different -> <b>Difference</b>',
    ],
  },
  {
    section: 'wordFormation',
    context: 'Наречие + Отрицание от FORTUNE (Сложно!).',
    text: "<input type='text' id='answer-input'> (FORTUNE), the memories did not return immediately.",
    correct: ['unfortunately'],
    rule: '1. Делаем наречие: Fortune -> Fortunately. <br>2. Меняем смысл на противоположный (по контексту - грустно): Unfortunately.',
    examples: [
      'Lucky -> <b>Unluckily</b>',
      'Happy -> <b>Unhappily</b>',
      'Expected -> <b>Unexpectedly</b>',
    ],
  },
];
