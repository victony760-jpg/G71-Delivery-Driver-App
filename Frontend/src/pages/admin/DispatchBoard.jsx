import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import LiveDispatchTable from '../../components/admin/LiveDispatchTable.jsx';
import DriverAssignmentModal from '../../components/admin/DriverAssignmentModal.jsx';
import BackButton from '../../components/common/BackButton.jsx';

export default function DispatchBoard() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [shipmentResponse, driverResponse] = await Promise.all([
        api.get('/shipments'),
        api.get('/admin/role/driver'),
      ]);
      setOrders(
        (shipmentResponse.data?.shipments || []).filter(
          (shipment) => shipment.status === 'pending' && !shipment.driver,
        ),
      );
      setDrivers(driverResponse.data?.users || []);
      setError('');
    } catch (loadError) {
      setError(loadError.response?.data?.message || 'Could not load dispatch data.');
    }
  };

  useEffect(() => {
    // Load the current dispatch queue when the board opens.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const assignDriver = async (order, driverId) => {
    if (!driverId) return;
    try {
      await api.put(`/shipments/${order._id}/assign`, { driverId });
      setSelectedOrder(null);
      await load();
    } catch (assignError) {
      setError(assignError.response?.data?.message || 'Could not assign driver.');
    }
  };

  return (
    <div className="p-6 lg:p-10">
      <BackButton />
      <h1 className="text-4xl font-black">Dispatch Board</h1>
      <p className="text-sm text-black/50 mt-1">
        Assign unassigned shipments to drivers.
      </p>
      {error && <p role="alert" className="mt-4 text-sm font-semibold text-red-600">{error}</p>}
      <div className="mt-8">
        <LiveDispatchTable orders={orders} onAssign={setSelectedOrder} />
      </div>
      <DriverAssignmentModal
        order={selectedOrder}
        drivers={drivers.filter((driver) => driver.isActive !== false)}
        onClose={() => setSelectedOrder(null)}
        onConfirm={(driverEmail) => assignDriver(selectedOrder, driverEmail)}
      />
    </div>
  );
}
