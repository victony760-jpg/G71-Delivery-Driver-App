import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Truck,
  UserRound,
  History,
  Package,
  LogOut,
  X,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api.js';

const links = [
  { to: '/driver', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/driver/new', label: 'New Assignments', icon: ClipboardList },
  { to: '/driver/active', label: 'Active Deliveries', icon: Truck },
  { to: '/driver/profile', label: 'My Profile', icon: UserRound },
  { to: '/driver/history', label: 'Delivery History', icon: History },
];

export default function DriverSidebar({ mobileOpen = false, onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [currentJob, setCurrentJob] = useState(null);

  useEffect(() => {
    let active = true;
    api
      .get('/driver/next-job')
      .then(({ data }) => {
        if (active) setCurrentJob(data.job || null);
      })
      .catch(() => {
        if (active) setCurrentJob(null);
      });

    return () => {
      active = false;
    };
  }, [location.pathname]);

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 w-[260px] bg-black text-white p-4 lg:p-6 flex flex-col justify-between z-50 overflow-y-auto transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      aria-label="Driver navigation"
    >
      <div>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="font-black text-xl tracking-widest">G71 DRIVER</div>
            <p className="text-[10px] text-white/40 tracking-widest mt-2">
              DRIVER WORKSPACE
            </p>
            <p className="text-xs text-white/70 mt-1 truncate">{user?.email}</p>
          </div>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="lg:hidden w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="mt-6 lg:mt-8 flex flex-col gap-2">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold whitespace-nowrap transition ${isActive ? 'bg-white text-black' : 'text-white/60 hover:bg-white/10 hover:text-white'}`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{label}</span>
            </NavLink>
          ))}
          {currentJob && (
            <NavLink
              to={`/driver/job/${currentJob._id}`}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold whitespace-nowrap transition ${isActive ? 'bg-white text-black' : 'text-white/60 hover:bg-white/10 hover:text-white'}`
              }
            >
              <Package className="w-4 h-4 shrink-0" />
              <span className="truncate">Current Job</span>
            </NavLink>
          )}
        </nav>
      </div>

      <button
        onClick={logout}
        className="mt-8 flex gap-2 items-center text-white/50 text-sm font-bold hover:text-white transition"
      >
        <LogOut className="w-4 h-4 shrink-0" />
        Logout
      </button>
    </aside>
  );
}
