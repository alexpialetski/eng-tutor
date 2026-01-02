import React, { useEffect, useState } from 'react';

import { getSectionName, SECTIONS } from '~/entities/book';
import { Card } from '~/shared/ui/Card';

import {
  analyticsService,
  DailyStat,
  TrendResult,
} from '../lib/analyticsService';

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
        <div className="text-center py-10 px-5 text-gray-600">
          Loading analytics...
        </div>
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
      <h2 className="mt-0 mb-6">Your Progress</h2>

      {/* Daily Activity Chart */}
      <div className="mb-10">
        <h3 className="mt-0 mb-4 text-lg text-gray-800">
          Activity (Last 7 Days)
        </h3>
        {data.dailyStats.length === 0 ? (
          <p className="text-gray-500 p-5">No activity yet.</p>
        ) : (
          <div className="flex items-end h-[150px] gap-2.5 py-2.5">
            {data.dailyStats.map((stat) => {
              const height = Math.max(
                10,
                (stat.correct / Math.max(stat.total, 1)) * 100,
              );
              const percentage = Math.round(
                (stat.correct / Math.max(stat.total, 1)) * 100,
              );
              return (
                <div
                  key={stat.date}
                  className="flex-1 flex flex-col items-center text-center"
                >
                  <div
                    className="w-full bg-green-600 rounded-t min-h-[20px] relative flex items-center justify-center transition-all duration-300"
                    style={{ height: `${height}px` }}
                    title={`${stat.correct}/${stat.total} Correct (${percentage}%)`}
                  >
                    <span className="text-[10px] text-white font-bold">
                      {stat.correct}
                    </span>
                  </div>
                  <small className="text-[10px] text-gray-600 mt-1">
                    {stat.date.slice(5)}
                  </small>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Topic Trends */}
      <div className="mt-8">
        <h3 className="mt-0 mb-4 text-lg text-gray-800">
          Topic Trends (Last 20 attempts)
        </h3>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
          {data.trends.map((trend) => (
            <div
              key={trend.section}
              className={`p-4 rounded-lg border shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                trend.status === 'improving'
                  ? 'border-l-[5px] border-l-green-600 bg-green-50'
                  : trend.status === 'declining'
                    ? 'border-l-[5px] border-l-red-500 bg-red-50'
                    : 'border-l-[5px] border-l-gray-500 bg-gray-100'
              }`}
            >
              <h4 className="m-0 mb-2.5 capitalize text-base text-gray-800">
                {getSectionName(trend.section)}
              </h4>

              {trend.status === 'insufficient_data' ? (
                <span className="text-gray-500 text-sm">
                  Not enough data yet
                </span>
              ) : (
                <div className="flex flex-col">
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {trend.currentAccuracy}%
                  </div>
                  <div className="text-sm text-gray-700">
                    {getTrendIcon(trend.status)} {Math.abs(trend.improvement)}%
                    <span className="text-gray-500 text-sm"> vs previous</span>
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
