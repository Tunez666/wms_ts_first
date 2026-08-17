export default function DashboardPage() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Обзор складской системы</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <span>Клиенты</span>
          <strong>1</strong>
        </div>

        <div className="stat-card">
          <span>Заявки</span>
          <strong>0</strong>
        </div>

        <div className="stat-card">
          <span>Товары</span>
          <strong>0</strong>
        </div>

        <div className="stat-card">
          <span>Склады</span>
          <strong>0</strong>
        </div>
      </div>
    </div>
  );
}