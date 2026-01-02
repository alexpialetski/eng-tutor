import React, { useEffect, useRef } from 'react';

import { getSectionName, Question } from '~/entities/book';

import './QuestionCard.css';

interface QuestionCardProps {
  question: Question;
  userAnswer: string;
  onAnswerChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  userAnswer,
  onAnswerChange,
  onKeyPress,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const parts = question.text.split("<input type='text' id='answer-input'>");

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  }, [inputRef, question.id]);

  return (
    <div className="question-card">
      <span className="section-badge">{getSectionName(question.section)}</span>
      <span className="context">Контекст: {question.context}</span>
      <p style={{ marginTop: '15px' }}>
        {parts[0]}
        <input
          ref={inputRef}
          type="text"
          id={'answer-input'}
          value={userAnswer}
          onChange={(e) => onAnswerChange(e.target.value)}
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
      </p>
    </div>
  );
};
