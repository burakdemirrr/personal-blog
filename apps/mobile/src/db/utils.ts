import type * as SQLite from 'expo-sqlite';
import { getDatabase } from './client';

type QueryParams = SQLite.QueryParameterSet;

export const run = async (sql: string, params: QueryParams = []): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync(sql, params);
};

export const getFirst = async <T>(sql: string, params: QueryParams = []): Promise<T | null> => {
  const db = await getDatabase();
  const result = await db.getFirstAsync<T>(sql, params);
  return result ?? null;
};

export const getAll = async <T>(sql: string, params: QueryParams = []): Promise<T[]> => {
  const db = await getDatabase();
  const result = await db.getAllAsync<T>(sql, params);
  return result ?? [];
};

export const runInTransaction = async (
  callback: (tx: SQLite.SQLiteDatabase) => Promise<void>
): Promise<void> => {
  const db = await getDatabase();
  await db.withTransactionAsync(async (tx) => {
    await callback(tx);
  });
};

