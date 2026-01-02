import React, { useEffect, useRef } from 'react';

import { getSectionName, Question } from '~/entities/book';

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
    <div className="text-xl leading-relaxed mb-5">
      <span className="inline-block bg-accent text-white px-2 py-0.5 rounded text-xs uppercase mb-2.5">
        {getSectionName(question.section)}
      </span>
      <span className="block italic text-gray-500 text-sm mb-2.5">
        Контекст: {question.context}
      </span>
      <p className="mt-4">
        {parts[0]}
        <input
          ref={inputRef}
          type="text"
          id={'answer-input'}
          value={userAnswer}
          onChange={(e) => onAnswerChange(e.target.value)}
          onKeyPress={onKeyPress}
          className="border-0 border-b-2 border-accent bg-transparent text-base px-1.5 w-40 text-center text-primary font-bold outline-none transition-colors duration-300"
        />
        {parts[1]}
      </p>
    </div>
  );
};
