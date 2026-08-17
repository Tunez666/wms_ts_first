import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';

export default function LoginPage() {
  const navigate = useNavigate();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError('');

    try {
      const response = await api.post('/auth/login', {
        login,
        password,
      });

      localStorage.setItem(
        'accessToken',
        response.data.accessToken,
      );

      navigate('/');
    } catch {
      setError('Неверный логин или пароль');
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-header">
          <h1>WMS</h1>
          <p>Warehouse Management System</p>
        </div>

        <div className="form-group">
          <label>Логин</label>

          <input
            type="text"
            value={login}
            onChange={(event) => setLogin(event.target.value)}
            placeholder="Введите логин"
          />
        </div>

        <div className="form-group">
          <label>Пароль</label>

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Введите пароль"
          />
        </div>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <button type="submit">
          Войти
        </button>
      </form>
    </div>
  );
}