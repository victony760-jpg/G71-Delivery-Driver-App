export default function LiveDispatchTable({ orders = [], onAssign }) {
  if (!orders.length) {
    return (
      <div className="bg-white border border-black rounded-[24px] p-8 text-center font-bold text-black/50">
        No approved orders to dispatch
      </div>
    );
  }

  return (
    <div className="bg-white border border-black rounded-[24px] overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-[#FFD666] text-black text-[11px] tracking-widest">
          <tr>
            <th className="p-4 text-left">TRACKING</th>
            <th className="text-left">ROUTE</th>
            <th className="text-left">DRIVER DECLINE REASONS</th>
            <th className="text-left">DRIVER</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order._id || order.id}
              className="border-t border-black/10"
            >
              <td className="p-4 font-black">{order.trackingId}</td>
              <td className="p-4 text-xs">
                {order.pickupAddress} → {order.deliveryAddress}
              </td>
              <td className="p-4 text-xs">
                {order.declines?.length ? (
                  <ul className="space-y-2">
                    {order.declines.map((decline) => (
                      <li key={decline._id}>
                        <span className="font-bold">
                          {decline.driver?.name || 'Driver'}:
                        </span>{' '}
                        {decline.reason}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-black/40">None</span>
                )}
              </td>
              <td className="p-4">
                <button
                  onClick={() => onAssign(order)}
                  className="bg-black text-white rounded-full px-4 py-2 text-xs font-bold"
                >
                  ASSIGN DRIVER
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
