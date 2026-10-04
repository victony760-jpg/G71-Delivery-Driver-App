import { useEffect, useState } from 'react';
import { TrendingUp, ArrowUpRight, Banknote } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatsOverviewCards from '../../components/admin/StatsOverviewCards.jsx';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [chart, setChart] = useState([]);
  const [recent, setRecent] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    api
      .get('/admin/stats', { signal: controller.signal })
      .then(({ data }) => {
        setStats(data?.stats || null);
        setChart(data?.chart || []);
        setRecent(data?.recentRequests || []);
      })
      .catch((e) => {
        if (!controller.signal.aborted)
          setError(
            e.response?.data?.message ||
              (e.code === 'ECONNABORTED'
                ? 'Dashboard data is taking too long to load. Check the database connection and try again.'
                : 'Could not load dashboard'),
          );
      });
    return () => controller.abort();
  }, []);

  return (
    <div className="max-w-[1200px] space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-3">
        <div>
          <p className="text-[11px] font-black tracking-[0.2em] text-black/40">
            OVERVIEW • PHASE 20 LIVE
          </p>
          <h1 className="text-[26px] md:text-[32px] font-black tracking-tight leading-none mt-2">
            Dashboard
          </h1>
          <p className="text-black/50 text-[13px] mt-2">
            Real revenue from delivered shipments.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="bg-black text-white px-4 py-2 rounded-full text-[11px] font-bold flex items-center gap-2">
            <Banknote className="w-4 h-4 text-[#C8F135]" /> ₦
            {stats?.revenue?.toLocaleString() || 0} REVENUE
          </div>
          <div className="bg-white border border-black px-4 py-2 rounded-full text-[11px] font-bold">
            PROFIT ₦{stats?.profit?.toLocaleString() || 0}
          </div>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm font-semibold text-red-600">
          {error}
        </p>
      )}

      <StatsOverviewCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_0.9fr] gap-4 md:gap-6">
        <div className="bg-white border border-black rounded-[24px] p-6 md:p-8">
          <h3 className="font-black text-[11px] tracking-[0.15em]">
            LAST 7 DAYS • REVENUE
          </h3>
          <div className="mt-8 flex items-end gap-2 h-[140px]">
            {chart.length ? (
              chart.map((d, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div
                    className="w-full flex flex-col justify-end gap-1"
                    style={{ height: '120px' }}
                  >
                    <div
                      className="w-full bg-black/20 rounded-t-lg"
                      title={`${d.count} orders`}
                      style={{ height: `${Math.max(6, d.count * 12)}px` }}
                    ></div>
                    <div
                      className="w-full bg-black rounded-t-lg"
                      title={`₦${d.revenue || 0}`}
                      style={{
                        height: `${Math.max(4, (d.revenue || 0) / 500)}px`,
                      }}
                    ></div>
                  </div>
                  <span className="text-[9px] font-bold text-black/40">
                    {d._id?.slice(5)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-black/40 text-xs font-bold">No data yet</p>
            )}
          </div>
          <div className="mt-6 grid grid-cols-4 gap-3 text-[11px]">
            <div className="bg-[#F5F5F0] p-3 rounded-xl">
              <p className="text-black/40 font-bold">TOTAL</p>
              <p className="font-black text-[16px] mt-1">{stats?.total || 0}</p>
            </div>
            <div className="bg-[#F5F5F0] p-3 rounded-xl">
              <p className="text-black/40 font-bold">DELIVERED</p>
              <p className="font-black text-[16px] mt-1 text-green-600">
                {stats?.delivered || 0}
              </p>
            </div>
            <div className="bg-[#F5F5F0] p-3 rounded-xl">
              <p className="text-black/40 font-bold">PAYOUT</p>
              <p className="font-black text-[16px] mt-1">
                ₦{stats?.payout?.toLocaleString() || 0}
              </p>
            </div>
            <div className="bg-[#F5F5F0] p-3 rounded-xl">
              <p className="text-black/40 font-bold">DRIVERS</p>
              <p className="font-black text-[16px] mt-1">
                {stats?.totalDrivers || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-black rounded-[24px] p-6">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-[11px] tracking-[0.15em]">
                RECENT REQUESTS
              </h3>
              <Link
                to="/admin/requests"
                className="text-[10px] font-black tracking-widest underline flex items-center gap-1"
              >
                VIEW ALL <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="mt-6 space-y-3">
              {recent.length ? (
                recent.map((r) => (
                  <div
                    key={r._id}
                    className="bg-[#F5F5F0] border border-black/5 p-4 rounded-[16px]"
                  >
                    <p className="font-black text-[12px] tracking-widest truncate">
                      {r.trackingCode}
                    </p>
                    <p className="text-[11px] text-black/60 mt-0.5 truncate">
                      {r.pickupAddress} → {r.dropoffAddress}
                    </p>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-black/40 font-bold text-sm">
                  No pending requests
                </div>
              )}
            </div>
          </div>
          <div className="bg-black text-white rounded-[24px] p-6">
            <TrendingUp className="w-6 h-6 text-[#C8F135]" />
            <h4 className="font-black text-[14px] tracking-[0.1em] mt-4">
              DAILY OPS
            </h4>
            <div className="mt-6 space-y-4 text-[13px]">
              <div className="flex justify-between">
                <span className="text-white/50">In Transit</span>
                <span className="font-bold">{stats?.inTransit || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Out for delivery</span>
                <span className="font-bold">{stats?.outForDelivery || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Profit</span>
                <span className="font-bold text-[#C8F135]">
                  ₦{stats?.profit?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
