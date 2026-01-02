import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getBookById, Question, SectionKey } from '~/entities/book';
import { useProgress } from '~/features/analytics';
import {
  allowsEmptyAnswer,
  FeedbackCard,
  QuestionCard,
  validateAnswer,
} from '~/features/quiz';
import { Button } from '~/shared/ui/Button';
import { Card } from '~/shared/ui/Card';
import { ProgressBar } from '~/shared/ui/ProgressBar';

import './QuizPage.css';

import { quizGenerator } from '../lib/quizGenerator';

const MAX_QUESTIONS = 10;

export const QuizPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { recordAnswer, getSectionStats } = useProgress();

  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsBeforeQuiz, setStatsBeforeQuiz] = useState<
    Awaited<ReturnType<typeof getSectionStats>>
  >([]);

  // Generate quiz with 10 questions upfront using adaptive selection
  useEffect(() => {
    const loadQuiz = async () => {
      if (!bookId) {
        navigate('/books');
        return;
      }

      try {
        setLoading(true);

        const book = getBookById(bookId);
        if (!book) {
          navigate('/books');
          return;
        }

        // Get all questions from book (static constants)
        const allQuestions = book.getQuestions();

        // Save stats snapshot before quiz starts
        const stats = await getSectionStats();
        setStatsBeforeQuiz(stats);

        // Generate adaptive quiz (10 questions selected based on performance)
        const quiz = await quizGenerator.getNewQuiz(
          allQuestions,
          MAX_QUESTIONS,
        );
        setQuizQuestions(quiz);

        if (quiz.length === 0) {
          // All questions completed - could show a message or redirect
          console.log('All questions completed!');
        }
      } catch (error) {
        console.error('Error loading quiz:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [bookId, navigate, getSectionStats]);

  const handleAnswer = async (
    isCorrect: boolean,
    section: SectionKey,
    questionId: string,
  ) => {
    // Record attempt in database (for analytics and adaptive selection)
    // All data (including completed questions) is derived from attempts table
    await recordAnswer(section, isCorrect, questionId);
  };

  const checkAnswer = () => {
    if (isAnswered || !currentQuestion) {
      return;
    }

    // Allow empty answer if it's a valid option (for questions like "enter --")
    const isEmptyAnswer = userAnswer.trim() === '';
    const allowsEmpty = allowsEmptyAnswer(currentQuestion.correct);

    if (isEmptyAnswer && !allowsEmpty) {
      return;
    }

    const correct = validateAnswer(userAnswer, currentQuestion.correct);

    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      setScore((prev) => prev + 1);
    }

    handleAnswer(correct, currentQuestion.section, currentQuestion.id);
  };

  const nextQuestion = async () => {
    const totalAnswered = currentIndex + 1;

    // Check if we've answered all questions in the quiz
    if (totalAnswered >= quizQuestions.length) {
      // Get stats after quiz
      const statsAfterQuiz = await getSectionStats();
      // Quiz complete - pass stats comparison to results page
      navigate(`/books/${bookId}/results`, {
        state: {
          score,
          totalQuestions: totalAnswered,
          statsBefore: statsBeforeQuiz,
          statsAfter: statsAfterQuiz,
        },
      });
      return;
    }

    // Move to next question
    setCurrentIndex((prev) => prev + 1);
    setUserAnswer('');
    setIsAnswered(false);
    setIsCorrect(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isAnswered) {
      checkAnswer();
    } else if (e.key === 'Enter' && isAnswered) {
      nextQuestion();
    }
  };

  if (loading) {
    return (
      <div className="quiz-container">
        <Card>
          <div>Generating personalized quiz...</div>
        </Card>
      </div>
    );
  }

  if (quizQuestions.length === 0) {
    return (
      <div className="quiz-container">
        <Card>
          <div>All questions completed! Great job!</div>
          <Button onClick={() => navigate('/books')}>Back to Books</Button>
        </Card>
      </div>
    );
  }

  const currentQuestion = quizQuestions[currentIndex];
  if (!currentQuestion) {
    return (
      <div className="quiz-container">
        <Card>
          <div>Loading question...</div>
        </Card>
      </div>
    );
  }

  const progress =
    quizQuestions.length > 0
      ? ((currentIndex + (isAnswered ? 1 : 0)) / quizQuestions.length) * 100
      : 0;
  const isEmptyAnswerAllowed = allowsEmptyAnswer(currentQuestion.correct);
  const isEmptyAnswer = userAnswer.trim() === '';

  return (
    <div className="quiz-container">
      <Card>
        <button
          onClick={() => navigate('/books')}
          className="back-button"
          aria-label="Назад к выбору книги"
        >
          Назад
        </button>
        <h1>Безмятежный Лотос</h1>
        <div className="subtitle">Полный цикл подготовки (8 класс)</div>

        <ProgressBar progress={progress} />

        <QuestionCard
          question={currentQuestion}
          userAnswer={userAnswer}
          onAnswerChange={setUserAnswer}
          onKeyPress={handleKeyPress}
        />

        {isAnswered && isCorrect !== null && (
          <FeedbackCard question={currentQuestion} isCorrect={isCorrect} />
        )}

        <Button
          onClick={isAnswered ? nextQuestion : checkAnswer}
          disabled={isAnswered ? false : isEmptyAnswer && !isEmptyAnswerAllowed}
        >
          {isAnswered
            ? currentIndex + 1 >= quizQuestions.length
              ? 'Завершить'
              : 'Следующий вопрос'
            : 'Ответить'}
        </Button>
      </Card>
    </div>
  );
};
