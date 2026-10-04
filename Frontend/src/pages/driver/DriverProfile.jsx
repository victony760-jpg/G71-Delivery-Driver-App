import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import BackButton from '../../components/common/BackButton.jsx';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api.js';

export default function DriverProfile() {
  const location = useLocation();
  const { driverId } = useParams();
  const { user } = useAuth();
  const [adminProfile, setAdminProfile] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [performanceLoading, setPerformanceLoading] = useState(true);
  const [performanceError, setPerformanceError] = useState('');
  const [loading, setLoading] = useState(Boolean(driverId));
  const [error, setError] = useState('');
  const fallback = location.pathname.startsWith('/admin')
    ? '/admin/drivers'
    : '/driver';
  const profile = driverId ? adminProfile : user;

  useEffect(() => {
    if (!driverId) return undefined;
    let active = true;
    api
      .get(`/admin/drivers/${driverId}`)
      .then(({ data }) => {
        if (active) setAdminProfile(data.user);
      })
      .catch((loadError) => {
        if (active)
          setError(
            loadError.response?.data?.message ||
              'Could not load driver profile.',
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [driverId]);

  useEffect(() => {
    let active = true;
    const loadPerformance = async () => {
      setPerformanceLoading(true);
      setPerformanceError('');
      try {
        if (driverId) {
          const { data } = await api.get('/admin/driver-performance');
          const driverPerformance = data.performance?.find(
            (item) => item._id === driverId,
          );
          if (!driverPerformance)
            throw new Error('Driver performance data was not returned.');
          if (active) setPerformance(driverPerformance);
        } else if (user?._id) {
          const { data } = await api.get('/driver/earnings');
          if (active) setPerformance(data);
        }
      } catch (loadError) {
        if (active)
          setPerformanceError(
            loadError.response?.data?.message ||
              loadError.message ||
              'Could not load driver performance.',
          );
      } finally {
        if (active) setPerformanceLoading(false);
      }
    };

    loadPerformance();
    return () => {
      active = false;
    };
  }, [driverId, user?._id]);

  if (loading)
    return (
      <div className="p-6" role="status">
        Loading driver profile...
      </div>
    );
  if (error || !profile)
    return (
      <div className="p-6" role="alert">
        {error || 'Driver profile not found.'}
      </div>
    );

  return (
    <div className="p-6 lg:p-10 bg-[#FCFCF9] min-h-screen">
      <BackButton fallback={fallback} />
      <h1 className="text-4xl font-black mt-3">Driver Profile</h1>
      <div className="mt-8 grid lg:grid-cols-[0.8fr_1.2fr] gap-6">
        <div className="bg-white border border-black/10 rounded-[24px] p-8 text-center">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={`${profile.name || 'Driver'} profile`}
              className="mx-auto h-20 w-20 rounded-full border-2 border-black object-cover"
            />
          ) : (
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-black text-2xl font-black text-white">
              {profile.name?.[0]?.toUpperCase() || 'D'}
            </div>
          )}
          <p className="mt-4 text-xl font-bold">{profile.name}</p>
          <p className="text-sm text-black/50">{profile.email}</p>
          <div className="mt-6 space-y-2 text-sm text-left">
            <div className="flex justify-between bg-[#F5F5F0] p-3 rounded-xl">
              <span>Phone</span>
              <span className="font-bold">
                {profile.phone || 'Not provided'}
              </span>
            </div>
            <div className="flex justify-between bg-[#F5F5F0] p-3 rounded-xl">
              <span>City</span>
              <span className="font-bold">
                {profile.city || 'Not provided'}
              </span>
            </div>
            <div className="flex justify-between bg-[#F5F5F0] p-3 rounded-xl">
              <span>Account</span>
              <span className="font-bold">
                {profile.isActive === false ? 'Inactive' : 'Active'}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white border border-black/10 rounded-[24px] p-8">
          <h3 className="font-bold">Performance Summary</h3>
          {performanceLoading ? (
            <p className="mt-4 text-sm text-black/50" role="status">
              Loading performance...
            </p>
          ) : performanceError ? (
            <p className="mt-4 text-sm font-semibold text-red-600" role="alert">
              {performanceError}
            </p>
          ) : (
            <>
              <p className="text-sm text-black/50 mt-2">
                Earnings include completed deliveries only; they are not a
                record of payouts.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="bg-black text-white p-4 rounded-xl">
                  <p className="text-[11px] opacity-60">EARNED</p>
                  <p className="font-black text-xl mt-1">
                    ₦
                    {(
                      performance?.totalEarnings || 0
                    ).toLocaleString()}
                  </p>
                </div>
                <div className="bg-[#F5F5F0] p-4 rounded-xl">
                  <p className="text-[11px] opacity-60">DELIVERED</p>
                  <p className="font-black text-xl mt-1">
                    {performance?.deliveredCount ?? performance?.delivered ?? 0}
                  </p>
                </div>
                <div className="bg-[#F5F5F0] p-4 rounded-xl">
                  <p className="text-[11px] opacity-60">ON-TIME</p>
                  <p className="font-black text-xl mt-1">
                    {performance?.onTimeRate == null
                      ? 'Not tracked'
                      : `${performance.onTimeRate}%`}
                  </p>
                  {performance?.onTimeEligibleCount > 0 && (
                    <p className="mt-1 text-xs text-black/50">
                      {performance.onTimeEligibleCount} with an estimated time
                    </p>
                  )}
                </div>
                <div className="bg-[#F5F5F0] p-4 rounded-xl">
                  <p className="text-[11px] opacity-60">CANCELLED</p>
                  <p className="font-black text-xl mt-1">
                    {performance?.cancelledCount ?? performance?.cancelled ?? 0}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
