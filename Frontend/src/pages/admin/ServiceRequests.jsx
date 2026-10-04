import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import api from '../../services/api.js';
import RequestApprovalTable from '../../components/admin/RequestApprovalTable.jsx';
import BackButton from '../../components/common/BackButton.jsx';

export default function ServiceRequests() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = async () => {
    try {
      const response = await api.get('/admin/requests');
      setData(response.data?.requests || []);
      setError('');
    } catch (loadError) {
      setError(loadError.response?.data?.message || 'Could not load requests.');
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const act = async (request, action) => {
    const id = request._id || request.id;
    try {
      const response = await api.put(`/admin/requests/${id}/${action}`);
      setError('');
      setNotice(response.data?.message || `Request ${action}d.`);
      await load();
    } catch (actionError) {
      setNotice('');
      setError(actionError.response?.data?.message || 'Could not update request.');
    }
  };

  const filtered = data.filter(
    (request) =>
      (filter === 'all' || request.status === filter) &&
      (request.trackingCode || '').toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="p-6 lg:p-10">
      <BackButton />
      <h1 className="text-4xl font-black">Service Requests</h1>
      <p className="text-sm text-black/50 mt-1">
        Guest requests • Admin approves • Generates tracking
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {['all', 'pending', 'approved', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase border ${filter === status ? 'bg-black text-white border-black' : 'bg-white border-black/10 text-black/60'}`}
          >
            {status}
          </button>
        ))}
        <div className="w-full sm:w-auto sm:ml-auto flex items-center gap-2 bg-white border px-4 py-2 rounded-full">
          <Search className="w-4 h-4 opacity-40" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="G71-xxxx"
            className="w-full sm:w-32 outline-none text-sm font-bold"
          />
        </div>
      </div>

      {error && <p role="alert" className="mt-4 text-sm font-semibold text-red-600">{error}</p>}
      {notice && <p role="status" className="mt-4 text-sm font-semibold text-green-700">{notice}</p>}

      <div className="mt-6">
        <RequestApprovalTable
          orders={filtered}
          onApprove={(request) => act(request, 'approve')}
          onReject={(request) => act(request, 'reject')}
        />
      </div>
    </div>
  );
}