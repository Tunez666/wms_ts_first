import type { FormEvent } from 'react';

import type { CreateUserData } from '../../api/users';

interface UserForm {
  login: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
}

interface UserCreateModalProps {
  form: UserForm;
  formError: string;
  saving: boolean;
  roles: {
    value: string;
    label: string;
  }[];
  onChange: (field: keyof UserForm, value: string) => void;
  onSubmit: (event: FormEvent) => void;
  onClose: () => void;
}

export default function UserCreateModal({
  form,
  formError,
  saving,
  roles,
  onChange,
  onSubmit,
  onClose,
}: UserCreateModalProps) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div>
            <h2>Новый пользователь</h2>

            <p>
              Создайте нового пользователя
            </p>
          </div>

          <button
            className="modal-close"
            type="button"
            onClick={onClose}
            disabled={saving}
          >
            ×
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="user-login">
                Логин
              </label>

              <input
                id="user-login"
                type="text"
                value={form.login}
                onChange={(event) =>
                  onChange(
                    'login',
                    event.target.value,
                  )
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="user-password">
                Пароль
              </label>

              <input
                id="user-password"
                type="password"
                value={form.password}
                onChange={(event) =>
                  onChange(
                    'password',
                    event.target.value,
                  )
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="user-first-name">
                Имя
              </label>

              <input
                id="user-first-name"
                type="text"
                value={form.firstName}
                onChange={(event) =>
                  onChange(
                    'firstName',
                    event.target.value,
                  )
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="user-last-name">
                Фамилия
              </label>

              <input
                id="user-last-name"
                type="text"
                value={form.lastName}
                onChange={(event) =>
                  onChange(
                    'lastName',
                    event.target.value,
                  )
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="user-role">
                Роль
              </label>

              <select
                id="user-role"
                value={form.role}
                onChange={(event) =>
                  onChange(
                    'role',
                    event.target.value,
                  )
                }
              >
                {roles.map((role) => (
                  <option
                    key={role.value}
                    value={role.value}
                  >
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="user-status">
                Статус
              </label>

              <select
                id="user-status"
                value={form.status}
                onChange={(event) =>
                  onChange(
                    'status',
                    event.target.value,
                  )
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

            {formError && (
              <div className="modal-error">
                {formError}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              className="button-secondary"
              type="button"
              onClick={onClose}
              disabled={saving}
            >
              Отмена
            </button>

            <button
              className="button-primary"
              type="submit"
              disabled={saving}
            >
              {saving
                ? 'Сохранение...'
                : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}