import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  getCurrentUser,
  logout,
} from '../../auth/auth';

import type { CurrentUser } from '../../auth/auth';

export default function Header() {
  const navigate = useNavigate();

  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error(error);

        logout();
        navigate('/login', { replace: true });
      }
    }

    loadUser();
  }, [navigate]);

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="header">
      <div />

      <div className="header-user">
        {user && (
          <span>
            {user.login} · {user.role}
          </span>
        )}

        <button onClick={handleLogout}>
          Выйти
        </button>
      </div>
    </header>
  );
}