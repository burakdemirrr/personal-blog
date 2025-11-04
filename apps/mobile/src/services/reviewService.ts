import { createReview, fetchRecentReviews, fetchReviewsByUserId } from '../db/repositories/reviewRepository';
import { getGameDetails } from './gameService';
import type { CreateReviewInput, Review, ReviewDetail } from '../types';

export const listRecentReviews = async (): Promise<ReviewDetail[]> => fetchRecentReviews();

export const listReviewsByUser = async (userId: number): Promise<ReviewDetail[]> =>
  fetchReviewsByUserId(userId);

export const createReviewEntry = async (input: CreateReviewInput): Promise<Review> => {
  if (input.rating < 1 || input.rating > 5) {
    throw new Error('Rating must be between 1 and 5.');
  }
  return createReview(input);
};

export const getGameDetailsWithReviews = getGameDetails;

