import { NavLink } from 'react-router-dom';

const links = [
  { to: '/admin/dashboard', label: 'DASHBOARD', icon: '◧' },
  { to: '/admin/requests', label: 'SERVICE REQUESTS', icon: '◫' },
  { to: '/admin/dispatch', label: 'DISPATCH BOARD', icon: '⬔' },
  { to: '/admin/drivers', label: 'DRIVERS', icon: '◐' },
];

export default function AdminSidebar() {
  return (
    <aside className="w-[280px] bg-black text-white flex flex-col min-h-screen border-r border-white/5">
      {/* HEADER */}
      <div className="px-8 py-8 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white text-black rounded-full grid place-items-center font-black text-sm">G71</div>
          <div>
            <div className="font-black text-[13px] tracking-[0.2em] leading-none">G71 ADMIN</div>
            <div className="text-[9px] text-white/40 font-bold tracking-widest mt-1.5">LOGISTICS CONSOLE</div>
          </div>
        </div>
      </div>

      {/* NAV - spaced */}
      <nav className="flex-1 p-4 md:p-5 space-y-2 mt-2">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3.5 rounded-[14px] text-[11px] font-black tracking-[0.15em] transition-all ${isActive ? 'bg-white text-black shadow-sm' : 'text-white/50 hover:text-white hover:bg-white/10'}`
            }
          >
            <span className="text-[14px] w-5 text-center">{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-8 border-t border-white/10">
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-black">Admin access restricted</p>
          <p className="text-[10px] text-white/50 mt-1 leading-relaxed">All actions are logged.</p>
        </div>
      </div>
    </aside>
  );
}