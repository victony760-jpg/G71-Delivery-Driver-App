import { MapPin, Package, Clock, Check, X } from 'lucide-react';

export default function AssignmentCard({ job, onAccept, onDecline }) {
  return (
    <div className="bg-white border border-black/10 rounded-[24px] p-6">
      <div className="flex justify-between">
        <div>
          <p className="font-black tracking-widest text-lg">{job.code}</p>
          <p className="text-[11px] text-black/40 font-bold flex gap-1 mt-1">
            <Clock className="w-3 h-3" /> {job.timeAgo} • {job.distance}
          </p>
        </div>
        <span className="bg-black text-white px-4 py-2 rounded-full text-xs font-black">
          {job.price}
        </span>
      </div>
      <div className="mt-5 grid md:grid-cols-2 gap-4">
        <div className="bg-[#FCFCF9] border rounded-xl p-4">
          <p className="text-[10px] font-bold tracking-widest flex gap-2">
            <MapPin className="w-4 h-4" /> PICKUP
          </p>
          <p className="font-bold text-sm mt-2">{job.pickup}</p>
        </div>
        <div className="bg-[#FFF8F8] border border-red-100 rounded-xl p-4">
          <p className="text-[10px] font-bold tracking-widest flex gap-2">
            <MapPin className="w-4 h-4 text-red-500" /> DROPOFF
          </p>
          <p className="font-bold text-sm mt-2">{job.dropoff}</p>
          <p className="text-xs text-black/60 mt-1 flex gap-1">
            <Package className="w-3 h-3" /> {job.packageType}
          </p>
        </div>
      </div>
      <div className="mt-3 text-[11px] bg-yellow-50 border border-yellow-200 px-3 py-2 rounded-xl">
        The OTP is not sent at assignment. Email it to the customer once the
        delivery is out for delivery, then ask for it face-to-face.
      </div>
      <div className="mt-5 flex gap-3">
        <button
          onClick={() => onAccept(job._id)}
          className="flex-1 bg-black text-white py-4 rounded-xl text-[11px] font-bold tracking-widest flex justify-center gap-2"
        >
          <Check className="w-4 h-4" /> ACCEPT
        </button>
        <button
          onClick={() => onDecline(job)}
          className="flex-1 border border-black/10 py-4 rounded-xl text-[11px] font-bold tracking-widest flex justify-center gap-2 text-red-600"
        >
          <X className="w-4 h-4" /> DECLINE
        </button>
      </div>
    </div>
  );
}
