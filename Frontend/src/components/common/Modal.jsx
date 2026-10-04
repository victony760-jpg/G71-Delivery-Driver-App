import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="relative bg-white rounded-[28px] w-full max-w-[520px] max-h-[calc(100vh-2rem)] overflow-y-auto p-6 md:p-8 border border-black/5 shadow-[0_32px_80px_rgba(0,0,0,0.3)]"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">{title}</h3>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-[#F5F5F0] flex items-center justify-center hover:bg-black hover:text-white transition shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
