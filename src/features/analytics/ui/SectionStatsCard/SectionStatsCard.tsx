import { useLiveQuery } from 'dexie-react-hooks';

import { getSectionName, SectionKey, SECTIONS } from '~/entities/book';

import { db } from '../../lib/db';

import './SectionStatsCard.css';

const getAccuracyColor = (accuracy: number) => {
  if (accuracy >= 0.8) return 'var(--correct)';
  if (accuracy >= 0.5) return 'var(--accent)';
  return 'var(--wrong)';
};

const SectionStatCard: React.FC<{ section: SectionKey }> = ({ section }) => {
  const stat = useLiveQuery(async () => {
    // Convert boolean to number (1) for IndexedDB
    const correct = await db.attempts
      .where('[section+isCorrect]')
      .equals([section, 1])
      .count();
    const total = await db.attempts.where('section').equals(section).count();

    return {
      section,
      accuracy: total > 0 ? correct / total : 0,
      correctCount: correct,
      totalCount: total,
    };
  }, []);

  if (!stat) {
    return null;
  }

  return (
    <div className="stat-card">
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
  );
};

export const SectionStatsCard = () => (
  <div className="stats-section">
    <h2>Твоя статистика</h2>
    <div className="stats-grid">
      {SECTIONS.map((section) => (
        <SectionStatCard key={section} section={section} />
      ))}
    </div>
  </div>
);
