import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, MapPin, Shield, Clock, Star, ArrowUpRight } from 'lucide-react';

const dispatchVideo =
  'https://res.cloudinary.com/dyg6tlb2r/video/upload/q_auto,f_auto/12044507_1440_2560_30fps_ejw8gr.mp4';
const cityVideo =
  'https://res.cloudinary.com/dyg6tlb2r/video/upload/q_auto,f_auto/14622765_1920_1080_30fps_mtjwzd.mp4';
const deliveryBikeImage =
  'https://res.cloudinary.com/dyg6tlb2r/image/upload/v1790891653/pexels-gabo-orozco-lucio-233483298-36490936_gx6wsu.jpg';
const storefrontImage =
  'https://res.cloudinary.com/dyg6tlb2r/image/upload/v1790891672/pexels-jterrazz-13581639_foxpcx.jpg';
const packageImage =
  'https://res.cloudinary.com/dyg6tlb2r/image/upload/v1790891674/pexels-kampus-6667680_dcpgz1.jpg';
const deliveryImage =
  'https://res.cloudinary.com/dyg6tlb2r/image/upload/v1790891674/pexels-kampus-7844003_c60qaw.jpg';
const driverImage =
  'https://res.cloudinary.com/dyg6tlb2r/image/upload/v1790891852/pexels-maksim-romashkin-12635003_wtbear.jpg';
const workspaceImage =
  'https://res.cloudinary.com/dyg6tlb2r/image/upload/v1790891868/pexels-screeny42-11053644_azjeex.jpg';

const slides = [
  { type: 'video', src: dispatchVideo },
  { type: 'video', src: cityVideo },
  { type: 'image', src: deliveryBikeImage },
  { type: 'image', src: storefrontImage },
];

