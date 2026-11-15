import React, { useCallback, useEffect, useRef, useState } from 'react';
import { alarm } from '../services/alarm';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, HeartPulse, Activity } from 'lucide-react';
import { EmbeddedModule } from '../components/common/EmbeddedModule';
import { MODULES } from './ModulePage';

export const HEALTH_MONITOR_SRC = '/health-monitor/index.html';

/** Embedded Astronaut Health Monitor, used on its own page, in Mission Control and on Home. */
export const HealthMonitorPanel: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const obsRef = useRef<MutationObserver | null>(null);

  // Feed the monitor's SYSTEM status (NOMINAL / WARNING / CRITICAL) into the emergency alarm.
  const onReady = useCallback((w: Window) => {
    obsRef.current?.disconnect();
    const sys = w.document.getElementById('sys');
    if (!sys) return;
    const push = () => {
      const t = (sys.textContent || '').toUpperCase();
      alarm.report('health-monitor', t.includes('CRITICAL') ? 'CRITICAL' : t.includes('WARNING') ? 'WARNING' : 'NORMAL');
    };
    push();
    obsRef.current = new MutationObserver(push);
    obsRef.current.observe(sys, { childList: true, characterData: true, subtree: true });
  }, []);

  useEffect(
    () => () => {
      obsRef.current?.disconnect();
      alarm.report('health-monitor', 'NORMAL');
    },
    []
  );

  return (
    <EmbeddedModule
      src={HEALTH_MONITOR_SRC}
      title="Astronaut Health Monitor"
      label="Astronaut Health Monitor · simulated crew telemetry"
      minHeight={compact ? 700 : 900}
      onReady={onReady}
    />
  );
};

/**
 * Health area used across the site: the AstroHealth AI agent (default) and the crew Health Monitor,
 * switchable with tabs. Only the visible app is loaded.
 */
export const HealthSuite: React.FC<{ compact?: boolean; initial?: 'agent' | 'monitor' }> = ({ compact = false, initial = 'agent' }) => {
  const [view, setView] = useState<'agent' | 'monitor'>(initial);
  const tabs = [
    { id: 'agent' as const, label: 'AstroHealth AI · AstroAgent', icon: <HeartPulse className="w-4 h-4" /> },
    { id: 'monitor' as const, label: 'Crew Health Monitor', icon: <Activity className="w-4 h-4" /> },
  ];
  return (
    <div className="space-y-3">
      <div className="inline-flex flex-wrap gap-1.5 p-1.5 rounded-xl glass-panel">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setView(t.id)}
            aria-pressed={view === t.id}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-colors ${
              view === t.id ? 'bg-[#58C7FF] text-[#05070D] font-semibold shadow-[0_0_18px_rgba(88,199,255,.4)]' : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>
      {view === 'agent' ? (
        <EmbeddedModule
          key="agent"
          src={MODULES.astrohealth.src}
          title="AstroHealth AI"
          label="AstroHealth AI · signal review & recommendations"
          minHeight={compact ? 680 : 760}
        />
      ) : (
        <HealthMonitorPanel key="monitor" compact={compact} />
      )}
    </div>
  );
};

export const HealthMonitor: React.FC = () => (
  <div className="min-h-screen pt-28 pb-20 text-[#F8FAFC]">
    <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div className="space-y-3 max-w-3xl">
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-[#EF4444]/10 text-[#FCA5A5] border border-[#EF4444]/30 inline-flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5" /> AstroHealth AI · Crew Health Monitoring
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight">Astronaut Health · AstroHealth AI</h1>
          <p className="text-base text-[#94A3B8] leading-relaxed">
            AstroHealth AI reviews the crew-health snapshot and recommends cautious next steps; the Crew Health Monitor
            shows the suit sensor map, ECG, vitals and cabin metrics. All values are simulated in your browser.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/mission-control?tab=vitals" className="px-5 py-2.5 rounded-xl text-xs font-mono font-semibold bg-[#58C7FF] text-[#05070D] hover:bg-[#8AD8FF] inline-flex items-center gap-1.5 shadow-[0_0_24px_rgba(88,199,255,.35)]">
            View in Mission Control <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link to="/technology#astrohealth" className="px-5 py-2.5 rounded-xl text-xs font-mono text-[#E2E8F0] glass-panel hover:border-[#58C7FF]/50">
            AstroHealth AI specs
          </Link>
        </div>
      </div>
      <HealthSuite />
      <p className="mt-4 text-[11px] font-mono text-[#64748B]">
        Prototype only. Not medically validated; provides no diagnosis and never controls a spacecraft.
      </p>
    </section>
  </div>
);

export default HealthMonitor;
