import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminLiveMap() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const fetchDrivers = () => {
      api
        .get('/admin/live-drivers')
        .then((res) => {
          if (active) {
            setDrivers(res.data.drivers || []);
            setError('');
          }
        })
        .catch((loadError) => {
          if (active)
            setError(
              loadError.response?.data?.message ||
              'Could not load live driver locations.',
            );
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    };

    fetchDrivers();
    const interval = setInterval(fetchDrivers, 5000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) return <div className="p-6">Loading live drivers...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Live Drivers ({drivers.length})</h2>
        <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full animate-pulse">Live • 5s refresh</span>
      </div>

      {error && <p role="alert" className="mb-4 text-sm text-red-700">{error}</p>}

      {drivers.length === 0 && (
        <div className="bg-yellow-50 p-6 text-center rounded">No drivers online right now</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drivers.map((d) => (
          <div key={d._id} className="bg-white p-4 rounded shadow border-l-4 border-green-500">
            <div className="flex justify-between">
              <h3 className="font-bold">{d.name}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${d.isOnline ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                {d.isOnline ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
            <p className="text-sm text-gray-600">{d.email}</p>
            <p className="text-sm text-gray-600">{d.phone}</p>

            <div className="mt-3 bg-gray-50 p-2 rounded text-sm">
              <p><b>Lat:</b> {d.lastLocation?.lat || 'No location yet'}</p>
              <p><b>Lng:</b> {d.lastLocation?.lng || 'No location yet'}</p>
              <p className="text-xs text-gray-500">
                Last update: {d.lastLocation?.updatedAt ? new Date(d.lastLocation.updatedAt).toLocaleTimeString() : 'Never'}
              </p>
            </div>

            {d.activeJob ? (
              <div className="mt-3 bg-blue-50 p-2 rounded border border-blue-200">
                <p className="text-sm font-bold text-blue-700">📦 Active Job</p>
                <p className="text-xs">{d.activeJob.trackingId}</p>
                <p className="text-xs">{d.activeJob.deliveryAddress}</p>
                <p className="text-xs font-semibold">Status: {d.activeJob.status}</p>
              </div>
            ) : (
              <div className="mt-3 text-xs text-gray-400">No active job — Idle</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}