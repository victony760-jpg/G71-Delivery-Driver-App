import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, ArrowUpRight } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

export default function PublicFooter() {
  return (
    <footer className="bg-black text-white overflow-hidden">
      <div className="px-6 lg:px-20 py-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-[11px] tracking-[0.2em] font-bold">
            NEED A RIDER NOW? CALL 08038445230 • 15-MIN DISPATCH • INSURED UP TO
            ₦200K
          </p>
          <a
            href="https://wa.me/2348038445230"
            target="_blank"
            className="bg-[#25D366] text-black px-6 py-2.5 rounded-full font-bold text-[11px] tracking-widest flex items-center gap-2 shrink-0"
          >
            WHATSAPP US <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="px-6 lg:px-20 py-20"
      >
        <div className="max-w-7xl mx-auto grid gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
          <div>
            <Link
              to="/"
              className="font-cormorant text-4xl font-bold tracking-tight"
            >
              G71 <span className="text-red-500">LOGISTICS</span>
            </Link>
            <p className="text-white/50 text-sm mt-6 leading-relaxed max-w-sm">
              Moving Nigerian businesses since 2023. Fast, tracked, insured
              delivery without stories. 36 states coverage, photo proof + OTP.
            </p>
            <div className="mt-8 space-y-3 text-sm">
              <p className="flex gap-3 text-white/60">
                <MapPin className="w-4 h-4 text-red-500 mt-0.5 shrink-0" /> 12a
                Admiralty Way, Lekki Phase 1, Lagos + Wuse 2 Abuja, GRA PH,
                Ibadan, Kano
              </p>
              <a
                href="tel:08038445230"
                className="flex gap-3 text-white/60 hover:text-white"
              >
                <Phone className="w-4 h-4 text-red-500" /> 08038445230
              </a>
              <a
                href="mailto:MAHORAGA123455@gmail.com"
                className="flex gap-3 text-white/60 hover:text-white break-all"
              >
                <Mail className="w-4 h-4 text-red-500" />{' '}
                MAHORAGA123455@gmail.com
              </a>
              <p className="flex gap-3 text-white/60">
                <Clock className="w-4 h-4 text-red-500" /> Everyday 7AM - 10PM
              </p>
            </div>
          </div>

          <div>
            <p className="font-bold tracking-widest text-[11px] mb-6">
              COMPANY
            </p>
            <div className="space-y-3 text-white/60 text-sm">
              <Link to="/about" className="block hover:text-white">
                About G71
              </Link>
              <Link to="/about" className="block hover:text-white">
                How It Works
              </Link>
              <Link to="/career" className="block hover:text-white">
                Careers
              </Link>
              <Link to="/contact" className="block hover:text-white">
                Contact Support
              </Link>
            </div>
          </div>
          <div>
            <p className="font-bold tracking-widest text-[11px] mb-6">
              SERVICES
            </p>
            <div className="space-y-3 text-white/60 text-sm">
              <Link to="/request-delivery" className="block hover:text-white">
                Instant Dispatch
              </Link>
              <Link to="/request-delivery" className="block hover:text-white">
                Interstate Delivery
              </Link>
              <Link to="/request-delivery" className="block hover:text-white">
                E-Commerce
              </Link>
              <Link to="/pricing" className="block hover:text-white">
                Pricing Calculator
              </Link>
            </div>
          </div>
          <div>
            <p className="font-bold tracking-widest text-[11px] mb-6">
              SUPPORT
            </p>
            <div className="space-y-3 text-white/60 text-sm">
              <Link to="/track-order" className="block hover:text-white">
                Track Package
              </Link>
              <Link to="/faq" className="block hover:text-white">
                FAQ
              </Link>
              <Link to="/contact" className="block hover:text-white">
                Help Center
              </Link>
              <a
                href="https://wa.me/2348038445230"
                className="block hover:text-white"
              >
                WhatsApp
              </a>
            </div>
          </div>
          <div>
            <p className="font-bold tracking-widest text-[11px] mb-6">
              WE COVER
            </p>
            <div className="space-y-3 text-white/60 text-sm">
              <Link to="/request-delivery" className="block hover:text-white">
                Lagos — 15 min
              </Link>
              <Link to="/request-delivery" className="block hover:text-white">
                Abuja — 20 min
              </Link>
              <Link to="/request-delivery" className="block hover:text-white">
                Port Harcourt
              </Link>
              <Link to="/request-delivery" className="block hover:text-white">
                36 States
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="px-6 lg:px-20 py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-[10px] tracking-widest">
            © 2026 G71 LOGISTICS. ALL RIGHTS RESERVED. • 08038445230 •
            MAHORAGA123455@gmail.com
          </p>
          <div className="flex items-center gap-6 flex-wrap justify-center text-[10px] tracking-widest font-bold">
            <NavLink
              to="/privacy"
              className={({ isActive }) =>
                isActive ? 'text-white' : 'text-white/30 hover:text-white'
              }
            >
              PRIVACY POLICY
            </NavLink>
            <NavLink
              to="/terms"
              className={({ isActive }) =>
                isActive ? 'text-white' : 'text-white/30 hover:text-white'
              }
            >
              TERMS AND CONDITIONS
            </NavLink>
            <Link to="/login" className="text-white/15 hover:text-white/60">
              STAFF ACCESS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
