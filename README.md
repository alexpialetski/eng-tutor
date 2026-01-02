# EngTutor - Безмятежный Лотос

An interactive English learning application with adaptive quizzes, progress tracking, and comprehensive analytics. Built with React, TypeScript, and Nx.

## Features

- **Book Selection**: Choose from available English learning books
- **Adaptive Quiz System**: Personalized quizzes with 10 questions selected based on your performance
- **Progress Tracking**: Monitor your learning progress across different sections
- **Analytics Dashboard**: View detailed statistics and performance metrics
- **Local Storage**: All progress is saved locally using IndexedDB (Dexie)
- **Multiple Learning Sections**:
  - Verbs
  - Articles
  - Prepositions
  - Word Formation
  - Translation

## Tech Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Monorepo**: Nx
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Database**: Dexie (IndexedDB wrapper)
- **Testing**: Vitest, React Testing Library

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```sh
npm install
```

### Development

Start the development server:

```sh
npm start
# or
npx nx serve eng-tutor
```

The application will be available at `http://localhost:4200` (or the port specified by Nx).

### Build

Create a production build:

```sh
npm run build
# or
npx nx build eng-tutor
```

### Testing

Run tests:

```sh
npm test
# or
npx nx test eng-tutor
```

## Project Structure

```
src/
├── app/              # Main app component and routing
├── entities/         # Domain entities (books, questions)
├── features/         # Feature modules
│   ├── analytics/    # Progress tracking and analytics
│   └── quiz/         # Quiz functionality
├── pages/            # Page components
│   ├── book-selection/
│   ├── quiz/
│   └── results/
├── shared/           # Shared utilities and UI components
└── main.tsx          # Application entry point
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npx nx graph` - Visualize project dependencies

## Learn More

- [Nx Documentation](https://nx.dev)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
