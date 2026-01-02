import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { getSectionName } from '~/entities/book';
import { SectionStats } from '~/features/analytics';
import { Button } from '~/shared/ui/Button';
import { Card } from '~/shared/ui/Card';

import './ResultsPage.css';

export const ResultsPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const score = location.state?.score || 0;
  const totalQuestions = location.state?.totalQuestions || 0;
  const statsBefore = (location.state?.statsBefore as SectionStats[]) || [];
  const statsAfter = (location.state?.statsAfter as SectionStats[]) || [];

  // No longer saving sessions - all data comes from attempts table

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

  // Create a map of stats for easy comparison
  const statsBeforeMap = new Map(
    statsBefore.map((stat) => [stat.section, stat]),
  );
  const statsAfterMap = new Map(statsAfter.map((stat) => [stat.section, stat]));

  // Get all unique sections
  const allSections = new Set([
    ...statsBefore.map((s) => s.section),
    ...statsAfter.map((s) => s.section),
  ]);

  const getStatChange = (section: string) => {
    const before = statsBeforeMap.get(section as any);
    const after = statsAfterMap.get(section as any);

    if (!before && !after) return null;
    if (!before) return { type: 'new', accuracy: after?.accuracy || 0 };
    if (!after) return { type: 'removed', accuracy: before.accuracy };

    const accuracyDiff = after.accuracy - before.accuracy;
    return {
      type:
        accuracyDiff > 0 ? 'progress' : accuracyDiff < 0 ? 'regress' : 'same',
      accuracyDiff: Math.abs(accuracyDiff),
      before: before.accuracy,
      after: after.accuracy,
    };
  };

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

          {statsBefore.length > 0 && statsAfter.length > 0 && (
            <div className="stats-comparison">
              <h3>Изменение статистики</h3>
              <div className="stats-comparison-grid">
                {Array.from(allSections).map((section) => {
                  const change = getStatChange(section);
                  if (!change) return null;

                  return (
                    <div key={section} className="stat-comparison-card">
                      <div className="stat-comparison-section">
                        {getSectionName(section as any)}
                      </div>
                      {change.type === 'new' && (
                        <div className="stat-change new">
                          <span className="stat-change-icon">✨</span>
                          <span>
                            Новый раздел: {Math.round(change.accuracy! * 100)}%
                          </span>
                        </div>
                      )}
                      {change.type === 'removed' && (
                        <div className="stat-change removed">
                          <span>Раздел удален</span>
                        </div>
                      )}
                      {(change.type === 'progress' ||
                        change.type === 'regress' ||
                        change.type === 'same') && (
                        <>
                          <div className="stat-comparison-values">
                            <span className="stat-before">
                              Было: {Math.round(change.before! * 100)}%
                            </span>
                            <span className="stat-arrow">
                              {change.type === 'progress'
                                ? '→'
                                : change.type === 'regress'
                                  ? '←'
                                  : '='}
                            </span>
                            <span className="stat-after">
                              Стало: {Math.round(change.after! * 100)}%
                            </span>
                          </div>
                          <div
                            className={`stat-change ${
                              change.type === 'progress'
                                ? 'progress'
                                : change.type === 'regress'
                                  ? 'regress'
                                  : 'same'
                            }`}
                          >
                            {change.type === 'progress' && (
                              <>
                                <span className="stat-change-icon">📈</span>
                                <span>
                                  +{Math.round(change.accuracyDiff! * 100)}%
                                </span>
                              </>
                            )}
                            {change.type === 'regress' && (
                              <>
                                <span className="stat-change-icon">📉</span>
                                <span>
                                  -{Math.round(change.accuracyDiff! * 100)}%
                                </span>
                              </>
                            )}
                            {change.type === 'same' && (
                              <span>Без изменений</span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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
