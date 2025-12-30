import React from 'react';
import { Question } from '../../../shared/types';

export const renderQuestionText = (
  question: Question,
  inputId: string,
  value: string,
  onChange: (value: string) => void,
  onKeyPress: (e: React.KeyboardEvent) => void
): React.ReactNode => {
  const parts = question.text.split("<input type='text' id='answer-input'>");
  
  return (
    <>
      {parts[0]}
      <input
        type="text"
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={onKeyPress}
        style={{
          border: 'none',
          borderBottom: '2px solid var(--accent)',
          background: 'transparent',
          fontSize: '1em',
          padding: '5px',
          width: '160px',
          textAlign: 'center',
          color: 'var(--primary)',
          fontWeight: 'bold',
          outline: 'none',
          transition: 'border-color 0.3s',
        }}
      />
      {parts[1]}
    </>
  );
};

export const validateAnswer = (
  userAnswer: string,
  correctAnswers: string[]
): boolean => {
  const normalized = userAnswer.trim().toLowerCase();
  
  // Check for empty answer (for questions that accept empty string)
  if (correctAnswers.includes('') || correctAnswers.includes('-') || correctAnswers.includes('--')) {
    if (normalized === '' || normalized === '-' || normalized === '--' || normalized === 'no preposition') {
      return true;
    }
  }
  
  // Check if answer matches any correct answer
  return correctAnswers.some((correct) => correct.toLowerCase() === normalized);
};

