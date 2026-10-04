import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Package } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

export default function PublicNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const getScrollY = () =>
      window.scrollY ?? document.documentElement.scrollTop ?? 0;
    const handleScroll = () => setIsScrolled(getScrollY() > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 z-50 w-full"
    >
      <div
        className={`px-4 py-5 transition-colors duration-300 md:px-8 ${isScrolled ? 'bg-black/90 backdrop-blur-lg border-b border-white/10 shadow-lg' : 'bg-transparent border-b border-transparent'}`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/">
            <span className="font-cormorant text-4xl font-bold text-white tracking-tight">
              G71 <span className="text-red-500">LOGISTICS</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-10 text-[13px] font-bold tracking-[0.2em]">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `group relative pb-1 transition-colors ${isActive ? 'active text-white' : 'text-white/60 hover:text-white'}`
              }
            >
              HOME
              <span className="absolute left-0 bottom-[-2px] h-[2px] w-0 bg-red-600 transition-all duration-300 group-hover:w-full group-[.active]:w-full"></span>
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `group relative pb-1 transition-colors ${isActive ? 'active text-white' : 'text-white/60 hover:text-white'}`
              }
            >
              ABOUT
              <span className="absolute left-0 bottom-[-2px] h-[2px] w-0 bg-red-600 transition-all duration-300 group-hover:w-full group-[.active]:w-full"></span>
            </NavLink>
            <NavLink
              to="/track-order"
              className={({ isActive }) =>
                `group relative pb-1 transition-colors ${isActive ? 'active text-white' : 'text-white/60 hover:text-white'}`
              }
            >
              TRACK YOUR ORDER
              <span className="absolute left-0 bottom-[-2px] h-[2px] w-0 bg-red-600 transition-all duration-300 group-hover:w-full group-[.active]:w-full"></span>
            </NavLink>
            <NavLink
              to="/career"
              className={({ isActive }) =>
                `group relative pb-1 transition-colors ${isActive ? 'active text-white' : 'text-white/60 hover:text-white'}`
              }
            >
              CAREER
              <span className="absolute left-0 bottom-[-2px] h-[2px] w-0 bg-red-600 transition-all duration-300 group-hover:w-full group-[.active]:w-full"></span>
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `group relative pb-1 transition-colors ${isActive ? 'active text-white' : 'text-white/60 hover:text-white'}`
              }
            >
              CONTACT
              <span className="absolute left-0 bottom-[-2px] h-[2px] w-0 bg-red-600 transition-all duration-300 group-hover:w-full group-[.active]:w-full"></span>
            </NavLink>
          </nav>

          <div className="hidden lg:flex">
            <Link
              to="/request-delivery"
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-[15px] tracking-widest px-7 py-3.5 rounded-lg flex items-center gap-2"
            >
              <Package className="w-4 h-4" /> BOOK A DRIVER
            </Link>
          </div>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-black/95 backdrop-blur-xl px-6 py-8 space-y-6 text-[13px] font-bold tracking-widest text-white max-h-[calc(100vh-88px)] overflow-y-auto">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `block py-2 ${isActive ? 'text-white' : 'text-white/60'}`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            HOME
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `block py-2 ${isActive ? 'text-white' : 'text-white/60'}`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            ABOUT
          </NavLink>
          <NavLink
            to="/track-order"
            className={({ isActive }) =>
              `block py-2 ${isActive ? 'text-white' : 'text-white/60'}`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            TRACK YOUR ORDER
          </NavLink>
          <NavLink
            to="/career"
            className={({ isActive }) =>
              `block py-2 ${isActive ? 'text-white' : 'text-white/60'}`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            CAREER
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `block py-2 ${isActive ? 'text-white' : 'text-white/60'}`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            CONTACT
          </NavLink>
          <Link
            to="/request-delivery"
            className="block bg-red-600 text-center py-4 rounded-lg mt-6"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            BOOK A DRIVER
          </Link>
        </div>
      )}
    </motion.header>
  );
}
