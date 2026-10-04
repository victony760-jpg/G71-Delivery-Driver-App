import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';

export default function PricingCalculator() {
  const [rate, setRate] = useState(null);
  const [weight, setWeight] = useState('1');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api
      .get('/rates/active')
      .then(({ data }) => {
        if (active) setRate(data.rate);
      })
      .catch((loadError) => {
        if (active)
          setError(loadError.response?.data?.message || 'Rates are unavailable');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const numericWeight = Number(weight);
  const billableWeight = Number.isFinite(numericWeight)
    ? Math.max(1, numericWeight)
    : 1;
  const total = rate
    ? Math.round(rate.baseFee + billableWeight * rate.perKgFee)
    : 0;

  return (
    <div className="bg-white">
      <header className="bg-black px-6 pb-16 pt-32 text-white lg:px-20 lg:pb-24">
        <p className="text-[11px] font-bold tracking-[0.3em] text-red-500">
          DELIVERY PRICING
        </p>
        <h1 className="mt-5 font-cormorant text-5xl font-bold leading-none md:text-7xl">
          KNOW YOUR
          <br />
          ESTIMATE.
        </h1>
        <p className="mt-6 max-w-xl leading-relaxed text-white/60">
          Estimates use the current server rate and package weight. The final
          charge is confirmed after your request is reviewed.
        </p>
      </header>

      <main className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1fr_0.7fr] lg:px-20 lg:py-16">
        <section className="max-w-2xl">
          {loading && <p role="status">Loading current rates...</p>}
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          {rate && (
            <>
              <label htmlFor="package-weight" className="text-sm font-bold">
                Package weight (kg)
              </label>
              <input
                id="package-weight"
                type="number"
                min="0.1"
                max="1000"
                step="0.1"
                value={weight}
                onChange={(event) => setWeight(event.target.value)}
                className="mt-2 w-full rounded-xl bg-[#F5F5F0] px-5 py-4 text-lg font-bold outline-none ring-1 ring-black/10 focus:ring-black"
              />
              <p className="mt-3 text-sm text-black/55">
                The current approval formula bills a minimum of 1 kg. Distance
                and special handling are not included in this estimate.
              </p>
            </>
          )}
        </section>

        <aside className="h-fit rounded-2xl bg-black p-6 text-white sm:p-8">
          <p className="text-[11px] font-bold tracking-widest text-white/45">
            ESTIMATED TOTAL
          </p>
          <p className="mt-4 font-cormorant text-5xl font-bold leading-none">
            {rate ? `₦${total.toLocaleString()}` : '—'}
          </p>
          {rate && (
            <div className="mt-7 space-y-3 border-t border-white/10 pt-5 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-white/55">Base delivery fee</span>
                <span>₦{Number(rate.baseFee).toLocaleString()}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-white/55">Weight ({billableWeight} kg)</span>
                <span>₦{(billableWeight * rate.perKgFee).toLocaleString()}</span>
              </div>
            </div>
          )}
          <Link
            to={`/request-delivery?weight=${encodeURIComponent(weight)}`}
            className="mt-8 block rounded-xl bg-red-600 py-4 text-center text-xs font-bold tracking-widest transition hover:bg-red-700"
          >
            REQUEST DELIVERY
          </Link>
          <p className="mt-4 text-center text-xs text-white/40">
            Final price confirmed by the dispatch team.
          </p>
        </aside>
      </main>
    </div>
  );
}