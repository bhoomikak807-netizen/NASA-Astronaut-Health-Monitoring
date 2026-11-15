import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { Shield, ExternalLink, Activity, Terminal, Database, Radio, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative band border-t pt-16 pb-12 overflow-hidden backdrop-blur-md">
      {/* Background Accent Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-t from-[#58C7FF]/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#1E2D44]/70">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-sm text-[#94A3B8] leading-relaxed max-w-sm">
              Developing intelligent space safety systems that combine astronaut physiological monitoring,
              spacecraft environmental sensing, and AI-based anomaly detection to support safer human space exploration.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-[#58C7FF] pt-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
              <span>ORBITAL SIMULATION PROTOCOL V1.4</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-mono tracking-widest text-[#58C7FF] uppercase mb-4">Navigation</h4>
            <ul className="space-y-2.5 text-sm text-[#94A3B8]">
              <li>
                <Link to="/" className="hover:text-[#F8FAFC] transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#F8FAFC] transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/technology" className="hover:text-[#F8FAFC] transition-colors">Technology</Link>
              </li>
              <li>
                <Link to="/platform" className="hover:text-[#F8FAFC] transition-colors">Sentinel Platform</Link>
              </li>
              <li>
                <Link to="/mission-control" className="hover:text-[#F8FAFC] text-[#58C7FF] flex items-center gap-1.5 transition-colors">
                  <Activity className="w-3.5 h-3.5" />
                  Mission Control
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#F8FAFC] transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Core Technology */}
          <div>
            <h4 className="text-xs font-mono tracking-widest text-[#58C7FF] uppercase mb-4">Core Systems</h4>
            <ul className="space-y-2.5 text-sm text-[#94A3B8]">
              <li>
                <Link to="/technology#astrohealth" className="hover:text-[#F8FAFC] transition-colors">AstroHealth AI</Link>
              </li>
              <li>
                <Link to="/health-monitor" className="hover:text-[#F8FAFC] text-[#F87171]/90 transition-colors">Astronaut Health Monitor</Link>
              </li>
              <li>
                <Link to="/technology#firehealth" className="hover:text-[#F8FAFC] transition-colors">FireHealth AI</Link>
              </li>
              <li>
                <Link to="/technology#sensor-fusion" className="hover:text-[#F8FAFC] transition-colors">Multi-Sensor Fusion</Link>
              </li>
              <li>
                <Link to="/technology#digital-twin" className="hover:text-[#F8FAFC] transition-colors">Spacecraft Digital Twin</Link>
              </li>
              <li>
                <Link to="/technology#solarshield" className="hover:text-[#F8FAFC] transition-colors">SolarShield Research</Link>
              </li>
              <li>
                <Link to="/technology/quantumnav" className="hover:text-[#F8FAFC] text-[#A78BFA] transition-colors">QuantumNav Research (Live)</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Public Research Sources */}
          <div>
            <h4 className="text-xs font-mono tracking-widest text-[#58C7FF] uppercase mb-4">Open Space Science</h4>
            <ul className="space-y-2.5 text-sm text-[#94A3B8]">
              <li>
                <a 
                  href="https://osdr.nasa.gov/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#58C7FF] flex items-center gap-1.5 transition-colors group"
                >
                  <span>NASA OSDR</span>
                  <ExternalLink className="w-3 h-3 text-[#64748B] group-hover:text-[#58C7FF]" />
                </a>
              </li>
              <li>
                <a 
                  href="https://ccmc.gsfc.nasa.gov/DONKI/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#58C7FF] flex items-center gap-1.5 transition-colors group"
                >
                  <span>NASA DONKI</span>
                  <ExternalLink className="w-3 h-3 text-[#64748B] group-hover:text-[#58C7FF]" />
                </a>
              </li>
              <li>
                <a 
                  href="https://firms.modaps.eosdis.nasa.gov/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#58C7FF] flex items-center gap-1.5 transition-colors group"
                >
                  <span>NASA FIRMS</span>
                  <ExternalLink className="w-3 h-3 text-[#64748B] group-hover:text-[#58C7FF]" />
                </a>
              </li>
              <li>
                <a 
                  href="https://images.nasa.gov/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#58C7FF] flex items-center gap-1.5 transition-colors group"
                >
                  <span>NASA Image Library</span>
                  <ExternalLink className="w-3 h-3 text-[#64748B] group-hover:text-[#58C7FF]" />
                </a>
              </li>
              <li className="pt-2">
                <Link to="/research" className="text-xs font-mono text-[#8B5CF6] hover:underline flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  View Data Provenance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Transparency Disclaimer Box */}
        <div className="my-8 p-4 rounded-xl glass-panel flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="p-2 rounded-lg bg-[#58C7FF]/10 text-[#58C7FF] shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            <strong className="text-[#F8FAFC]">Research & Prototype Disclosure:</strong> ASTRA-SENTINEL AI is an independent SpaceTech research and prototype initiative. It is not affiliated with, endorsed by, or operated by NASA. Public space science datasets (OSDR, DONKI, FIRMS) are utilized strictly for scientific reference and prototype evaluation.
          </p>
        </div>

        {/* Bottom Bar: Copyright, Legal, Status */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-4">
          <p>© {new Date().getFullYear()} ASTRA-SENTINEL AI Inc. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link to="/legal#privacy" className="hover:text-[#94A3B8] transition-colors">Privacy Policy</Link>
            <Link to="/legal#terms" className="hover:text-[#94A3B8] transition-colors">Terms of Use</Link>
            <span className="font-mono text-[#58C7FF]/70">LATENCY: ~1.2s LIGHT-TIME</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
