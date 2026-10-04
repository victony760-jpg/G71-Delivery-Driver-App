import { useEffect, useState } from 'react';
import BackButton from '../../components/common/BackButton.jsx';
import api from '../../services/api.js';

const formatDuration = (minutes) => {
  if (minutes === null || minutes === undefined) return '—';
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  return remainingMinutes
    ? `${hours} hr ${remainingMinutes} min`
    : `${hours} hr`;
};

export default function DriverPerformance() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    api
      .get('/admin/driver-performance', { signal: controller.signal })
      .then(({ data }) => setDrivers(data.performance || []))
      .catch((requestError) => {
        if (!controller.signal.aborted)
          setError(
            requestError.response?.data?.message ||
              'Could not load driver performance.',
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return (
    <div className="max-w-[1200px] space-y-6">
      <BackButton />
      <div>
        <h1 className="text-[28px] font-black tracking-tight md:text-4xl">
          Driver Performance
        </h1>
        <p className="mt-2 text-sm text-black/55">
          Metrics are calculated from each driver’s assigned shipment history.
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}
      {loading ? (
        <p className="text-sm font-semibold text-black/50">
          Loading driver performance…
        </p>
      ) : drivers.length ? (
        <>
          <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-[#F5F5F0] text-[11px] uppercase tracking-wider text-black/55">
                <tr>
                  <th className="px-5 py-4">Driver</th>
                  <th className="px-5 py-4">Delivered</th>
                  <th className="px-5 py-4">Avg. delivery time</th>
                  <th className="px-5 py-4">Cancelled</th>
                  <th className="px-5 py-4">On time</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver) => (
                  <tr key={driver._id} className="border-t border-black/5">
                    <td className="px-5 py-4">
                      <p className="font-bold">{driver.name}</p>
                      <p className="mt-1 text-xs text-black/50">
                        {driver.email}
                        {!driver.isActive && ' • Inactive'}
                      </p>
                    </td>
                    <td className="px-5 py-4 font-bold">{driver.delivered}</td>
                    <td className="px-5 py-4">
                      {formatDuration(driver.averageDeliveryMinutes)}
                    </td>
                    <td className="px-5 py-4">
                      {driver.cancelled}{' '}
                      <span className="text-xs text-black/50">
                        ({driver.cancellationRate}%)
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {driver.onTimeRate === null
                        ? 'Not tracked'
                        : `${driver.onTimeRate}%`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-black/50">
            Average delivery time is measured from shipment creation to OTP
            delivery completion. On-time rate is shown only for delivered
            shipments with an estimated delivery time.
          </p>
        </>
      ) : (
        <div className="rounded-2xl border border-black/10 bg-white p-8 text-sm font-semibold text-black/50">
          No drivers are available to report yet.
        </div>
      )}
    </div>
  );
}
