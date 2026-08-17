import { Navigate, Route, Routes } from 'react-router-dom';

import Layout from '../components/layout/Layout';
import DashboardPage from '../pages/DashboardPage';
import LoginPage from '../pages/LoginPage';
import ClientsPage from '../pages/ClientsPage';
import UsersPage from '../pages/UsersPage';

function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="users" element={<UsersPage />} />
        
      </Route>
    </Routes>
  );
}