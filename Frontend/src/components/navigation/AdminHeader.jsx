import useAuth from '../../hooks/useAuth';
import Button from '../common/Button';

export default function AdminHeader() {
  const { user, logout } = useAuth();
  return (
    <header className="h-[64px] bg-white border-b border-zinc-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
          A
        </span>
        <span className="text-sm font-bold">{user?.email}</span>
        <span className="px-2 py-1 rounded bg-black text-white text-[10px] font-bold uppercase">
          {user?.role}
        </span>
      </div>
      <Button variant="ghost" size="sm" onClick={logout}>
        ⎋ Logout
      </Button>
    </header>
  );
}
