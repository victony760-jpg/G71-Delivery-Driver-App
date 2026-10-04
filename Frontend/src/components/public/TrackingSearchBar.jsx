import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TrackingSearchBar() {
  const [id, setId] = useState('');
  const nav = useNavigate();
  const go = () => {
    if (!id.trim()) return;
    nav(`/track-order?code=${id.trim().toUpperCase()}`);
  };
  return (
    <div className="flex gap-2">
      <input
        value={id}
        onChange={(e) => setId(e.target.value.toUpperCase())}
        onKeyDown={(e) => e.key === 'Enter' && go()}
        placeholder="G71-123456"
        className="flex-1 px-4 py-3 rounded-xl border border-black/15 bg-white text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
      />
      <button
        onClick={go}
        className="px-6 py-3 rounded-xl bg-black text-white text-[11px] font-bold tracking-widest hover:bg-zinc-800 transition"
      >
        TRACK
      </button>
    </div>
  );
}
