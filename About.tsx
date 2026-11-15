import React from 'react';
import { Shield, Target, Compass, Sparkles, BookOpen, Layers, Users, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen pt-28 pb-20 text-[#F8FAFC]">
      {/* Hero Header */}
      <section className="relative py-16 tech-grid border-b border-[#1E2D44]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#58C7FF]/10 text-[#58C7FF] border border-[#58C7FF]/30 inline-block">
            About ASTRA-SENTINEL AI
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight">
            Protecting Human Life Beyond Earth Through Intelligent Systems
          </h1>
          <p className="text-lg text-[#94A3B8] max-w-3xl mx-auto leading-relaxed">
            ASTRA-SENTINEL AI is focused on exploring intelligent technologies for astronaut safety and spacecraft environmental monitoring.
          </p>
        </div>
      </section>

      {/* Main Narrative & Philosophy */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Core Statement Card */}
        <div className="space-card rounded-2xl p-8 border border-[#58C7FF]/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#58C7FF]/5 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-2xl font-bold font-display text-[#F8FAFC] mb-4">Our Core Purpose</h2>
          <p className="text-base text-[#94A3B8] leading-relaxed">
            ASTRA-SENTINEL AI is focused on exploring intelligent technologies for astronaut safety and spacecraft environmental monitoring.
            We aim to combine artificial intelligence, sensor fusion, space science research, and advanced visualization to create systems
            that support safer human space exploration.
          </p>
          <p className="text-base text-[#94A3B8] leading-relaxed mt-4">
            Our approach emphasizes responsible AI, transparent risk assessment, reliable data processing, and research-driven innovation.
          </p>
        </div>

        {/* Mission and Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-card rounded-2xl p-8 border border-[#1E2D44]">
            <div className="p-3 rounded-xl bg-[#58C7FF]/15 text-[#58C7FF] w-fit mb-5">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-display text-[#F8FAFC]">Our Mission</h3>
            <p className="text-sm text-[#94A3B8] mt-3 leading-relaxed">
              To develop intelligent space safety technologies that help identify potential astronaut health risks and spacecraft emergencies
              earlier through AI, sensor fusion, and mission intelligence.
            </p>
          </div>

          <div className="space-card rounded-2xl p-8 border border-[#1E2D44]">
            <div className="p-3 rounded-xl bg-[#8B5CF6]/15 text-[#8B5CF6] w-fit mb-5">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-display text-[#F8FAFC]">Our Vision</h3>
            <p className="text-sm text-[#94A3B8] mt-3 leading-relaxed">
              To contribute to a future where human space exploration is safer, smarter, and more resilient across low Earth orbit, cislunar space,
              and future deep space expeditions.
            </p>
          </div>
        </div>

        {/* Core Focus & Approach to Innovation */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-display text-[#F8FAFC]">Our Core Focus</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-[#0A101B] border border-[#1E2D44]">
              <div className="text-xs font-mono text-[#58C7FF] mb-2 font-bold">FOCUS 01</div>
              <h4 className="text-base font-semibold text-[#F8FAFC]">Physiological Anomaly Detection</h4>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                Evaluating changes in astronaut heart rate variability, arterial saturation, core temperature, and cognitive fatigue in microgravity.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0A101B] border border-[#1E2D44]">
              <div className="text-xs font-mono text-[#8B5CF6] mb-2 font-bold">FOCUS 02</div>
              <h4 className="text-base font-semibold text-[#F8FAFC]">Environmental Emergency Sensing</h4>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                Analyzing cabin temperature excursions, smoldering micro-particulates, trace volatile gases, and pressure drop rates.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0A101B] border border-[#1E2D44]">
              <div className="text-xs font-mono text-[#10B981] mb-2 font-bold">FOCUS 03</div>
              <h4 className="text-base font-semibold text-[#F8FAFC]">Explainable Decision Support</h4>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                Providing transparent risk classifications and plain-language reasoning to empower flight directors and crew members.
              </p>
            </div>
          </div>
        </div>

        {/* Research Philosophy */}
        <div className="space-card rounded-2xl p-8 border border-[#1E2D44]">
          <h2 className="text-2xl font-bold font-display text-[#F8FAFC] mb-4">Our Research Philosophy</h2>
          <div className="space-y-4 text-sm text-[#94A3B8] leading-relaxed">
            <p>
              We believe safety-critical space software must be grounded in verified scientific facts. We do not treat artificial intelligence
              as an opaque black box. Every risk evaluation produced by our prototype includes supporting sensor evidence, baseline comparisons,
              and explicit confidence intervals.
            </p>
            <p>
              Open science data—such as studies from the NASA Open Science Data Repository (OSDR), heliospheric alerts from NASA DONKI,
              and satellite radiometry from NASA FIRMS—serves as the foundational baseline against which our anomaly detection models are designed and calibrated.
            </p>
          </div>
        </div>

        {/* Long-Term Vision */}
        <div className="space-card rounded-2xl p-8 border border-[#8B5CF6]/30">
          <h2 className="text-2xl font-bold font-display text-[#F8FAFC] mb-4">Our Long-Term Vision</h2>
          <p className="text-sm text-[#94A3B8] leading-relaxed">
            As commercial space stations, lunar Artemis habitats, and crewed Mars transits mature, the traditional paradigm of continuous ground-control
            oversight becomes physically constrained by speed-of-light delays. ASTRA-SENTINEL AI aspires to pioneer the autonomous safety layer
            that keeps human crews secure when Earth is millions of kilometers away.
          </p>
        </div>

        {/* Team Section (Editable Placeholders Only) */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-display text-[#F8FAFC]">Research & Engineering Team</h2>
            <span className="text-xs font-mono text-[#64748B]">CORE ROSTER (PLACEHOLDERS)</span>
          </div>
          <p className="text-xs text-[#94A3B8]">
            Editable developer placeholders. Team profiles will be populated as research fellows and engineers are onboarded.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-[#0A101B] border border-dashed border-[#1E2D44] text-center">
              <div className="w-16 h-16 rounded-full bg-[#101826] border border-[#1E2D44] flex items-center justify-center mx-auto mb-3 text-[#58C7FF]">
                <Users className="w-7 h-7" />
              </div>
              <h4 className="text-base font-semibold text-[#F8FAFC]">[Engineering Lead]</h4>
              <span className="text-xs font-mono text-[#58C7FF] block mt-0.5">Aerospace & AI Systems</span>
              <p className="text-[11px] text-[#64748B] mt-2">Spacecraft sensor fusion, real-time telemetry architectures.</p>
            </div>

            <div className="p-6 rounded-xl bg-[#0A101B] border border-dashed border-[#1E2D44] text-center">
              <div className="w-16 h-16 rounded-full bg-[#101826] border border-[#1E2D44] flex items-center justify-center mx-auto mb-3 text-[#8B5CF6]">
                <Users className="w-7 h-7" />
              </div>
              <h4 className="text-base font-semibold text-[#F8FAFC]">[Space Biology Researcher]</h4>
              <span className="text-xs font-mono text-[#8B5CF6] block mt-0.5">Physiological Data Modeling</span>
              <p className="text-[11px] text-[#64748B] mt-2">NASA OSDR integration, cardiovascular microgravity response.</p>
            </div>

            <div className="p-6 rounded-xl bg-[#0A101B] border border-dashed border-[#1E2D44] text-center">
              <div className="w-16 h-16 rounded-full bg-[#101826] border border-[#1E2D44] flex items-center justify-center mx-auto mb-3 text-[#10B981]">
                <Users className="w-7 h-7" />
              </div>
              <h4 className="text-base font-semibold text-[#F8FAFC]">[Mission Systems Architect]</h4>
              <span className="text-xs font-mono text-[#10B981] block mt-0.5">Flight Software & UI/UX</span>
              <p className="text-[11px] text-[#64748B] mt-2">Avionics interfaces, low-latency telemetry visualization.</p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-[#58C7FF]/10 to-[#8B5CF6]/10 border border-[#58C7FF]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold font-display text-[#F8FAFC]">Explore Our Operational Technology</h3>
            <p className="text-xs text-[#94A3B8] mt-1">Review the architectural subsystems and multi-sensor fusion algorithms.</p>
          </div>
          <Link
            to="/technology"
            className="px-6 py-2.5 rounded-lg text-xs font-mono font-semibold bg-[#58C7FF] text-[#05070D] shrink-0 hover:bg-[#38BDF8] transition-colors"
          >
            Explore Technology
          </Link>
        </div>
      </section>
    </div>
  );
};
