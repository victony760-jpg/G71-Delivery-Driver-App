import { useEffect, useState } from 'react';
import { ArrowRight, Calculator, Shield, Truck } from 'lucide-react';
import {
  createDeliveryRequest,
} from '../../services/deliveryService.js';
import api from '../../services/api.js';
import useBusinessHours from '../../hooks/useBusinessHours.js';

const inputClass =
  'w-full rounded-xl bg-white px-5 py-4 text-sm outline-none ring-1 ring-black/10 focus:ring-black';

function initialForm() {
  const params = new URLSearchParams(window.location.search);
  return {
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    pickupAddress: params.get('from') || '',
    receiverName: '',
    receiverPhone: '',
    dropoffAddress: params.get('to') || '',
    packageType: 'Documents',
    packageWeight: params.get('weight') || '',
    description: '',
  };
}

export default function RequestDeliveryPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  const [error, setError] = useState('');
  const [rate, setRate] = useState(null);
  const { businessHours, businessHoursError } = useBusinessHours();

  useEffect(() => {
    let active = true;
    api
      .get('/rates/active')
      .then(({ data }) => {
        if (active) setRate(data.rate);
      })
      .catch(() => {
        if (active) setRate(null);
      });
    return () => {
      active = false;
    };
  }, []);

  const weight = Number(form.packageWeight);
  const estimatedTotal = rate && Number.isFinite(weight) && weight > 0
    ? Math.round(rate.baseFee + Math.max(1, weight) * rate.perKgFee)
    : null;

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await createDeliveryRequest({
        ...form,
        packageWeight: Number(form.packageWeight),
      });
      if (!response.trackingCode) {
        throw new Error('The server did not return a tracking code.');
      }
      setTrackingCode(response.trackingCode);
    } catch (requestError) {
      setError(requestError.message || 'Could not submit the delivery request.');
    } finally {
      setLoading(false);
    }
  };

  if (trackingCode) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6">
        <section className="w-full max-w-md rounded-3xl bg-white p-8 text-center md:p-10">
          <p className="text-xs font-bold tracking-widest text-black/50">
            REQUEST RECEIVED
          </p>
          <h1 className="mt-4 font-cormorant text-4xl font-bold">
            Your tracking code
          </h1>
          <p className="mt-5 break-all text-2xl font-black tracking-widest">
            {trackingCode}
          </p>
          <p className="mt-4 text-sm text-black/60">
            Save this code to check your delivery status.
          </p>
          {estimatedTotal !== null && (
            <p className="mt-3 text-xs text-black/50">
              Estimate: ₦{estimatedTotal.toLocaleString()} (final price confirmed by admin)
            </p>
          )}
          <a
            href={`/track-order?code=${encodeURIComponent(trackingCode)}`}
            className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-4 text-xs font-bold tracking-widest text-white"
          >
            TRACK REQUEST <ArrowRight className="h-4 w-4" />
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-white">
      <section className="bg-black px-6 pb-16 pt-32 text-white lg:px-20 lg:pb-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] text-red-500">
              DELIVERY REQUEST
            </p>
            <h1 className="mt-5 font-cormorant text-5xl font-bold leading-none md:text-7xl">
              BOOK A RIDER.
            </h1>
            <p className="mt-6 max-w-xl leading-relaxed text-white/60">
              Submit your package details. The server will create your request
              and return a tracking code.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="flex gap-3 text-sm text-white/70">
              <Calculator className="h-5 w-5 shrink-0 text-red-500" />
              <span>Estimate confirmed by admin</span>
            </div>
            <div className="flex gap-3 text-sm text-white/70">
              <Truck className="h-5 w-5 shrink-0 text-red-500" />
              <span>Track with your request code</span>
            </div>
            <div className="flex gap-3 text-sm text-white/70">
              <Shield className="h-5 w-5 shrink-0 text-red-500" />
              <span>Delivery completion requires OTP</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1fr_0.45fr] lg:px-20 lg:py-16">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="font-cormorant text-3xl font-bold">Package details</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <input className={inputClass} required placeholder="Sender name" value={form.guestName} onChange={(event) => updateField('guestName', event.target.value)} />
            <input className={inputClass} required placeholder="Sender phone" value={form.guestPhone} onChange={(event) => updateField('guestPhone', event.target.value)} />
          </div>
          <input className={inputClass} required type="email" placeholder="Sender email" value={form.guestEmail} onChange={(event) => updateField('guestEmail', event.target.value)} />
          <input className={inputClass} required placeholder="Pickup address" value={form.pickupAddress} onChange={(event) => updateField('pickupAddress', event.target.value)} />
          <div className="grid gap-4 md:grid-cols-2">
            <input className={inputClass} required placeholder="Receiver name" value={form.receiverName} onChange={(event) => updateField('receiverName', event.target.value)} />
            <input className={inputClass} required placeholder="Receiver phone" value={form.receiverPhone} onChange={(event) => updateField('receiverPhone', event.target.value)} />
          </div>
          <input className={inputClass} required placeholder="Drop-off address" value={form.dropoffAddress} onChange={(event) => updateField('dropoffAddress', event.target.value)} />
          <div className="grid gap-4 md:grid-cols-2">
            <select className={inputClass} value={form.packageType} onChange={(event) => updateField('packageType', event.target.value)}>
              <option>Documents</option>
              <option>Food &amp; Groceries</option>
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Fragile</option>
              <option>Other</option>
            </select>
            <input className={inputClass} required type="number" min="0.1" step="0.1" placeholder="Weight (kg)" value={form.packageWeight} onChange={(event) => updateField('packageWeight', event.target.value)} />
          </div>
          <textarea className={`${inputClass} min-h-28 resize-y`} placeholder="Package note (optional)" value={form.description} onChange={(event) => updateField('description', event.target.value)} />
          {businessHours && (
            <p
              role={businessHours.isOpen ? 'status' : 'alert'}
              className={`rounded-xl p-4 text-sm font-semibold ${
                businessHours.isOpen
                  ? 'bg-green-50 text-green-800'
                  : 'bg-amber-50 text-amber-900'
              }`}
            >
              {businessHours.message}
            </p>
          )}
          <p className="text-sm text-black/60">
            Operating hours: {businessHours?.operatingDays || 'Monday–Saturday'},{' '}
            {businessHours?.openingTime || '8:00 AM'}–
            {businessHours?.closingTime || '6:00 PM'} WAT. Sunday: closed.
          </p>
          {businessHoursError && (
            <p role="status" className="text-sm text-amber-900">
              {businessHoursError}
            </p>
          )}
          {error && <p role="alert" className="text-sm font-semibold text-red-600">{error}</p>}
          <button disabled={loading || businessHours?.isOpen === false} className="w-full rounded-xl bg-black px-5 py-5 text-xs font-bold tracking-widest text-white disabled:opacity-50">
            {loading ? 'SUBMITTING...' : 'SUBMIT REQUEST'}
          </button>
        </form>

        <aside className="h-fit rounded-2xl bg-[#F5F5F0] p-6">
          <h2 className="font-cormorant text-2xl font-bold">Estimate</h2>
          <p className="mt-3 text-sm leading-relaxed text-black/60">
            {estimatedTotal !== null
              ? `Current estimate: ₦${estimatedTotal.toLocaleString()}. Admin confirms the final price.`
              : 'Enter a package weight to see an estimate. Final price is confirmed by admin after review.'}
          </p>
        </aside>
      </section>
    </main>
  );
}
