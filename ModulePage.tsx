import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Flame, HeartPulse, Radiation } from 'lucide-react';
import { EmbeddedModule } from '../components/common/EmbeddedModule';

export interface ModuleInfo {
  key: string;
  src: string;
  title: string;
  badge: string;
  tone: string;
  icon: React.ReactNode;
  description: string;
  notice: string;
  techId: string;
}

/** Standalone apps shipped with the site (served from /public, themed by modules/apply_theme.py). */
export const MODULES: Record<'astrohealth' | 'firehealth' | 'radiation', ModuleInfo> = {
  astrohealth: {
    key: 'astrohealth',
    src: '/astrohealth-ai/index.html',
    title: 'AstroHealth AI',
    badge: 'Crew Health AI · AstroAgent',
    tone: '#58C7FF',
    icon: <HeartPulse className="w-3.5 h-3.5" />,
    description:
      'Signal review and recommendations for the crew-health snapshot. AstroAgent plans, uses tools, tracks trends, runs what-if checks and posts an action plan on its own when status turns critical.',
    notice: 'Runs fully in your browser. Synthetic data only; not a medical device and gives no diagnosis.',
    techId: 'astrohealth',
  },
  firehealth: {
    key: 'firehealth',
    src: '/aegis-fds/index.html',
    title: 'FireHealth AI · Aegis FDS',
    badge: 'Fire Detection & Alarm',
    tone: '#F59E0B',
    icon: <Flame className="w-3.5 h-3.5" />,
    description:
      'Aegis watches smoke, heat, carbon monoxide and oxygen in eight compartments. When two sensors agree a fire has started, it sounds the alarm and shows the crew exactly where.',
    notice: 'Prototype with simulated sensors. Use Start test fire, then Douse fire, to see the automatic alarm.',
    techId: 'firehealth',
  },
  radiation: {
    key: 'radiation',
    src: '/radiation-monitor/index.html',
    title: 'Spacecraft Radiation Monitor',
    badge: 'SolarShield Research',
    tone: '#A78BFA',
    icon: <Radiation className="w-3.5 h-3.5" />,
    description:
      'Live proton flux, electron flux and modelled dose rate with editable limits on every card. Alerts fire when a reading leaves its range; scenario buttons demonstrate solar particle events.',
    notice: 'Simulated demo data. Flux is not absorbed dose; do not use for operational decisions.',
    techId: 'solarshield',
  },
};

export const ModulePage: React.FC<{ module: ModuleInfo }> = ({ module: m }) => (
  <div className="min-h-screen pt-24 pb-16 text-[#F8FAFC]">
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      <Link to={`/technology#${m.techId}`} className="inline-flex items-center gap-1.5 text-xs font-mono text-[#94A3B8] hover:text-[#58C7FF] mb-4">
        <ArrowLeft className="w-3.5 h-3.5" /> Technology / {m.title}
      </Link>
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-6">
        <div className="space-y-3 max-w-3xl">
          <span
            className="px-3 py-1 rounded-full text-xs font-mono inline-flex items-center gap-1.5 border"
            style={{ color: m.tone, borderColor: `${m.tone}66`, background: `${m.tone}1A` }}
          >
            {m.icon} {m.badge}
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight">{m.title}</h1>
          <p className="text-base text-[#94A3B8] leading-relaxed">{m.description}</p>
        </div>
        <div className="p-3 rounded-xl glass-panel flex items-start gap-2.5 max-w-md">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: m.tone }} />
          <p className="text-[11px] text-[#94A3B8] leading-relaxed">{m.notice}</p>
        </div>
      </div>
      <EmbeddedModule src={m.src} title={m.title} label={`${m.title} · live`} minHeight={760} eager />
    </section>
  </div>
);

export const AstroHealthPage: React.FC = () => <ModulePage module={MODULES.astrohealth} />;
export const FireHealthPage: React.FC = () => <ModulePage module={MODULES.firehealth} />;
export const RadiationPage: React.FC = () => <ModulePage module={MODULES.radiation} />;

export default ModulePage;
