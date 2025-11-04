import { fetchGameById, fetchGames, searchGames } from '../db/repositories/gameRepository';
import { fetchReviewsByGameId } from '../db/repositories/reviewRepository';
import { getFirst } from '../db/utils';
import type { Game, ReviewDetail } from '../types';

type GameDetails = {
  game: Game;
  reviews: ReviewDetail[];
  averageRating: number | null;
  reviewCount: number;
};

export const listGames = async (): Promise<Game[]> => fetchGames();

export const searchGamesByQuery = async (query: string): Promise<Game[]> => {
  if (!query.trim()) {
    return listGames();
  }
  return searchGames(query);
};

export const getGameDetails = async (gameId: number): Promise<GameDetails | null> => {
  const game = await fetchGameById(gameId);
  if (!game) {
    return null;
  }

  const reviews = await fetchReviewsByGameId(gameId);
  const aggregate = await getFirst<{ averageRating: number | null; reviewCount: number }>(
    'SELECT AVG(rating) as averageRating, COUNT(*) as reviewCount FROM reviews WHERE game_id = ?;',
    [gameId]
  );

  return {
    game,
    reviews,
    averageRating: aggregate?.averageRating ?? null,
    reviewCount: aggregate?.reviewCount ?? 0
  };
};

export type { GameDetails };

