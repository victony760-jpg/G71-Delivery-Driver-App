import { Check, X } from 'lucide-react';

export default function RequestApprovalTable({
  orders = [],
  onApprove,
  onReject,
}) {
  if (!orders.length) {
    return (
      <div className="bg-white border border-black rounded-[24px] p-8 text-center font-bold text-black/50">
        No pending requests
      </div>
    );
  }

  return (
    <div className="bg-white border border-black rounded-[24px] overflow-x-auto">
      <table className="w-full min-w-[700px] text-sm">
        <thead className="bg-black text-white text-[11px] tracking-widest">
          <tr>
            <th className="p-4 text-left">TRACKING</th>
            <th className="text-left">ROUTE</th>
            <th className="text-left">CUSTOMER</th>
            <th className="text-left">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order._id || order.id}
              className="border-t border-black/10"
            >
              <td className="p-4 font-black">{order.trackingCode}</td>
              <td className="p-4">
                {order.pickup} → {order.dropoff}
              </td>
              <td className="p-4">
                {order.senderEmail || order.email || order.senderName}
              </td>
              <td className="p-4">
                {order.status === 'pending' ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onApprove(order)}
                      className="bg-black text-white px-4 py-2 rounded-full text-xs font-black flex gap-1"
                    >
                      <Check className="w-4 h-4" /> APPROVE
                    </button>
                    <button
                      onClick={() => onReject(order)}
                      className="border border-black px-4 py-2 rounded-full text-xs font-black flex gap-1"
                    >
                      <X className="w-4 h-4" /> REJECT
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-bold uppercase text-black/50">
                    {order.status}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
