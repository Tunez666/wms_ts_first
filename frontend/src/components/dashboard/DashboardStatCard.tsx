interface DashboardStatCardProps {
  title: string;
  total: number;
  active?: number;
  emptyText?: string;
}

export default function DashboardStatCard({
  title,
  total,
  active,
  emptyText = 'Пока нет',
}: DashboardStatCardProps) {
  return (
    <div className="stat-card">
      <span>{title}</span>

      <strong>{total}</strong>

      <small>
        {active !== undefined
          ? `${active} активных`
          : total > 0
            ? `${total} всего`
            : emptyText}
      </small>
    </div>
  );
}

