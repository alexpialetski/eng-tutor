import { useLiveQuery } from 'dexie-react-hooks';

import { getSectionName, SectionKey, SECTIONS } from '~/entities/book';

import { db } from '../lib/db';

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
    <div className="bg-primary/5 p-4 rounded-md border border-primary text-center">
      <div className="text-sm text-gray-600 mb-2">
        {getSectionName(stat.section)}
      </div>
      <div
        className="text-4xl font-bold my-2.5"
        style={{ color: getAccuracyColor(stat.accuracy) }}
      >
        {Math.round(stat.accuracy * 100)}%
      </div>
      <div className="text-sm text-gray-500">
        {stat.correctCount} / {stat.totalCount}
      </div>
    </div>
  );
};

export const SectionStatsCard = () => (
  <div className="my-8 mb-10">
    <h2 className="text-primary text-2xl mb-5 font-normal">Твоя статистика</h2>
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
      {SECTIONS.map((section) => (
        <SectionStatCard key={section} section={section} />
      ))}
    </div>
  </div>
);
