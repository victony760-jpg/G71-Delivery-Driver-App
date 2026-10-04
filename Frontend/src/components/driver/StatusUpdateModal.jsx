import { useState } from 'react';
import { X, ShieldCheck } from 'lucide-react';

export default function StatusUpdateModal({ order, open, onClose, onUpdate }) {
  const [otp, setOtp] = useState('');
  if (!open || !order) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] p-6 w-full max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto">
        <div className="flex justify-between">
          <h3 className="font-black">Complete Delivery {order.code}</h3>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-4 bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
          <p className="text-[11px] font-bold flex gap-2">
            <ShieldCheck className="w-4 h-4" /> OTP FACE-TO-FACE FLOW
          </p>
          <p className="text-xs text-black/60 mt-2">
            Receiver email: {order.receiverEmail}
            <br />
            OTP: {order.otp} (sent with tracking ID)
            <br />
            You must ask face-to-face. Do not enter on website.
          </p>
        </div>
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder={`Ask receiver OTP (${order.otp})`}
          className="mt-4 w-full border border-black/10 bg-[#F5F5F0] px-4 py-3 rounded-xl text-sm font-bold outline-none"
        />
        <p className="text-[11px] text-black/40 mt-2">Defence fallback: 1234</p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border py-3 rounded-xl text-[11px] font-bold"
          >
            CANCEL
          </button>
          <button
            onClick={() => {
              if (otp === order.otp || otp === '1234') {
                onUpdate(order._id, 'delivered');
                onClose();
              } else alert('Wrong OTP');
            }}
            className="flex-1 bg-green-600 text-white py-3 rounded-xl text-[11px] font-bold"
          >
            VERIFY & MARK DELIVERED
          </button>
        </div>
      </div>
    </div>
  );
}
