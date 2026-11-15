import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  showText = true 
}) => {
  const sizeMap = {
    sm: { icon: 28, text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 38, text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 52, text: 'text-2xl', sub: 'text-xs' },
  };

  const currentSize = sizeMap[size];

  return (
    <Link to="/" className={`inline-flex items-center gap-3 group focus:outline-none ${className}`}>
      {/* Custom Vector Icon: Shield + Orbit + Four-pointed Star */}
      <div className="relative flex items-center justify-center">
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-500 group-hover:scale-105"
        >
          <defs>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#58C7FF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="orbitGrad" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#58C7FF" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#58C7FF" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.2" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Protective Shield Path */}
          <path
            d="M24 4L7 11V22C7 32.5 14.2 42.1 24 44.5C33.8 42.1 41 32.5 41 22V11L24 4Z"
            stroke="url(#shieldGrad)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#05070D"
            fillOpacity="0.75"
          />

          {/* Elliptical Satellite Orbital Path */}
          <ellipse
            cx="24"
            cy="24"
            rx="18"
            ry="7"
            transform="rotate(-28 24 24)"
            stroke="url(#orbitGrad)"
            strokeWidth="1.4"
            strokeDasharray="2 1.5"
            opacity="0.85"
          />

          {/* Orbital Satellite Node */}
          <circle
            cx="38"
            cy="17"
            r="2"
            fill="#58C7FF"
            filter="url(#glow)"
          />

          {/* Central Sentinel Guiding Star (Four-pointed Space Star) */}
          <path
            d="M24 14L26.2 21.8L34 24L26.2 26.2L24 34L21.8 26.2L14 24L21.8 21.8L24 14Z"
            fill="#58C7FF"
            opacity="0.95"
            filter="url(#glow)"
          />

          {/* Core Star Singularity */}
          <circle cx="24" cy="24" r="1.5" fill="#FFFFFF" />
        </svg>

        {/* Ambient Halo behind icon */}
        <div className="absolute inset-0 bg-[#58C7FF]/20 blur-xl rounded-full -z-10 group-hover:bg-[#58C7FF]/30 transition-colors" />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`font-display font-bold tracking-wider text-[#F8FAFC] group-hover:text-[#58C7FF] transition-colors ${currentSize.text}`}>
              ASTRA<span className="text-[#58C7FF]">-</span>SENTINEL
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#58C7FF]/15 text-[#58C7FF] border border-[#58C7FF]/30">
              AI
            </span>
          </div>
          <span className={`font-mono text-[#94A3B8] tracking-widest uppercase mt-0.5 ${currentSize.sub}`}>
            Mission Intelligence & Safety
          </span>
        </div>
      )}
    </Link>
  );
};
