import { useNavigate } from 'react-router-dom';

export default function DashboardQuickActions() {
  const navigate = useNavigate();

  return (
    <section className="dashboard-section">
      <div className="dashboard-section-header">
        <h2>Быстрые действия</h2>
      </div>

      <div className="dashboard-quick-actions">
        <button
          className="dashboard-quick-action"
          type="button"
          onClick={() => navigate('/clients')}
        >
          <span className="dashboard-quick-action-icon">
            +
          </span>

          <span>Создать клиента</span>
        </button>

        <button
          className="dashboard-quick-action"
          type="button"
          onClick={() => navigate('/users')}
        >
          <span className="dashboard-quick-action-icon">
            +
          </span>

          <span>Создать пользователя</span>
        </button>

        <button
          className="dashboard-quick-action"
          type="button"
          disabled
        >
          <span className="dashboard-quick-action-icon">
            +
          </span>

          <span>Создать заявку</span>
        </button>
      </div>
    </section>
  );
}

