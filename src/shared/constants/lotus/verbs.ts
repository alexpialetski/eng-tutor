import { Question } from '../../types';

export const verbsQuestions: Question[] = [
  {
    section: 'verbs',
    context: 'Сцена у горы. Описание длительного действия в прошлом.',
    text: "The young cultivator <input type='text' id='answer-input'> (stand) at the foot of the mountain when he heard a melody.",
    correct: ['was standing'],
    rule: 'Past Continuous (was/were + ing) используется для описания длительного фонового действия, которое было прервано кратким событием.',
    examples: [
      'I <b>was reading</b> when he entered.',
      'The sun <b>was shining</b> when I woke up.',
      'They <b>were fighting</b> when the Master arrived.',
    ],
  },
  {
    section: 'verbs',
    context: 'Внезапное, краткое действие в прошлом.',
    text: "He suddenly <input type='text' id='answer-input'> (hear) a familiar melody.",
    correct: ['heard'],
    rule: 'Past Simple используется для коротких, завершенных действий в прошлом, особенно если они прерывают длительное действие.',
    examples: [
      'Suddenly, the sword <b>broke</b>.',
      'She <b>saw</b> a ghost in the mirror.',
      'He <b>dropped</b> the cup.',
    ],
  },
  {
    section: 'verbs',
    context:
      'Воспоминания о том, что случилось ДО событий рассказа (предпрошедшее время).',
    text: "It was strange, because he <input type='text' id='answer-input'> (lose) his memory two years before.",
    correct: ['had lost'],
    rule: 'Past Perfect (had + V3) используется, когда одно действие в прошлом произошло РАНЬШЕ другого действия в прошлом.',
    examples: [
      'I realized I <b>had forgotten</b> my bag.',
      'The train <b>had left</b> when we arrived.',
      'She said she <b>had seen</b> him before.',
    ],
  },
  {
    section: 'verbs',
    context:
      'Разговор двух героев. Действие, которое началось в прошлом и длится до сих пор (результат сейчас).',
    text: "'I <input type='text' id='answer-input'> (wait) for you for a long time,' the stranger said.",
    correct: ['have been waiting', 'have waited'],
    rule: 'Present Perfect Continuous (have been + ing) подчеркивает длительность действия, которое началось в прошлом и только что закончилось или еще длится.',
    examples: [
      'I <b>have been studying</b> English for 5 years.',
      'It <b>has been raining</b> all day.',
      'How long <b>have you been standing</b> here?',
    ],
  },
  {
    section: 'verbs',
    context: 'Расписание (факты будущего).',
    text: "'We <input type='text' id='answer-input'> (start) our journey tomorrow at dawn,' he said.",
    correct: ['start', 'will start'],
    rule: 'Для расписаний (поездов, уроков, начал экспедиций) часто используется Present Simple. Future Simple (will) тоже допустимо для решений.',
    examples: [
      "The train <b>leaves</b> at 5 o'clock.",
      'The lesson <b>starts</b> in 10 minutes.',
      'The festival <b>begins</b> next Monday.',
    ],
  },
  {
    section: 'verbs',
    context: 'Обещание на будущее.',
    text: "'I promise I <input type='text' id='answer-input'> (never/betray) the Sect again.'",
    correct: ['will never betray'],
    rule: 'С обещаниями (promise) мы почти всегда используем Future Simple (will).',
    examples: [
      'I promise I <b>will help</b> you.',
      'I swear I <b>will not tell</b> anyone.',
      'He promised he <b>will return</b>.',
    ],
  },
];
