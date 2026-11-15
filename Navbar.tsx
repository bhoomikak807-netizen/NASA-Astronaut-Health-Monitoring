import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { Menu, X, Activity, ChevronDown, Compass, Heart, Cpu, HeartPulse, Flame, Radiation } from 'lucide-react';
import { prefetchRoute } from '../../routes';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [techOpen, setTechOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setTechOpen(false);
  }, [location.pathname, location.hash]);

  const techMenu = [
    { name: 'Technology Overview', path: '/technology', desc: 'All subsystems & specs', icon: <Cpu className="w-4 h-4 text-[#58C7FF]" /> },
    { name: 'AstroHealth AI', path: '/technology/astrohealth', desc: 'Crew-health agent & recommendations', icon: <HeartPulse className="w-4 h-4 text-[#58C7FF]" /> },
    { name: 'FireHealth AI · Aegis FDS', path: '/technology/firehealth', desc: 'Fire detection & automatic alarm', icon: <Flame className="w-4 h-4 text-[#F59E0B]" /> },
    { name: 'Radiation Monitor', path: '/technology/radiation', desc: 'SolarShield · flux & dose rate', icon: <Radiation className="w-4 h-4 text-[#A78BFA]" /> },
    { name: 'QuantumNav Research', path: '/technology/quantumnav', desc: 'Live GPS-denied navigation lab', icon: <Compass className="w-4 h-4 text-[#A78BFA]" /> },
    { name: 'Astronaut Health Monitor', path: '/health-monitor', desc: 'Crew vitals, ECG & AstroHealth AI', icon: <Heart className="w-4 h-4 text-[#F87171]" /> },
  ];

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Technology', path: '/technology' },
    { name: 'Platform', path: '/platform' },
    { name: 'Research & Data', path: '/research' },
    { name: 'Contact', path: '/contact' },
  ];

  const isMissionControl = location.pathname.startsWith('/mission-control');

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isMissionControl ? 'glass-nav py-2.5 shadow-lg shadow-black/40' : 'glass-nav py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Company Brand Logo */}
          <Logo size="md" />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => link.path === '/technology' ? (
              <div
                key={link.path}
                className="relative"
                onMouseEnter={() => {
                  setTechOpen(true);
                  prefetchRoute('/technology');
                }}
                onMouseLeave={() => setTechOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setTechOpen((o) => !o)}
                  aria-expanded={techOpen}
                  className={`px-4 py-2 rounded-lg text-[15px] font-medium transition-all duration-200 inline-flex items-center gap-1 ${
                    location.pathname.startsWith('/technology') || location.pathname.startsWith('/health-monitor')
                      ? 'text-[#58C7FF] bg-[#58C7FF]/10 border border-[#58C7FF]/25 shadow-[0_0_12px_rgba(88,199,255,0.15)]'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5'
                  }`}
                >
                  {link.name}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${techOpen ? 'rotate-180' : ''}`} />
                </button>
                {techOpen && (
                  <div className="absolute left-0 top-full pt-2 w-72">
                    <div className="glass-panel rounded-xl p-1.5 shadow-2xl shadow-black/60">
                      {techMenu.map((item) => (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onMouseEnter={() => prefetchRoute(item.path)}
                          onFocus={() => prefetchRoute(item.path)}
                          end
                          className={({ isActive }) =>
                            `flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-[#58C7FF]/12' : 'hover:bg-white/5'}`
                          }
                        >
                          <span className="mt-0.5 p-1.5 rounded-md bg-white/5 border border-white/10">{item.icon}</span>
                          <span>
                            <span className="block text-sm font-medium text-[#F8FAFC]">{item.name}</span>
                            <span className="block text-[11px] font-mono text-[#64748B]">{item.desc}</span>
                          </span>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={link.path}
                to={link.path}
                onMouseEnter={() => prefetchRoute(link.path)}
                onFocus={() => prefetchRoute(link.path)}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-[15px] font-medium transition-all duration-200 relative group ${
                    isActive
                      ? 'text-[#58C7FF] bg-[#58C7FF]/10 border border-[#58C7FF]/25 shadow-[0_0_12px_rgba(88,199,255,0.15)]'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#101826]/60'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Header Status & CTA Action */}
          <div className="hidden md:flex items-center gap-4">
            {/* Mission Control CTA */}
            <NavLink
              to="/mission-control" onMouseEnter={() => prefetchRoute("/mission-control")}
              className={`relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-[15px] font-semibold tracking-wide transition-all duration-300 overflow-hidden group ${
                isMissionControl
                  ? 'bg-[#58C7FF] text-[#05070D] font-semibold shadow-[0_0_20px_rgba(88,199,255,0.4)]'
                  : 'bg-gradient-to-r from-[#58C7FF]/20 to-[#8B5CF6]/20 text-[#F8FAFC] border border-[#58C7FF]/40 hover:border-[#58C7FF] hover:shadow-[0_0_20px_rgba(88,199,255,0.3)]'
              }`}
            >
              <Activity className="w-4 h-4 text-[#58C7FF] group-hover:animate-pulse" />
              <span>Explore Mission Control</span>
            </NavLink>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <NavLink
              to="/mission-control"
              className="px-3 py-1.5 rounded-md bg-[#58C7FF]/15 border border-[#58C7FF]/30 text-xs font-mono text-[#58C7FF]"
            >
              Dashboard
            </NavLink>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#101826] border border-[#1E2D44] text-[#94A3B8] hover:text-[#F8FAFC] focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#050B18]/95 backdrop-blur-xl border-b border-[#1E2D44] px-4 pt-4 pb-6 mt-3 max-h-[80vh] overflow-y-auto space-y-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2D44]/60 px-2">
            <span className="text-xs font-mono text-[#94A3B8]">ASTRA-SENTINEL PROTOCOL</span>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#10B981]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block animate-pulse"></span>
              ACTIVE PROTOTYPE
            </div>
          </div>

          {navLinks.map((link) => (
            <React.Fragment key={link.path}>
              <NavLink
                to={link.path}
                end
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? 'text-[#58C7FF] bg-[#58C7FF]/15 border-l-2 border-[#58C7FF]'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#101826]'
                  }`
                }
              >
                {link.name}
              </NavLink>
              {link.path === '/technology' &&
                techMenu.slice(1).map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `ml-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                        isActive ? 'text-[#58C7FF] bg-[#58C7FF]/10' : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#101826]'
                      }`
                    }
                  >
                    {item.icon}
                    {item.name}
                  </NavLink>
                ))}
            </React.Fragment>
          ))}

          <div className="pt-3">
            <NavLink
              to="/mission-control"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-gradient-to-r from-[#58C7FF] to-[#3B82F6] text-[#05070D] font-semibold text-sm shadow-[0_0_15px_rgba(88,199,255,0.3)]"
            >
              <Activity className="w-4 h-4" />
              Launch Mission Control
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};
