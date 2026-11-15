import React from 'react';
import {
  Heart,
  Flame,
  Cpu,
  AlertTriangle,
  Activity,
  History,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Terminal,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Platform: React.FC = () => {
  const platformPillars = [
    {
      letter: 'A',
      title: 'Astronaut Health Monitoring',
      desc: 'Real-time telemetry stream ingest tracking ECG heart rate, pulse oximetry arterial oxygen saturation, core thermoregulation, and cognitive fatigue indices.',
      icon: <Heart className="w-6 h-6 text-[#EF4444]" />,
      badge: 'BIOMEDICAL STREAM',
    },
    {
      letter: 'B',
      title: 'Spacecraft Environmental Monitoring',
      desc: 'Multi-point atmospheric monitoring measuring cabin barometric pressure, carbon dioxide, oxygen percentages, volatile organic compounds, and optical aerosol smoke densities.',
      icon: <Flame className="w-6 h-6 text-[#F59E0B]" />,
      badge: 'ATMOSPHERIC SENSING',
    },
    {
      letter: 'C',
      title: 'AI Risk Detection & Multi-Sensor Fusion',
      desc: 'Multivariate statistical engines evaluating cross-sensor anomalies in real time to isolate coincident biological stress and spacecraft degradation.',
      icon: <Cpu className="w-6 h-6 text-[#58C7FF]" />,
      badge: 'FUSION INFERENCE',
    },
    {
      letter: 'D',
      title: 'Emergency Alert Management',
      desc: 'Categorical triage classifying conditions into Normal, Warning, and Critical, with audible alert triggers, flight operator acknowledgment states, and emergency procedures.',
      icon: <AlertTriangle className="w-6 h-6 text-[#EF4444]" />,
      badge: 'TRIAGE PROTOCOL',
    },
    {
      letter: 'E',
      title: 'Mission Telemetry Visualization',
      desc: 'Low-latency aerospace dashboard displaying rolling timeseries curves, subsystem health meters, orbital velocity, and communications latency indicators.',
      icon: <Activity className="w-6 h-6 text-[#10B981]" />,
      badge: 'AVIONICS CONSOLE',
    },
    {
      letter: 'F',
      title: 'Historical Event Analysis',
      desc: 'Structured chronological event logging capturing flight anomalies, operator acknowledgments, and simulated scenario transitions for post-flight debriefing.',
      icon: <History className="w-6 h-6 text-[#8B5CF6]" />,
      badge: 'FLIGHT RECORDER',
    },
  ];

  const useCases = [
    {
      title: 'Commercial Crew Transit Safety',
      desc: 'Monitoring commercial orbital capsules during launch, docking, and re-entry phases where rapid cabin depressurization or electrical short-circuits demand instant triage.',
    },
    {
      title: 'Lunar Orbital Gateway & Surface Habitats',
      desc: 'Operating during uncrewed autonomous dormancy periods and crewed habitation phases, managing ECLSS life support loops and solar particle storm alerts.',
    },
    {
      title: 'Spacewalk (EVA) Metabolic Management',
      desc: 'Tracking suited astronauts outside the spacecraft, correlating extravehicular physiological exertion with spacesuit oxygen consumption and thermal garments.',
    },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 text-[#F8FAFC]">
      {/* Page Header */}
      <section className="relative py-16 tech-grid border-b border-[#1E2D44]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#58C7FF]/10 text-[#58C7FF] border border-[#58C7FF]/30 inline-block">
            Prototype Platform Architecture
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight">
            ASTRA-SENTINEL AI Safety Intelligence Platform
          </h1>
          <p className="text-base sm:text-lg text-[#94A3B8] max-w-3xl mx-auto leading-relaxed">
            A unified prototype platform combining astronaut physiological monitoring, spacecraft environmental sensing,
            AI risk classification, and mission-control visualization.
          </p>
        </div>
      </section>

      {/* Six Pillars of the Platform */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-mono text-[#58C7FF] uppercase tracking-wider">Functional Capabilities</span>
          <h2 className="text-3xl font-bold font-display">Six Core Architectural Pillars</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platformPillars.map((p) => (
            <div key={p.letter} className="space-card rounded-2xl p-6 border border-[#1E2D44] relative group hover:border-[#58C7FF]/50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-[#05070D] border border-[#1E2D44]">
                  {p.icon}
                </div>
                <span className="text-xs font-mono font-bold text-[#58C7FF] bg-[#58C7FF]/10 px-2 py-0.5 rounded border border-[#58C7FF]/25">
                  PILLAR {p.letter}
                </span>
              </div>
              <h3 className="text-base font-bold font-display text-[#F8FAFC]">{p.title}</h3>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">{p.desc}</p>
              <div className="mt-4 pt-3 border-t border-[#1E2D44] text-[10px] font-mono text-[#64748B]">
                {p.badge}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Product Architecture Diagram */}
      <section className="py-16 band border-y">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-mono text-[#8B5CF6] uppercase tracking-wider">System Integration</span>
            <h2 className="text-3xl font-bold font-display">Product Architecture Model</h2>
            <p className="text-xs text-[#94A3B8]">
              Data pathways connecting spaceflight edge sensors to the unified Mission Control console.
            </p>
          </div>

          <div className="space-card rounded-3xl p-6 sm:p-10 border border-[#58C7FF]/30">
            {/* Top Tier: Data Ingestion */}
            <div className="p-4 rounded-xl bg-[#05070D] border border-[#1E2D44] text-center mb-6">
              <span className="text-xs font-mono text-[#58C7FF] block font-semibold mb-2">TIER 1: EDGE SENSORS & OPEN SCIENCE STREAMS</span>
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-[#94A3B8]">
                <span className="px-2.5 py-1 rounded bg-[#101826] border border-[#1E2D44]">Astronaut ECG / PPG</span>
                <span className="px-2.5 py-1 rounded bg-[#101826] border border-[#1E2D44]">Cabin Pressure & Temp</span>
                <span className="px-2.5 py-1 rounded bg-[#101826] border border-[#1E2D44]">Laser Smoke Backscatter</span>
                <span className="px-2.5 py-1 rounded bg-[#101826] border border-[#1E2D44]">NASA OSDR Studies</span>
                <span className="px-2.5 py-1 rounded bg-[#101826] border border-[#1E2D44]">NASA DONKI Space Weather</span>
              </div>
            </div>

            {/* Middle Tier: AI Core Processing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Link to="/technology/astrohealth" className="block p-4 rounded-xl bg-[#05070D]/70 border border-[#58C7FF]/40 text-center hover:bg-[#58C7FF]/10 transition-colors">
                <span className="text-xs font-mono text-[#58C7FF] block font-bold mb-1">AstroHealth Engine</span>
                <p className="text-[11px] text-[#94A3B8]">Physiological anomaly detection and baseline statistical tracking.</p>
                <span className="mt-2 inline-block text-[10px] font-mono text-[#58C7FF]">Open live →</span>
              </Link>

              <Link to="/mission-control?tab=ai" className="block p-4 rounded-xl bg-[#05070D]/70 border border-[#8B5CF6]/40 text-center hover:bg-[#8B5CF6]/10 transition-colors">
                <span className="text-xs font-mono text-[#8B5CF6] block font-bold mb-1">Multi-Sensor Fusion</span>
                <p className="text-[11px] text-[#94A3B8]">Cross-subsystem Bayesian inference and compound risk scoring.</p>
                <span className="mt-2 inline-block text-[10px] font-mono text-[#8B5CF6]">Open live →</span>
              </Link>

              <Link to="/technology/firehealth" className="block p-4 rounded-xl bg-[#05070D]/70 border border-[#F59E0B]/40 text-center hover:bg-[#F59E0B]/10 transition-colors">
                <span className="text-xs font-mono text-[#F59E0B] block font-bold mb-1">FireHealth AI</span>
                <p className="text-[11px] text-[#94A3B8]">Atmospheric pyrolytic gas detection and combustion classification.</p>
                <span className="mt-2 inline-block text-[10px] font-mono text-[#F59E0B]">Open live →</span>
              </Link>
            </div>

            {/* Bottom Tier: Presentation Layer */}
            <div className="p-4 rounded-xl bg-[#05070D] border border-[#10B981]/40 text-center">
              <span className="text-xs font-mono text-[#10B981] block font-semibold mb-2">TIER 3: UNIFIED OPERATIONAL MISSION CONTROL</span>
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-[#94A3B8]">
                <Link to="/mission-control?tab=vitals" className="px-2.5 py-1 rounded bg-[#101826] border border-[#1E2D44] hover:border-[#10B981]/60 hover:text-white transition-colors">Real-time Telemetry Graphs</Link>
                <Link to="/mission-control?tab=events" className="px-2.5 py-1 rounded bg-[#101826] border border-[#1E2D44] hover:border-[#10B981]/60 hover:text-white transition-colors">Explainable Alert Timeline</Link>
                <Link to="/mission-control?tab=modules" className="px-2.5 py-1 rounded bg-[#101826] border border-[#1E2D44] hover:border-[#10B981]/60 hover:text-white transition-colors">Module Diagnostics</Link>
                <Link to="/mission-control?tab=ai" className="px-2.5 py-1 rounded bg-[#101826] border border-[#1E2D44] hover:border-[#10B981]/60 hover:text-white transition-colors">Emergency Checklists</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Operational Use Cases */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-mono text-[#58C7FF] uppercase tracking-wider">Mission Profiles</span>
          <h2 className="text-3xl font-bold font-display">Target Exploration Use Cases</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {useCases.map((uc, i) => (
            <div key={i} className="space-card rounded-2xl p-6 border border-[#1E2D44]">
              <div className="text-xs font-mono text-[#58C7FF] mb-2 font-bold">USE CASE 0{i + 1}</div>
              <h3 className="text-base font-bold font-display text-[#F8FAFC]">{uc.title}</h3>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">{uc.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA to Open Mission Control */}
        <div className="mt-14 text-center">
          <Link
            to="/mission-control"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-mono text-sm font-bold bg-[#58C7FF] text-[#05070D] hover:bg-[#38BDF8] shadow-[0_0_25px_rgba(88,199,255,0.4)] transition-all"
          >
            <span>Launch Mission Control Prototype</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
