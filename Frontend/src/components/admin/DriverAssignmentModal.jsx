import { useState } from 'react';

export default function DriverAssignmentModal({
  order,
  drivers = [],
  onClose,
  onConfirm,
}) {
  const [driver, setDriver] = useState('');

  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/60 grid place-items-center z-50 p-4">
      <div className="bg-white border border-black rounded-[24px] p-6 w-full max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto">
        <h3 className="font-black tracking-widest text-sm">
          ASSIGN DRIVER TO {order.trackingId || order.trackingCode}
        </h3>
        <select
          value={driver}
          onChange={(event) => setDriver(event.target.value)}
          className="w-full mt-4 border border-black rounded-[12px] p-3 text-sm"
        >
          <option value="">Select driver</option>
          {drivers.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name} - {item.email}
            </option>
          ))}
        </select>
        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 border border-black rounded-full py-3 font-black text-xs"
          >
            CANCEL
          </button>
          <button
            disabled={!driver}
            onClick={() => onConfirm(driver)}
            className="flex-1 bg-black text-white rounded-full py-3 font-black text-xs disabled:opacity-40"
          >
            ASSIGN
          </button>
        </div>
      </div>
    </div>
  );
}
