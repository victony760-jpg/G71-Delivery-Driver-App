import { useState, useCallback, useMemo } from 'react';
import ToastContext from './toastContext';
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((msg, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);
  const value = useMemo(() => ({ addToast }), [addToast]);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] space-y-2 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="alert"
            className={`px-5 py-3 rounded-xl text-[13px] font-medium shadow-2xl border backdrop-blur ${t.type === 'error' ? 'bg-red-600 text-white border-red-700' : t.type === 'success' ? 'bg-green-600 text-white border-green-700' : 'bg-black text-white border-white/10'}`}
          >
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
