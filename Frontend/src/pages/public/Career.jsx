import { useState } from 'react';
import {
  Bike,
  Shield,
  Wallet,
  Clock,
  ArrowUpRight,
  Upload,
  Phone,
  Mail,
  MapPin,
  Star,
} from 'lucide-react';
import api from '../../services/api.js';

const documentFields = [
  { name: 'nin', label: 'NIN' },
  { name: 'driverLicense', label: "Driver's license" },
  { name: 'guarantorLetter', label: 'Guarantor letter' },
  { name: 'passportPhoto', label: 'Passport photo' },
];

export default function Career() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'Lagos',
    bikeStatus: 'Own Bike',
    experience: 'Less than 1 year',
  });
  const [documents, setDocuments] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const updateField = (event) =>
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const updateDocument = (event) => {
    const file = event.target.files?.[0];
    setDocuments((current) => ({
      ...current,
      [event.target.name]: file || null,
    }));
  };

  const submitApplication = async (event) => {
    event.preventDefault();
    const oversizedFile = Object.values(documents).find(
      (file) => file && file.size > 5 * 1024 * 1024,
    );
    if (oversizedFile) {
      setFeedback({
        type: 'error',
        message: `${oversizedFile.name} exceeds the 5 MB file limit.`,
      });
      return;
    }

    const formElement = event.currentTarget;
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.append(key, value));
    Object.entries(documents).forEach(([key, file]) => {
      if (file) payload.append(key, file);
    });

    setSubmitting(true);
    setFeedback({ type: '', message: '' });
    try {
      await api.post('/driver/apply', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm({
        name: '',
        phone: '',
        email: '',
        city: 'Lagos',
        bikeStatus: 'Own Bike',
        experience: 'Less than 1 year',
      });
      setDocuments({});
      formElement.reset();
      setFeedback({
        type: 'success',
        message: 'Application received. Our recruitment team will contact you.',
      });
    } catch (error) {
      setFeedback({
        type: 'error',
        message:
          error.response?.data?.message ||
          'Could not submit your application. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      {/* HERO - responsive */}
      <div className="bg-black px-4 md:px-8 lg:px-20 pt-28 md:pt-36 pb-16 md:pb-28">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 lg:gap-12">
          <div>
            <p className="text-red-500 font-bold text-[10px] md:text-[11px] tracking-[0.25em] md:tracking-[0.4em] leading-relaxed">
              CAREERS • APPLY: 08038445230 • MAHORAGA123455@gmail.com
            </p>
            <h1 className="font-cormorant text-white text-[40px] sm:text-[56px] lg:text-[88px] font-bold leading-[0.9] md:leading-[0.85] mt-6">
              RIDE WITH
              <br />
              G71.
              <br />
              <span className="text-white/40">EARN BIG.</span>
            </h1>
            <p className="text-white/60 max-w-xl mt-6 md:mt-8 leading-relaxed text-[14px] md:text-[16px]">
              Join 300+ verified riders across Nigeria. Earn up to ₦250k
              monthly, weekly payouts every Monday, fuel bonus + insurance.
            </p>
            <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 md:gap-4">
              <a
                href="#apply"
                className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-[11px] tracking-widest text-center"
              >
                APPLY AS DRIVER
              </a>
              <a
                href="tel:08038445230"
                className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-[11px] tracking-widest text-center"
              >
                CALL 08038445230
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="font-cormorant text-4xl font-bold text-white">
                ₦250k
              </p>
              <p className="text-white/50 text-[10px] tracking-widest mt-3 leading-relaxed">
                MAX MONTHLY EARNING
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="font-cormorant text-4xl font-bold text-white">
                300+
              </p>
              <p className="text-white/50 text-[10px] tracking-widest mt-3 leading-relaxed">
                ACTIVE RIDERS
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:col-span-2">
              <div className="flex gap-1">
                <Star className="w-4 h-4 fill-white text-white" />
                <Star className="w-4 h-4 fill-white text-white" />
                <Star className="w-4 h-4 fill-white text-white" />
                <Star className="w-4 h-4 fill-white text-white" />
                <Star className="w-4 h-4 fill-white text-white" />
              </div>
              <p className="text-white text-[13px] md:text-sm mt-4 font-bold leading-relaxed">
                “G71 changed my hustle. I make ₦180k monthly and get paid every
                Monday without story.” — Emeka, Lagos Rider
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 py-12 md:py-20">
        {/* PERKS */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Bike,
              t: 'Own or HP Bike',
              d: 'Use your bike or get company bike on hire purchase. Fuel bonus weekly.',
            },
            {
              icon: Wallet,
              t: 'Weekly Payouts',
              d: 'Every Monday straight to your account. Transparent earnings dashboard.',
            },
            {
              icon: Shield,
              t: 'Full Insurance',
              d: 'Accident + package insurance while on duty. We cover you.',
            },
            {
              icon: Clock,
              t: 'Flexible',
              d: 'Ride full-time or part-time. You control your hours, we bring orders.',
            },
          ].map((f, i) => (
            <div
              key={i}
              className="border border-black/10 rounded-[20px] p-6 md:p-8 hover:bg-black hover:text-white transition-colors group"
            >
              <f.icon className="w-7 h-7 group-hover:text-red-500" />
              <p className="font-bold mt-6 text-[14px]">{f.t}</p>
              <p className="text-[13px] mt-3 opacity-60 leading-relaxed">
                {f.d}
              </p>
            </div>
          ))}
        </div>

        {/* FORM + SIDE */}
        <div
          id="apply"
          className="mt-16 md:mt-24 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12"
        >
          <div className="border border-black/10 rounded-[20px] md:rounded-[24px] p-6 md:p-10">
            <p className="text-red-600 font-bold text-[10px] md:text-[11px] tracking-widest">
              DRIVER APPLICATION FORM
            </p>
            <h3 className="font-cormorant text-[32px] md:text-[40px] font-bold mt-3 md:mt-4 leading-[0.95]">
              Ready to start earning? Apply now.
            </h3>

            <form
              onSubmit={submitApplication}
              className="mt-8 md:mt-10 space-y-5 md:space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <div>
                  <label className="text-[10px] font-bold tracking-widest">
                    FULL NAME *
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={updateField}
                    placeholder="e.g. Emeka Okoro"
                    className="w-full mt-2 md:mt-3 bg-[#F5F5F0] px-5 py-4 rounded-xl text-sm font-bold outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-widest">
                    WHATSAPP NUMBER *
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={updateField}
                    type="tel"
                    placeholder="08012345678"
                    className="w-full mt-2 md:mt-3 bg-[#F5F5F0] px-5 py-4 rounded-xl text-sm font-bold outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-widest">
                  EMAIL ADDRESS *
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={updateField}
                  placeholder="you@example.com"
                  className="w-full mt-2 md:mt-3 bg-[#F5F5F0] px-5 py-4 rounded-xl text-sm font-bold outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <div>
                  <label className="text-[10px] font-bold tracking-widest">
                    CITY *
                  </label>
                  <select name="city" value={form.city} onChange={updateField} className="w-full mt-2 md:mt-3 bg-[#F5F5F0] px-5 py-4 rounded-xl text-sm font-bold outline-none">
                    <option>Lagos</option>
                    <option>Abuja</option>
                    <option>Port Harcourt</option>
                    <option>Ibadan</option>
                    <option>Kano</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-widest">
                    BIKE STATUS
                  </label>
                  <select name="bikeStatus" value={form.bikeStatus} onChange={updateField} className="w-full mt-2 md:mt-3 bg-[#F5F5F0] px-5 py-4 rounded-xl text-sm font-bold outline-none">
                    <option>Own Bike</option>
                    <option>Need Company Bike (HP)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-widest">
                  YEARS OF EXPERIENCE
                </label>
                <select name="experience" value={form.experience} onChange={updateField} className="w-full mt-2 md:mt-3 bg-[#F5F5F0] px-5 py-4 rounded-xl text-sm font-bold outline-none">
                  <option>Less than 1 year</option>
                  <option>1-2 years</option>
                  <option>3+ years</option>
                </select>
              </div>

              <div className="bg-[#F5F5F0] border border-dashed border-black/20 rounded-xl p-6 md:p-8 text-center">
                <Upload className="w-8 h-8 mx-auto text-black/30" />
                <p className="text-[10px] font-bold tracking-widest mt-3 leading-relaxed">
                  OPTIONAL SUPPORTING DOCUMENTS
                </p>
                <p className="text-[10px] text-black/50 mt-2">
                  Upload any available documents now, or submit without them.
                </p>
                <div className="mt-5 grid gap-4 text-left sm:grid-cols-2">
                  {documentFields.map(({ name, label }) => (
                    <label key={name} className="block text-[10px] font-bold">
                      {label.toUpperCase()}
                      <input
                        type="file"
                        name={name}
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={updateDocument}
                        className="mt-2 block w-full text-xs font-normal"
                      />
                      {documents[name] && (
                        <span className="mt-1 block truncate font-normal text-black/50">
                          {documents[name].name}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
                <p className="text-[10px] text-black/40 mt-4">
                  PDF, JPG, or PNG. Maximum 5 MB each. Identity documents are
                  stored privately and visible only to admins.
                </p>
              </div>

              {feedback.message && (
                <p
                  role={feedback.type === 'error' ? 'alert' : 'status'}
                  className={`text-sm font-semibold ${feedback.type === 'error' ? 'text-red-600' : 'text-green-700'}`}
                >
                  {feedback.message}
                </p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-black text-white py-5 rounded-xl font-bold text-[11px] tracking-[0.2em] flex justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}
                {!submitting && <ArrowUpRight className="w-4 h-4" />}
              </button>
              <p className="text-center text-black/40 text-[10px] tracking-widest font-bold leading-relaxed">
                WE WILL CALL YOU ON 08038445230 WITHIN 24HRS • EMAIL:
                MAHORAGA123455@gmail.com
              </p>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-[#F5F5F0] rounded-[20px] md:rounded-[24px] p-6 md:p-8">
              <h4 className="font-cormorant text-xl md:text-2xl font-bold">
                Requirements
              </h4>
              <ul className="mt-6 space-y-4 text-[13px] md:text-sm">
                {[
                  'Valid Rider Permit / License',
                  'NIN + Guarantor letter (Lagos resident)',
                  'Smartphone Android 10+ with data',
                  'Clean bike papers or HP agreement',
                  'Good knowledge of your city routes',
                  'No criminal record',
                ].map((t) => (
                  <li key={t} className="flex gap-3 leading-relaxed">
                    <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">
                      ✓
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[20px] md:rounded-[24px] overflow-hidden border border-black/10 h-[280px] md:h-[320px]">
              <iframe
                title="G71 Office"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.602!2d3.471!3d6.435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf452da3bd44b%3A0x9c3e6a2a5b!2sLekki%20Phase%201%2C%20Lagos!5e0!3m2!1sen!2sng!4v1710000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
              ></iframe>
            </div>

            <div className="bg-black text-white rounded-[20px] md:rounded-[24px] p-6 md:p-8">
              <p className="text-white/40 text-[11px] tracking-widest font-bold">
                RECRUITMENT CONTACT
              </p>
              <div className="mt-6 space-y-4 text-[14px]">
                <p className="flex gap-3 items-center">
                  <Phone className="w-4 h-4 text-red-500 shrink-0" />{' '}
                  08038445230
                </p>
                <p className="flex gap-3 items-center break-all">
                  <Mail className="w-4 h-4 text-red-500 shrink-0" />{' '}
                  MAHORAGA123455@gmail.com
                </p>
                <p className="flex gap-3 items-start">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />{' '}
                  12a Admiralty Way, Lekki Phase 1
                </p>
              </div>
              <a
                href="tel:08038445230"
                className="mt-8 block bg-white text-black py-4 rounded-xl text-center font-bold text-[11px] tracking-widest"
              >
                CALL RECRUITMENT NOW
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
