export type User = {
  id: number;
  username: string;
  email: string;
  avatar?: string | null;
};

export type Game = {
  id: number;
  title: string;
  platform: string;
  genre: string;
  coverImage?: string | null;
};

export type Review = {
  id: number;
  userId: number;
  gameId: number;
  rating: number;
  comment: string;
  createdAt: string;
};

export type ReviewDetail = {
  review: Review;
  user: User;
  game: Game;
};

export type CreateReviewInput = {
  userId: number;
  gameId: number;
  rating: number;
  comment: string;
};

export type AuthCredentials = {
  username: string;
  email?: string;
  avatar?: string;
};

