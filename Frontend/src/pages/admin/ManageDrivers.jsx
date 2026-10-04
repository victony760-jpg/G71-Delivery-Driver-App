import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import CreateDriverForm from '../../components/admin/CreateDriverForm.jsx';
import BackButton from '../../components/common/BackButton.jsx';

export default function ManageDrivers() {
  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/admin/role/driver')
      .then((response) => setDrivers(response.data?.users || []))
      .catch((loadError) => {
        setError(loadError.response?.data?.message || 'Could not load drivers.');
      });
  }, []);

  return (
    <div className="p-6 lg:p-10">
      <BackButton />
      <h1 className="text-4xl font-black">Manage Drivers</h1>
      <div className="mt-8 max-w-xl">
        <CreateDriverForm
          onCreated={(driver) =>
            setDrivers((current) => [driver, ...current.filter((item) => item._id !== driver._id)])
          }
        />
      </div>
      {error && <p role="alert" className="mt-6 text-sm font-semibold text-red-600">{error}</p>}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        {drivers.map((driver) => (
          <div
            key={driver._id}
            className="bg-white border border-black/10 rounded-[24px] p-6"
          >
            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-black">
              {driver.name?.[0] || '?'}
            </div>
            <p className="font-bold mt-4">{driver.name}</p>
            <p className="text-xs text-black/50 mt-1">
              {driver.email} • {driver.isActive === false ? 'Disabled' : 'Active'}
            </p>
            <Link
              to={`/admin/drivers/${driver._id}`}
              className="mt-4 block w-full bg-[#F5F5F0] py-2 rounded-xl text-[11px] font-bold text-center"
            >
              VIEW PROFILE
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
