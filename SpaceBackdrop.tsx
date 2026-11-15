import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Starfield } from './Starfield';

/**
 * Site-wide animated orbital backdrop.
 *
 * Layers (back to front): drifting nebula, twinkling starfield with meteors, Earth with a pulsing
 * atmosphere, aurora shimmer and sun flare, a rotating planet with an orbiting moon (home only),
 * and a floating space station with blinking beacons and a light sweep across its arrays.
 *
 * Motion is kept GPU-friendly: every looping animation is a transform or opacity on its own layer,
 * so the heavy SVG filters (clouds, craters, blur) rasterize once. Pointer movement adds depth
 * parallax and scrolling eases the hero objects back. Reduced-motion users get the still scene.
 */
export const SpaceBackdrop: React.FC = () => {
  const { pathname } = useLocation();
  const hero = pathname === '/';
  const rootRef = useRef<HTMLDivElement>(null);
  // The noise-textured layers (nebula, cloud tops, planet surface) are the costliest to rasterize,
  // so they are added just after the first paint instead of delaying it.
  const [rich, setRich] = useState(false);
  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (n: number) => void;
    };
    if (w.requestIdleCallback && w.cancelIdleCallback) {
      const id = w.requestIdleCallback(() => setRich(true), { timeout: 600 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(() => setRich(true), 200);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let raf = 0;
    let mx = 0;
    let my = 0;
    const apply = () => {
      raf = 0;
      const y = window.scrollY;
      el.style.setProperty('--mx', mx.toFixed(3));
      el.style.setProperty('--my', my.toFixed(3));
      el.style.setProperty('--sy', Math.min(y, 1600).toFixed(0));
      el.style.setProperty('--hero-fade', hero ? Math.max(0.25, 1 - y / 900).toFixed(3) : '1');
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onMove = (e: PointerEvent) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
      queue();
    };
    apply();
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', queue, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', queue);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [hero]);

  // Earth geometry in a 2000x1000 viewBox: hero rises from the lower-left, inner pages show a wide limb.
  const E = hero ? { cx: -200, cy: 3300, r: 2538 } : { cx: 1000, cy: 2700, r: 2200 };
  const earthAspect = hero ? 'xMinYMax slice' : 'xMidYMin slice';

  return (
    <div ref={rootRef} className={`space-backdrop ${hero ? 'is-hero' : ''}`} aria-hidden="true">
      {/* nebula haze, slowly breathing and drifting */}
      <div className="sb-par sb-par-1">
        <div className="sb-nebula-drift">
          <svg className="sb-nebula" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
            <defs>
              <filter id="sbNeb" x="0" y="0" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.0022 0.004" numOctaves="4" seed="11" />
                <feColorMatrix values="0 0 0 0 0.22  0 0 0 0 0.5  0 0 0 0 1  0 0 0 1.5 -0.5" />
                <feGaussianBlur stdDeviation="10" />
              </filter>
              <filter id="sbNeb2" x="0" y="0" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.003 0.002" numOctaves="3" seed="23" />
                <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.35  0 0 0 0 1  0 0 0 1.4 -0.62" />
                <feGaussianBlur stdDeviation="16" />
              </filter>
              <radialGradient id="sbNebMask" cx="50%" cy="40%" r="62%">
                <stop offset="0" stopColor="#fff" />
                <stop offset="1" stopColor="#000" />
              </radialGradient>
              <mask id="sbNebM"><rect width="1600" height="900" fill="url(#sbNebMask)" /></mask>
            </defs>
            {rich && (
              <>
                <rect width="1600" height="900" filter="url(#sbNeb)" mask="url(#sbNebM)" />
                <rect width="1600" height="900" filter="url(#sbNeb2)" mask="url(#sbNebM)" opacity="0.7" />
              </>
            )}
          </svg>
        </div>
      </div>

      <Starfield />

      {/* Earth */}
      <div className="sb-par sb-par-earth">
        <div className="sb-intro-earth">
          <svg className="sb-earth" viewBox="0 0 2000 1000" preserveAspectRatio={earthAspect}>
            <defs>
              <radialGradient id="sbEarthBody" cx={hero ? '55%' : '62%'} cy="6%" r="80%">
                <stop offset="0" stopColor="#4f9bff" />
                <stop offset="0.1" stopColor="#2563eb" />
                <stop offset="0.28" stopColor="#0f3482" />
                <stop offset="0.6" stopColor="#061636" />
                <stop offset="1" stopColor="#020713" />
              </radialGradient>
              <filter id="sbClouds" x="0" y="0" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.004 0.012" numOctaves="4" seed="7" />
                <feColorMatrix values="0 0 0 0 0.85  0 0 0 0 0.93  0 0 0 0 1  0 0 0 1.8 -0.78" />
              </filter>
              <linearGradient id="sbNight" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="#02050c" stopOpacity={hero ? 0 : 0.6} />
                <stop offset="0.5" stopColor="#02050c" stopOpacity="0.05" />
                <stop offset="1" stopColor="#02050c" stopOpacity={hero ? 0.7 : 0} />
              </linearGradient>
              <clipPath id="sbEarthClip"><circle cx={E.cx} cy={E.cy} r={E.r} /></clipPath>
            </defs>
            <g clipPath="url(#sbEarthClip)">
              <circle cx={E.cx} cy={E.cy} r={E.r} fill="url(#sbEarthBody)" />
              {rich && <rect x="0" y={E.cy - E.r} width="2000" height="1000" filter="url(#sbClouds)" opacity="0.6" />}
              <rect x="0" y={E.cy - E.r} width="2000" height="1000" fill="url(#sbNight)" />
            </g>
            <circle cx={E.cx} cy={E.cy} r={E.r + 1} fill="none" stroke="#e6f6ff" strokeOpacity="0.95" strokeWidth="3" />
          </svg>

          {/* atmosphere bloom: separate layer so its pulse is a cheap opacity animation */}
          <svg className="sb-earth sb-atmo" viewBox="0 0 2000 1000" preserveAspectRatio={earthAspect}>
            <defs>
              <filter id="sbBlur"><feGaussianBlur stdDeviation="12" /></filter>
              <filter id="sbBlurWide"><feGaussianBlur stdDeviation="50" /></filter>
            </defs>
            <circle cx={E.cx} cy={E.cy} r={E.r + 60} fill="none" stroke="#3b9cff" strokeOpacity="0.45" strokeWidth="130" filter="url(#sbBlurWide)" />
            <circle cx={E.cx} cy={E.cy} r={E.r + 14} fill="none" stroke="#8fd3ff" strokeOpacity="0.85" strokeWidth="26" filter="url(#sbBlur)" />
            <circle cx={E.cx} cy={E.cy} r={E.r + 5} fill="none" stroke="#58c7ff" strokeOpacity="0.8" strokeWidth="8" filter="url(#sbBlur)" />
          </svg>

          {/* aurora shimmer hugging the limb */}
          <svg className="sb-earth sb-aurora" viewBox="0 0 2000 1000" preserveAspectRatio={earthAspect}>
            <defs><filter id="sbAur"><feGaussianBlur stdDeviation="18" /></filter></defs>
            <circle cx={E.cx} cy={E.cy} r={E.r + 30} fill="none" stroke="#34f5c5" strokeOpacity="0.35" strokeWidth="26" strokeDasharray="220 160 90 260" filter="url(#sbAur)" />
            <circle cx={E.cx} cy={E.cy} r={E.r + 46} fill="none" stroke="#a78bfa" strokeOpacity="0.25" strokeWidth="20" strokeDasharray="140 300 200 120" filter="url(#sbAur)" />
          </svg>

          <div className="sb-flare" />
        </div>
      </div>

      {/* Planet with rotating surface and orbiting moon (home hero) */}
      {hero && (
        <div className="sb-par sb-par-planet">
          <div className="sb-planet">
            <div className="sb-planet-float">
              <div className="sb-planet-halo" />
              <div className="sb-planet-ball">
                {rich && <div className="sb-planet-tex">
                  <svg viewBox="0 0 800 400" preserveAspectRatio="none">
                    <defs>
                      <filter id="sbCraters" x="0" y="0" width="100%" height="100%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="4" seed="3" stitchTiles="stitch" />
                        <feColorMatrix values="0 0 0 0 0.8  0 0 0 0 0.88  0 0 0 0 1  0 0 0 1.3 -0.5" />
                      </filter>
                      <filter id="sbBands" x="0" y="0" width="100%" height="100%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.002 0.03" numOctaves="3" seed="9" stitchTiles="stitch" />
                        <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.65  0 0 0 0 1  0 0 0 1.2 -0.45" />
                      </filter>
                    </defs>
                    <rect x="0" width="400" height="400" filter="url(#sbCraters)" />
                    <rect x="400" width="400" height="400" filter="url(#sbCraters)" />
                    <rect x="0" width="400" height="400" filter="url(#sbBands)" opacity="0.6" />
                    <rect x="400" width="400" height="400" filter="url(#sbBands)" opacity="0.6" />
                  </svg>
                </div>}
                <div className="sb-planet-shade" />
              </div>
              <div className="sb-moon" />
            </div>
          </div>
        </div>
      )}

      {/* Orbiting station */}
      <div className="sb-par sb-par-station">
        <div className="sb-station-wrap">
          <div className="sb-intro-station">
            <svg className="sb-station" viewBox="0 0 600 300">
              <defs>
                <pattern id="sbCells" width="10" height="10" patternUnits="userSpaceOnUse">
                  <rect width="10" height="10" fill="#1d3878" />
                  <rect width="10" height="5" fill="#27479a" />
                  <path d="M10 0H0V10" fill="none" stroke="#e0bf7a" strokeOpacity="0.4" strokeWidth="0.7" />
                </pattern>
                <pattern id="sbLattice" width="12" height="12" patternUnits="userSpaceOnUse">
                  <rect width="12" height="12" fill="#5b6577" />
                  <path d="M0 0L12 12M12 0L0 12" stroke="#b7c1d2" strokeWidth="1" />
                </pattern>
                <linearGradient id="sbHull" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#ffffff" />
                  <stop offset="0.5" stopColor="#b1bdcc" />
                  <stop offset="1" stopColor="#4b5565" />
                </linearGradient>
                <linearGradient id="sbArrayShade" x1="0" x2="1">
                  <stop offset="0" stopColor="#000" stopOpacity="0.3" />
                  <stop offset="0.5" stopColor="#8fc0ff" stopOpacity="0.2" />
                  <stop offset="1" stopColor="#000" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="sbSweep" x1="0" x2="1">
                  <stop offset="0" stopColor="#bfe6ff" stopOpacity="0" />
                  <stop offset="0.5" stopColor="#e9f6ff" stopOpacity="0.55" />
                  <stop offset="1" stopColor="#bfe6ff" stopOpacity="0" />
                </linearGradient>
                <clipPath id="sbArrayClip">
                  {[34, 96, 448, 510].map((x) => (
                    <React.Fragment key={x}>
                      <rect x={x} y="14" width="44" height="124" />
                      <rect x={x} y="162" width="44" height="124" />
                    </React.Fragment>
                  ))}
                </clipPath>
              </defs>

              {[34, 96, 448, 510].map((x) => (
                <g key={x}>
                  <rect x={x} y="14" width="44" height="124" fill="url(#sbCells)" stroke="#9cc0ff" strokeOpacity="0.5" />
                  <rect x={x} y="14" width="44" height="124" fill="url(#sbArrayShade)" />
                  <rect x={x} y="162" width="44" height="124" fill="url(#sbCells)" stroke="#9cc0ff" strokeOpacity="0.5" />
                  <rect x={x} y="162" width="44" height="124" fill="url(#sbArrayShade)" />
                  <rect x={x + 20} y="14" width="4" height="272" fill="#8b95a6" />
                </g>
              ))}
              {/* sunlight sweeping across the arrays */}
              <g clipPath="url(#sbArrayClip)">
                <rect className="sb-sweep" x="-160" y="0" width="140" height="300" fill="url(#sbSweep)" />
              </g>

              <rect x="20" y="143" width="560" height="14" fill="url(#sbLattice)" stroke="#2f3846" />

              {[196, 360].map((x) => (
                <g key={x} fill="#eef3f9" stroke="#9aa6b8" strokeWidth="0.8">
                  <rect x={x} y="70" width="46" height="16" />
                  <rect x={x} y="90" width="46" height="16" />
                  <rect x={x} y="110" width="46" height="16" />
                  <rect x={x + 21} y="86" width="4" height="57" fill="#9aa6b8" />
                </g>
              ))}

              <rect x="282" y="96" width="36" height="122" rx="14" fill="url(#sbHull)" />
              <rect x="240" y="158" width="120" height="30" rx="13" fill="url(#sbHull)" />
              <rect x="290" y="210" width="22" height="78" rx="9" fill="url(#sbHull)" />
              <rect x="258" y="232" width="86" height="8" fill="#1d3878" stroke="#9cc0ff" strokeOpacity=".5" />
              <circle cx="300" cy="173" r="10" fill="#cbd5e1" stroke="#64748b" />
              <rect x="318" y="118" width="26" height="14" rx="6" fill="#d7dee8" />
              <rect x="256" y="120" width="26" height="14" rx="6" fill="#d7dee8" />

              {/* navigation beacons */}
              <circle cx="300" cy="150" r="3" fill="#58c7ff" className="sb-beacon" />
              <circle cx="22" cy="150" r="3" fill="#ff4d5e" className="sb-beacon sb-b2" />
              <circle cx="578" cy="150" r="3" fill="#3dffa8" className="sb-beacon sb-b3" />
              <circle cx="301" cy="286" r="2.4" fill="#ffffff" className="sb-beacon sb-b4" />
            </svg>
          </div>
        </div>
      </div>

      <div className="sb-vignette" />
    </div>
  );
};

export default SpaceBackdrop;
