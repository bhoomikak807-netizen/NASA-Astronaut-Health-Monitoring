import React, { useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, ArrowLeft, AlertCircle } from 'lucide-react';
import { EmbeddedModule } from '../components/common/EmbeddedModule';

const QN_TABS = ['overview', 'live', 'gps', 'deepspace', 'quantum', 'pulsar', 'twin', 'research'] as const;

type QnTab = (typeof QN_TABS)[number];

/** QuantumNav Research — the QuantumNav Live app, hosted under Technology. */
export const QuantumNav: React.FC = () => {
  const { hash } = useLocation();
  const initial: QnTab = QN_TABS.find((t) => `#${t}` === hash) ?? 'overview';
  const onReady = useCallback((w: Window) => {
    if (initial !== 'overview') w.location.hash = initial;
  }, [initial]);

  return (
    <div className="min-h-screen pt-24 pb-16 text-[#F8FAFC]">
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/technology#quantumnav" className="inline-flex items-center gap-1.5 text-xs font-mono text-[#94A3B8] hover:text-[#58C7FF] mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Technology / QuantumNav Research
        </Link>

        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-6">
          <div className="space-y-3 max-w-3xl">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-[#8B5CF6]/15 text-[#C4B5FD] border border-[#8B5CF6]/40 inline-flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" /> Research Concept · Live Simulation
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight">QuantumNav Research</h1>
            <p className="text-base text-[#94A3B8] leading-relaxed">
              GPS-denied navigation for deep space: cold-atom interferometer inertial sensing, X-ray pulsar timing fixes and a
              filter that fuses them, with Earth GPS (your device location) as the real-world reference.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-start gap-2.5 max-w-md">
            <AlertCircle className="w-4 h-4 text-[#A78BFA] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              Cislunar and deep-space modes are simulations. Only Mode A uses real data (your browser's location, with permission).
            </p>
          </div>
        </div>

        <EmbeddedModule
          key={initial}
          src="/quantumnav/index.html"
          title="QuantumNav Live"
          label="QuantumNav Live · navigation console"
          height="calc(100vh - 150px)"
          minHeight={720}
          onReady={onReady}
        />
      </section>
    </div>
  );
};

export default QuantumNav;
