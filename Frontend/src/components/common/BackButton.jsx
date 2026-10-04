import { ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function BackButton({ fallback = '/admin' }) {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    if (location.key !== 'default') {
      navigate(-1);
      return;
    }
    navigate(fallback);
  };

  return (
    <button
      onClick={goBack}
      className="inline-flex items-center gap-2 text-[11px] font-black tracking-widest text-black/50 hover:text-black transition"
    >
      <ArrowLeft className="w-4 h-4" />
      BACK
    </button>
  );
}