const steps = [
  {
    num: '01',
    title: 'Request a Rider in Seconds',
    desc: 'Open G71 on WhatsApp, app or website. Enter pickup and drop-off, package size and you get instant price + rider ETA.',
    img: workspaceImage,
  },
  {
    num: '02',
    title: 'We Collect & Verify',
    desc: 'A verified G71 rider arrives in 15 minutes. We confirm package condition, take photo proof, and secure it.',
    img: packageImage,
  },
  {
    num: '03',
    title: 'Reliable Nationwide Delivery',
    desc: 'From Lagos to Abuja, Port Harcourt to Kano — every handoff is handled with care and clear delivery updates.',
    img: deliveryBikeImage,
  },
  {
    num: '04',
    title: 'Delivered With Proof',
    desc: 'Hand-to-hand delivery with OTP confirmation, photo proof and digital signature. Insured up to ₦200,000.',
    img: deliveryImage,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

const heroReveal = {
  hidden: { opacity: 0, x: -36, y: 18 },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const revealStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};

const testimonials = [
  {
    quote:
      'G71 cut our delivery complaints to zero. Our customers receive their orders on time, every time.',
    name: 'Chidi O.',
    role: 'Gadgets Store, Computer Village',
  },
  {
    quote:
      'As a baker, timing is everything. G71 riders are fast and handle cakes like they are their own.',
    name: 'Amaka S.',
    role: 'Baker, Yaba',
  },
  {
    quote:
      'We ship more than 80 orders daily. G71 keeps up with our growth without the usual stories.',
    name: 'Tunde A.',
    role: 'Fashion Vendor, Lekki',
  },
];

const faqs = [
  [
    'How quickly can I get a rider?',
    'A verified rider can usually be assigned within 15 minutes, depending on your pickup area.',
  ],
  [
    'Which areas do you serve?',
    'We serve Lagos, Abuja, Port Harcourt, Ibadan, Kano, and delivery routes across Nigeria.',
  ],
  [
    'How do I receive delivery updates?',
    'We send clear status updates at each important handoff, from pickup through delivery confirmation.',
  ],
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(
      () => setCurrent((p) => (p + 1) % slides.length),
      6000,
    );
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const t = setInterval(
      () => setStepIndex((p) => (p + 1) % steps.length),
      4000,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-white text-black overflow-x-hidden">
      {/* HERO - CLEAN, NO TRACKING BAR */}
      <div className="relative min-h-[88vh] w-full overflow-hidden bg-black">
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            initial={{ opacity: index === 0 ? 1 : 0 }}
            animate={{ opacity: index === current ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {slide.type === 'video' ? (
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                crossOrigin="anonymous"
                className="w-full h-full object-cover brightness-[0.9]"
              >
                <source src={slide.src} type="video/mp4" />
              </video>
            ) : (
              <img
                src={slide.src}
                className="w-full h-full object-cover brightness-[0.9]"
                alt=""
              />
            )}
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
          </motion.div>
        ))}
        <div className="relative z-10 min-h-[88vh] flex items-center px-6 lg:px-20 pt-24">
          <motion.div initial="hidden" animate="show" variants={revealStagger}>
            <motion.p
              variants={heroReveal}
              className="text-red-500 font-bold text-[11px] tracking-[0.4em] mb-6"
            >
              LIVE ACROSS NIGERIA • BUILT FOR SPEED
            </motion.p>
            <motion.h1
              variants={heroReveal}
              className="font-bold text-white leading-[0.85] text-[42px] sm:text-[52px] md:text-[88px] lg:text-[110px]"
            >
              WE KEEP
              <br /> NIGERIA
              <br />
              <span className="text-white/60">MOVING.</span>
            </motion.h1>
            <motion.p
              variants={heroReveal}
              className="text-white/80 max-w-lg mt-6 leading-relaxed text-[15px] font-bold tracking-wide"
            >
              Deliver faster. Grow faster.
            </motion.p>
            <motion.div
              variants={heroReveal}
              className="flex flex-wrap gap-3 mt-10"
            >
              <button
                onClick={() => navigate('/request-delivery')}
                className="bg-red-600 hover:bg-red-700 transition text-white font-bold text-[11px] tracking-widest px-8 py-4 rounded-xl flex items-center gap-2"
              >
                BOOK A RIDER <ArrowUpRight className="w-4 h-4" />
              </button>
              <Link
                to="/track"
                className="bg-white/10 backdrop-blur border border-white/20 text-white font-bold text-[11px] tracking-widest px-8 py-4 rounded-xl hover:bg-white hover:text-black transition"
              >
                TRACK ORDER
              </Link>
              <Link
                to="/pricing"
                className="bg-white/10 backdrop-blur border border-white/20 text-white font-bold text-[11px] tracking-widest px-8 py-4 rounded-xl hover:bg-white hover:text-black transition"
              >
                PRICING
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* STATS */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.1, delayChildren: 0.05 },
          },
        }}
        className="bg-black text-white grid grid-cols-2 lg:grid-cols-4"
      >
        {[
          { n: '5,000+', l: 'Businesses Nationwide' },
          { n: '98.2%', l: 'On-Time' },
          { n: '36 States', l: 'Coverage' },
          { n: '24/7', l: 'Support' },
        ].map((s, i) => (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.6,
              delay: i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            key={i}
            className="px-6 py-10 md:px-10 md:py-12 border-r border-white/10 last:border-0"
          >
            <p className="text-3xl md:text-4xl font-bold">{s.n}</p>
            <p className="text-white/50 text-[11px] mt-2 tracking-widest uppercase">
              {s.l}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* ABOUT */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.15, delayChildren: 0.06 },
          },
        }}
        className="max-w-7xl mx-auto px-6 lg:px-20 py-24"
      >
        <motion.p
          variants={fadeUp}
          className="text-red-600 font-bold text-[11px] tracking-[0.3em]"
        >
          WHY G71
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-bold text-[32px] md:text-[52px] leading-[0.9] mt-6 max-w-4xl"
        >
          WE ARE NOT JUST A DISPATCH SERVICE — WE ARE THE ENGINE BEHIND
          BUSINESSES THAT REFUSE TO SLOW DOWN.
        </motion.h2>
      </motion.div>

      {/* SERVICES */}
      <div className="max-w-7xl mx-auto px-6 lg:px-20 py-20 space-y-24">
        {[
          {
            k: 'SERVICE 01',
            t: 'Instant Dispatch Across Cities',
            d: 'Need a rider right now? Whether you are in Lagos, Abuja, or Port Harcourt, get a verified G71 rider in 15 minutes. We handle urgent documents, perishable food, medical supplies, fashion items and last-minute parcels with speed and care.',
            img: packageImage,
          },
          {
            k: 'SERVICE 02',
            t: 'E-Commerce & Business Fulfillment',
            d: 'We power over 5,000 online businesses across Nigeria. From your warehouse, store or home to your customer’s doorstep — we integrate directly with your WhatsApp, Instagram and Shopify store.',
            img: storefrontImage,
          },
          {
            k: 'SERVICE 03',
            t: 'Interstate & Door-to-Door Express',
            d: 'We don’t do drop-offs, we do hand-to-hand delivery with proof. From Lagos to any state in Nigeria, your package moves with OTP verification, photo confirmation and digital signature.',
            img: deliveryImage,
          },
        ].map((s, i) => (
          <motion.div
            initial={{ opacity: 0, y: 52, x: i % 2 === 0 ? -24 : 24 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.8,
              delay: i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            key={i}
            className={`grid lg:grid-cols-2 gap-12 items-center`}
          >
            <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
              <p className="text-red-600 font-bold text-[11px]">{s.k}</p>
              <h3 className="text-[28px] md:text-[48px] font-bold mt-4 leading-[0.9]">
                {s.t}
              </h3>
              <p className="text-black/60 mt-6 leading-relaxed">{s.d}</p>
              <Link
                to="/about"
                className="inline-block mt-8 border border-black px-8 py-3 text-[11px] font-bold rounded-xl hover:bg-black hover:text-white transition"
              >
                LEARN MORE
              </Link>
            </div>
            <motion.img
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              src={s.img}
              className={`rounded-2xl h-[240px] md:h-[480px] w-full object-cover ${i % 2 === 1 ? 'lg:order-1' : ''}`}
              alt=""
            />
          </motion.div>
        ))}
      </div>

      {/* WHY US */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.1, delayChildren: 0.06 },
          },
        }}
        className="bg-black text-white px-6 lg:px-20 py-24 grid lg:grid-cols-2 gap-16 items-center"
      >
        <motion.div
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.h2
            variants={fadeUp}
            className="text-[40px] md:text-[56px] font-bold leading-[0.9]"
          >
            WHAT MAKES G71
            <br />
            UNBEATABLE
          </motion.h2>
          <div className="mt-12 space-y-8">
            {[
              {
                icon: Zap,
                t: '15-Minute Dispatch',
                d: 'Verified riders assigned fast',
              },
              { icon: MapPin, t: 'Nationwide Coverage', d: '36 states + FCT' },
              {
                icon: Shield,
                t: 'Insured Packages',
                d: 'Up to ₦200,000 coverage',
              },
              {
                icon: Clock,
                t: 'Dedicated Support',
                d: 'Real human support 24/7',
              },
            ].map((f, i) => (
              <motion.div
                initial={{ opacity: 0, y: 26, x: -12 }}
                whileInView={{ opacity: 1, y: 0, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                key={i}
                className="flex gap-4"
              >
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <f.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm">{f.t}</p>
                  <p className="text-white/50 text-xs">{f.d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.img
          initial={{ opacity: 0, x: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          src={driverImage}
          className="rounded-2xl h-[320px] md:h-[600px] w-full object-cover"
          alt=""
        />
      </motion.div>

      {/* TESTIMONIALS */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.15, delayChildren: 0.06 },
          },
        }}
        className="max-w-7xl mx-auto px-6 lg:px-20 py-24"
      >
        <motion.h2
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-[36px] md:text-[56px] font-bold leading-[0.9]"
        >
          TRUSTED BY BUSINESSES
          <br />
          THAT MOVE NIGERIA.
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              key={testimonial.name}
              className="border border-black/10 rounded-2xl p-8"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} className="w-4 h-4 fill-black" />
                ))}
              </div>
              <p className="leading-relaxed text-[15px]">
                “{testimonial.quote}”
              </p>
              <p className="font-bold mt-6 text-sm">{testimonial.name}</p>
              <p className="text-black/50 text-xs mt-1">{testimonial.role}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* FAQS */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        className="bg-[#F5F5F0] px-6 lg:px-20 py-24"
      >
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[0.8fr_1.2fr] gap-16 items-start">
          <div>
            <motion.p
              variants={fadeUp}
              className="text-red-600 font-bold text-[11px] tracking-[0.3em]"
            >
              NEED ANSWERS?
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-[40px] md:text-[56px] font-bold leading-[0.9] mt-6"
            >
              DELIVERY QUESTIONS,
              <br />
              MADE SIMPLE.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-black/60 mt-6 max-w-sm text-[14px]"
            >
              Find quick answers about our service areas, rider dispatch and
              delivery process.
            </motion.p>
            <Link
              to="/faq"
              className="inline-block mt-8 bg-black text-white px-7 py-3 rounded-xl text-[11px] font-bold tracking-widest hover:bg-zinc-800 transition"
            >
              VIEW ALL FAQS
            </Link>
          </div>
          <div className="space-y-3">
            {faqs.map(([question, answer]) => (
              <motion.details
                variants={fadeUp}
                key={question}
                className="group border-b border-black/15 py-5"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between font-bold">
                  {question}
                  <span className="text-xl transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="text-black/60 text-sm leading-relaxed pt-4 max-w-xl">
                  {answer}
                </p>
              </motion.details>
            ))}
          </div>
        </div>
      </motion.section>

      {/* STEPS */}
      <div className="bg-[#F5F5F0] px-6 lg:px-20 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center gap-3">
            {steps.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => setStepIndex(idx)}
                animate={{
                  scale: idx === stepIndex ? 1.1 : 1,
                  backgroundColor: idx === stepIndex ? '#000' : '#fff',
                  color: idx === stepIndex ? '#fff' : '#000',
                }}
                className="w-14 h-14 rounded-xl font-bold text-lg border border-black/10 shadow-sm"
              >
                {idx + 1}
              </motion.button>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center mt-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={stepIndex}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-red-600 font-bold text-[11px] tracking-widest">
                  STEP {steps[stepIndex].num}
                </p>
                <h3 className="text-4xl font-bold mt-4 leading-[0.9]">
                  {steps[stepIndex].title}
                </h3>
                <p className="text-black/60 mt-6 leading-relaxed">
                  {steps[stepIndex].desc}
                </p>
                <button
                  onClick={() => navigate('/request-delivery')}
                  className="mt-8 bg-black text-white px-6 py-3 rounded-xl text-[11px] font-bold tracking-widest"
                >
                  BOOK NOW
                </button>
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.img
                key={stepIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                src={steps[stepIndex].img}
                className="rounded-2xl h-[260px] md:h-[400px] w-full object-cover shadow-xl"
                alt=""
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
