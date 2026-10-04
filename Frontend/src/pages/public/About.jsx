import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  MapPin,
  Zap,
  Package,
  Truck,
  Users,
  CheckCircle,
} from 'lucide-react';

const aboutHeroVideo =
  'https://res.cloudinary.com/dyg6tlb2r/video/upload/q_auto,f_auto/new_tomnkn.mp4';
const aboutStoryVideo =
  'https://res.cloudinary.com/dyg6tlb2r/video/upload/q_auto,f_auto/14622765_1920_1080_30fps_mtjwzd.mp4';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerReveal = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="bg-white text-black overflow-x-hidden">
      {/* HERO */}
      <div className="relative min-h-[70vh] bg-black flex items-center px-6 lg:px-20 pt-28">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          crossOrigin="anonymous"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.5]"
        >
          <source src={aboutHeroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        <div className="relative z-10 max-w-7xl w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerReveal}
          >
            <motion.p
              variants={fadeUp}
              className="text-red-500 font-bold text-[11px] tracking-[0.4em]"
            >
              ABOUT G71 LOGISTICS
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="font-cormorant font-bold text-white text-[48px] md:text-[72px] leading-[0.9] mt-4"
            >
              NIGERIA'S MOST
              <br />
              RELIABLE DISPATCH
              <br />
              <span className="text-white/40">NETWORK.</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-white/70 max-w-xl mt-6 leading-relaxed"
            >
              Founded in 2023 in Lagos, G71 Logistics provides fast, tracked and
              insured delivery services for businesses across all 36 states in
              Nigeria.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* WHO WE ARE */}
      <div className="max-w-7xl mx-auto px-6 lg:px-20 py-20 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerReveal}
        >
          <motion.p
            variants={fadeUp}
            className="text-red-600 font-bold text-[11px] tracking-[0.3em]"
          >
            WHO WE ARE
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-cormorant text-[36px] md:text-[48px] font-bold leading-[0.9] mt-4"
          >
            WE HELP BUSINESSES
            <br />
            MOVE FASTER ACROSS
            <br />
            NIGERIA.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-black/60 mt-6 leading-relaxed"
          >
            G71 Logistics is a technology-enabled dispatch company built for
            Nigerian businesses. We serve e-commerce vendors, restaurants,
            pharmacies, fashion brands, SMEs and corporates who need same-day
            and interstate delivery without delays.
          </motion.p>
          <motion.p
            variants={fadeUp}
            className="text-black/60 mt-4 leading-relaxed"
          >
            With over 100 verified riders and operations in Lagos, Abuja, Port
            Harcourt, Ibadan, Kano and other major cities, we handle 2,000+
            deliveries weekly with a 98.2% on-time rate. Every package is
            insured up to ₦200,000 with OTP and photo confirmation.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-3 gap-6 mt-10 border-t border-black/10 pt-8"
          >
            <div>
              <p className="font-bold text-2xl">5,000+</p>
              <p className="text-[11px] text-black/50 tracking-widest">
                BUSINESSES
              </p>
            </div>
            <div>
              <p className="font-bold text-2xl">120k+</p>
              <p className="text-[11px] text-black/50 tracking-widest">
                DELIVERIES
              </p>
            </div>
            <div>
              <p className="font-bold text-2xl">36</p>
              <p className="text-[11px] text-black/50 tracking-widest">
                STATES
              </p>
            </div>
          </motion.div>
        </motion.div>
        <motion.video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          crossOrigin="anonymous"
          initial={{ opacity: 0, x: 36, scale: 0.96 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl h-[280px] md:h-[550px] w-full object-cover"
        >
          <source src={aboutStoryVideo} type="video/mp4" />
        </motion.video>
      </div>

      {/* MISSION VISION */}
      <div className="bg-[#F5F5F0] px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white p-8 rounded-2xl border border-black/5"
          >
            <Truck className="w-6 h-6" />
            <h3 className="font-bold mt-6">Our Mission</h3>
            <p className="text-black/60 text-sm mt-3 leading-relaxed">
              To provide fast, affordable and reliable delivery services that
              help Nigerian businesses grow without logistics stress.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white p-8 rounded-2xl border border-black/5"
          >
            <Zap className="w-6 h-6" />
            <h3 className="font-bold mt-6">Our Vision</h3>
            <p className="text-black/60 text-sm mt-3 leading-relaxed">
              To become Nigeria's largest last-mile delivery network, present in
              all 774 LGAs with same-day capability.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white p-8 rounded-2xl border border-black/5"
          >
            <Shield className="w-6 h-6" />
            <h3 className="font-bold mt-6">Our Values</h3>
            <p className="text-black/60 text-sm mt-3 leading-relaxed">
              Speed, transparency, accountability and respect for both customers
              and riders. No hidden fees, no stories.
            </p>
          </motion.div>
        </div>
      </div>

      {/* WHAT WE DO */}
      <div className="max-w-7xl mx-auto px-6 lg:px-20 py-20">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          <h2 className="font-cormorant text-[32px] md:text-[48px] font-bold leading-[0.9]">
            WHAT WE DO
          </h2>
          <p className="text-black/60 max-w-xl">
            From instant dispatch in 15 minutes to interstate next-day delivery
            and full e-commerce fulfillment.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {[
            {
              icon: Zap,
              t: 'Instant Dispatch',
              d: 'Get a verified rider in 15 minutes anywhere in Lagos, Abuja, PH and Ibadan.',
            },
            {
              icon: Package,
              t: 'Same-Day Delivery',
              d: 'Within-city same-day delivery with clear status updates and proof.',
            },
            {
              icon: MapPin,
              t: 'Interstate Delivery',
              d: 'Lagos to any state in Nigeria with next-day delivery and insurance.',
            },
            {
              icon: Users,
              t: 'E-Commerce Fulfillment',
              d: 'We handle your online orders from pickup to delivery and COD.',
            },
          ].map((s, i) => (
            <motion.div
              initial={{ opacity: 0, y: 24, x: i % 2 === 0 ? -18 : 18 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              key={i}
              className="border border-black/10 rounded-2xl p-6 hover:bg-black hover:text-white transition-colors group"
            >
              <s.icon className="w-5 h-5 group-hover:text-white" />
              <p className="font-bold mt-6 text-sm">{s.t}</p>
              <p className="text-black/60 group-hover:text-white/60 text-sm mt-2 leading-relaxed">
                {s.d}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* WHY CHOOSE US */}
      <div className="bg-black text-white px-6 lg:px-20 py-20 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-red-500 font-bold text-[11px] tracking-[0.3em]">
            WHY CHOOSE G71
          </p>
          <h2 className="font-cormorant text-[36px] md:text-[48px] font-bold leading-[0.9] mt-4">
            WHY 5,000+ BUSINESSES
            <br />
            TRUST US DAILY
          </h2>
          <div className="mt-10 space-y-5">
            {[
              '15-minute average rider assignment time',
              'Clear delivery updates for you and your customers',
              'Every delivery insured up to ₦200,000',
              'OTP and photo confirmation on delivery',
              'Flat pricing — no surge, no hidden fees',
              '24/7 human support on WhatsApp',
              'Coverage across all 36 states in Nigeria',
            ].map((t, i) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                key={i}
                className="flex gap-3"
              >
                <CheckCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-white/70 text-sm">{t}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <motion.video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          crossOrigin="anonymous"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-2xl h-[320px] md:h-[600px] w-full object-cover"
        >
          <source src={aboutHeroVideo} type="video/mp4" />
        </motion.video>
      </div>

      {/* CTA */}
      <div className="px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto bg-[#F5F5F0] rounded-3xl p-10 lg:p-16 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div>
            <h2 className="font-cormorant text-[32px] md:text-[44px] font-bold leading-[0.9]">
              LET'S MOVE YOUR
              <br />
              BUSINESS FORWARD
            </h2>
            <p className="text-black/60 mt-4 max-w-md">
              Join 5,000+ businesses across Nigeria moving faster with G71. No
              signup fee, pay per delivery.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/request-delivery')}
              className="bg-black text-white px-8 py-4 rounded-lg text-[11px] font-bold tracking-widest"
            >
              REQUEST DELIVERY
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="border border-black px-8 py-4 rounded-lg text-[11px] font-bold tracking-widest"
            >
              CONTACT US
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
