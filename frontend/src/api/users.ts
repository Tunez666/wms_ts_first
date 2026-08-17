import { api } from './client';

export interface User {
  id: string;
  login: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

export interface CreateUserData {
  login: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  status?: string;
}

export interface UpdateUserData {
  login?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  status?: string;
}

export async function getUsers(): Promise<User[]> {
  const response = await api.get<User[]>('/users');

  return response.data;
}

export async function createUser(
  data: CreateUserData,
): Promise<User> {
  const response = await api.post<User>('/users', data);

  return response.data;
}

export async function updateUser(
  id: string,
  data: UpdateUserData,
): Promise<User> {
  const response = await api.patch<User>(
    `/users/${id}`,
    data,
  );

  return response.data;
}