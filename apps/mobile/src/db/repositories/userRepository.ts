import { getAll, getFirst, run } from '../utils';
import { mapUser } from '../mappers';
import type { User } from '../../types';

type DbUserRow = {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
};

export const fetchUsers = async (): Promise<User[]> => {
  const rows = await getAll<DbUserRow>('SELECT id, username, email, avatar FROM users ORDER BY username ASC;');
  return rows.map(mapUser);
};

export const fetchUserById = async (id: number): Promise<User | null> => {
  const row = await getFirst<DbUserRow>('SELECT id, username, email, avatar FROM users WHERE id = ?;', [id]);
  return row ? mapUser(row) : null;
};

export const fetchUserByUsername = async (username: string): Promise<User | null> => {
  const row = await getFirst<DbUserRow>(
    'SELECT id, username, email, avatar FROM users WHERE username = ?;',
    [username]
  );
  return row ? mapUser(row) : null;
};

export const createUser = async (username: string, email: string, avatar?: string | null): Promise<User> => {
  await run('INSERT INTO users (username, email, avatar) VALUES (?, ?, ?);', [username, email, avatar ?? null]);
  const newlyCreated = await fetchUserByUsername(username);
  if (!newlyCreated) {
    throw new Error('Failed to create user.');
  }
  return newlyCreated;
};

