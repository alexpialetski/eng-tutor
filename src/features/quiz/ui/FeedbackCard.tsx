import React from 'react';

import { Question } from '~/entities/book';
import { getRandomCongratulatoryMessage } from '~/shared/constants/messages';

interface FeedbackCardProps {
  question: Question;
  isCorrect: boolean;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  question,
  isCorrect,
}) => {
  return (
    <div
      className={`mt-5 p-5 rounded-md animate-fadeIn ${
        isCorrect
          ? 'bg-correct/10 border-l-4 border-correct'
          : 'bg-wrong/10 border-l-4 border-wrong'
      }`}
    >
      <h3
        className="mt-0 mb-2.5"
        style={{ color: isCorrect ? '#4a7c59' : '#b84b4b' }}
      >
        {isCorrect ? 'Верно! ✨' : 'Ошибка 🥀'}
      </h3>
      <p className="mb-4">
        {isCorrect ? (
          getRandomCongratulatoryMessage()
        ) : (
          <>
            Правильный ответ: <b>{question.correct[0]}</b>
            {question.correct.length > 1 && ` (или ${question.correct[1]})`}
          </>
        )}
      </p>
      <div className="mt-4 text-sm bg-white/70 p-2.5 rounded">
        <strong>Правило:</strong>{' '}
        <span dangerouslySetInnerHTML={{ __html: question.rule }} />
      </div>
      <div className="mt-2.5 text-sm text-gray-700">
        <strong>Похожие примеры для запоминания:</strong>
        <ul className="pl-5 my-1">
          {question.examples.map((example, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: example }} />
          ))}
        </ul>
      </div>
    </div>
  );
};
