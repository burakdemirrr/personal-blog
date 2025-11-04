import {
  createUser,
  fetchUserById,
  fetchUserByUsername,
  fetchUsers
} from '../db/repositories/userRepository';
import type { AuthCredentials, User } from '../types';

export const listUsers = async (): Promise<User[]> => fetchUsers();

export const getUserById = async (id: number): Promise<User | null> => fetchUserById(id);

export const loginWithUsername = async (username: string): Promise<User | null> =>
  fetchUserByUsername(username);

export const registerUser = async ({ username, email, avatar }: AuthCredentials): Promise<User> => {
  if (!username || !email) {
    throw new Error('Username and email are required.');
  }
  const existing = await fetchUserByUsername(username);
  if (existing) {
    throw new Error('Username already taken.');
  }
  return createUser(username, email, avatar);
};

