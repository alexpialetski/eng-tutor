import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useProgress } from '../../features/progress/model/useProgress';
import { books } from '../../shared/constants/books';
import { getSectionName } from '../../shared/constants/sections';
import { Card } from '../../shared/ui/Card/Card';
import { Button } from '../../shared/ui/Button/Button';
import './BookSelectionPage.css';

export const BookSelectionPage: React.FC = () => {
  const { user, loading: userLoading } = useUser();
  const { getSectionStats, loading: progressLoading } = useProgress(
    user?.id,
    books[0]?.id || ''
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!userLoading && !user) {
      navigate('/');
    }
  }, [user, userLoading, navigate]);

  if (userLoading || progressLoading) {
    return (
      <div className="book-selection-container">
        <Card>
          <div>Загрузка...</div>
        </Card>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const stats = getSectionStats();

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 0.8) return 'var(--correct)';
    if (accuracy >= 0.5) return 'var(--accent)';
    return 'var(--wrong)';
  };

  return (
    <div className="book-selection-container">
      <Card>
        <h1>Привет, {user.name}!</h1>
        <div className="subtitle">Выбери книгу для изучения</div>

        {stats.length > 0 && (
          <div className="stats-section">
            <h2>Твоя статистика</h2>
            <div className="stats-grid">
              {stats.map((stat) => (
                <div key={stat.section} className="stat-card">
                  <div className="stat-section">{getSectionName(stat.section)}</div>
                  <div
                    className="stat-accuracy"
                    style={{ color: getAccuracyColor(stat.accuracy) }}
                  >
                    {Math.round(stat.accuracy * 100)}%
                  </div>
                  <div className="stat-details">
                    {stat.correctCount} / {stat.totalCount}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="books-section">
          <h2>Доступные книги</h2>
          <div className="books-grid">
            {books.map((book) => (
              <div key={book.id} className="book-card">
                <h3>{book.title}</h3>
                <p className="book-subtitle">{book.subtitle}</p>
                <p className="book-questions">
                  {book.questions.length} вопросов
                </p>
                <Button
                  onClick={() => navigate(`/books/${book.id}`)}
                  variant="primary"
                >
                  Начать тест
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

