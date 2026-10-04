import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const links = [
  { to: '/driver', label: 'Dashboard', icon: '◧', end: true },
  { to: '/driver/new', label: 'New', icon: '◫' },
  { to: '/driver/active', label: 'Active', icon: '⬔' },
];

export default function DriverNavbar() {
  const { user, logout } = useAuth();
  return (
    <header className="h-[64px] bg-black text-white px-6 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <span className="font-black text-lg">◐ G71 DRIVER</span>
        <nav className="flex gap-1 bg-white/10 p-1 rounded-full">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition ${isActive ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`
              }
            >
              <span>{l.icon}</span> {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-white/60 hidden md:block">
          {user?.email}
        </span>
        <button
          onClick={logout}
          className="text-xs font-bold uppercase tracking-widest border border-white/20 px-4 py-2 rounded-full hover:bg-white hover:text-black transition"
        >
          ⎋ Logout
        </button>
      </div>
    </header>
  );
}
