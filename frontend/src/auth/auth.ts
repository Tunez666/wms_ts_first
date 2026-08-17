import { api } from '../api/client';

export interface CurrentUser {
  userId: string;
  login: string;
  role: string;
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const response = await api.get<CurrentUser>('/auth/me');

  return response.data;
}

export function logout() {
  localStorage.removeItem('accessToken');
}