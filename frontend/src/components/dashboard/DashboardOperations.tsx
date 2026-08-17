interface DashboardOperationsProps {
  operations: {
    newRequests: number;
    inProgress: number;
    receiving: number;
    placement: number;
    completed: number;
  };
}

export default function DashboardOperations({
  operations,
}: DashboardOperationsProps) {
  return (
    <section className="dashboard-section">
      <div className="dashboard-section-header">
        <h2>Операции</h2>
      </div>

      <div className="operations-list">
        <div className="operation-row">
          <span>Новые заявки</span>
          <strong>{operations.newRequests}</strong>
        </div>

        <div className="operation-row">
          <span>В обработке</span>
          <strong>{operations.inProgress}</strong>
        </div>

        <div className="operation-row">
          <span>На приёмке</span>
          <strong>{operations.receiving}</strong>
        </div>

        <div className="operation-row">
          <span>На размещении</span>
          <strong>{operations.placement}</strong>
        </div>

        <div className="operation-row">
          <span>Завершено</span>
          <strong>{operations.completed}</strong>
        </div>
      </div>
    </section>
  );
}