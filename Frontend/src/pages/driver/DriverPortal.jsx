import { useState, useEffect } from 'react';
import { Truck, Wallet, Power } from 'lucide-react';
import DriverChangePasswordModal from '../../components/driver/DriverChangePasswordModal.jsx';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api.js';

export default function DriverPortal() {
  const { user: driver } = useAuth();
  const [online, setOnline] = useState(true);
  const [showModal, setShowModal] = useState(
    Boolean(driver?.mustChangePassword),
  );
  const [earnings, setEarnings] = useState({
    totalEarnings: 0,
    todayEarnings: 0,
    deliveredCount: 0,
    todayCount: 0,
    chart: [],
  });
  const [nextJob, setNextJob] = useState(null);
  const [greetingHour, setGreetingHour] = useState(() => new Date().getHours());
  const [locationError, setLocationError] = useState('');
  const [dashboardError, setDashboardError] = useState('');
  const geolocationUnsupported = !navigator.geolocation;
  const greeting =
    greetingHour < 12
      ? 'Good morning'
      : greetingHour < 17
        ? 'Good afternoon'
        : 'Good evening';

  useEffect(() => {
    const interval = setInterval(
      () => setGreetingHour(new Date().getHours()),
      60_000,
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [e, n] = await Promise.all([
          api.get('/driver/earnings'),
          api.get('/driver/next-job'),
        ]);
        setEarnings(e.data);
        setNextJob(n.data.job);
      } catch (error) {
        setDashboardError(
          error.response?.data?.message || 'Could not load driver overview',
        );
      }
    };
    fetchAll();

    let locationInterval;
    if (!online) {
      api
        .put('/driver/location', { isOnline: false })
        .catch(() => setLocationError('Could not update driver availability'));
    } else if (navigator.geolocation) {
      if (navigator.permissions)
        navigator.permissions
          .query({ name: 'geolocation' })
          .then((r) => {
            if (r.state === 'denied')
              setLocationError('Location blocked - enable in browser settings');
          })
          .catch(() =>
            setLocationError('Could not check location permission'),
          );
      const sendLocation = () => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setLocationError('');
            api
              .put('/driver/location', {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                lastLocationAt: new Date().toISOString(),
                isOnline: true,
              })
              .catch(() => setLocationError('Could not update driver location'));
          },
          (err) => {
            if (err.code === 1)
              setLocationError('Permission denied - tracking disabled');
            else setLocationError('Could not read location');
          },
          { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 },
        );
      };
      sendLocation();
      locationInterval = setInterval(sendLocation, 10000);
    }
    return () => clearInterval(locationInterval);
  }, [online]);

  return (
    <div className="p-6 lg:p-10 bg-[#FCFCF9] min-h-screen">
      <DriverChangePasswordModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div className="flex min-w-0 items-center gap-4">
          {driver?.avatarUrl ? (
            <img
              src={driver.avatarUrl}
              alt={`${driver.name} profile`}
              className="h-14 w-14 rounded-full border-2 border-black object-cover"
            />
          ) : (
            <div className="grid h-14 w-14 place-items-center rounded-full bg-black text-xl font-bold text-white">
              {driver?.name?.[0]?.toUpperCase() || 'D'}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-3xl font-black sm:text-4xl">
              {greeting}, {driver?.name || 'Driver'}
            </h1>
            <p className="mt-1 break-all text-sm text-black/50">
              {driver?.email}
            </p>
          </div>
        </div>
        <button
          onClick={() => setOnline(!online)}
          className={`flex gap-2 items-center px-5 py-3 rounded-full text-[11px] font-bold border ${online ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}
        >
          <Power className="w-4 h-4" />
          {online ? 'ONLINE' : 'OFFLINE'}
        </button>
      </div>

      {locationError && (
        <p className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700">
          {locationError}
        </p>
      )}
      {geolocationUnsupported && !locationError && (
        <p className="mt-4 rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-xs text-yellow-800">
          Geolocation is not supported in this browser.
        </p>
      )}
      {dashboardError && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700">
          {dashboardError}
        </p>
      )}

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="bg-black text-white rounded-[24px] p-6">
          <p className="text-white/50 text-[11px] font-bold tracking-widest">
            TOTAL EARNINGS
          </p>
          <p className="text-3xl font-black mt-3">
            ₦{earnings.totalEarnings?.toLocaleString() || 0}
          </p>
          <p className="text-white/50 text-xs mt-2">
            {earnings.deliveredCount || 0} deliveries • Today ₦
            {earnings.todayEarnings?.toLocaleString() || 0} (
            {earnings.todayCount || 0})
          </p>
          <div className="mt-4 flex gap-1 h-8 items-end">
            {earnings.chart?.map((c, i) => (
              <div
                key={i}
                className="flex-1 bg-[#C8F135] rounded-sm"
                style={{ height: `${Math.max(4, (c.earnings || 0) / 100)}px` }}
                title={`${c._id} ₦${c.earnings}`}
              ></div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-black/10 rounded-[24px] p-6 flex justify-between items-center">
          <div>
            <p className="text-black/40 text-[11px] font-bold">DELIVERED</p>
            <p className="text-3xl font-black mt-1">
              {earnings.deliveredCount || 0}
            </p>
          </div>
          <Truck className="w-8 h-8 opacity-20" />
        </div>
        <div className="bg-white border border-black/10 rounded-[24px] p-6 flex justify-between items-center">
          <div>
            <p className="text-black/40 text-[11px] font-bold">TODAY</p>
            <p className="text-3xl font-black mt-1">
              ₦{earnings.todayEarnings?.toLocaleString() || 0}
            </p>
          </div>
          <Wallet className="w-8 h-8 opacity-20" />
        </div>
      </div>

      <div className="mt-8 bg-white border border-black/10 rounded-[24px] p-8">
        <h3 className="font-bold">Next Job</h3>
        {nextJob ? (
          <div className="mt-4 bg-[#F5F5F0] p-5 rounded-xl flex justify-between items-center">
            <div>
              <p className="font-black tracking-widest">
                {nextJob.trackingId} • {nextJob.status.toUpperCase()} • ₦
                {nextJob.driverEarning || 0}
              </p>
              <p className="text-sm text-black/60 mt-1">
                {nextJob.pickupAddress} → {nextJob.deliveryAddress}
              </p>
            </div>
            <a
              href={`/driver/job/${nextJob._id}`}
              className="bg-black text-white px-5 py-3 rounded-xl text-[11px] font-bold"
            >
              VIEW JOB
            </a>
          </div>
        ) : (
          <p className="mt-4 text-black/40 font-bold text-sm">
            No active jobs.
          </p>
        )}
      </div>
    </div>
  );
}
