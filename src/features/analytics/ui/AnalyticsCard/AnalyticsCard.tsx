import { useLiveQuery } from 'dexie-react-hooks';
import React from 'react';

import { Card } from '~/shared/ui/Card';

import { analyticsService } from '../../lib/analyticsService';
import { db } from '../../lib/db';

import './AnalyticsCard.css';

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
        <div className="analytics-empty">
          <p>Пока нет данных</p>
          <p className="analytics-empty-hint">
            Пройди несколько тестов, чтобы увидеть статистику
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="analytics-container">
        <h3>Общая аналитика</h3>

        <div className="analytics-grid">
          <div className="analytics-stat">
            <div className="analytics-stat-label">Всего попыток</div>
            <div className="analytics-stat-value">
              {overallStats.totalAttempts}
            </div>
          </div>

          <div className="analytics-stat">
            <div className="analytics-stat-label">Правильных ответов</div>
            <div className="analytics-stat-value">
              {overallStats.correctAttempts}
            </div>
          </div>

          <div className="analytics-stat">
            <div className="analytics-stat-label">Средний процент</div>
            <div className="analytics-stat-value">
              {overallStats.averageAccuracy.toFixed(1)}%
            </div>
          </div>

          <div className="analytics-stat">
            <div className="analytics-stat-label">Лучший день</div>
            <div className="analytics-stat-value highlight">
              {overallStats.bestDayAccuracy.toFixed(1)}%
            </div>
          </div>

          {trend && (
            <div className="analytics-stat">
              <div className="analytics-stat-label">
                Тренд (последние 3 дня)
              </div>
              <div
                className={`analytics-stat-value ${
                  trend.isImproving ? 'trend-up' : 'trend-down'
                }`}
              >
                {trend.isImproving ? '↑' : '↓'} {trend.value.toFixed(1)}%
              </div>
            </div>
          )}
        </div>

        {dailyProgress && dailyProgress.length > 0 && (
          <div className="progress-timeline">
            <h4>Прогресс по времени (последние 30 дней)</h4>
            <div className="timeline-container">
              {dailyProgress.slice(-10).map((point, index) => {
                const percentage =
                  point.total > 0 ? (point.correct / point.total) * 100 : 0;
                return (
                  <div key={index} className="timeline-point">
                    <div className="timeline-date">
                      {new Date(point.date).toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                      })}
                    </div>
                    <div className="timeline-bar">
                      <div
                        className="timeline-fill"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="timeline-percentage">
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
