import { getDatabase } from './client';

const USERS = [
  {
    username: 'playerone',
    email: 'player1@example.com',
    avatar: null
  },
  {
    username: 'arcadequeen',
    email: 'arcade@example.com',
    avatar: null
  }
];

const GAMES = [
  {
    title: 'The Legend of Zelda: Breath of the Wild',
    platform: 'Nintendo Switch',
    genre: 'Action-Adventure',
    cover_image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGUlEQVR4nO3BMQEAAADCoPdPbQ43oAAAAAAAAADwG6+DAAGApF1YAAAAAElFTkSuQmCC'
  },
  {
    title: 'Elden Ring',
    platform: 'PC',
    genre: 'Action RPG',
    cover_image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGUlEQVR4nO3BMQEAAADCoPdPbQ43oAAAAAAAAADwG6+DAAFwKpCFAAAAAElFTkSuQmCC'
  },
  {
    title: 'Hades',
    platform: 'PC',
    genre: 'Roguelike',
    cover_image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGUlEQVR4nO3BMQEAAADCoPdPbQ43oAAAAAAAAADwG6+DAAFwKpCFAAAAAElFTkSuQmCC'
  }
];

const REVIEWS = [
  {
    username: 'playerone',
    gameTitle: 'Elden Ring',
    rating: 5,
    comment: 'A masterpiece of world-building with challenging combat.',
    createdAt: new Date().toISOString()
  },
  {
    username: 'arcadequeen',
    gameTitle: 'Hades',
    rating: 4,
    comment: 'Fast-paced and incredibly stylish with a gripping narrative.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  }
];

export const seedInitialData = async (): Promise<void> => {
  const db = await getDatabase();

  const userCount = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM users;');
  if ((userCount?.count ?? 0) === 0) {
    for (const user of USERS) {
      await db.runAsync(
        'INSERT INTO users (username, email, avatar) VALUES (?, ?, ?);',
        [user.username, user.email, user.avatar]
      );
    }
  }

  const gameCount = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM games;');
  if ((gameCount?.count ?? 0) === 0) {
    for (const game of GAMES) {
      await db.runAsync(
        'INSERT INTO games (title, platform, genre, cover_image) VALUES (?, ?, ?, ?);',
        [game.title, game.platform, game.genre, game.cover_image]
      );
    }
  }

  const reviewCount = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM reviews;');
  if ((reviewCount?.count ?? 0) === 0) {
    for (const review of REVIEWS) {
      const user = await db.getFirstAsync<{ id: number }>('SELECT id FROM users WHERE username = ?;', [
        review.username
      ]);
      const game = await db.getFirstAsync<{ id: number }>('SELECT id FROM games WHERE title = ?;', [
        review.gameTitle
      ]);

      if (user && game) {
        await db.runAsync(
          'INSERT INTO reviews (user_id, game_id, rating, comment, created_at) VALUES (?, ?, ?, ?, ?);',
          [user.id, game.id, review.rating, review.comment, review.createdAt]
        );
      }
    }
  }
};

