import { useEffect, useState } from 'react';

import { getDashboard } from '../api/dashboard';

import type { DashboardData } from '../api/dashboard';

import DashboardStatCard from '../components/dashboard/DashboardStatCard';
import DashboardOperations from '../components/dashboard/DashboardOperations';
import DashboardRecentEvents from '../components/dashboard/DashboardRecentEvents';
import DashboardQuickActions from '../components/dashboard/DashboardQuickActions';

export default function DashboardPage() {
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError('');

        const data = await getDashboard();

        setDashboard(data);
      } catch (error) {
        console.error(error);
        setError(
          'Не удалось загрузить данные Dashboard',
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="table-state">
        Загрузка Dashboard...
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="table-state table-state-error">
        {error ||
          'Не удалось загрузить Dashboard'}
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>

          <p>
            Обзор текущего состояния WMS
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        <DashboardStatCard
          title="Клиенты"
          total={dashboard.clients.total}
          active={dashboard.clients.active}
        />

        <DashboardStatCard
          title="Пользователи"
          total={dashboard.users.total}
          active={dashboard.users.active}
        />

        <DashboardStatCard
          title="Заявки"
          total={dashboard.requests.total}
          emptyText="Пока нет"
        />

        <DashboardStatCard
          title="Товары"
          total={dashboard.products.total}
          emptyText="Пока нет"
        />
      </div>

      <DashboardOperations
        operations={dashboard.operations}
      />

      <div className="dashboard-bottom-grid">
        <DashboardRecentEvents
          events={dashboard.recentEvents}
        />

        <DashboardQuickActions />
      </div>
    </div>
  );
}