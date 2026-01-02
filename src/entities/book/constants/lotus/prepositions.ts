import { Question } from '../../model/question';

export const prepositionsQuestions: Question[] = [
  {
    id: 'aa99538c-a77b-457f-862b-28dfb4ceb67f',
    section: 'prepositions',
    context: 'Быть грубым *по отношению* к кому-то.',
    text: "He was very rude <input type='text' id='answer-input'> (at/to/for) his Disciple.",
    correct: ['to'],
    rule: 'Запомните: Rude TO, Polite TO, Kind TO (по отношению к людям).',
    examples: [
      "Don't be rude <b>to</b> your parents.",
      'She was very kind <b>to</b> me.',
      'He is polite <b>to</b> everyone.',
    ],
  },
  {
    id: 'ccb4d64c-84b6-4dc2-b3be-49a9f78453a4',
    section: 'prepositions',
    context: 'Извиниться *за* что-то.',
    text: "Later he apologized <input type='text' id='answer-input'> (at/to/for) his harsh words.",
    correct: ['for'],
    rule: 'Apologize TO someone (кому-то) FOR something (за что-то).',
    examples: [
      'I apologize <b>for</b> being late.',
      'He apologized <b>to</b> her.',
      'Forgive me <b>for</b> my mistake.',
    ],
  },
  {
    id: '9b222c7f-f00c-4383-9ddd-f90751a8f42e',
    section: 'prepositions',
    context: 'Войти в комнату. (Ловушка!)',
    text: "You must not enter <input type='text' id='answer-input'> (into/to/--) the forbidden room.",
    correct: ['', '-', '--'],
    rule: "Глагол ENTER (в значении 'входить в помещение') используется БЕЗ предлога!",
    examples: [
      'He <b>entered the room</b>.',
      'They <b>entered the hall</b>.',
      'Did you <b>enter the competition</b>?',
    ],
  },
  {
    id: '6fb6ba06-41f2-4cfc-bc27-a30b9211af8d',
    section: 'prepositions',
    context: 'Испугаться чего-то.',
    text: "The young man was afraid <input type='text' id='answer-input'> (of/from/by) the dark shadows.",
    correct: ['of'],
    rule: 'Устойчивое выражение: to be afraid OF something.',
    examples: [
      'I am afraid <b>of</b> spiders.',
      "Don't be afraid <b>of</b> ghosts.",
      'Are you afraid <b>of</b> the dark?',
    ],
  },
  {
    id: '71243ef7-cfc1-448b-9936-71acfc7ff6c8',
    section: 'prepositions',
    context: 'К моему удивлению...',
    text: "<input type='text' id='answer-input'> (To/At/In) my surprise, the Lotus bloom did not wither.",
    correct: ['to'],
    rule: 'Устойчивая фраза: TO my surprise (к моему удивлению).',
    examples: [
      '<b>To my surprise</b>, he won.',
      '<b>To her horror</b>, the door opened.',
      '<b>To our joy</b>, she returned.',
    ],
  },
];
