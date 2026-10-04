import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import PageTransition from '../../components/common/PageTransition.jsx';
import DriverChangePasswordModal from '../../components/driver/DriverChangePasswordModal.jsx';

export default function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // tries backend first, fallback inside useAuth handles defence accounts
      const user = await login(email, password);

      // SAME LOGIN PAGE - CHECK TEMP PASSWORD
      if (user.role === 'driver' && user.mustChangePassword) {
        setShowPassModal(true);
        setLoading(false);
        return;
      }

      if (user.role === 'admin') navigate('/admin');
      else navigate('/driver');
    } catch (err) {
      if ([400, 401].includes(err.response?.status)) {
        setError('Invalid email or password, please try again.');
      } else {
        setError(
          err.response?.data?.message ||
          err.message ||
          'Unable to sign in. Please try again.',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      {/* Temp password blocking modal - same email */}
      <DriverChangePasswordModal
        isOpen={showPassModal}
        onClose={() => setShowPassModal(false)}
      />

      <div className="min-h-screen bg-black grid lg:grid-cols-[0.9fr_1.1fr]">
        {/* LEFT */}
        <div className="px-8 lg:px-20 py-16 flex flex-col justify-between">
          <div>
            <Link
              to="/"
              className="font-bold text-white text-2xl tracking-widest"
            >
              G71 LOGISTICS
            </Link>
            <div className="mt-10 md:mt-20">
              <p className="text-red-500 font-bold text-[11px] tracking-[0.4em]">
                SECURE ACCESS • ROLE-BASED
              </p>
              <h1 className="text-white text-[40px] sm:text-[56px] md:text-[72px] font-bold leading-[0.85] mt-6">
                WELCOME
                <br />
                BACK.
                <br />
                <span className="text-white/30">LET'S MOVE.</span>
              </h1>
              <p className="text-white/50 mt-8 max-w-md text-sm leading-relaxed">
                Sign in to continue moving businesses forward. Track, dispatch,
                and deliver with confidence across Nigeria.
              </p>
              <div className="mt-8 bg-white/10 border border-white/10 rounded-xl p-4 max-w-md">
                <p className="text-white/60 text-[11px] font-bold tracking-widest">
                  STAFF ACCESS
                </p>
                <p className="text-white/70 text-xs mt-2">
                  Staff credentials are configured securely by the deployment
                  environment.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-12 text-white/20 text-[11px] tracking-widest font-bold">
            © 2026 G71 LOGISTICS
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white rounded-tl-[32px] rounded-bl-[32px] lg:rounded-l-[32px] p-8 lg:p-16 flex items-center">
          <div className="w-full max-w-md mx-auto">
            <h3 className="text-4xl font-bold">Welcome back</h3>
            <p className="text-black/50 text-sm mt-3">
              Enter your credentials to access your workspace.
            </p>

            <form onSubmit={handleLogin} className="mt-10 space-y-6">
              <div>
                <label className="text-[11px] font-bold tracking-widest">
                  EMAIL
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@g71.com"
                  className="w-full mt-3 bg-[#F5F5F0] px-5 py-4 rounded-xl text-sm font-bold outline-none border border-transparent focus:border-black focus:bg-white transition"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold tracking-widest">
                  PASSWORD
                </label>
                <div className="relative mt-3">
                  <input
                    type={show ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#F5F5F0] px-5 py-4 pr-12 rounded-xl text-sm font-bold outline-none border border-transparent focus:border-black focus:bg-white transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40"
                  >
                    {show ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] font-bold tracking-widest">
                <label className="flex gap-2 items-center cursor-pointer">
                  <input type="checkbox" className="rounded" /> REMEMBER
                </label>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-[11px] tracking-[0.2em] flex justify-center items-center gap-2 hover:bg-zinc-900 disabled:opacity-60 transition active:scale-[0.99]"
              >
                {loading ? 'CHECKING...' : 'CONTINUE'}{' '}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="bg-[#F5F5F0] rounded-xl p-4 flex gap-3 items-start">
                <ShieldCheck className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-xs">Secure Access</p>
                  <p className="text-black/60 text-xs mt-1">
                    Only admin can access admin pages. All other routes to
                    driver.
                  </p>
                </div>
              </div>
            </form>

            <div className="mt-10 text-center">
              <Link
                to="/"
                className="text-[11px] font-bold tracking-widest underline text-black/40 hover:text-black"
              >
                BACK TO WEBSITE
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}