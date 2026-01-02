const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}',
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4a7c59',
        secondary: '#d88c9a',
        bg: '#f9f7f2',
        paper: '#ffffff',
        text: '#2c2c2c',
        accent: '#c6a664',
        correct: '#4a7c59',
        wrong: '#b84b4b',
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
      },
      backgroundImage: {
        'dot-pattern': 'radial-gradient(#e6e1d3 1px, transparent 1px)',
      },
      backgroundSize: {
        'dot-pattern': '20px 20px',
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          from: {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
};
