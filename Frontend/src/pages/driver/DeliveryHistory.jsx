import { useEffect, useState } from 'react';
import api from '../../services/api.js';

export default function DeliveryHistory() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api
      .get('/driver/history')
      .then(({ data }) => {
        if (active) setShipments(data.shipments || []);
      })
      .catch((loadError) => {
        if (active)
          setError(
            loadError.response?.data?.message ||
            'Could not load delivery history.',
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="p-6 lg:p-10 bg-[#FCFCF9] min-h-screen">
      <h1 className="text-4xl font-black">Delivery History</h1>
      {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
      <div className="mt-8 bg-white border border-black/10 rounded-[24px] overflow-x-auto">
        <div className="min-w-[640px]">
          <div className="grid grid-cols-4 bg-[#F5F5F0] p-4 text-[11px] font-bold uppercase tracking-widest text-black/40">
            <span>Code</span>
            <span>Route</span>
            <span>Date</span>
            <span>Status</span>
          </div>
          {loading ? (
            <p className="p-4 text-sm text-black/50">Loading history...</p>
          ) : shipments.length === 0 ? (
            <p className="p-4 text-sm text-black/50">No completed deliveries yet.</p>
          ) : shipments.map((shipment) => (
            <div
              key={shipment._id}
              className="grid grid-cols-4 p-4 border-t text-sm items-center"
            >
              <span className="font-black tracking-widest">{shipment.trackingId}</span>
              <span className="text-black/60">{shipment.pickupAddress} → {shipment.deliveryAddress}</span>
              <span className="text-black/50">{shipment.updatedAt ? new Date(shipment.updatedAt).toLocaleDateString() : '—'}</span>
              <span className="text-[11px] font-bold uppercase bg-green-100 text-green-700 px-2 py-1 rounded-full w-fit">
                {shipment.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
