import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="bg-black min-h-screen flex items-center px-6 lg:px-20 pt-20">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-red-500 font-bold text-[11px] tracking-[0.4em]">
            404 • PAGE NOT FOUND
          </p>
          <h1 className="font-cormorant text-white text-[72px] md:text-[110px] font-bold leading-[0.8] mt-6">
            LOST
            <br />
            IN
            <br />
            <span className="text-white/30">TRANSIT?</span>
          </h1>
          <p className="text-white/60 max-w-md mt-8">
            The page you are looking for doesn't exist or was moved. Let's get
            your delivery back on track.
          </p>
          <div className="mt-10 flex gap-4">
            <Link
              to="/"
              className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-[11px] tracking-widest"
            >
              BACK TO HOME
            </Link>
            <Link
              to="/track-order"
              className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-[11px] tracking-widest"
            >
              TRACK ORDER
            </Link>
          </div>
          <p className="text-white/30 text-[11px] tracking-widest mt-10 font-bold">
            HELP: 08038445230 • MAHORAGA123455@gmail.com
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-[24px] p-10"
        >
          <p className="text-white/40 text-[11px] tracking-widest font-bold">
            QUICK LINKS
          </p>
          <div className="mt-8 space-y-4">
            {[
              ['/request-delivery', 'Request a Rider'],
              ['/track-order', 'Track Your Order'],
              ['/pricing', 'Pricing Calculator'],
              ['/contact', 'Contact Support'],
              ['/career', 'Join as Driver'],
            ].map(([href, label]) => (
              <Link
                key={href}
                to={href}
                className="flex justify-between items-center border-b border-white/10 pb-4 text-white hover:text-red-500"
              >
                <span className="font-bold text-sm tracking-widest">
                  {label}
                </span>
                <span>→</span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
