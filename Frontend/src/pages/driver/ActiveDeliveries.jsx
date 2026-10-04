import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import ActiveJobCard from '../../components/driver/ActiveJobCard.jsx';

export default function ActiveDeliveries() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = async () => {
    try {
      const response = await api.get('/driver/jobs');
      setOrders(
        (response.data?.shipments || []).filter((shipment) =>
          ['picked_up', 'in_transit', 'out_for_delivery'].includes(
            shipment.status,
          ),
        ),
      );
      setError('');
    } catch (loadError) {
      setError(loadError.response?.data?.message || 'Could not load deliveries.');
    }
  };

  useEffect(() => {
    // Load accepted deliveries when the driver view opens.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/shipments/${id}/status`, { status });
      await load();
    } catch (statusError) {
      setError(statusError.response?.data?.message || 'Could not update delivery status.');
    }
  };

  const generateOtp = async (id) => {
    try {
      const { data } = await api.post(`/shipments/${id}/generate-otp`);
      setError('');
      setNotice(data.message || 'Delivery OTP generated and emailed to the customer.');
    } catch (otpError) {
      setNotice('');
      setError(otpError.response?.data?.message || 'Could not generate OTP.');
    }
  };
  const verifyOtp = async (id, otp) => {
    try {
      const response = await api.post(`/shipments/${id}/verify-otp`, { otp });
      alert(response.data.message);
      await load();
    } catch (otpError) {
      setError(otpError.response?.data?.message || 'OTP verification failed.');
    }
  };

  return (
    <div className="p-6 lg:p-10 bg-[#FCFCF9] min-h-screen">
      <h1 className="text-4xl font-black">Active Deliveries</h1>
      <p className="text-sm text-black/50 mt-1">
        Mark pickup, start delivery, navigate, then verify the guest OTP
        face-to-face.
      </p>
      {error && <p role="alert" className="mt-4 text-sm font-semibold text-red-600">{error}</p>}
      {notice && <p role="status" className="mt-4 text-sm font-semibold text-green-700">{notice}</p>}
      <div className="mt-8 grid gap-6">
        {orders.map((order) => (
          <ActiveJobCard
            key={order._id}
            order={{
              ...order,
              code: order.trackingId,
              pickup: order.pickupAddress,
              dropoff: order.deliveryAddress,
              receiver: order.receiverName,
            }}
            onStatusChange={updateStatus}
            onGenerateOtp={generateOtp}
            onVerifyOtp={verifyOtp}
          />
        ))}
        {orders.length === 0 && (
          <div className="py-20 text-center bg-white border border-dashed rounded-[24px] text-sm text-black/40">
            No accepted deliveries are active.
          </div>
        )}
      </div>
    </div>
  );
}
