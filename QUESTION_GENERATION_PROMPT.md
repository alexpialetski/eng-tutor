# Prompt for Generating English Grammar Questions

## Book Information

- **Book Name**: `{{BOOK_NAME}}`
- **Author**: `{{AUTHOR_NAME}}`

## Overview

Generate English grammar questions following the specified structure. Each question should be educational, contextual, and include clear explanations. The questions should be contextualized within the theme and narrative of **{{BOOK_NAME}}** by **{{AUTHOR_NAME}}**.

## Question Structure

Each question must include the following fields:

```typescript
{
  id: string;              // UUID v4 format
  section: string;         // One of: 'verbs', 'articles', 'prepositions', 'wordFormation', 'translation'
  context: string;         // Russian explanation of the context/scenario
  text: string;           // Question text with <input type='text' id='answer-input'> placeholder
  correct: string[];      // Array of correct answers (can be multiple valid options)
  rule: string;           // Russian explanation of the grammar rule
  examples: string[];     // Array of 3 example sentences (can include HTML like <b> tags)
}
```

## Format Requirements

1. **ID**: Generate a unique UUID v4 for each question
2. **Section**: Must be one of: `'verbs'`, `'articles'`, `'prepositions'`, `'wordFormation'`, `'translation'`
3. **Context**: Write in Russian, explaining the scenario or context where this grammar point applies
4. **Text**:
   - Include the input placeholder: `<input type='text' id='answer-input'>`
   - Show possible answers in parentheses: `(a/an/the)`, `(at/to/for)`, etc.
   - Use complete, meaningful sentences
   - Make sentences engaging and contextual (can reference stories, scenarios, etc.)
5. **Correct**: Array of all valid answers (e.g., `['the']`, `['much', 'far']`, `['was standing']`)
6. **Rule**: Explain the grammar rule in Russian, clearly and concisely
7. **Examples**: Provide 3 example sentences that illustrate the rule. Use `<b>` tags to highlight the key word/phrase

## Category-Specific Guidelines

### 1. Articles (`articles`)

- Focus on: a/an/the usage, zero article, specific cases
- Common topics: abstract nouns, unique places, superlatives, directions, institutions
- Examples of rules: "The" with unique buildings, superlatives, abstract concepts as specific entities
- Generate **at least 20 questions**

**Example:**

```typescript
{
  id: '613b47a5-413f-450d-a5f9-5a49360b92c6',
  section: 'articles',
  context: 'Речь идет о конкретной Истине (абстрактное понятие с большой буквы).',
  text: "Finding <input type='text' id='answer-input'> (a/an/the) Truth is the ultimate goal.",
  correct: ['the'],
  rule: "Обычно перед абстрактными понятиями артикль не нужен, но здесь 'The Truth' как конкретная, единственная истина (часто в религиозном контексте).",
  examples: [
    'Tell me <b>the truth</b>.',
    '<b>Truth</b> is stranger than fiction (общий смысл).',
    'He searches for <b>the truth</b>.',
  ],
}
```

### 2. Prepositions (`prepositions`)

- Focus on: correct preposition usage with verbs, adjectives, nouns
- Common topics: phrasal verbs, fixed expressions, common mistakes
- Examples: apologize FOR/TO, afraid OF, enter (no preposition), rude TO
- Generate **at least 20 questions**

**Example:**

```typescript
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
}
```

### 3. Verbs (`verbs`)

- Focus on: verb tenses, aspect, modal verbs
- Common topics: Past Continuous vs Past Simple, Past Perfect, Present Perfect Continuous, Future forms
- Examples: background actions, completed actions, promises, schedules
- Generate **at least 20 questions**

**Example:**

```typescript
{
  id: 'd0c02e0c-7cc6-4df5-b0a1-244cc457f09f',
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
}
```

### 4. Word Formation (`wordFormation`)

- Focus on: forming nouns, adjectives, adverbs from base words
- Common topics: suffixes (-ness, -ous, -ful, -ly, -tion, etc.), prefixes (un-, in-, etc.)
- Examples: dark -> darkness, danger -> dangerous, beauty -> beautiful
- Generate **at least 20 questions**

**Example:**

```typescript
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
}
```

### 5. Translation (`translation`)

- Focus on: translating Russian words/phrases to English correctly
- Common topics: intensifiers (much/far vs very), negative pronouns, adverbs, word order
- Examples: "намного" -> much/far, "никого" -> nobody/no one, "молча" -> silently
- Generate **at least 20 questions**

**Example:**

```typescript
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
}
```

## Quality Guidelines

1. **Variety**: Cover different grammar points within each category
2. **Difficulty**: Mix easy, medium, and challenging questions
3. **Context**: Make sentences meaningful and engaging (can reference stories, real-life situations, etc.)
4. **Clarity**: Rules should be clear and educational
5. **Examples**: Examples should be practical and illustrate the rule well
6. **Common Mistakes**: Include questions that address common learner errors
7. **Multiple Answers**: When multiple answers are valid, include all in the `correct` array

## Output Format

Generate questions as TypeScript arrays, one file per category. The questions should be contextualized within the theme of **{{BOOK_NAME}}** by **{{AUTHOR_NAME}}**:

```typescript
import { Question } from '../../model/question';

export const [category]Questions: Question[] = [
  // ... at least 20 questions
];
```

**Note**: After generation, manually copy the generated questions into the appropriate folder structure:

- `src/entities/book/constants/[book-folder-name]/[category].ts`
- Create an `index.ts` file that exports all question arrays and creates the book instance

## Task

Generate **at least 20 questions** for each of the 5 categories for **{{BOOK_NAME}}** by **{{AUTHOR_NAME}}**:

- Articles: 20+ questions
- Prepositions: 20+ questions
- Verbs: 20+ questions
- Word Formation: 20+ questions
- Translation: 20+ questions

**Total: At least 100 questions**

Ensure variety in difficulty levels, grammar points covered, and contexts used. Make the questions educational and engaging for English learners. The questions should reference themes, characters, or scenarios from **{{BOOK_NAME}}** to maintain consistency and engagement.
