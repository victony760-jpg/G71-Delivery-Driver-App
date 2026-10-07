import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowUpRight,
  MessageCircle,
  Shield,
  Zap,
  Headset,
} from 'lucide-react';
import { submitContactMessage } from '../../services/contactService.js';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    subject: 'Request a Rider',
    message: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const submit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });

    try {
      await submitContactMessage(form);
      setStatus({
        type: 'success',
        message: 'Message received. Our support team will contact you shortly.',
      });
      setForm({
        name: '',
        company: '',
        phone: '',
        email: '',
        subject: 'Request a Rider',
        message: '',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error.message || 'Message could not be sent. Please try again.',
      });
    }
  };

  return (
    <div className="bg-white">
      {/* HERO */}
      <div className="bg-black px-6 lg:px-20 pt-36 pb-28">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="max-w-7xl mx-auto grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-end"
        >
          <div>
            <motion.p
              variants={fadeUp}
              className="text-red-500 font-bold text-[15px] tracking-[0.4em]"
            >
              CONTACT G71 • NATIONWIDE
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="font-cormorant text-white text-[52px] md:text-[84px] font-bold leading-[0.85] mt-6"
            >
              WE ARE
              <br />
              ALWAYS
              <br />
              <span className="text-white/50">AVAILABLE.</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-white/60 max-w-xl mt-8 leading-relaxed text-[15px]"
            >
              Whether you need an urgent rider in Lekki, want to track a package
              to Abuja, or partner your business — our team is live. Call
              08038445230 or email MAHORAGA123455@gmail.com
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap gap-4 mt-10"
            >
              <a
                href="https://wa.me/2348038445230"
                className="bg-[#25D366] text-black px-8 py-4 rounded-xl font-bold text-[11px] tracking-widest flex items-center gap-2"
              >
                WHATSAPP US <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="tel:08038445230"
                className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-[11px] tracking-widest"
              >
                CALL 08038445230
              </a>
            </motion.div>
          </div>
          <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <Headset className="w-6 h-6 text-red-500" />
              <p className="font-cormorant text-3xl font-bold text-white mt-4">
                90s
              </p>
              <p className="text-white/50 text-[11px] tracking-widest mt-1">
                AVG REPLY TIME
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <Zap className="w-6 h-6 text-red-500" />
              <p className="font-cormorant text-3xl font-bold text-white mt-4">
                36
              </p>
              <p className="text-white/50 text-[11px] tracking-widest mt-1">
                STATES COVERAGE
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 col-span-2">
              <Shield className="w-6 h-6 text-red-500" />
              <p className="font-bold text-white mt-4 text-sm">
                Insured up to ₦200,000 • Photo proof + OTP • Verified riders
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* FORM + INFO */}
      <div className="max-w-7xl mx-auto px-6 lg:px-20 py-20 grid lg:grid-cols-[1.3fr_0.7fr] gap-12">
        <div className="border border-black/10 rounded-[24px] p-10">
          <p className="text-red-600 font-bold text-[15px] tracking-widest">
            SEND US A MESSAGE
          </p>
          <h3 className="font-cormorant text-[38px] font-bold mt-4 leading-[0.9]">
            Tell us what you need — we will respond in minutes.
          </h3>
          <form onSubmit={submit} className="mt-10 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-[11px] font-bold tracking-widest">
                  FULL NAME *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. John Okoro"
                  className="w-full mt-3 bg-[#F5F5F0] px-5 py-4 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-black"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold tracking-widest">
                  COMPANY (OPTIONAL)
                </label>
                <input
                  value={form.company}
                  onChange={(e) =>
                    setForm({ ...form, company: e.target.value })
                  }
                  placeholder="e.g. Gadgets Store, Computer Village"
                  className="w-full mt-3 bg-[#F5F5F0] px-5 py-4 rounded-xl outline-none text-sm font-bold"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-[11px] font-bold tracking-widest">
                  PHONE / WHATSAPP *
                </label>
                <input
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="08038445230"
                  className="w-full mt-3 bg-[#F5F5F0] px-5 py-4 rounded-xl outline-none text-sm font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold tracking-widest">
                  EMAIL *
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full mt-3 bg-[#F5F5F0] px-5 py-4 rounded-xl outline-none text-sm font-bold"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold tracking-widest">
                SUBJECT
              </label>
              <select
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full mt-3 bg-[#F5F5F0] px-5 py-4 rounded-xl outline-none text-sm font-bold"
              >
                <option>Request a Rider</option>
                <option>Track My Order</option>
                <option>Business Partnership</option>
                <option>Complaint / Support</option>
                <option>Careers</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold tracking-widest">
                MESSAGE *
              </label>
              <textarea
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows="6"
                placeholder="Explain your need in detail..."
                className="w-full mt-3 bg-[#F5F5F0] px-5 py-4 rounded-xl outline-none text-sm font-bold resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-5 rounded-xl font-bold text-[11px] tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
            >
              SEND MESSAGE <ArrowUpRight className="w-4 h-4" />
            </button>
            {status.message && (
              <p
                role="status"
                className={`text-center text-sm font-semibold ${status.type === 'error' ? 'text-red-600' : 'text-green-600'}`}
              >
                {status.message}
              </p>
            )}
            <p className="text-center text-black/40 text-[10px] tracking-widest">
              WE NEVER SHARE YOUR DATA • REPLY WITHIN 90 SECONDS ON WHATSAPP
            </p>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-black text-white rounded-[24px] p-8">
            <p className="text-white/40 text-[11px] tracking-widest font-bold">
              DIRECT CONTACT
            </p>
            <div className="mt-8 space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white/50 text-[10px] tracking-widest">
                    PHONE & WHATSAPP
                  </p>
                  <p className="font-cormorant font-bold text-xl mt-1">
                    08038445230
                  </p>
                  <p className="text-white/50 text-xs mt-1">
                    Mon - Sun 7AM - 10PM
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white/50 text-[10px] tracking-widest">
                    EMAIL ADDRESS
                  </p>
                  <p className="font-bold text-[14px] mt-1 break-all">
                    MAHORAGA123455@gmail.com
                  </p>
                  <p className="text-white/50 text-xs mt-1">
                    For business & support
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white/50 text-[10px] tracking-widest">
                    HEAD OFFICE
                  </p>
                  <p className="font-bold text-sm mt-1">
                    12a Admiralty Way, Lekki Phase 1, Lagos, Nigeria
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-3">
              <a
                href="https://wa.me/2348038445230"
                target="_blank"
                className="bg-[#25D366] text-black py-4 rounded-xl text-center font-bold text-[11px] tracking-widest"
              >
                WHATSAPP
              </a>
              <a
                href="tel:08038445230"
                className="bg-white text-black py-4 rounded-xl text-center font-bold text-[11px] tracking-widest"
              >
                CALL NOW
              </a>
            </div>
          </div>

          <div className="border border-black/10 rounded-[24px] p-8">
            <h4 className="font-cormorant text-2xl font-bold">Other Hubs</h4>
            <div className="mt-6 space-y-5">
              <div className="flex gap-3">
                <MapPin className="w-4 h-4 mt-1 text-red-600" />
                <div>
                  <p className="font-bold text-sm">Abuja Hub - Wuse 2</p>
                  <p className="text-black/50 text-sm">
                    24/7 dispatch • 08038445230
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="w-4 h-4 mt-1 text-red-600" />
                <div>
                  <p className="font-bold text-sm">Port Harcourt - GRA</p>
                  <p className="text-black/50 text-sm">
                    Interstate & intracity
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock className="w-4 h-4 mt-1 text-red-600" />
                <div>
                  <p className="font-bold text-sm">Hours</p>
                  <p className="text-black/50 text-sm">
                    Everyday 7AM - 10PM, Sunday inclusive
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAP */}
      <div className="px-6 lg:px-20 pb-20">
        <div className="max-w-7xl mx-auto rounded-[24px] overflow-hidden border border-black/10 h-[320px] md:h-[500px] relative">
          <iframe
            title="G71 Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.602!2d3.471!3d6.435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf452da3bd44b%3A0x9c3e6a2a5b!2sLekki%20Phase%201%2C%20Lagos!5e0!3m2!1sen!2sng!4v1710000000000"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
          ></iframe>
          <div className="absolute bottom-6 left-6 bg-black text-white px-6 py-4 rounded-xl">
            <p className="font-bold text-sm">G71 LOGISTICS • Lekki, Lagos</p>
            <p className="text-white/60 text-xs mt-1">
              08038445230 • MAHORAGA123455@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
