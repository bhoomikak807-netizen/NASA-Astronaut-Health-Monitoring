import React, { useEffect, useState } from 'react';

/**
 * HudHero — vector recreation of the looping sci-fi HUD reference (14.5 s loop):
 *   0–4 s   full HUD, amber warning triangle blinks
 *   3–4 s   glitch dim, "WARNING" tag flashes
 *   4–5 s   everything clears, single ring draws in
 *   5–6 s   planet ignites (orange rim glow)
 *   6–9 s   side widgets (hexes, code, histogram) fade in, orbit ellipses sweep in
 *   9–14 s  hold with slow ring rotation, then loop
 * Purely decorative and simulated: no data is shown. Reduced-motion = static full state.
 */
const CODE_LINES = [92, 70, 84, 58, 76, 40, 66, 52];
const HEX = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');

export const HudHero: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [reduced, setReduced] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  return (
    <div className={`hud-root ${reduced ? 'hud-static' : ''} ${className}`} aria-hidden="true">
      {!videoFailed ? (
        <video
          className="hud-video"
          src="/media/hud-loop.mp4"
          poster="/media/hud-poster.jpg"
          autoPlay={!reduced}
          loop
          muted
          playsInline
          preload="auto"
          tabIndex={-1}
          onError={() => setVideoFailed(true)}
        />
      ) : (
        <>
          <div className="hud-teal" />
          <div className="hud-sheen" />
        </>
      )}
      <svg style={{ display: videoFailed ? undefined : 'none' }} viewBox="0 0 410 660" className="hud-svg" preserveAspectRatio="xMidYMid slice" role="presentation">
        <defs>
          <radialGradient id="hudPlanet" cx="50%" cy="45%" r="55%">
            <stop offset="0" stopColor="#7a1d0a" />
            <stop offset="0.65" stopColor="#c2410c" />
            <stop offset="1" stopColor="#fb923c" />
          </radialGradient>
          <radialGradient id="hudGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0.7" stopColor="#f97316" stopOpacity="0.55" />
            <stop offset="1" stopColor="#f97316" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hudHist" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5eead4" />
            <stop offset="1" stopColor="#0d9488" stopOpacity="0.5" />
          </linearGradient>
          <filter id="hudNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
            <feColorMatrix values="0 0 0 0 1  0 0 0 0 0.45  0 0 0 0 0.1  0 0 0 0.9 -0.35" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <clipPath id="hudClip"><circle cx="205" cy="318" r="62" /></clipPath>
        </defs>

        {/* ---- peripheral widgets (fade in after ring) ---- */}
        <g className="hud-periph" fill="none" stroke="#5eead4" strokeWidth="0.7">
          <rect x="18" y="14" width="190" height="62" opacity="0.7" />
          <rect x="18" y="14" width="190" height="6" fill="#5eead4" fillOpacity="0.15" />
          {CODE_LINES.map((w, i) => (
            <rect key={i} className="hud-code" style={{ animationDelay: `${i * 0.25}s` }}
              x="24" y={26 + i * 6} width={w * 1.6} height="1.6" fill="#99f6e4" stroke="none" opacity="0.7" />
          ))}
          <polygon points={HEX(335, 30, 20)} stroke="#e2e8f0" />
          <polygon points={HEX(362, 46, 14)} stroke="#e2e8f0" opacity="0.7" />
          <polygon points={HEX(318, 62, 10)} stroke="#e2e8f0" opacity="0.6" />
          <rect x="30" y="92" width="62" height="10" fill="#5eead4" fillOpacity="0.55" stroke="none" />
          <rect x="22" y="470" width="36" height="9" stroke="#ef4444" />
          <text x="62" y="477" fill="#ef4444" fontSize="6" fontFamily="JetBrains Mono, monospace" stroke="none">Tmax Warning</text>
          <text x="318" y="478" fill="#5eead4" fontSize="6" fontFamily="JetBrains Mono, monospace" stroke="none">Tracking Engine</text>
          <polygon points="205,590 225,560 238,575 252,540 270,566 300,586 205,590" fill="url(#hudHist)" stroke="none" />
          <polygon points="236,590 262,545 290,588" fill="url(#hudHist)" stroke="none" opacity="0.7" />
          {[52, 82, 112, 142].map((x, i) => (
            <g key={x}><circle cx={x} cy={600} r={14 - i} stroke="#cbd5e1" opacity="0.8" /><circle cx={x} cy={600} r={7 - i / 2} stroke="#cbd5e1" opacity="0.5" /></g>
          ))}
          {[0, 1, 2].map((i) => (
            <polygon key={i} points={HEX(52 + i * 14, 500 + (i % 2) * 8, 6)} stroke={i === 1 ? '#5eead4' : '#fca5a5'} fill={i === 1 ? '#5eead4' : 'none'} fillOpacity="0.5" />
          ))}
          <circle cx="60" cy="152" r="9" stroke="#fbbf24" /><circle cx="60" cy="152" r="4" fill="#fde68a" stroke="none" />
          <circle cx="340" cy="600" r="9" stroke="#f59e0b" /><circle cx="340" cy="600" r="4" fill="#fbbf24" stroke="none" />
        </g>

        {/* ---- tilted orbit ellipses ---- */}
        <g className="hud-orbit" fill="none" stroke="#e2f8ff" transform="rotate(-24 205 318)">
          <ellipse cx="205" cy="318" rx="95" ry="290" strokeWidth="0.9" pathLength="1" />
          <ellipse cx="205" cy="318" rx="118" ry="285" strokeWidth="0.5" pathLength="1" opacity="0.6" strokeDasharray="0.02 0.01" />
          <ellipse cx="205" cy="318" rx="75" ry="250" strokeWidth="0.5" pathLength="1" opacity="0.5" />
          {!reduced && (
            <circle r="5" fill="#fbbf24" stroke="#fde68a">
              <animateMotion dur="14.5s" repeatCount="indefinite" path="M205,28 A95,290 0 1,1 205,608 A95,290 0 1,1 205,28" />
            </circle>
          )}
        </g>

        {/* ---- core: ring + planet ---- */}
        <g className="hud-core">
          <circle cx="205" cy="318" r="104" fill="url(#hudGlow)" className="hud-halo" />
          <circle className="hud-ring-draw" cx="205" cy="318" r="86" fill="none" stroke="#fff" strokeWidth="1.6" pathLength="1" />
          <g className="hud-spin-a" style={{ transformOrigin: '205px 318px' }}>
            <circle cx="205" cy="318" r="76" fill="none" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="38 14 8 14" />
          </g>
          <g className="hud-spin-b" style={{ transformOrigin: '205px 318px' }}>
            <circle cx="205" cy="318" r="95" fill="none" stroke="#94a3b8" strokeWidth="0.7" strokeDasharray="2 5" />
            <circle cx="205" cy="223" r="2.5" fill="#f87171" />
            <circle cx="300" cy="318" r="2.5" fill="#5eead4" />
          </g>
          <g className="hud-planet">
            <circle cx="205" cy="318" r="62" fill="url(#hudPlanet)" />
            <rect x="143" y="256" width="124" height="124" filter="url(#hudNoise)" clipPath="url(#hudClip)" opacity="0.6" />
            <circle cx="205" cy="318" r="62" fill="none" stroke="#fdba74" strokeWidth="2.5" className="hud-rim" />
            <path d="M158 292 A62 62 0 0 1 252 292" fill="none" stroke="#fff7ed" strokeWidth="1.4" opacity="0.85" />
          </g>
          <line x1="168" y1="262" x2="190" y2="290" stroke="#fca5a5" strokeWidth="1" opacity="0.8" />
          <line x1="242" y1="262" x2="222" y2="290" stroke="#fca5a5" strokeWidth="1" opacity="0.8" />
        </g>

        {/* ---- warning: triangle blink + glitch label ---- */}
        <g className="hud-warn">
          <polygon points="212,88 222,106 202,106" fill="#facc15" />
          <rect x="209" y="94" width="1.6" height="7" fill="#111" /><rect x="209" y="102.5" width="1.6" height="1.6" fill="#111" />
          <g className="hud-warn-tag">
            <rect x="228" y="92" width="64" height="18" fill="none" stroke="#fbbf24" strokeWidth="0.8" />
            <text x="260" y="105" textAnchor="middle" fill="#fef3c7" fontSize="9" letterSpacing="1" fontFamily="Space Grotesk, sans-serif">WARNING</text>
          </g>
        </g>
      </svg>
      <div className="hud-fade" />
    </div>
  );
};
