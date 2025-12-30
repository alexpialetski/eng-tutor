import React from 'react';
import { Question } from '../../../shared/types';
import { getSectionName } from '../../../shared/constants/sections';
import { renderQuestionText } from '../../quiz/lib/questionRenderer';
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
  return (
    <div className="question-card">
      <span className="section-badge">{getSectionName(question.section)}</span>
      <span className="context">Контекст: {question.context}</span>
      <p style={{ marginTop: '15px' }}>
        {renderQuestionText(question, 'answer-input', userAnswer, onAnswerChange, onKeyPress)}
      </p>
    </div>
  );
};

