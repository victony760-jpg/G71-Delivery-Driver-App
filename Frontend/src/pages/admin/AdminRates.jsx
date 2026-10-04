import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import api from '../../services/api.js';

const emptyRate = {
  baseFee: '',
  perKgFee: '',
  perKmFee: '',
  driverShare: '',
};

const fields = [
  { key: 'baseFee', label: 'Base delivery fee', suffix: 'NGN' },
  { key: 'perKgFee', label: 'Fee per kilogram', suffix: 'NGN / kg' },
  { key: 'perKmFee', label: 'Fee per kilometre', suffix: 'NGN / km' },
  { key: 'driverShare', label: 'Driver payout per delivery', suffix: 'NGN' },
];

export default function AdminRates() {
  const [rate, setRate] = useState(emptyRate);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;
    api
      .get('/rates/active')
      .then(({ data }) => {
        if (active) {
          setRate({
            baseFee: String(data.rate.baseFee),
            perKgFee: String(data.rate.perKgFee),
            perKmFee: String(data.rate.perKmFee),
            driverShare: String(data.rate.driverShare),
          });
        }
      })
      .catch((loadError) => {
        if (active)
          setError(loadError.response?.data?.message || 'Could not load rates');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleChange = (event) => {
    setRate((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');
    const values = Object.fromEntries(
      Object.entries(rate).map(([key, value]) => [key, Number(value)]),
    );
    if (Object.values(values).some((value) => !Number.isFinite(value) || value < 0)) {
      setError('Enter a valid non-negative amount for each rate.');
      return;
    }

    setSaving(true);
    try {
      const { data } = await api.put('/rates', values);
      setRate({
        baseFee: String(data.rate.baseFee),
        perKgFee: String(data.rate.perKgFee),
        perKmFee: String(data.rate.perKmFee),
        driverShare: String(data.rate.driverShare),
      });
      setNotice('Rates updated. New delivery approvals will use these values.');
    } catch (saveError) {
      setError(saveError.response?.data?.message || 'Could not save rates');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-black px-6 py-8 text-white lg:px-10">
        <p className="text-[11px] font-bold tracking-widest text-red-500">
          G71 ADMIN / PRICING
        </p>
        <h1 className="mt-3 text-3xl font-bold">Delivery rates</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/60">
          These server-managed rates are used by customer estimates and new delivery approvals.
        </p>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8 lg:px-10">
        {loading ? (
          <p role="status" className="text-sm text-black/60">Loading rates...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            {notice && <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{notice}</p>}
            <div className="divide-y divide-black/10 border-y border-black/10">
              {fields.map(({ key, label, suffix }) => (
                <label key={key} className="grid gap-2 py-5 sm:grid-cols-[1fr_220px] sm:items-center">
                  <span className="text-sm font-semibold">{label}</span>
                  <span className="flex items-center gap-3">
                    <input
                      required
                      min="0"
                      step="0.01"
                      type="number"
                      name={key}
                      value={rate[key]}
                      onChange={handleChange}
                      className="min-w-0 flex-1 rounded-md border border-black/20 px-3 py-2 text-sm"
                    />
                    <span className="w-20 text-xs text-black/50">{suffix}</span>
                  </span>
                </label>
              ))}
            </div>
            <button
              type="submit"
              disabled={saving || loading}
              className="inline-flex items-center gap-2 rounded-md bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save rates'}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}