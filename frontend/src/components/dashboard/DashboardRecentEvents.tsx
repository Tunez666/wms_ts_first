interface DashboardEvent {
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

interface DashboardRecentEventsProps {
  events: DashboardEvent[];
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString(
    'ru-RU',
    {
      hour: '2-digit',
      minute: '2-digit',
    },
  );
}

export default function DashboardRecentEvents({
  events,
}: DashboardRecentEventsProps) {
  return (
    <section className="dashboard-section">
      <div className="dashboard-section-header">
        <h2>Последние события</h2>
      </div>

      {events.length === 0 ? (
        <div className="dashboard-empty">
          Событий пока нет
        </div>
      ) : (
        <div className="dashboard-events">
          {events.map((event) => (
            <div
              className="dashboard-event"
              key={event.id}
            >
              <span className="dashboard-event-time">
                {formatTime(event.createdAt)}
              </span>

              <div className="dashboard-event-content">
                <p className="dashboard-event-description">
                  {event.description ??
                    `${event.action} ${event.entityType}`}
                </p>

                {event.user && (
                  <div className="dashboard-event-user">
                    {event.user.firstName}{' '}
                    {event.user.lastName}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
