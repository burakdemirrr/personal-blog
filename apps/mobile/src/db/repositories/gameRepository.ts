import { getAll, getFirst } from '../utils';
import { mapGame } from '../mappers';
import type { Game } from '../../types';

type DbGameRow = {
  id: number;
  title: string;
  platform: string;
  genre: string;
  cover_image: string | null;
};

export const fetchGames = async (): Promise<Game[]> => {
  const rows = await getAll<DbGameRow>(
    'SELECT id, title, platform, genre, cover_image FROM games ORDER BY title ASC;'
  );
  return rows.map(mapGame);
};

export const fetchGameById = async (id: number): Promise<Game | null> => {
  const row = await getFirst<DbGameRow>(
    'SELECT id, title, platform, genre, cover_image FROM games WHERE id = ? LIMIT 1;',
    [id]
  );
  return row ? mapGame(row) : null;
};

export const searchGames = async (query: string): Promise<Game[]> => {
  const wildcard = `%${query.trim()}%`;
  const rows = await getAll<DbGameRow>(
    `SELECT id, title, platform, genre, cover_image FROM games
     WHERE title LIKE ? OR platform LIKE ? OR genre LIKE ?
     ORDER BY title ASC;`,
    [wildcard, wildcard, wildcard]
  );
  return rows.map(mapGame);
};

