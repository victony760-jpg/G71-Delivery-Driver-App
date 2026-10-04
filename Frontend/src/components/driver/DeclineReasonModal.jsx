import { useState } from 'react';
import { X } from 'lucide-react';

export default function DeclineReasonModal({ job, open, onClose, onConfirm }) {
  const [reason, setReason] = useState('Too far');
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] p-6 w-full max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h3 className="font-black">Decline {job?.code}</h3>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-black/60 mt-2">
          Why decline? Admin will see.
        </p>
        <div className="mt-4 space-y-2">
          {[
            'Too far',
            'Vehicle issue',
            'Already booked',
            'Bad route',
            'Personal reason',
          ].map((r) => (
            <button
              key={r}
              onClick={() => setReason(r)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm border ${reason === r ? 'bg-black text-white border-black' : 'bg-[#F5F5F0] border-black/10'}`}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border py-3 rounded-xl text-[11px] font-bold"
          >
            CANCEL
          </button>
          <button
            onClick={() => {
              onConfirm(reason);
              onClose();
            }}
            className="flex-1 bg-red-600 text-white py-3 rounded-xl text-[11px] font-bold"
          >
            CONFIRM DECLINE
          </button>
        </div>
      </div>
    </div>
  );
}
