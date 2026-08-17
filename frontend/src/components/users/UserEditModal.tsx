import type { FormEvent } from 'react';

interface UserForm {
  login: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
}

interface UserEditModalProps {
  form: UserForm;
  formError: string;
  saving: boolean;
  roles: {
    value: string;
    label: string;
  }[];
  isCurrentUser: boolean;
  onChange: (field: keyof UserForm, value: string) => void;
  onSubmit: (event: FormEvent) => void;
  onClose: () => void;
}

export default function UserEditModal({
  form,
  formError,
  saving,
  roles,
  isCurrentUser,
  onChange,
  onSubmit,
  onClose,
}: UserEditModalProps) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div>
            <h2>Редактирование пользователя</h2>

            <p>
              Измените данные пользователя
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
                disabled={isCurrentUser}
              />
            </div>

            <div className="form-group">
              <label htmlFor="user-password">
                Новый пароль
              </label>

              <input
                id="user-password"
                type="password"
                placeholder="Оставьте пустым, чтобы не менять"
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
                disabled={isCurrentUser}
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
                disabled={isCurrentUser}
              >
                <option value="ACTIVE">
                  Активен
                </option>

                <option value="INACTIVE">
                  Неактивен
                </option>
              </select>
            </div>

            {isCurrentUser && (
              <div className="modal-info">
                Нельзя изменить логин, роль или статус
                текущего пользователя.
              </div>
            )}

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
                : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}