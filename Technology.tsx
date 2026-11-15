import React, { useEffect, useRef, useState } from 'react';
import {
  Heart,
  Flame,
  Layers,
  Cpu,
  ShieldAlert,
  Sun,
  Compass,
  ArrowRight,
  Terminal,
  Activity,
  CheckCircle2,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { EmbeddedModule } from '../components/common/EmbeddedModule';

interface TechItem {
  id: string;
  name: string;
  category: 'Core System' | 'Safety Engine' | 'Research Concept';
  icon: React.ReactNode;
  problem: string;
  overview: string;
  howItWorks: string;
  inputs: string[];
  outputs: string[];
  applications: string[];
  status: string;
  statusBadge: string;
  /** Where this subsystem can be tried live. */
  launch: { to: string; label: string };
}

/** Subsystems that ship as their own live apps, previewed inside the spec card. */
const LIVE_PREVIEW: Record<string, { src: string; title: string }> = {
  astrohealth: { src: '/astrohealth-ai/index.html', title: 'AstroHealth AI' },
  firehealth: { src: '/aegis-fds/index.html', title: 'FireHealth AI · Aegis FDS' },
  solarshield: { src: '/radiation-monitor/index.html', title: 'Radiation Monitor' },
  quantumnav: { src: '/quantumnav/index.html', title: 'QuantumNav Live' },
};

export const Technology: React.FC = () => {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const [selectedTech, setSelectedTech] = useState<string>(hash.slice(1) || 'astrohealth');
  const detailRef = useRef<HTMLDivElement>(null);

  // Deep links such as /technology#quantumnav (footer, navbar, home cards) select that subsystem.
  useEffect(() => {
    const id = hash.slice(1);
    if (!id) return;
    setSelectedTech(id);
    window.setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
  }, [hash]);

  const select = (id: string) => {
    setSelectedTech(id);
    navigate(`/technology#${id}`, { replace: true });
  };

  const technologies: TechItem[] = [
    {
      id: 'astrohealth',
      name: 'AstroHealth AI',
      category: 'Core System',
      icon: <Heart className="w-6 h-6 text-[#EF4444]" />,
      overview: 'A research prototype that reviews synthetic crew-health values and provides explainable signal summaries with cautious follow-up suggestions.',
      problem: 'Physiological signals can change with activity and context. A monitoring interface should show its evidence clearly and keep qualified personnel responsible for interpretation.',
      howItWorks: 'The deterministic rule engine calculates a transparent demo risk score. When configured, AstroHealth AI uses a language model to explain only the supplied snapshot and answer review questions; it cannot change the score or diagnose a person.',
      inputs: ['Heart Rate (BPM)', 'Arterial Oxygen Saturation (SpO2 %)', 'Core Temperature (°C)', 'Respiration Rate', 'Cognitive Fatigue Index'],
      outputs: ['Demo signal risk score (0-100)', 'Out-of-range signal flags', 'Plain-language explanation', 'Cautious review suggestions'],
      applications: ['Long-duration ISS missions', 'Lunar orbital Gateway expeditions', 'EVA spacewalk metabolic management'],
      status: 'Simulation prototype; model responses require a backend API key',
      statusBadge: 'SIMULATION PROTOTYPE',
      launch: { to: '/technology/astrohealth', label: 'Launch AstroHealth AI' },
    },
    {
      id: 'firehealth',
      name: 'FireHealth AI · Aegis FDS',
      category: 'Safety Engine',
      icon: <Flame className="w-6 h-6 text-[#F59E0B]" />,
      overview: 'Aegis FDS: fire detection and alarm for crewed spacecraft. It watches smoke, heat, carbon monoxide and oxygen in eight compartments and shows the crew exactly where a fire is.',
      problem: 'In microgravity, flames smoulder in spherical envelopes without rising smoke plumes, so a single sensor is easy to miss or to trip falsely. The crew needs a fast, unambiguous alarm and location.',
      howItWorks: 'Sensors in every compartment are cross-checked; when two of them agree that fire has started, the alarm sounds on its own and the compartment lights up on the deck plan. When readings return to normal the alarm clears automatically.',
      inputs: ['Smoke obscuration per compartment', 'Heat / temperature rise', 'Carbon monoxide (CO)', 'Oxygen level (O₂)'],
      outputs: ['Demo environmental risk score (0-100)', 'Signals contributing to the score', 'Plain-language explanation', 'Cautious review suggestions'],
      applications: ['Pressurized space station modules', 'Commercial crew transport capsules', 'Planetary surface habitats'],
      status: 'Simulation prototype; model responses require a backend API key',
      statusBadge: 'SIMULATION PROTOTYPE',
      launch: { to: '/technology/firehealth', label: 'Launch FireHealth AI · Aegis FDS' },
    },
    {
      id: 'sensor-fusion',
      name: 'Multi-Sensor Fusion Engine',
      category: 'Core System',
      icon: <Layers className="w-6 h-6 text-[#58C7FF]" />,
      overview: 'Combines simulated health and environmental signals into a unified dashboard view.',
      problem: 'Traditional space telemetry operates in isolated engineering silos: ECLSS engineers monitor life support, flight surgeons monitor crew vitals, and propulsion engineers monitor power. When compound failures occur, correlation is delayed.',
      howItWorks: 'Utilizes multivariate Bayesian inference and statistical anomaly correlation matrixes to detect simultaneous cross-subsystem drift (e.g. rising astronaut heart rate occurring at the exact same minute cabin temperature elevates).',
      inputs: ['AstroHealth demo signals', 'Smoke, temperature, and air-quality readings', 'Cabin pressure and life-support context'],
      outputs: ['Cross-Subsystem Correlation Factor', 'Unified Flight Risk Metric', 'Compound Failure Root Cause Hypotheses'],
      applications: ['Mission Control Flight Surgeon consoles', 'Autonomous deep space flight computers', 'Crew autonomous triage'],
      status: 'Algorithmic Prototype Operating in Mission Dashboard',
      statusBadge: 'PROTOTYPE ACTIVE',
      launch: { to: '/mission-control?tab=ai', label: 'Inspect Fusion in Mission Control' },
    },
    {
      id: 'anomaly-detection',
      name: 'Anomaly Detection & Scoring',
      category: 'Safety Engine',
      icon: <Cpu className="w-6 h-6 text-[#8B5CF6]" />,
      overview: 'Interpretable statistical outlier detection calibrated specifically for spaceflight dynamic regimes.',
      problem: 'Terrestrial AI anomaly models generate high false alarm rates due to spacecraft operational transients (e.g. exercise periods cause heart rate spikes; cooking or vacuum venting causes pressure fluctuations).',
      howItWorks: 'Employs adaptive dynamic thresholding and rolling z-score analysis. Differentiates expected physiological exertion (e.g. cycle ergometer exercise) from unprovoked medical emergencies by cross-checking activity schedules.',
      inputs: ['Normalized Telemetry Timeseries', 'Mission Operational Phase Context', 'Crew Scheduled Activity Schedules'],
      outputs: ['Statistical Z-Score Anomaly Metric', 'Signal Confidence Level (%)', 'Expected vs Observed Variance Vectors'],
      applications: ['Flight rule verification', 'Autonomous onboard alert generation', 'Telemetry compression and downlink prioritization'],
      status: 'Implemented in Rule & Statistical Engine',
      statusBadge: 'PROTOTYPE ACTIVE',
      launch: { to: '/mission-control?tab=events', label: 'View Anomaly Event Log' },
    },
    {
      id: 'risk-classification',
      name: 'AI Risk Classification Engine',
      category: 'Safety Engine',
      icon: <ShieldAlert className="w-6 h-6 text-[#EF4444]" />,
      overview: 'Categorizes raw anomalies into actionable severity tiers: Normal, Warning, and Critical with explicit plain-language rationale.',
      problem: 'In high-stress emergency scenarios, flight directors and astronauts do not have time to parse raw sensor standard deviations. They need instantaneous, unambiguous triage.',
      howItWorks: 'Maps prototype sensor checks into a three-tier risk display. It explains which supplied demo readings contributed and offers review suggestions; a qualified operator must consult verified procedures.',
      inputs: ['Multi-Sensor Risk Scores', 'Subsystem Redundancy Availability', 'Flight Rule Matrix'],
      outputs: ['Categorical demo risk (NORMAL, WARNING, CRITICAL)', 'Plain-language signal explanation', 'Cautious review suggestions (not operational procedures)'],
      applications: ['Astronaut heads-up display alerting', 'Mission Control CAPCOM briefing feeds'],
      status: 'Simulation prototype implemented in dashboard',
      statusBadge: 'SIMULATION PROTOTYPE',
      launch: { to: '/mission-control?tab=ai', label: 'Open AI Risk Engine' },
    },
    {
      id: 'digital-twin',
      name: 'Spacecraft Digital Twin Model',
      category: 'Core System',
      icon: <Zap className="w-6 h-6 text-[#38BDF8]" />,
      overview: 'A visual research concept for exploring spacecraft environment status; it is not a validated physical model.',
      problem: 'Physical sensor placement inside spacecraft is limited by weight and wiring constraints. Unmonitored pockets behind avionics racks can harbor smoldering hotspots unnoticed.',
      howItWorks: 'Uses thermal and computational fluid dynamics approximations driven by actual telemetry inputs to predict unmonitored bay states and forecast conditions 15 minutes ahead.',
      inputs: ['Module Boundary Temperatures', 'Ventilation Fan RPM & Delta-P', 'Power Bus Current Draw'],
      outputs: ['Predicted Temperature Field Map', 'Aerosol Dispersion Vectors', 'Thermal Overload Pre-Warning'],
      applications: ['Space station maintenance forecasting', 'Emergency vent path calculation'],
      status: 'Architectural Simulation Model',
      statusBadge: 'PROTOTYPE ACTIVE',
      launch: { to: '/mission-control?tab=modules', label: 'Open Spacecraft Modules' },
    },
    {
      id: 'solarshield',
      name: 'SolarShield Research',
      category: 'Research Concept',
      icon: <Sun className="w-6 h-6 text-[#F59E0B]" />,
      overview: 'Investigating space-weather telemetry integration and cosmic radiation biological risk modeling for lunar and deep space crew safety.',
      problem: 'Outside Earth magnetosphere protection, coronal mass ejections (CMEs) and solar particle events (SPEs) pose lethal radiation hazards during extravehicular activities.',
      howItWorks: 'Explores how public space-weather research could be shown alongside separately labeled simulated sensor concepts. It does not estimate crew dose or recommend operational actions.',
      inputs: ['NASA DONKI event records for research context', 'Synthetic radiation values for interface demonstration'],
      outputs: ['Estimated Biological Dose Rate', 'Safe EVA Duration Limits', 'Solar Particle Event Storm Alerts'],
      applications: ['Artemis lunar surface EVA safety', 'Cislunar Gateway radiation triage'],
      status: 'Research Concept (Not an operational spaceflight system)',
      statusBadge: 'RESEARCH CONCEPT',
      launch: { to: '/technology/radiation', label: 'Launch Radiation Monitor' },
    },
    {
      id: 'quantumnav',
      name: 'QuantumNav Research',
      category: 'Research Concept',
      icon: <Compass className="w-6 h-6 text-[#8B5CF6]" />,
      overview: 'Exploring quantum cold-atom inertial sensing and optical pulsar reference navigation for spacecraft operating in GPS-denied deep space.',
      problem: 'Terrestrial GNSS signals (GPS/Galileo) are unavailable beyond geostationary orbit. Deep space tracking relies on Earth ground stations (DSN), which creates communication bottlenecks.',
      howItWorks: 'Simulates atomic matter-wave interferometry to track 3D acceleration and angular velocity with near-zero sensor drift, enabling autonomous trajectory verification.',
      inputs: ['Cold-Atom Interferometer Phase Shifts', 'Star Tracker Optical Fixes', 'Pulsar Timing Models'],
      outputs: ['Autonomous 3D State Vector (Position & Velocity)', 'Drift-Free Dead Reckoning Solution'],
      applications: ['Autonomous deep space trajectory control', 'GPS-denied cislunar navigation'],
      status: 'Research Concept (Theoretical and simulation modeling only)',
      statusBadge: 'RESEARCH CONCEPT',
      launch: { to: '/technology/quantumnav', label: 'Launch QuantumNav Live' },
    },
  ];

  const current = technologies.find((t) => t.id === selectedTech) || technologies[0];

  return (
    <div className="min-h-screen pt-28 pb-20 text-[#F8FAFC]">
      {/* Page Header */}
      <section className="relative py-16 tech-grid border-b border-[#1E2D44]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#58C7FF]/10 text-[#58C7FF] border border-[#58C7FF]/30 inline-block">
            Engineering & Technology Architecture
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight">
            Designed for Intelligent Space Safety
          </h1>
          <p className="text-base sm:text-lg text-[#94A3B8] max-w-3xl mx-auto leading-relaxed">
            A comprehensive breakdown of our biological monitoring, spacecraft environmental sensing, multi-sensor fusion,
            and research-stage navigation systems.
          </p>
        </div>
      </section>

      {/* Main Interactive Technology Explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Technology Selector Navigation */}
          <div className="lg:col-span-4 space-y-2">
            <h3 className="text-xs font-mono tracking-widest text-[#58C7FF] uppercase mb-3 px-2">
              Select Subsystem
            </h3>
            {technologies.map((t) => (
              <button
                key={t.id}
                onClick={() => select(t.id)}
                className={`w-full p-3.5 rounded-xl border text-left transition-all duration-200 flex items-center justify-between group ${
                  selectedTech === t.id
                    ? 'bg-[#58C7FF]/15 border-[#58C7FF] shadow-[0_0_15px_rgba(88,199,255,0.2)]'
                    : 'bg-[#101826]/70 border-[#1E2D44] hover:border-[#58C7FF]/30 hover:bg-[#162235]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#05070D] border border-[#1E2D44]">
                    {t.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#F8FAFC] group-hover:text-[#58C7FF] transition-colors">
                      {t.name}
                    </h4>
                    <span className="text-[11px] font-mono text-[#64748B]">
                      {t.category}
                      {LIVE_PREVIEW[t.id] && <span className="ml-1.5 text-[#10B981]">● LIVE APP</span>}
                    </span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
                  t.category === 'Research Concept'
                    ? 'bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/40'
                    : 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40'
                }`}>
                  {t.statusBadge}
                </span>
              </button>
            ))}
          </div>

          {/* Right Column: Deep-Dive Technical Specification Card */}
          <div className="lg:col-span-8 scroll-mt-28" ref={detailRef}>
            <div className="space-card rounded-2xl p-6 sm:p-8 border border-[#58C7FF]/30 relative">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E2D44]">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-xl bg-[#05070D] border border-[#1E2D44]">
                    {current.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold font-display text-[#F8FAFC]">{current.name}</h2>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                        current.category === 'Research Concept'
                          ? 'bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/40'
                          : 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40'
                      }`}>
                        {current.statusBadge}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-[#58C7FF]">{current.category}</span>
                  </div>
                </div>

                <div className="text-xs font-mono text-[#94A3B8] p-2 rounded-lg bg-[#05070D] border border-[#1E2D44] sm:text-right">
                  <span className="text-[#64748B] block text-[10px]">CURRENT MATURITY</span>
                  <span className="text-[#F8FAFC]">{current.status}</span>
                </div>
              </div>

              {/* Research Concept Explicit Disclaimer Warning */}
              {current.category === 'Research Concept' && (
                <div className="my-6 p-4 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/40 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#8B5CF6] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    <strong className="text-[#F8FAFC]">Research Concept Notice:</strong> {current.name} is an exploratory conceptual initiative evaluated via simulation and external space research literature. It is not an active aerospace-certified or space-deployed flight system.
                  </p>
                </div>
              )}

              {/* Overview & Problem Addressed */}
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-xs font-mono text-[#58C7FF] uppercase tracking-wider mb-2">1. Technology Overview</h3>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">{current.overview}</p>
                </div>

                <div>
                  <h3 className="text-xs font-mono text-[#EF4444] uppercase tracking-wider mb-2">2. Problem Addressed</h3>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">{current.problem}</p>
                </div>

                <div>
                  <h3 className="text-xs font-mono text-[#10B981] uppercase tracking-wider mb-2">3. How It Works</h3>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">{current.howItWorks}</p>
                </div>

                {/* Technical Inputs & Outputs Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#1E2D44]">
                  <div className="p-4 rounded-xl bg-[#05070D] border border-[#1E2D44]">
                    <span className="text-xs font-mono text-[#58C7FF] block mb-2 font-bold">TELEMETRY INPUTS</span>
                    <ul className="space-y-1.5 text-xs text-[#94A3B8]">
                      {current.inputs.map((inp, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#58C7FF]" />
                          <span>{inp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-[#05070D] border border-[#1E2D44]">
                    <span className="text-xs font-mono text-[#10B981] block mb-2 font-bold">SYSTEM OUTPUTS</span>
                    <ul className="space-y-1.5 text-xs text-[#94A3B8]">
                      {current.outputs.map((out, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                          <span>{out}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Potential Applications */}
                <div className="pt-2">
                  <h3 className="text-xs font-mono text-[#8B5CF6] uppercase tracking-wider mb-2">Potential Applications</h3>
                  <div className="flex flex-wrap gap-2">
                    {current.applications.map((app, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-lg text-xs font-mono bg-[#101826] border border-[#1E2D44] text-[#F8FAFC]">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="mt-8 pt-6 border-t border-[#1E2D44] flex flex-col sm:flex-row items-center justify-between gap-4">
                <Link to="/mission-control" className="text-xs font-mono text-[#94A3B8] hover:text-[#58C7FF]">
                  Open full Mission Control →
                </Link>
                <Link
                  to={current.launch.to}
                  className="px-5 py-2.5 rounded-lg text-xs font-mono font-semibold bg-[#58C7FF] text-[#05070D] hover:bg-[#38BDF8] flex items-center gap-1.5 transition-colors shadow-[0_0_20px_rgba(88,199,255,0.35)]"
                >
                  <span>{current.launch.label}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Live module previews for the subsystems that ship as their own apps */}
              {LIVE_PREVIEW[current.id] && (
                <div className="mt-8 pt-6 border-t border-[#1E2D44]">
                  <EmbeddedModule
                    key={current.id}
                    src={LIVE_PREVIEW[current.id].src}
                    title={LIVE_PREVIEW[current.id].title}
                    label={`Live preview · ${LIVE_PREVIEW[current.id].title}`}
                    height="560px"
                    minHeight={560}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
