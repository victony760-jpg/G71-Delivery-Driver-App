import { useState } from 'react';
import { motion } from 'framer-motion';

const faqs = [
  [
    'How quickly can I get a rider in Lagos?',
    '15 minutes average in Lekki, VI, Yaba, Ikeja. Abuja and PH 20-30 mins. Interstate next-day dispatch. Call 08038445230 for urgent.',
  ],
  [
    'Which areas do you cover?',
    'Lagos, Abuja, Port Harcourt, Ibadan, Kano + 36 states nationwide. Door-to-door with OTP + photo proof.',
  ],
  [
    'How much does delivery cost?',
    'Base ₦500 + ₦100/km intracity Lagos. Interstate from ₦3,500. Fragile/cake extra ₦500. Use /pricing calculator for exact.',
  ],
  [
    'Is my package insured?',
    'Yes, up to ₦200,000 included. Photo proof at pickup & delivery + OTP confirmation. For high value, declare at booking.',
  ],
  [
    'How do I track my order?',
    'Go to /track-order enter your G71-XXXXXX ID. You get live rider location, ETA, and delivery proof.',
  ],
  [
    'What if rider delays?',
    'Our SLA is 98.2% on-time. If delayed >60 mins intracity, you get ₦500 wallet credit. Contact 08038445230.',
  ],
  [
    'Can I pay on delivery?',
    'Yes. Transfer, cash, or wallet. Corporate clients get weekly invoicing. Email MAHORAGA123455@gmail.com for corporate.',
  ],
  [
    'Do you handle food and cakes?',
    "Yes, we have food boxes + cake handling training. Mention 'Fragile / Cake' in request delivery.",
  ],
];

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <div className="bg-white">
      <div className="bg-black px-6 lg:px-20 pt-36 pb-24">
        <p className="text-red-500 font-bold text-[11px] tracking-[0.4em]">
          FAQ • SUPPORT: 08038445230
        </p>
        <h1 className="font-cormorant text-white text-[56px] md:text-[84px] font-bold leading-[0.85] mt-6">
          QUESTIONS?
          <br />
          <span className="text-white/40">WE HAVE ANSWERS.</span>
        </h1>
        <p className="text-white/60 max-w-xl mt-8">
          Everything about pricing, coverage, insurance, tracking. Still need
          help? Email MAHORAGA123455@gmail.com
        </p>
      </div>
      <div className="max-w-5xl mx-auto px-6 lg:px-20 py-20">
        <div className="space-y-3">
          {faqs.map(([q, a], i) => (
            <div key={i} className="border border-black/10 rounded-2xl">
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="w-full text-left px-8 py-6 flex justify-between items-center"
              >
                <span className="font-bold text-[15px] pr-6">{q}</span>
                <span
                  className={`w-8 h-8 rounded-full border flex items-center justify-center text-xl transition ${open === i ? 'bg-black text-white rotate-45' : ''}`}
                >
                  +
                </span>
              </button>
              {open === i && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-8 pb-8 text-black/60 text-sm leading-relaxed max-w-3xl"
                >
                  {a}
                </motion.div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-20 bg-[#F5F5F0] rounded-[24px] p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h4 className="font-cormorant text-3xl font-bold">
              Still need help?
            </h4>
            <p className="text-black/60 text-sm mt-2">
              Call 08038445230 or email MAHORAGA123455@gmail.com — 90s avg reply
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="https://wa.me/2348038445230"
              className="bg-black text-white px-6 py-3 rounded-xl font-bold text-[11px] tracking-widest"
            >
              WHATSAPP
            </a>
            <a
              href="/contact"
              className="border border-black px-6 py-3 rounded-xl font-bold text-[11px] tracking-widest"
            >
              CONTACT
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
