import { useEffect, useState } from 'react';
import { Check, RefreshCw, X } from 'lucide-react';
import api from '../../services/api.js';
import BackButton from '../../components/common/BackButton.jsx';

const filters = ['pending', 'accepted', 'rejected', 'all'];

export default function DriverApplications() {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/admin/driver-applications');
      setApplications(data.applications || []);
    } catch (loadError) {
      setError(
        loadError.response?.data?.message ||
        'Could not load driver applications.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    api
      .get('/admin/driver-applications')
      .then(({ data }) => {
        if (active) setApplications(data.applications || []);
      })
      .catch((loadError) => {
        if (active) {
          setError(
            loadError.response?.data?.message ||
            'Could not load driver applications.',
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const decideApplication = async (application, decision) => {
    const action = decision === 'accept' ? 'approve' : 'decline';
    if (
      !window.confirm(
        `${action === 'approve' ? 'Approve' : 'Decline'} ${application.name}'s application?`,
      )
    )
      return;

    setBusyId(application._id);
    setError('');
    setNotice('');
    try {
      const { data } = await api.post(
        `/driver/applications/${application._id}/${decision}`,
      );
      setApplications((current) =>
        current.map((item) =>
          item._id === application._id
            ? { ...item, status: decision === 'accept' ? 'accepted' : 'rejected' }
            : item,
        ),
      );
      setNotice(
        data.temporaryPassword
          ? `${data.message} Temporary password: ${data.temporaryPassword}`
          : data.message ||
          (decision === 'accept'
            ? 'Application approved.'
            : 'Application declined.'),
      );
    } catch (decisionError) {
      setError(
        decisionError.response?.data?.message ||
        'Could not update this application.',
      );
    } finally {
      setBusyId('');
    }
  };

  const visibleApplications = applications.filter(
    (application) => filter === 'all' || application.status === filter,
  );

  return (
    <div className="p-6 lg:p-10">
      <BackButton />
      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-black/45">
            RECRUITMENT
          </p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            Driver applications
          </h1>
        </div>
        <button
          type="button"
          onClick={loadApplications}
          disabled={loading}
          title="Refresh applications"
          aria-label="Refresh applications"
          className="grid h-10 w-10 place-items-center rounded-lg border border-black/15 bg-white disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="mt-7 flex flex-wrap gap-2" role="tablist" aria-label="Filter applications">
        {filters.map((status) => {
          const count =
            status === 'all'
              ? applications.length
              : applications.filter((item) => item.status === status).length;
          return (
            <button
              key={status}
              type="button"
              role="tab"
              aria-selected={filter === status}
              onClick={() => setFilter(status)}
              className={`rounded-lg border px-3 py-2 text-xs font-bold capitalize ${filter === status ? 'border-black bg-black text-white' : 'border-black/15 bg-white text-black/65'}`}
            >
              {status} <span className="ml-1 opacity-65">{count}</span>
            </button>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="mt-5 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="mt-5 text-sm font-semibold text-green-700">
          {notice}
        </p>
      )}

      {loading ? (
        <p className="mt-8 text-sm text-black/55">Loading applications...</p>
      ) : visibleApplications.length === 0 ? (
        <p className="mt-8 border-t border-black/10 py-8 text-sm text-black/55">
          No {filter === 'all' ? '' : `${filter} `}applications found.
        </p>
      ) : (
        <div className="mt-6 divide-y divide-black/10 border-y border-black/10">
          {visibleApplications.map((application) => (
            <article
              key={application._id}
              className="grid gap-5 py-6 lg:grid-cols-[auto_1fr_auto] lg:items-center"
            >
              <div>
                {application.avatarUrl ? (
                  <img
                    src={application.avatarUrl}
                    alt={`${application.name} passport photo`}
                    className="h-16 w-16 rounded-full border-2 border-black object-cover"
                  />
                ) : (
                  <div
                    aria-label={`${application.name} initials`}
                    className="grid h-16 w-16 place-items-center rounded-full bg-black text-xl font-bold text-white"
                  >
                    {application.name?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-bold">{application.name}</h2>
                  <span className="rounded-md bg-black/5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-black/60">
                    {application.status}
                  </span>
                </div>
                <div className="mt-3 grid gap-x-8 gap-y-1 text-sm text-black/65 sm:grid-cols-2">
                  <p className="break-all">{application.email}</p>
                  <p>{application.phone}</p>
                  <p>City: {application.city || 'Not provided'}</p>
                  <p>Bike: {application.bikeStatus || 'Not provided'}</p>
                  <p>Experience: {application.experience || 'Not provided'}</p>
                  <p>
                    Applied:{' '}
                    {application.createdAt
                      ? new Date(application.createdAt).toLocaleDateString()
                      : 'Date unavailable'}
                  </p>
                </div>
                {application.documents?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-bold text-black/70">
                      Supporting documents
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {application.documents.map((document) => (
                        <a
                          key={document.field}
                          href={document.downloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-md border border-black/15 bg-white px-3 py-2 text-xs font-semibold text-black underline underline-offset-2"
                        >
                          {document.field === 'nin'
                            ? 'NIN'
                            : document.field === 'driverLicense'
                              ? "Driver's license"
                              : document.field === 'guarantorLetter'
                                ? 'Guarantor letter'
                                : 'Passport photo'}
                          <span className="ml-1 font-normal text-black/50">
                            ({document.format?.toUpperCase()})
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {application.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => decideApplication(application, 'accept')}
                    disabled={busyId === application._id}
                    className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50"
                  >
                    <Check className="h-4 w-4" /> Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => decideApplication(application, 'reject')}
                    disabled={busyId === application._id}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-700/30 px-4 py-2.5 text-xs font-bold text-red-700 disabled:opacity-50"
                  >
                    <X className="h-4 w-4" /> Decline
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}