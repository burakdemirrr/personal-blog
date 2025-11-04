import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createReviewEntry,
  getGameDetailsWithReviews,
  listRecentReviews,
  listReviewsByUser
} from './reviewService';
import { listGames, searchGamesByQuery } from './gameService';
import { loginWithUsername, registerUser } from './userService';
import type { CreateReviewInput, Game, ReviewDetail, User } from '../types';

export const useGamesQuery = () =>
  useQuery<Game[], Error>({
    queryKey: ['games'],
    queryFn: listGames
  });

export const useSearchGamesQuery = (query: string) =>
  useQuery<Game[], Error>({
    queryKey: ['games', query],
    queryFn: () => searchGamesByQuery(query),
    enabled: !!query
  });

export const useRecentReviewsQuery = () =>
  useQuery<ReviewDetail[], Error>({
    queryKey: ['reviews', 'recent'],
    queryFn: listRecentReviews
  });

export const useUserReviewsQuery = (userId: number | null) =>
  useQuery<ReviewDetail[], Error>({
    queryKey: ['reviews', 'user', userId],
    queryFn: () => {
      if (!userId) {
        return Promise.resolve([]);
      }
      return listReviewsByUser(userId);
    },
    enabled: Boolean(userId)
  });

export const useGameDetailsQuery = (gameId: number) =>
  useQuery({
    queryKey: ['game', gameId],
    queryFn: () => getGameDetailsWithReviews(gameId),
    enabled: !!gameId
  });

export const useCreateReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateReviewInput) => createReviewEntry(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'recent'] });
      queryClient.invalidateQueries({ queryKey: ['game', variables.gameId] });
    }
  });
};

export const useLoginMutation = () =>
  useMutation<User | null, Error, string>({
    mutationFn: (username) => loginWithUsername(username)
  });

export const useSignupMutation = () =>
  useMutation<User, Error, { username: string; email: string; avatar?: string }>(
    {
      mutationFn: (payload) => registerUser(payload)
    }
  );

