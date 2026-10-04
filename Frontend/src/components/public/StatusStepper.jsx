import { motion } from 'framer-motion';
import { Check, Truck, Package, Clock, ShieldCheck } from 'lucide-react';

const STEPS = [
  {
    key: 'pending',
    label: 'Order Placed',
    desc: 'Request received',
    icon: Clock,
  },
  {
    key: 'approved',
    label: 'Approved',
    desc: 'Verified by admin',
    icon: ShieldCheck,
  },
  {
    key: 'assigned',
    label: 'Rider Assigned',
    desc: 'Rider on the way',
    icon: Package,
  },
  { key: 'transit', label: 'In Transit', desc: 'On the road', icon: Truck },
  { key: 'delivered', label: 'Delivered', desc: 'OTP + Photo', icon: Check },
];

export default function StatusStepper({ current = 'pending' }) {
  const currentIndex = STEPS.findIndex((step) => step.key === current);
  const progress = (Math.max(0, currentIndex) / (STEPS.length - 1)) * 100;

  return (
    <div className="w-full bg-white rounded-[24px] p-8 border border-black/5">
      <div className="overflow-x-auto">
        <div className="flex justify-between relative min-w-[460px]">
          <div className="absolute top-[20px] left-[20px] right-[20px] h-[2px] bg-black/[0.06]" />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8 }}
            className="absolute top-[20px] left-[20px] h-[2px] bg-black"
          />
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div
                key={step.key}
                className="flex flex-col items-center gap-3 z-10 w-[80px]"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${isActive ? 'bg-black text-white border-black shadow-[0_0_0_4px_rgba(0,0,0,0.1)]' : 'bg-white text-black/20 border-black/10'} ${isCurrent ? 'scale-110' : ''}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-center">
                  <p
                    className={`text-[10px] font-bold tracking-widest ${isActive ? 'text-black' : 'text-black/30'}`}
                  >
                    {step.label}
                  </p>
                  <p className="text-[10px] text-black/40 mt-0.5 hidden md:block">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
