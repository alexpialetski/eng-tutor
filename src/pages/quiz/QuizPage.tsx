import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookById } from '../../shared/constants/books';
import { Question } from '../../shared/types';
import { useUser, useProgress } from '../../features/progress/model/useProgress';
import { selectQuestion } from '../../features/adaptive-selection/lib/selectQuestion';
import { QuestionCard } from '../../features/quiz/ui/QuestionCard';
import { FeedbackCard } from '../../features/quiz/ui/FeedbackCard';
import { Card } from '../../shared/ui/Card/Card';
import { Button } from '../../shared/ui/Button/Button';
import { ProgressBar } from '../../shared/ui/ProgressBar/ProgressBar';
import './QuizPage.css';
import { SectionKey } from '../../shared/constants/sections';

export const QuizPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { user, loading: userLoading } = useUser();
  const { recordAnswer, getSectionStats } = useProgress(
    user?.id,
    bookId || ''
  );

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answeredQuestionIndices, setAnsweredQuestionIndices] = useState<Set<number>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if (!userLoading && !user) {
      navigate('/');
      return;
    }

    if (!bookId) {
      navigate('/books');
      return;
    }

    const book = getBookById(bookId);
    if (!book) {
      navigate('/books');
      return;
    }

    setQuestions(book.questions);
  }, [bookId, user, userLoading, navigate]);

  useEffect(() => {
    if (questions.length === 0) return;

    // Get available questions (not yet answered)
    const availableQuestions = questions.filter((_, index) => !answeredQuestionIndices.has(index));
    
    // If all questions answered, reset
    if (availableQuestions.length === 0) {
      setAnsweredQuestionIndices(new Set());
      const stats = getSectionStats();
      const selected = selectQuestion(questions, stats);
      setCurrentQuestion(selected);
      return;
    }

    const stats = getSectionStats();
    const selected = selectQuestion(availableQuestions, stats);
    
    // Find the index of selected question in original array
    setCurrentQuestion(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, currentIndex, answeredQuestionIndices]);

  const handleAnswer = async (isCorrect: boolean, section: SectionKey) => {
    if (user?.id) {
      await recordAnswer(section, isCorrect);
    }
  };

  const checkAnswer = () => {
    if (isAnswered || !currentQuestion) {
      return;
    }

    // Allow empty answer if it's a valid option (for questions like "enter --")
    const isEmptyAnswer = userAnswer.trim() === '';
    const allowsEmpty = currentQuestion.correct.includes('') || 
                        currentQuestion.correct.includes('-') || 
                        currentQuestion.correct.includes('--');
    
    if (isEmptyAnswer && !allowsEmpty) {
      return;
    }

    const normalized = userAnswer.trim().toLowerCase();
    const correct = currentQuestion.correct.some(
      (ans) => ans.toLowerCase() === normalized
    ) ||
    (currentQuestion.correct.includes('') && normalized === '') ||
    (currentQuestion.correct.includes('-') && (normalized === '-' || normalized === '')) ||
    (currentQuestion.correct.includes('--') && (normalized === '--' || normalized === '')) ||
    (normalized === 'no preposition' && (currentQuestion.correct.includes('') || currentQuestion.correct.includes('-') || currentQuestion.correct.includes('--')));

    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      setScore((prev) => prev + 1);
    }

    handleAnswer(correct, currentQuestion.section);
  };

  const nextQuestion = () => {
    if (!currentQuestion) return;

    // Mark current question as answered
    const currentQIndex = questions.findIndex(q => q === currentQuestion);
    if (currentQIndex !== -1) {
      setAnsweredQuestionIndices(prev => new Set([...prev, currentQIndex]));
    }

    // Check if we've answered enough questions (e.g., all questions or a set number)
    if (answeredQuestionIndices.size + 1 >= questions.length) {
      // Quiz complete
      navigate(`/books/${bookId}/results`, {
        state: { score, totalQuestions: questions.length },
      });
      return;
    }

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

  if (!currentQuestion) {
    return (
      <div className="quiz-container">
        <Card>
          <div>Загрузка...</div>
        </Card>
      </div>
    );
  }

  const progress = questions.length > 0 
    ? ((answeredQuestionIndices.size + (isAnswered ? 1 : 0)) / questions.length) * 100 
    : 0;

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
          disabled={isAnswered ? false : !userAnswer.trim() && !(currentQuestion?.correct.includes('') || currentQuestion?.correct.includes('-') || currentQuestion?.correct.includes('--'))}
        >
          {isAnswered
            ? answeredQuestionIndices.size + 1 >= questions.length
              ? 'Завершить'
              : 'Следующий вопрос'
            : 'Ответить'}
        </Button>
      </Card>
    </div>
  );
};

