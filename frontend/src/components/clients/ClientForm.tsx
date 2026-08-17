import { FormEvent, useState } from 'react';

interface ClientFormProps {
  client?: {
    id: string;
    name: string;
    clientType: string;
    email?: string;
    phone?: string;
    isActive: boolean;
  };

  onSuccess: () => void;
  onCancel: () => void;

  onSubmit: (data: {
    name: string;
    clientType: string;
    email?: string;
    phone?: string;
    isActive?: boolean;
  }) => Promise<void>;
}

export default function ClientForm({
  client,
  onSuccess,
  onCancel,
  onSubmit,
}: ClientFormProps) {
  const isEditMode = Boolean(client);

  const [name, setName] = useState(client?.name ?? '');
  const [clientType, setClientType] = useState(
    client?.clientType ?? 'BUSINESS',
  );
  const [email, setEmail] = useState(client?.email ?? '');
  const [phone, setPhone] = useState(client?.phone ?? '');
  const [isActive, setIsActive] = useState(
    client?.isActive ?? true,
  );

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!name.trim()) {
      setError('Введите название клиента');
      return;
    }

    try {
      setSaving(true);
      setError('');

      await onSubmit({
        name: name.trim(),
        clientType,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        isActive,
      });

      onSuccess();
    } catch (error) {
      console.error(error);

      setError(
        isEditMode
          ? 'Не удалось изменить клиента'
          : 'Не удалось создать клиента',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div>
            <h2>
              {isEditMode
                ? 'Редактирование клиента'
                : 'Новый клиент'}
            </h2>

            <p>
              {isEditMode
                ? 'Измените данные клиента'
                : 'Добавьте клиента в систему'}
            </p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onCancel}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="client-name">
              Название
            </label>

            <input
              id="client-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="ООО Ромашка"
            />
          </div>

          <div className="form-group">
            <label htmlFor="client-type">
              Тип клиента
            </label>

            <select
              id="client-type"
              value={clientType}
              onChange={(event) =>
                setClientType(event.target.value)
              }
            >
              <option value="BUSINESS">
                BUSINESS
              </option>

              <option value="INDIVIDUAL">
                INDIVIDUAL
              </option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="client-email">
              Email
            </label>

            <input
              id="client-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="client@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="client-phone">
              Телефон
            </label>

            <input
              id="client-phone"
              type="text"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+79990000000"
            />
          </div>

          {isEditMode && (
            <div className="form-group">
              <label htmlFor="client-status">
                Статус
              </label>

              <select
                id="client-status"
                value={isActive ? 'ACTIVE' : 'INACTIVE'}
                onChange={(event) =>
                  setIsActive(event.target.value === 'ACTIVE')
                }
              >
                <option value="ACTIVE">
                  Активен
                </option>

                <option value="INACTIVE">
                  Неактивен
                </option>
              </select>
            </div>
          )}

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onCancel}
              disabled={saving}
            >
              Отмена
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving
                ? 'Сохранение...'
                : isEditMode
                  ? 'Сохранить'
                  : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}