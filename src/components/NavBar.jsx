// src/components/NavBar.jsx
import { NavLink } from 'react-router-dom';

export default function NavBar() {
  return (
<nav className="bg-white border-b shadow p-4 mb-6">

      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          isActive ? 'font-semibold text-blue-600' : 'text-gray-600'
        }
      >
        Dashboard
      </NavLink>
      <NavLink
        to="/login"
        className={({ isActive }) =>
          isActive ? 'font-semibold text-blue-600' : 'text-gray-600'
        }
      >
        Login
      </NavLink>
      {/* future links: */}
      {/* <NavLink to="/profile">Profile</NavLink> */}
      {/* <NavLink to="/audit-logs">Audit Log</NavLink> */}
    </nav>
  );
}
