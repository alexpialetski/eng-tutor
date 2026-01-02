import { useLiveQuery } from 'dexie-react-hooks';
import React from 'react';

import { Card } from '~/shared/ui/Card';

import { analyticsService } from '../lib/analyticsService';
import { db } from '../lib/db';

export const AnalyticsCard: React.FC = () => {
  // Get daily progress from attempts table
  const dailyProgress = useLiveQuery(
    () => analyticsService.getDailyProgress(30), // Last 30 days
    [],
  );

  // Get overall statistics from attempts
  const overallStats = useLiveQuery(async () => {
    const allAttempts = await db.attempts.toArray();
    if (allAttempts.length === 0) {
      return {
        totalAttempts: 0,
        correctAttempts: 0,
        averageAccuracy: 0,
        bestDayAccuracy: 0,
      };
    }

    const correctAttempts = allAttempts.filter((a) => a.isCorrect).length;
    const averageAccuracy = (correctAttempts / allAttempts.length) * 100;

    // Calculate best day accuracy
    const dailyStats = await analyticsService.getDailyProgress(30);
    const bestDay =
      dailyStats.length > 0
        ? dailyStats.reduce((best, day) => {
            const dayAccuracy =
              day.total > 0 ? (day.correct / day.total) * 100 : 0;
            const bestAccuracy =
              best.total > 0 ? (best.correct / best.total) * 100 : 0;
            return dayAccuracy > bestAccuracy ? day : best;
          })
        : null;

    return {
      totalAttempts: allAttempts.length,
      correctAttempts,
      averageAccuracy,
      bestDayAccuracy: bestDay
        ? bestDay.total > 0
          ? (bestDay.correct / bestDay.total) * 100
          : 0
        : 0,
    };
  }, []);

  // Calculate trend from daily progress
  const trend = React.useMemo(() => {
    if (!dailyProgress || dailyProgress.length < 6) return null;

    const recent = dailyProgress.slice(-3);
    const previous = dailyProgress.slice(-6, -3);

    const recentAvg =
      recent.reduce(
        (sum, p) => sum + (p.total > 0 ? (p.correct / p.total) * 100 : 0),
        0,
      ) / recent.length;
    const previousAvg =
      previous.reduce(
        (sum, p) => sum + (p.total > 0 ? (p.correct / p.total) * 100 : 0),
        0,
      ) / previous.length;

    const diff = recentAvg - previousAvg;
    return {
      value: Math.abs(diff),
      isImproving: diff > 0,
    };
  }, [dailyProgress]);

  if (!overallStats || overallStats.totalAttempts === 0) {
    return (
      <Card>
        <div className="text-center py-10 px-5 text-gray-600">
          <p>Пока нет данных</p>
          <p className="text-sm mt-2.5 italic">
            Пройди несколько тестов, чтобы увидеть статистику
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-5">
        <h3 className="text-primary text-2xl mb-5 font-normal">
          Общая аналитика
        </h3>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 mb-8">
          <div className="bg-primary/5 p-4 rounded-md border border-primary text-center">
            <div className="text-sm text-gray-600 mb-2">Всего попыток</div>
            <div className="text-3xl font-bold text-primary">
              {overallStats.totalAttempts}
            </div>
          </div>

          <div className="bg-primary/5 p-4 rounded-md border border-primary text-center">
            <div className="text-sm text-gray-600 mb-2">Правильных ответов</div>
            <div className="text-3xl font-bold text-primary">
              {overallStats.correctAttempts}
            </div>
          </div>

          <div className="bg-primary/5 p-4 rounded-md border border-primary text-center">
            <div className="text-sm text-gray-600 mb-2">Средний процент</div>
            <div className="text-3xl font-bold text-primary">
              {overallStats.averageAccuracy.toFixed(1)}%
            </div>
          </div>

          <div className="bg-primary/5 p-4 rounded-md border border-primary text-center">
            <div className="text-sm text-gray-600 mb-2">Лучший день</div>
            <div className="text-3xl font-bold text-accent">
              {overallStats.bestDayAccuracy.toFixed(1)}%
            </div>
          </div>

          {trend && (
            <div className="bg-primary/5 p-4 rounded-md border border-primary text-center">
              <div className="text-sm text-gray-600 mb-2">
                Тренд (последние 3 дня)
              </div>
              <div
                className={`text-3xl font-bold ${
                  trend.isImproving ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {trend.isImproving ? '↑' : '↓'} {trend.value.toFixed(1)}%
              </div>
            </div>
          )}
        </div>

        {dailyProgress && dailyProgress.length > 0 && (
          <div className="mt-8">
            <h4 className="text-primary text-lg mb-4 font-normal">
              Прогресс по времени (последние 30 дней)
            </h4>
            <div className="flex flex-col gap-3">
              {dailyProgress.slice(-10).map((point, index) => {
                const percentage =
                  point.total > 0 ? (point.correct / point.total) * 100 : 0;
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="min-w-[60px] text-sm text-gray-600 text-right">
                      {new Date(point.date).toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                      })}
                    </div>
                    <div className="flex-1 h-6 bg-primary/10 rounded-xl overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-xl transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="min-w-[50px] text-sm font-medium text-gray-800 text-left">
                      {percentage.toFixed(0)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
