import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useUser, useSessions } from '../../features/progress/model/useProgress';
import { Card } from '../../shared/ui/Card/Card';
import { Button } from '../../shared/ui/Button/Button';
import './ResultsPage.css';

export const ResultsPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const { saveSession } = useSessions(user?.id);

  const score = location.state?.score || 0;
  const totalQuestions = location.state?.totalQuestions || 0;

  useEffect(() => {
    if (bookId && user?.id && score !== undefined) {
      saveSession(bookId, score, totalQuestions);
    }
  }, [bookId, user?.id, score, totalQuestions, saveSession]);

  const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

  let message = '';
  if (percentage === 100) {
    message =
      "Потрясающе! Ты достигла стадии 'Золотого Ядра'! Храм Истины открывает тебе свои двери.";
  } else if (percentage >= 80) {
    message =
      'Отличный результат! Ты талантливый адепт. Немного практики, и ты станешь мастером.';
  } else if (percentage >= 50) {
    message =
      'Ты на верном пути, ученик. Твои знания крепки, но есть пробелы, требующие медитации.';
  } else {
    message =
      'Твоя ци нестабильна. Не отчаивайся, даже Великие Мастера начинали с ошибок. Попробуй пройти испытание еще раз!';
  }

  return (
    <div className="results-container">
      <Card>
        <div className="result-screen">
          <h2>Испытание завершено!</h2>
          <p>Твой уровень духовной силы:</p>
          <div className="score-big">
            {score} / {totalQuestions}
          </div>
          <p className="final-msg">{message}</p>
          <div className="result-actions">
            <Button onClick={() => navigate(`/books/${bookId}`)}>
              Пройти заново
            </Button>
            <Button
              onClick={() => navigate('/books')}
              variant="secondary"
              style={{ marginTop: '10px' }}
            >
              Выбрать другую книгу
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

