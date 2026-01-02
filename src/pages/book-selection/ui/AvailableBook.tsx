import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate } from 'react-router-dom';

import { db } from '~/features/analytics';
import { Button } from '~/shared/ui/Button';
import { CircularProgress } from '~/shared/ui/CircularProgress';

import './AvailableBook.css';

import { Book } from '~/entities/book';

interface AvailableBookProps {
  book: Book;
}

export const AvailableBook: React.FC<AvailableBookProps> = ({ book }) => {
  const allQuestions = book.getQuestions();
  const navigate = useNavigate();

  // Use dexie-react-hooks to reactively get completed question IDs
  const completedQuestionIds = useLiveQuery(async () => {
    // Convert boolean to number (1) for IndexedDB - isCorrect stored as 0/1
    const correctAttempts = await db.attempts
      .where('isCorrect')
      .equals(1)
      .toArray();
    return new Set(correctAttempts.map((a) => a.questionId));
  }, []);

  if (!completedQuestionIds) {
    return (
      <div className="book-card">
        <h3>{book.title}</h3>
        <p className="book-subtitle">{book.subtitle}</p>
        <div>Loading...</div>
      </div>
    );
  }

  const remaining = allQuestions.length - completedQuestionIds.size;
  const progressPercent =
    allQuestions.length > 0
      ? (completedQuestionIds.size / allQuestions.length) * 100
      : 0;

  return (
    <div key={book.id} className="book-card">
      <h3>{book.title}</h3>
      <p className="book-subtitle">{book.subtitle}</p>
      <div className="book-progress-container">
        <CircularProgress
          progress={progressPercent}
          total={allQuestions.length}
          completed={completedQuestionIds.size}
          size={100}
          strokeWidth={10}
        />
        <div className="book-progress-info">
          <p className="book-questions">{remaining} вопросов осталось</p>
        </div>
      </div>
      <Button onClick={() => navigate(`/books/${book.id}`)} variant="primary">
        Начать тест
      </Button>
    </div>
  );
};
