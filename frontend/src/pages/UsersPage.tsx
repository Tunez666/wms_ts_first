import { useEffect, useMemo, useState } from 'react';

import UserCreateModal from '../components/users/UserCreateModal';
import UserEditModal from '../components/users/UserEditModal';

import toast from 'react-hot-toast';

import {
  createUser,
  getUsers,
  updateUser,
} from '../api/users';

import type {
  CreateUserData,
  UpdateUserData,
  User,
} from '../api/users';

import { getCurrentUser } from '../auth/auth';

const roleLabels: Record<string, string> = {
  ADMIN: 'Администратор',
  WAREHOUSE_MANAGER: 'Менеджер склада',
  RECEIVER: 'Приёмщик',
  WAREHOUSE_OPERATOR: 'Оператор склада',
};

const statusLabels: Record<string, string> = {
  ACTIVE: 'Активен',
  INACTIVE: 'Неактивен',
};

const roles = [
  {
    value: 'ADMIN',
    label: 'Администратор',
  },
  {
    value: 'WAREHOUSE_MANAGER',
    label: 'Менеджер склада',
  },
  {
    value: 'RECEIVER',
    label: 'Приёмщик',
  },
  {
    value: 'WAREHOUSE_OPERATOR',
    label: 'Оператор склада',
  },
];

interface UserForm {
  login: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
}

const emptyForm: UserForm = {
  login: '',
  password: '',
  firstName: '',
  lastName: '',
  role: 'WAREHOUSE_OPERATOR',
  status: 'ACTIVE',
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  const [currentUserId, setCurrentUserId] = useState<
    string | null
  >(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] =
    useState<User | null>(null);

  const [form, setForm] = useState<UserForm>(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUsers();
    loadCurrentUser();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      setError('');

      const data = await getUsers();

      setUsers(data);
    } catch (error) {
      console.error(error);

      const message =
        (error as any)?.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message.join(', ')
          : message || 'Не удалось загрузить пользователей',
      );

      toast.error(
        Array.isArray(message)
          ? message.join(', ')
          : message || 'Не удалось загрузить пользователей',
      );
    }
    finally {
      setLoading(false);
    }
  }

  async function loadCurrentUser() {
    try {
      const user = await getCurrentUser();

      setCurrentUserId(user.userId);
    } catch (error) {
      console.error(error);
    }
  }

  function openCreateModal() {
    setEditingUser(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  }

  function openEditModal(user: User) {
    setEditingUser(user);

    setForm({
      login: user.login,
      password: '',
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
    });

    setFormError('');
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) {
      return;
    }

    resetModal();
  }

  function resetModal() {
    setModalOpen(false);
    setEditingUser(null);
    setForm(emptyForm);
    setFormError('');
  }

  function handleChange(
    field: keyof UserForm,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    setFormError('');

    if (!form.login.trim()) {
      setFormError('Введите логин');
      return;
    }

    if (!form.firstName.trim()) {
      setFormError('Введите имя');
      return;
    }

    if (!form.lastName.trim()) {
      setFormError('Введите фамилию');
      return;
    }

    if (!editingUser && form.password.length < 6) {
      setFormError(
        'Пароль должен содержать минимум 6 символов',
      );
      return;
    }

    try {
      setSaving(true);

      if (editingUser) {
        const data: UpdateUserData = {
          login: form.login.trim(),
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          role: form.role,
          status: form.status,
        };

        if (form.password) {
          data.password = form.password;
        }

        const updatedUser = await updateUser(
          editingUser.id,
          data,
        );

        setUsers((current) =>
          current.map((user) =>
            user.id === updatedUser.id
              ? updatedUser
              : user,
          ),
        );

        toast.success('Пользователь обновлён');

      } else {
        const data: CreateUserData = {
          login: form.login.trim(),
          password: form.password,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          role: form.role,
          status: form.status,
        };

        const newUser = await createUser(data);

        setUsers((current) => [
          newUser,
          ...current,
        ]);

        toast.success('Пользователь создан');
      }

      resetModal();
    } catch (error: any) {
      console.error(error);

      const message =
        error?.response?.data?.message;

      const errorMessage =
        Array.isArray(message)
          ? message.join(', ')
          : message ||
          (editingUser
            ? 'Не удалось обновить пользователя'
            : 'Не удалось создать пользователя');

      setFormError(errorMessage);

      toast.error(errorMessage);
    } finally {
    setSaving(false);
  }
}

const filteredUsers = useMemo(() => {
  const query = search.trim().toLowerCase();

  return users.filter((user) => {
    const matchesSearch =
      !query ||
      user.login.toLowerCase().includes(query) ||
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === 'ALL' ||
      user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
}, [users, search, statusFilter]);

return (
  <>
    <div className="page-header">
      <div>
        <h1>Пользователи</h1>

        <p>
          Управление пользователями и их доступом
        </p>
      </div>
    </div>

    <div className="clients-toolbar">
      <input
        type="text"
        placeholder="Поиск пользователя..."
        value={search}
        onChange={(event) =>
          setSearch(event.target.value)
        }
      />

      <select
        value={statusFilter}
        onChange={(event) =>
          setStatusFilter(event.target.value)
        }
      >
        <option value="ALL">
          Все пользователи
        </option>

        <option value="ACTIVE">
          Активные
        </option>

        <option value="INACTIVE">
          Неактивные
        </option>
      </select>

      <button
        className="primary-button"
        type="button"
        onClick={openCreateModal}
      >
        Создать пользователя
      </button>
    </div>

    {loading && (
      <div className="table-state">
        Загрузка пользователей...
      </div>
    )}

    {!loading && error && (
      <div className="table-state table-state-error">
        {error}
      </div>
    )}

    {!loading && !error && (
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Логин</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Роль</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.login}</td>

                <td>{user.firstName}</td>

                <td>{user.lastName}</td>

                <td>
                  {roleLabels[user.role] ??
                    user.role}
                </td>

                <td>
                  <span
                    className={`status ${user.status === 'ACTIVE'
                      ? 'status-active'
                      : 'status-inactive'
                      }`}
                  >
                    {statusLabels[user.status] ??
                      user.status}
                  </span>
                </td>

                <td>
                  <button
                    className="table-action"
                    type="button"
                    onClick={() =>
                      openEditModal(user)
                    }
                  >
                    Редактировать
                  </button>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <div className="table-state">
                    Пользователи не найдены
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )}

    {modalOpen &&
      (editingUser ? (
        <UserEditModal
          form={form}
          formError={formError}
          saving={saving}
          roles={roles}
          isCurrentUser={
            editingUser.id === currentUserId
          }
          onChange={handleChange}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      ) : (
        <UserCreateModal
          form={form}
          formError={formError}
          saving={saving}
          roles={roles}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      ))}
  </>
);
}

