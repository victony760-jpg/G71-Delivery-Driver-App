import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const loadJob = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/shipments/${id}`);
        if (active) setJob(res.data.shipment);
      } catch (loadError) {
        if (active)
          setError(
            loadError.response?.data?.message || 'Could not load this job.',
          );
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadJob();

    const watchId = navigator.geolocation?.watchPosition(
      (position) => {
        api
          .put('/driver/location', {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          .catch(() => { });
      },
      () => { },
      { enableHighAccuracy: true },
    );

    return () => {
      active = false;
      if (watchId !== undefined) navigator.geolocation.clearWatch(watchId);
    };
  }, [id]);

  const updateStatus = async (newStatus) => {
    setLoading(true);
    try {
      const res = await api.put(`/driver/job/${id}/status`, { status: newStatus });
      setJob(res.data.shipment);
      alert(`Status → ${newStatus}`);
    } catch (error) {
      alert(error.response?.data?.message || 'Could not update job status');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) return alert('Enter 6-digit OTP');
    setLoading(true);
    try {
      const res = await api.post(`/driver/job/${id}/verify-otp`, { otp });
      alert('✅ Delivered successfully!');
      setJob(res.data.shipment);
      navigate('/driver/history');
    } catch (error) {
      alert(error.response?.data?.message || 'Wrong OTP');
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async () => {
    setLoading(true);
    try {
      const response = await api.post(`/shipments/${id}/generate-otp`);
      alert(response.data.message || 'OTP emailed to customer.');
    } catch (sendError) {
      alert(sendError.response?.data?.message || 'Could not email OTP.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !job) return <div className="p-6">Loading job...</div>;
  if (error || !job)
    return (
      <div className="p-6" role="alert">
        {error || 'Job not found.'}
      </div>
    );

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Job #{job.trackingId}</h2>

      <div className="bg-white p-4 rounded shadow">
        <p><b>From:</b> {job.pickupAddress}</p>
        <p><b>To:</b> {job.deliveryAddress}</p>
        <p><b>Receiver:</b> {job.receiverName} - {job.receiverPhone}</p>
        <p><b>Package:</b> {job.packageDescription}</p>
        <p><b>Status:</b> <span className="font-bold text-blue-600">{job.status}</span></p>
      </div>

      {/* Status Buttons */}
      <div className="flex gap-2">
        {job.status === 'pending' && (
          <button onClick={() => updateStatus('picked_up')} className="bg-yellow-500 text-white px-4 py-2 rounded">Mark Picked Up</button>
        )}
        {job.status === 'picked_up' && (
          <button onClick={() => updateStatus('in_transit')} className="bg-blue-500 text-white px-4 py-2 rounded">Start Transit</button>
        )}
        {job.status === 'in_transit' && (
          <button onClick={() => updateStatus('out_for_delivery')} className="bg-purple-500 text-white px-4 py-2 rounded">Out for Delivery</button>
        )}
      </div>

      {/* OTP Section - Only when out_for_delivery */}
      {job.status === 'out_for_delivery' && (
        <div className="bg-green-50 p-4 rounded border-2 border-green-500">
          <h3 className="font-bold text-lg mb-2">Verify Delivery OTP</h3>
          <p className="text-sm mb-3">Email a 6-digit code to the customer, then verify it face-to-face.</p>
          <button
            onClick={sendOtp}
            disabled={loading}
            className="mb-3 bg-black text-white px-4 py-2 rounded font-bold disabled:opacity-50"
          >
            Email OTP to customer
          </button>
          <div className="flex gap-2">
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              inputMode="numeric"
              placeholder="000000"
              className="border p-3 text-2xl tracking-[0.5em] w-32 text-center"
            />
            <button
              onClick={verifyOtp}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded font-bold"
            >
              {loading ? '...' : 'Verify & Deliver'}
            </button>
          </div>
        </div>
      )}

      {job.status === 'delivered' && (
        <div className="bg-green-600 text-white p-4 rounded text-center font-bold">
          ✅ This package is delivered
        </div>
      )}

      {/* History */}
      <div className="bg-gray-50 p-3 rounded">
        <h4 className="font-bold">History</h4>
        {job.history?.map((h, i) => (
          <div key={h._id || `${h.status}-${i}`} className="text-sm border-b py-1">
            {h.status} - {new Date(h.createdAt || h.timestamp).toLocaleString()}
          </div>
        ))}
      </div>
    </div>
  );
}