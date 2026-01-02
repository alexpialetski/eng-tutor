import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate } from 'react-router-dom';

import { Book } from '~/entities/book';
import { db } from '~/features/analytics';
import { Button } from '~/shared/ui/Button';
import { CircularProgress } from '~/shared/ui/CircularProgress';

interface AvailableBookProps {
  book: Book;
}

export const AvailableBook: React.FC<AvailableBookProps> = ({ book }) => {
  const allQuestions = book.getQuestions();
  const navigate = useNavigate();

  // Use dexie-react-hooks to reactively get completed question IDs for this book
  const completedQuestionIds = useLiveQuery(async () => {
    // Query only attempts for this book that are correct
    // Using compound index [bookId+isCorrect] for efficient filtering
    const correctAttempts = await db.attempts
      .where('[bookId+isCorrect]')
      .equals([book.id, 1])
      .toArray();
    return new Set(correctAttempts.map((a) => a.questionId));
  }, [book.id]);

  if (!completedQuestionIds) {
    return (
      <div className="bg-secondary/10 p-5 rounded-md border-2 border-secondary text-center">
        <h3 className="text-primary mt-0 text-xl">{book.title}</h3>
        <p className="italic text-gray-600 text-sm my-2.5">{book.subtitle}</p>
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
    <div
      key={book.id}
      className="bg-secondary/10 p-5 rounded-md border-2 border-secondary text-center"
    >
      <h3 className="text-primary mt-0 text-xl">{book.title}</h3>
      <p className="italic text-gray-600 text-sm my-2.5">{book.subtitle}</p>
      <div className="flex flex-col items-center gap-4 my-5">
        <CircularProgress
          progress={progressPercent}
          total={allQuestions.length}
          completed={completedQuestionIds.size}
          size={100}
          strokeWidth={10}
        />
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-4">
            {remaining} вопросов осталось
          </p>
        </div>
      </div>
      <Button onClick={() => navigate(`/books/${book.id}`)} variant="primary">
        Начать тест
      </Button>
    </div>
  );
};
