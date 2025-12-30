import { useState, useCallback } from 'react';
import { Question } from '../../../shared/types';
import { validateAnswer } from '../lib/questionRenderer';

interface UseQuizOptions {
  questions: Question[];
  onAnswer: (isCorrect: boolean, section: string) => void;
}

export const useQuiz = ({ questions, onAnswer }: UseQuizOptions) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const checkAnswer = useCallback(() => {
    if (isAnswered || !userAnswer.trim()) {
      return;
    }

    const correct = validateAnswer(userAnswer, currentQuestion.correct);
    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      setScore((prev) => prev + 1);
    }

    onAnswer(correct, currentQuestion.section);
  }, [userAnswer, currentQuestion, isAnswered, onAnswer]);

  const nextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setUserAnswer('');
      setIsAnswered(false);
      setIsCorrect(null);
    }
  }, [currentIndex, questions.length]);

  const isComplete = currentIndex >= questions.length - 1 && isAnswered;

  return {
    currentQuestion,
    currentIndex,
    score,
    userAnswer,
    setUserAnswer,
    isAnswered,
    isCorrect,
    progress,
    checkAnswer,
    nextQuestion,
    isComplete,
    totalQuestions: questions.length,
  };
};

