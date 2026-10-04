import { Clock, Truck, CheckCircle, Banknote } from 'lucide-react';
export default function StatsOverviewCards({ stats }) {
  const cards = [
    {
      label: 'PENDING',
      value: stats?.pending ?? 0,
      sub: `${stats?.requests ?? 0} requests`,
      icon: Clock,
      style: 'bg-[#FFF3CD] text-black',
    },
    {
      label: 'ACTIVE DISPATCH',
      value:
        (stats?.inTransit ?? 0) +
        (stats?.outForDelivery ?? 0) +
        (stats?.picked ?? 0),
      sub: `${stats?.inTransit ?? 0} in transit`,
      icon: Truck,
      style: 'bg-[#C8F135] text-black',
    },
    {
      label: 'DELIVERED',
      value: stats?.delivered ?? 0,
      sub: `${stats?.total ? Math.round((stats.delivered / stats.total) * 100) : 0}% success`,
      icon: CheckCircle,
      style: 'bg-black text-white',
    },
    {
      label: 'TOTAL REVENUE',
      value: `₦${(stats?.revenue ?? 0).toLocaleString()}`,
      sub: `${stats?.total ?? 0} shipments • ${stats?.totalDrivers ?? 0} drivers`,
      icon: Banknote,
      style: 'bg-white text-black',
    },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`${c.style} border border-black rounded-[24px] p-6`}
        >
          <div
            className={`w-8 h-8 rounded-full grid place-items-center mb-4 ${c.style.includes('bg-black') ? 'bg-white text-black' : 'bg-black text-white'}`}
          >
            <c.icon className="w-4 h-4" />
          </div>
          <p className="text-[10px] font-black tracking-[0.2em] opacity-60">
            {c.label}
          </p>
          <p className="text-[26px] font-black mt-1 leading-none tracking-tight">
            {c.value}
          </p>
          <p className="text-[10px] font-bold opacity-50 mt-2 tracking-widest">
            {c.sub}
          </p>
        </div>
      ))}
    </div>
  );
}
