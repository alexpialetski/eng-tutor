import { Question } from '../../model/question';

export const translationQuestions: Question[] = [
  {
    id: 'a4f0242a-94b0-4cfc-a0e0-1f6a24a6f9ce',
    section: 'translation',
    context: 'Усиление сравнения (намного сильнее).',
    text: "The Master was <input type='text' id='answer-input'> (намного) stronger than his enemies.",
    correct: ['much', 'far'],
    rule: 'Сравнительную степень (stronger) усиливают словами MUCH или FAR. Нельзя использовать Very!',
    examples: [
      'It is <b>much better</b>.',
      'She is <b>far more</b> intelligent.',
      'This way is <b>much longer</b>.',
    ],
  },
  {
    id: '7f97127c-6a1e-4b59-b208-8536e33932cd',
    section: 'translation',
    context: 'Отрицательное местоимение.',
    text: "There was <input type='text' id='answer-input'> (никого) in the abandoned pavilion.",
    correct: ['nobody', 'no one'],
    rule: 'В английском предложении должно быть только одно отрицание. Если есть was (нет not), используем nobody/no one.',
    examples: [
      'I saw <b>nobody</b>.',
      'There is <b>no one</b> here.',
      '<b>Nobody</b> knows the truth.',
    ],
  },
  {
    id: 'e8950608-bf80-4435-8a68-4be22280fbd9',
    section: 'translation',
    context: 'Наречие образа действия.',
    text: "He looked at him <input type='text' id='answer-input'> (молча) and smiled.",
    correct: ['silently'],
    rule: 'Silent (тихий) + суффикс наречия -ly = Silently (молча/тихо).',
    examples: [
      'Quick -> <b>Quickly</b>',
      'Quiet -> <b>Quietly</b>',
      'Loud -> <b>Loudly</b>',
    ],
  },
];
