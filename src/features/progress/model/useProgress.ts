import { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { User, Progress, SectionStats } from '../../../shared/types';
import { SectionKey } from '../../../shared/constants/sections';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const users = await db.users.toArray();
        if (users.length > 0) {
          setUser(users[0] as User);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const createUser = async (name: string): Promise<User> => {
    const newUser: Omit<User, 'id'> = {
      name,
      createdAt: new Date(),
    };
    const id = await db.users.add(newUser as User);
    const createdUser = { ...newUser, id } as User;
    setUser(createdUser);
    return createdUser;
  };

  return { user, loading, createUser };
};

export const useProgress = (userId: number | undefined, bookId: string) => {
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const loadProgress = async () => {
      try {
        const userProgress = await db.progress
          .where('[userId+bookId]')
          .equals([userId, bookId])
          .toArray();
        setProgress(userProgress as Progress[]);
      } catch (error) {
        console.error('Error loading progress:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [userId, bookId]);

  const recordAnswer = async (
    section: SectionKey,
    isCorrect: boolean,
  ): Promise<void> => {
    if (!userId) return;

    try {
      const existing = await db.progress
        .where('[userId+bookId+section]')
        .equals([userId, bookId, section])
        .first();

      if (existing && existing.id) {
        await db.progress.update(existing.id, {
          correctCount: existing.correctCount + (isCorrect ? 1 : 0),
          totalCount: existing.totalCount + 1,
          lastAttempt: new Date(),
        });
      } else {
        await db.progress.add({
          userId,
          bookId,
          section,
          correctCount: isCorrect ? 1 : 0,
          totalCount: 1,
          lastAttempt: new Date(),
        });
      }
    } catch (error) {
      console.error('Error recording answer:', error);
    }
  };

  const getSectionStats = (): SectionStats[] => {
    const statsMap = new Map<SectionKey, { correct: number; total: number }>();

    progress.forEach((p) => {
      const existing = statsMap.get(p.section) || { correct: 0, total: 0 };
      statsMap.set(p.section, {
        correct: existing.correct + p.correctCount,
        total: existing.total + p.totalCount,
      });
    });

    return Array.from(statsMap.entries()).map(
      ([section, { correct, total }]) => ({
        section: section as SectionKey,
        accuracy: total > 0 ? correct / total : 0,
        correctCount: correct,
        totalCount: total,
      }),
    );
  };

  return { progress, loading, recordAnswer, getSectionStats };
};

export const useSessions = (userId: number | undefined) => {
  const saveSession = async (
    bookId: string,
    score: number,
    totalQuestions: number,
  ): Promise<void> => {
    if (!userId) return;

    try {
      await db.sessions.add({
        userId,
        bookId,
        score,
        totalQuestions,
        completedAt: new Date(),
      });
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  return { saveSession };
};
