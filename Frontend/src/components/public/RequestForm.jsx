import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  createDeliveryRequest,
} from '../../services/deliveryService.js';
import useBusinessHours from '../../hooks/useBusinessHours.js';

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-[11px] font-bold tracking-widest text-black/60">
      {label}
    </label>
    <input
      {...props}
      className="w-full mt-3 bg-[#F5F5F0] px-5 py-4 rounded-xl text-[13px] font-semibold outline-none border border-transparent focus:border-black focus:bg-white transition-all placeholder:text-black/30"
      required
    />
  </div>
);

export default function GuestRequestForm() {
  const [form, setForm] = useState({
    senderName: '',
    senderPhone: '',
    senderEmail: '',
    pickup: '',
    receiverName: '',
    receiverPhone: '',
    dropoff: '',
    packageType: 'Documents',
    weight: '2',
    note: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { businessHours, businessHoursError } = useBusinessHours();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await createDeliveryRequest({
        guestName: form.senderName,
        guestEmail: form.senderEmail,
        guestPhone: form.senderPhone,
        pickupAddress: form.pickup,
        dropoffAddress: form.dropoff,
        packageType: form.packageType,
        packageWeight: Number(form.weight),
        description: form.note,
      });
      const trackingCode = response.trackingCode;
      if (!trackingCode) {
        throw new Error('The request was accepted without a tracking ID.');
      }
      navigate(`/track-order?code=${trackingCode}`);
    } catch (requestError) {
      setError(
        requestError.message ||
        'We could not submit your request. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onSubmit={submit}
      className="bg-white rounded-[28px] p-8 md:p-10 border border-black/[0.06] shadow-[0_24px_80px_rgba(0,0,0,0.07)]"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-[11px] tracking-[0.35em] text-red-500">
            GUEST CHECKOUT
          </p>
          <h3 className="font-cormorant text-[42px] font-bold mt-3 leading-[0.9]">
            Request a<br />
            delivery
          </h3>
          <p className="text-black/50 text-[13px] mt-4 max-w-sm leading-relaxed">
            No account needed. Get tracking ID instantly after submission.
          </p>
        </div>
        <div className="hidden md:flex w-10 h-10 rounded-full bg-[#F5F5F0] items-center justify-center">
          <ShieldCheck className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-10 grid md:grid-cols-2 gap-6">
        <Input
          label="SENDER FULL NAME"
          placeholder="John Doe"
          value={form.senderName}
          onChange={(e) => setForm({ ...form, senderName: e.target.value })}
        />
        <Input
          label="SENDER PHONE"
          placeholder="0803 844 5230"
          value={form.senderPhone}
          onChange={(e) => setForm({ ...form, senderPhone: e.target.value })}
        />
        <Input
          label="SENDER EMAIL"
          type="email"
          placeholder="you@example.com"
          value={form.senderEmail}
          onChange={(e) => setForm({ ...form, senderEmail: e.target.value })}
        />
        <div className="md:col-span-2">
          <Input
            label="PICKUP ADDRESS — LGA, STREET, LANDMARK"
            placeholder="12a Admiralty Way, Lekki Phase 1, Lagos"
            value={form.pickup}
            onChange={(e) => setForm({ ...form, pickup: e.target.value })}
          />
        </div>
        <Input
          label="RECEIVER FULL NAME"
          placeholder="Receiver name"
          value={form.receiverName}
          onChange={(e) => setForm({ ...form, receiverName: e.target.value })}
        />
        <Input
          label="RECEIVER PHONE"
          placeholder="080..."
          value={form.receiverPhone}
          onChange={(e) => setForm({ ...form, receiverPhone: e.target.value })}
        />
        <div className="md:col-span-2">
          <Input
            label="DROP-OFF ADDRESS — STATE & CITY"
            placeholder="Wuse 2, Abuja"
            value={form.dropoff}
            onChange={(e) => setForm({ ...form, dropoff: e.target.value })}
          />
        </div>
        <div>
          <label className="text-[11px] font-bold tracking-widest text-black/60">
            PACKAGE TYPE
          </label>
          <select
            value={form.packageType}
            onChange={(e) => setForm({ ...form, packageType: e.target.value })}
            className="w-full mt-3 bg-[#F5F5F0] px-5 py-4 rounded-xl text-[13px] font-semibold outline-none border border-transparent focus:border-black focus:bg-white transition-all"
          >
            <option>Documents</option>
            <option>Food & Groceries</option>
            <option>Electronics</option>
            <option>Fashion</option>
            <option>Fragile</option>
            <option>Other</option>
          </select>
        </div>
        <Input
          label="WEIGHT (KG)"
          type="number"
          min="1"
          max="50"
          value={form.weight}
          onChange={(e) => setForm({ ...form, weight: e.target.value })}
        />
        <div className="md:col-span-2">
          <label className="text-[11px] font-bold tracking-widest text-black/60">
            DELIVERY NOTE (OPTIONAL)
          </label>
          <textarea
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            placeholder="Gate code, handle with care..."
            rows={3}
            className="w-full mt-3 bg-[#F5F5F0] px-5 py-4 rounded-xl text-[13px] font-semibold outline-none border border-transparent focus:border-black focus:bg-white transition-all resize-none placeholder:text-black/30"
          />
        </div>
      </div>

      {businessHours && (
        <p
          role={businessHours.isOpen ? 'status' : 'alert'}
          className={`mt-6 rounded-xl p-4 text-sm font-semibold ${
            businessHours.isOpen
              ? 'bg-green-50 text-green-800'
              : 'bg-amber-50 text-amber-900'
          }`}
        >
          {businessHours.message}
        </p>
      )}
      <p className="mt-3 text-sm text-black/60">
        Operating hours: {businessHours?.operatingDays || 'Monday–Saturday'},{' '}
        {businessHours?.openingTime || '8:00 AM'}–
        {businessHours?.closingTime || '6:00 PM'} WAT. Sunday: closed.
      </p>
      {businessHoursError && (
        <p role="status" className="mt-6 text-sm text-amber-900">
          {businessHoursError}
        </p>
      )}
      <button
        disabled={loading || businessHours?.isOpen === false}
        type="submit"
        className="w-full mt-10 bg-black text-white py-[18px] rounded-xl font-bold text-[11px] tracking-[0.2em] flex justify-center items-center gap-2 hover:bg-zinc-900 disabled:opacity-60 transition-all active:scale-[0.99]"
      >
        {loading ? 'PROCESSING...' : 'SUBMIT REQUEST — GET TRACKING ID'}{' '}
        <ArrowRight className="w-4 h-4" />
      </button>
      {error && (
        <p
          role="alert"
          className="text-red-600 text-sm text-center mt-4 font-semibold"
        >
          {error}
        </p>
      )}
      <p className="text-[10px] text-black/40 text-center mt-4 tracking-[0.1em] font-bold">
        INSURED UP TO ₦200K • OTP VERIFICATION • PHOTO PROOF
      </p>
    </motion.form>
  );
}
