import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Truck,
  Users,
  ClipboardList,
  MapPinned,
  Activity,
  BadgeDollarSign,
  ScrollText,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import PageTransition from '../components/common/PageTransition';

export default function AdminLayout() {
  const loc = useLocation();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = [
    { to: '/admin', label: 'DASHBOARD', icon: LayoutDashboard },
    { to: '/admin/requests', label: 'SERVICE REQUESTS', icon: Package },
    { to: '/admin/dispatch', label: 'DISPATCH BOARD', icon: Truck },
    { to: '/admin/drivers', label: 'MANAGE DRIVERS', icon: Users },
    { to: '/admin/applications', label: 'DRIVER APPLICATIONS', icon: ClipboardList },
    { to: '/admin/live-map', label: 'LIVE DRIVER MAP', icon: MapPinned },
    { to: '/admin/performance', label: 'PERFORMANCE', icon: Activity },
    { to: '/admin/rates', label: 'RATES MANAGER', icon: BadgeDollarSign },
    { to: '/admin/logs', label: 'SYSTEM LOGS', icon: ScrollText },
  ];

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSidebarOpen(false);
  }, [loc.pathname]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      {/* MOBILE TOP BAR - hidden on desktop */}
      <header className="lg:hidden sticky top-0 z-40 bg-black text-white px-4 py-3 flex items-center justify-between border-b border-white/10 shadow-lg">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white text-black rounded-full grid place-items-center font-black text-xs">
            G71
          </div>
          <p className="font-black text-[13px] tracking-[0.2em]">G71 ADMIN</p>
        </Link>
        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={sidebarOpen}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* BACKDROP for mobile drawer */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-45"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR - off-canvas drawer on mobile, fixed column on desktop */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-[280px] bg-black text-white p-6 flex flex-col justify-between z-50 overflow-y-auto transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        aria-label="Admin navigation"
      >
        <div>
          <div className="flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 bg-white text-black rounded-full grid place-items-center font-black text-sm shrink-0">
                G71
              </div>
              <div className="min-w-0">
                <p className="font-black text-[13px] tracking-[0.2em] leading-none truncate">
                  G71 ADMIN
                </p>
                <p className="text-[9px] text-white/40 font-bold tracking-widest mt-1">
                  LOGISTICS CONSOLE
                </p>
              </div>
            </Link>
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <nav className="mt-10 flex flex-col gap-2">
            {links.map((l) => {
              const active =
                loc.pathname === l.to ||
                (l.to !== '/admin' && loc.pathname.startsWith(l.to));
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-[14px] text-[11px] font-black tracking-[0.15em] transition-all ${active ? 'bg-white text-black' : 'text-white/50 hover:bg-white/10 hover:text-white'}`}
                >
                  <l.icon className="w-4 h-4 shrink-0" />
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <button
          onClick={logout}
          className="flex gap-2 items-center text-white/40 text-[11px] font-black tracking-widest hover:text-white pt-6 border-t border-white/10"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          LOGOUT
        </button>
      </aside>


      {/* CONTENT */}
      <main className="lg:pl-[304px] min-h-screen bg-[#F5F5F0] p-4 md:p-8 lg:p-10">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
    </div>
  );
}
