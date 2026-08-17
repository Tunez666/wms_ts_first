import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span>WMS</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/">
          Dashboard
        </NavLink>

        <NavLink to="/clients">
          Клиенты
        </NavLink>

        <NavLink to="/warehouses">
          Склады
        </NavLink>

        <NavLink to="/products">
          Товары
        </NavLink>

        <NavLink to="/requests">
          Заявки
        </NavLink>

        <NavLink to="/receiving">
          Приёмка
        </NavLink>

        <NavLink to="/inventory">
          Инвентарь
        </NavLink>
      </nav>
    </aside>
  );
}