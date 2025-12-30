import Dexie, { Table } from 'dexie';
import { User, Progress, Session } from '../../../shared/types';

class EngTutorDB extends Dexie {
  users!: Table<User>;
  progress!: Table<Progress>;
  sessions!: Table<Session>;

  constructor() {
    super('EngTutorDB');
    this.version(1).stores({
      users: '++id, name, createdAt',
      progress: '++id, userId, bookId, section, [userId+bookId+section]',
      sessions: '++id, userId, bookId, completedAt',
    });
  }
}

export const db = new EngTutorDB();

