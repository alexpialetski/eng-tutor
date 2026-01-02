import React, { useEffect, useState } from 'react';

import { getSectionName, SECTIONS } from '~/entities/book';
import { Card } from '~/shared/ui/Card';

import {
  analyticsService,
  DailyStat,
  TrendResult,
} from '../../lib/analyticsService';

import './ProgressDashboard.css';

interface DashboardData {
  trends: TrendResult[];
  dailyStats: DailyStat[];
}

/**
 * Component for displaying user progress trends and daily activity.
 * Shows whether user is improving, declining, or stable in each topic.
 */
export const ProgressDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Get trends for all sections in parallel
        const trendsPromise = Promise.all(
          SECTIONS.map((sec) => analyticsService.getSectionTrend(sec, 10)),
        );

        // 2. Get daily chart data (last 7 days)
        const dailyPromise = analyticsService.getDailyProgress(7);

        const [trends, dailyStats] = await Promise.all([
          trendsPromise,
          dailyPromise,
        ]);

        setData({ trends, dailyStats });
      } catch (error) {
        console.error('Error loading progress data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Card>
        <div className="progress-dashboard-loading">Loading analytics...</div>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <div>No data available</div>
      </Card>
    );
  }

  return (
    <Card>
      <h2>Your Progress</h2>

      {/* Daily Activity Chart */}
      <div className="progress-dashboard-daily">
        <h3>Activity (Last 7 Days)</h3>
        {data.dailyStats.length === 0 ? (
          <p className="progress-dashboard-empty">No activity yet.</p>
        ) : (
          <div className="progress-dashboard-chart">
            {data.dailyStats.map((stat) => {
              const height = Math.max(
                10,
                (stat.correct / Math.max(stat.total, 1)) * 100,
              );
              const percentage = Math.round(
                (stat.correct / Math.max(stat.total, 1)) * 100,
              );
              return (
                <div key={stat.date} className="progress-dashboard-bar">
                  <div
                    className="progress-dashboard-bar-fill"
                    style={{ height: `${height}px` }}
                    title={`${stat.correct}/${stat.total} Correct (${percentage}%)`}
                  >
                    <span className="progress-dashboard-bar-label">
                      {stat.correct}
                    </span>
                  </div>
                  <small className="progress-dashboard-bar-date">
                    {stat.date.slice(5)}
                  </small>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Topic Trends */}
      <div className="progress-dashboard-trends">
        <h3>Topic Trends (Last 20 attempts)</h3>
        <div className="progress-dashboard-trends-grid">
          {data.trends.map((trend) => (
            <div
              key={trend.section}
              className={`progress-dashboard-card progress-dashboard-card-${trend.status}`}
            >
              <h4 className="progress-dashboard-card-title">
                {getSectionName(trend.section)}
              </h4>

              {trend.status === 'insufficient_data' ? (
                <span className="progress-dashboard-card-empty">
                  Not enough data yet
                </span>
              ) : (
                <div className="progress-dashboard-card-content">
                  <div className="progress-dashboard-card-accuracy">
                    {trend.currentAccuracy}%
                  </div>
                  <div className="progress-dashboard-card-trend">
                    {getTrendIcon(trend.status)} {Math.abs(trend.improvement)}%
                    <span className="progress-dashboard-card-trend-label">
                      {' '}
                      vs previous
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

// Helper functions
function getTrendIcon(status: TrendResult['status']): string {
  if (status === 'improving') return '⬆️';
  if (status === 'declining') return '⬇️';
  return '➡️';
}
