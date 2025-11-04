import type { Game, Review, User } from '../types';

type DbGame = {
  id: number;
  title: string;
  platform: string;
  genre: string;
  cover_image: string | null;
};

type DbUser = {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
};

type DbReview = {
  id: number;
  user_id: number;
  game_id: number;
  rating: number;
  comment: string;
  created_at: string;
};

export const mapGame = (row: DbGame): Game => ({
  id: row.id,
  title: row.title,
  platform: row.platform,
  genre: row.genre,
  coverImage: row.cover_image ?? null
});

export const mapUser = (row: DbUser): User => ({
  id: row.id,
  username: row.username,
  email: row.email,
  avatar: row.avatar ?? null
});

export const mapReview = (row: DbReview): Review => ({
  id: row.id,
  userId: row.user_id,
  gameId: row.game_id,
  rating: row.rating,
  comment: row.comment,
  createdAt: row.created_at
});

