import { getDatabase } from './client';
import { seedInitialData } from './seed';

const CREATE_USERS_TABLE = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    avatar TEXT
  );
`;

const CREATE_GAMES_TABLE = `
  CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    platform TEXT NOT NULL,
    genre TEXT NOT NULL,
    cover_image TEXT
  );
`;

const CREATE_REVIEWS_TABLE = `
  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    game_id INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
  );
`;

export const initializeDatabase = async (): Promise<void> => {
  const db = await getDatabase();

  await db.execAsync('PRAGMA journal_mode = WAL;');
  await db.execAsync(CREATE_USERS_TABLE);
  await db.execAsync(CREATE_GAMES_TABLE);
  await db.execAsync(CREATE_REVIEWS_TABLE);

  await seedInitialData();
};

