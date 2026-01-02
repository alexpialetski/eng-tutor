import { Question } from '../../model/question';

export const wordFormationQuestions: Question[] = [
  {
    id: '71d332dc-105c-4701-abda-3e7c120b0589',
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
    id: 'f04ea66a-5d44-423b-a752-fb8d19b7ea5c',
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
    id: 'c0d3de5f-c08f-4f77-97f4-1118782443c6',
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
    id: '737591fb-48c3-46d1-b5b1-3a9a864d1542',
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
    id: 'a7d78d27-87c8-40ba-8d49-6e403cf15451',
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
