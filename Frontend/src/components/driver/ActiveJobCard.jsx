import { useState } from 'react';
import { MapPin, Navigation, ShieldCheck } from 'lucide-react';

export default function ActiveJobCard({
  order,
  onStatusChange,
  onGenerateOtp,
  onVerifyOtp,
}) {
  const [otp, setOtp] = useState('');
  const handleDeliver = () => {
    if (otp.length !== 6) {
      alert('Enter the 6-digit customer delivery OTP.');
      return;
    }
    onVerifyOtp(order._id, otp);
  };
  return (
    <div className="bg-white border border-black/10 rounded-[24px] p-6">
      <div className="flex justify-between">
        <span className="font-black tracking-widest">{order.code}</span>
        <span className="px-3 py-1 rounded-full bg-black text-white text-[10px] font-bold uppercase">
          {order.status}
        </span>
      </div>
      <div className="mt-2 text-[11px] bg-[#F5F5F0] inline-block px-3 py-1 rounded-full">
        Delivery is completed only after server-side OTP verification.
      </div>
      <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
        <div className="border rounded-xl p-4">
          <p className="text-[10px] font-bold flex gap-2">
            <MapPin className="w-4 h-4" /> PICKUP
          </p>
          <p className="font-semibold mt-1">{order.pickup}</p>
        </div>
        <div className="border rounded-xl p-4 bg-[#FFF8F8]">
          <p className="text-[10px] font-bold flex gap-2">
            <MapPin className="w-4 h-4 text-red-500" /> DROPOFF
          </p>
          <p className="font-semibold mt-1">{order.dropoff}</p>
          <p className="text-xs text-black/60">{order.receiver}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2 items-center">
        {order.status === 'picked_up' && (
          <button
            onClick={() => onStatusChange(order._id, 'in_transit')}
            className="bg-black text-white px-6 py-3 rounded-xl text-[11px] font-bold"
          >
            START DELIVERY
          </button>
        )}
        {order.status === 'in_transit' && (
          <button
            onClick={() => onStatusChange(order._id, 'out_for_delivery')}
            className="bg-black text-white px-6 py-3 rounded-xl text-[11px] font-bold flex gap-2"
          >
            <Navigation className="w-4 h-4" /> MARK OUT FOR DELIVERY
          </button>
        )}
        {order.status === 'out_for_delivery' && (
          <>
            <button
              onClick={() => onGenerateOtp(order._id)}
              className="bg-black text-white px-5 py-3 rounded-xl text-[11px] font-bold"
            >
              EMAIL OTP TO CUSTOMER
            </button>
            <div className="flex items-center gap-2 bg-[#F5F5F0] border px-4 py-3 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                inputMode="numeric"
                placeholder="6-DIGIT OTP"
                className="bg-transparent outline-none text-sm font-bold w-32"
              />
            </div>

            <button
              onClick={handleDeliver}
              className="bg-green-600 text-white px-6 py-3 rounded-xl text-[11px] font-bold"
            >
              ENTER CUSTOMER OTP
            </button>
          </>
        )}
        <button
          onClick={() =>
            window.open(
              `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.dropoff)}`,
              '_blank',
            )
          }
          className="border px-5 py-3 rounded-xl text-[11px] font-bold"
        >
          MAP
        </button>
      </div>
    </div>
  );
}
