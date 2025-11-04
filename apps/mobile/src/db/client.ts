import * as SQLite from 'expo-sqlite';

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

export const getDatabase = (): Promise<SQLite.SQLiteDatabase> => {
  if (!databasePromise) {
    databasePromise = (async () => {
      const db = await SQLite.openDatabaseAsync('gamesjournal.db');
      await db.execAsync('PRAGMA foreign_keys = ON;');
      return db;
    })();
  }

  return databasePromise;
};

export const resetDatabaseCache = () => {
  databasePromise = null;
};

