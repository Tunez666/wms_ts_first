import { api } from './client';

export interface DashboardStat {
  total: number;
  active: number;
}

export interface DashboardOperations {
  newRequests: number;
  inProgress: number;
  receiving: number;
  placement: number;
  completed: number;
}

export interface DashboardEvent {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  description: string | null;
  createdAt: string;
  user: {
    id: string;
    login: string;
    firstName: string;
    lastName: string;
  } | null;
}

export interface DashboardData {
  clients: DashboardStat;
  users: DashboardStat;
  requests: DashboardStat;
  products: DashboardStat;
  warehouses: DashboardStat;

  operations: DashboardOperations;

  recentEvents: DashboardEvent[];
}

export async function getDashboard(): Promise<DashboardData> {
  const response = await api.get<DashboardData>('/dashboard');

  return response.data;
}