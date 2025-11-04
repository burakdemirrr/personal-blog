import { getAll, getFirst, run } from '../utils';
import { mapGame, mapReview, mapUser } from '../mappers';
import type { CreateReviewInput, Review, ReviewDetail } from '../../types';

type DbReviewRow = {
  id: number;
  user_id: number;
  game_id: number;
  rating: number;
  comment: string;
  created_at: string;
};

type JoinedReviewRow = DbReviewRow & {
  username: string;
  email: string;
  avatar: string | null;
  title: string;
  platform: string;
  genre: string;
  cover_image: string | null;
};

const mapJoinedReview = (row: JoinedReviewRow): ReviewDetail => ({
  review: mapReview(row),
  user: mapUser({
    id: row.user_id,
    username: row.username,
    email: row.email,
    avatar: row.avatar
  }),
  game: mapGame({
    id: row.game_id,
    title: row.title,
    platform: row.platform,
    genre: row.genre,
    cover_image: row.cover_image
  })
});

export const fetchRecentReviews = async (limit = 20): Promise<ReviewDetail[]> => {
  const rows = await getAll<JoinedReviewRow>(
    `SELECT r.id, r.user_id, r.game_id, r.rating, r.comment, r.created_at,
            u.username, u.email, u.avatar,
            g.title, g.platform, g.genre, g.cover_image
     FROM reviews r
     JOIN users u ON u.id = r.user_id
     JOIN games g ON g.id = r.game_id
     ORDER BY datetime(r.created_at) DESC
     LIMIT ?;`,
    [limit]
  );
  return rows.map(mapJoinedReview);
};

export const fetchReviewsByGameId = async (gameId: number): Promise<ReviewDetail[]> => {
  const rows = await getAll<JoinedReviewRow>(
    `SELECT r.id, r.user_id, r.game_id, r.rating, r.comment, r.created_at,
            u.username, u.email, u.avatar,
            g.title, g.platform, g.genre, g.cover_image
     FROM reviews r
     JOIN users u ON u.id = r.user_id
     JOIN games g ON g.id = r.game_id
     WHERE r.game_id = ?
     ORDER BY datetime(r.created_at) DESC;`,
    [gameId]
  );
  return rows.map(mapJoinedReview);
};

export const fetchReviewsByUserId = async (userId: number): Promise<ReviewDetail[]> => {
  const rows = await getAll<JoinedReviewRow>(
    `SELECT r.id, r.user_id, r.game_id, r.rating, r.comment, r.created_at,
            u.username, u.email, u.avatar,
            g.title, g.platform, g.genre, g.cover_image
     FROM reviews r
     JOIN users u ON u.id = r.user_id
     JOIN games g ON g.id = r.game_id
     WHERE r.user_id = ?
     ORDER BY datetime(r.created_at) DESC;`,
    [userId]
  );
  return rows.map(mapJoinedReview);
};

export const createReview = async (input: CreateReviewInput): Promise<Review> => {
  const createdAt = new Date().toISOString();
  await run(
    'INSERT INTO reviews (user_id, game_id, rating, comment, created_at) VALUES (?, ?, ?, ?, ?);',
    [input.userId, input.gameId, input.rating, input.comment, createdAt]
  );

  const row = await getFirst<DbReviewRow>(
    `SELECT id, user_id, game_id, rating, comment, created_at
     FROM reviews
     WHERE user_id = ? AND game_id = ?
     ORDER BY datetime(created_at) DESC
     LIMIT 1;`,
    [input.userId, input.gameId]
  );

  if (!row) {
    throw new Error('Failed to create review');
  }

  return mapReview(row);
};

