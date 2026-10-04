import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
  {
    q: 'Do I need an account to request a delivery?',
    a: 'No. G71 is guest-first by design. You fill sender and receiver details, submit, and receive a tracking ID instantly. No signup required for customers.',
  },
  {
    q: 'How fast is delivery within Lagos?',
    a: 'Average pickup is 15 minutes. Intra-Lagos deliveries are same-day. Interstate is 24 to 72 hours depending on distance.',
  },
  {
    q: 'What is OTP and photo proof?',
    a: 'Every delivery requires OTP verification from the receiver plus a photo proof uploaded by the rider. This prevents false delivery claims.',
  },
  {
    q: 'Is my package insured?',
    a: 'Yes. Every package is automatically insured up to ₦200,000. For high-value items above that, contact support before dispatch.',
  },
  {
    q: 'How do I track my package?',
    a: 'Use your tracking ID like G71-1234 on the homepage tracking bar or visit /track-order. You get live status from Pending to Delivered.',
  },
];

export default function FAQAccordion() {
  const [open, setOpen] = useState(0);
  return (
    <div className="space-y-3">
      {FAQS.map((f, i) => {
        const active = open === i;
        return (
          <div
            key={i}
            className={`bg-white rounded-[20px] border transition-all ${active ? 'border-black shadow-[0_10px_40px_rgba(0,0,0,0.06)]' : 'border-black/5'}`}
          >
            <button
              onClick={() => setOpen(active ? -1 : i)}
              className="w-full flex justify-between items-center p-6 md:p-7 text-left"
            >
              <p className="font-bold text-[14px] md:text-[15px] pr-6 leading-snug">
                {f.q}
              </p>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${active ? 'bg-black text-white' : 'bg-[#F5F5F0] text-black/50'}`}
              >
                {active ? (
                  <Minus className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </div>
            </button>
            <AnimatePresence>
              {active && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 md:px-7 pb-7 text-black/60 text-[13px] leading-relaxed max-w-2xl">
                    {f.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
