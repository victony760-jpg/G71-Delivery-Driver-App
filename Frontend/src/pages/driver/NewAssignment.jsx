import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import AssignmentCard from '../../components/driver/AssignmentCard.jsx';
import DeclineReasonModal from '../../components/driver/DeclineReasonModal.jsx';

export default function NewAssignment() {
  const [requests, setRequests] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const response = await api.get('/driver/jobs');
      setRequests(
        (response.data?.shipments || []).filter(
          (shipment) => shipment.status === 'pending',
        ),
      );
      setError('');
    } catch (loadError) {
      setError(loadError.response?.data?.message || 'Could not load assignments.');
    }
  };

  useEffect(() => {
    // Load assignments when the driver view opens.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const act = async (request, action, reason) => {
    try {
      await api.put(
        `/driver/jobs/${request._id}/${action}`,
        action === 'decline' ? { reason } : {},
      );
      setSelectedJob(null);
      await load();
    } catch (actionError) {
      setError(actionError.response?.data?.message || 'Could not update assignment.');
    }
  };

  const jobs = requests.map((request) => ({
    ...request,
    code: request.trackingId,
    pickup: request.pickupAddress,
    dropoff: request.deliveryAddress,
    packageType: request.packageDescription,
  }));

  return (
    <div className="p-6 lg:p-10 bg-[#FCFCF9] min-h-screen">
      <p className="text-[11px] font-bold tracking-[0.3em] text-red-600">
        NEW JOBS • ACCEPT OR DECLINE
      </p>
      <h1 className="text-4xl font-black mt-2">New Assignments</h1>
      <p className="text-sm text-black/50 mt-2">
        Approved jobs from admin. The driver requests an OTP email after marking
        the package out for delivery, then verifies it face-to-face.
      </p>
      {error && <p role="alert" className="mt-4 text-sm font-semibold text-red-600">{error}</p>}

      <div className="mt-8 grid gap-6">
        {jobs.map((job) => (
          <AssignmentCard
            key={job._id}
            job={job}
            onAccept={() => act(job, 'accept')}
            onDecline={setSelectedJob}
          />
        ))}
        {jobs.length === 0 && (
          <div className="py-20 text-center bg-white border border-dashed rounded-[24px] text-sm text-black/40">
            No new assignments — waiting for admin.
          </div>
        )}
      </div>

      <DeclineReasonModal
        job={selectedJob}
        open={Boolean(selectedJob)}
        onClose={() => setSelectedJob(null)}
        onConfirm={(reason) => act(selectedJob, 'decline', reason)}
      />
    </div>
  );
}
