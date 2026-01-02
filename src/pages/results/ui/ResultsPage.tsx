import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { getSectionName } from '~/entities/book';
import { SectionStats } from '~/features/analytics';
import { Button } from '~/shared/ui/Button';
import { Card } from '~/shared/ui/Card';

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
    <div className="flex justify-center items-center min-h-screen p-5">
      <Card>
        <div className="text-center">
          <h2>Испытание завершено!</h2>
          <p>Твой уровень духовной силы:</p>
          <div className="text-5xl text-primary my-5 font-bold">
            {score} / {totalQuestions}
          </div>
          <p className="text-lg leading-relaxed my-8 text-text">{message}</p>

          {statsBefore.length > 0 && statsAfter.length > 0 && (
            <div className="my-8 p-5 bg-primary/5 rounded-lg border border-primary">
              <h3 className="text-primary text-xl mb-5 font-normal">
                Изменение статистики
              </h3>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
                {Array.from(allSections).map((section) => {
                  const change = getStatChange(section);
                  if (!change) return null;

                  return (
                    <div
                      key={section}
                      className="bg-white p-4 rounded-md border border-gray-300"
                    >
                      <div className="font-bold text-primary mb-2.5 text-sm">
                        {getSectionName(section as any)}
                      </div>
                      {change.type === 'new' && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-sm font-medium bg-blue-100 text-blue-500">
                          <span className="text-base">✨</span>
                          <span>
                            Новый раздел: {Math.round(change.accuracy! * 100)}%
                          </span>
                        </div>
                      )}
                      {change.type === 'removed' && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-sm font-medium bg-gray-100 text-gray-500">
                          <span>Раздел удален</span>
                        </div>
                      )}
                      {(change.type === 'progress' ||
                        change.type === 'regress' ||
                        change.type === 'same') && (
                        <>
                          <div className="flex items-center justify-between gap-2 my-2.5 text-sm">
                            <span className="text-gray-600">
                              Было: {Math.round(change.before! * 100)}%
                            </span>
                            <span className="text-lg text-gray-500">
                              {change.type === 'progress'
                                ? '→'
                                : change.type === 'regress'
                                  ? '←'
                                  : '='}
                            </span>
                            <span className="text-gray-800 font-medium">
                              Стало: {Math.round(change.after! * 100)}%
                            </span>
                          </div>
                          <div
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-sm font-medium ${
                              change.type === 'progress'
                                ? 'bg-green-100 text-green-600'
                                : change.type === 'regress'
                                  ? 'bg-red-100 text-red-500'
                                  : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {change.type === 'progress' && (
                              <>
                                <span className="text-base">📈</span>
                                <span>
                                  +{Math.round(change.accuracyDiff! * 100)}%
                                </span>
                              </>
                            )}
                            {change.type === 'regress' && (
                              <>
                                <span className="text-base">📉</span>
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

          <div className="mt-8">
            <Button onClick={() => navigate(`/books/${bookId}`)}>
              Пройти заново
            </Button>
            <Button
              onClick={() => navigate('/books')}
              variant="secondary"
              className="mt-2.5"
            >
              Выбрать другую книгу
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
