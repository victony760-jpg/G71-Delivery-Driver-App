import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import DriverSidebar from '../components/navigation/DriverSidebar';

export default function DriverLayout() {
  const loc = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        <Link to="/driver" className="font-black text-[15px] tracking-widest">
          G71 DRIVER
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

      <DriverSidebar
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="lg:pl-[260px] min-w-0 min-h-screen p-4 lg:p-8">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
    </div>
  );
}
