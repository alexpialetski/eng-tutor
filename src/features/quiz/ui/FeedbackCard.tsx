import React from 'react';

import { Question } from '~/entities/book';
import { getRandomCongratulatoryMessage } from '~/shared/constants/messages';

import './FeedbackCard.css';

interface FeedbackCardProps {
  question: Question;
  isCorrect: boolean;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  question,
  isCorrect,
}) => {
  return (
    <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
      <h3
        className="feedback-title"
        style={{ color: isCorrect ? 'var(--correct)' : 'var(--wrong)' }}
      >
        {isCorrect ? 'Верно! ✨' : 'Ошибка 🥀'}
      </h3>
      <p className="feedback-msg">
        {isCorrect ? (
          getRandomCongratulatoryMessage()
        ) : (
          <>
            Правильный ответ: <b>{question.correct[0]}</b>
            {question.correct.length > 1 && ` (или ${question.correct[1]})`}
          </>
        )}
      </p>
      <div className="rule-box">
        <strong>Правило:</strong>{' '}
        <span dangerouslySetInnerHTML={{ __html: question.rule }} />
      </div>
      <div className="extra-examples">
        <strong>Похожие примеры для запоминания:</strong>
        <ul>
          {question.examples.map((example, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: example }} />
          ))}
        </ul>
      </div>
    </div>
  );
};
