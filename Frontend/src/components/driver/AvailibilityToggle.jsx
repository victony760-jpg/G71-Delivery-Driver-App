import { useState, useEffect } from 'react';
import { Power } from 'lucide-react';

export default function AvailabilityToggle({
  defaultOnline = true,
  onToggle,
  compact = false,
}) {
  const [online, setOnline] = useState(() => {
    const saved = localStorage.getItem('g71_driver_online');
    return saved !== null ? saved === 'true' : defaultOnline;
  });

  useEffect(() => {
    localStorage.setItem('g71_driver_online', String(online));
  }, [online]);

  const handleToggle = () => {
    const v = !online;
    setOnline(v);
    onToggle?.(v);
    // when backend ready:
    // api.patch('/driver/availability', { isAvailable: v })
  };

  if (compact) {
    return (
      <button
        onClick={handleToggle}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-full border border-black text-[10px] font-black tracking-[0.2em] transition-all ${online ? 'bg-[#C8F135] text-black' : 'bg-white text-black/50'}`}
      >
        <span className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${online ? 'bg-black animate-pulse' : 'bg-red-500'}`}
          />
          {online ? 'ONLINE' : 'OFFLINE'}
        </span>
        <Power className="w-3 h-3" />
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={`flex gap-2 items-center px-5 py-3 rounded-full text-[11px] font-black tracking-[0.15em] border border-black transition-all ${online ? 'bg-[#C8F135] text-black' : 'bg-white text-black/60'}`}
    >
      <Power className="w-4 h-4" />
      {online ? '● ONLINE — Receiving Jobs' : '○ OFFLINE — Paused'}
    </button>
  );
}
