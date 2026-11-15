import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Activity,
  Heart,
  Flame,
  Cpu,
  Radio,
  ArrowRight,
  Database,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Sun,
  Layers,
  Sparkles,
  Zap,
  Eye,
  Workflow,
  RotateCcw,
  Sliders,
  Play,
  Pause,
  Search,
} from 'lucide-react';
import { simulator } from '../services/simulationEngine';
import { TelemetryChart } from '../components/charts/TelemetryChart';
import { SpacecraftModuleViewer } from '../components/spacecraft/SpacecraftModuleViewer';
import { VERIFIED_DATASETS } from '../services/nasaService';
import { HealthSuite } from './HealthMonitor';

export const Home: React.FC = () => {
  // Local state synced with simulator for real-time reactivity
  const [vitals, setVitals] = useState(simulator.getVitals());
  const [env, setEnv] = useState(simulator.getEnv());
  const [risk, setRisk] = useState(simulator.getRisk());
  const [modules, setModules] = useState(simulator.getModules());
  const [telemetryHistory, setTelemetryHistory] = useState(simulator.getTelemetryHistory());
  const [isRunning, setIsRunning] = useState(simulator.getIsRunning());
  const [activeFlowStep, setActiveFlowStep] = useState(0);
  const [activeStage, setActiveStage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = simulator.subscribe(() => {
      setVitals({ ...simulator.getVitals() });
      setEnv({ ...simulator.getEnv() });
      setRisk({ ...simulator.getRisk() });
      setModules([...simulator.getModules()]);
      setTelemetryHistory([...simulator.getTelemetryHistory()]);
      setIsRunning(simulator.getIsRunning());
    });
    return unsubscribe;
  }, []);

  // Automatic animated stepper for data flow section
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFlowStep((prev) => (prev + 1) % 6);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const flowSteps = [
    { num: '01', title: 'Sensors', desc: 'Physiological ECG, SpO2, Cabin Temp, Smoke Aerosols, VOCs' },
    { num: '02', title: 'Data Processing', desc: 'Signal normalization, high-frequency filtering & baseline calibration' },
    { num: '03', title: 'AI Risk Analysis', desc: 'Cross-sensor multivariate fusion & multi-agent anomaly modeling' },
    { num: '04', title: 'Anomaly Detection', desc: 'Statistical outlier recognition & trend deviation scoring' },
    { num: '05', title: 'Risk Classification', desc: 'Multi-category categorization: Nominal, Warning, Critical' },
    { num: '06', title: 'Mission Control', desc: 'Low-latency flight telemetry feed & actionable emergency mitigation' },
  ];

  const riskTone = risk.overallRisk === 'CRITICAL' ? 'text-[#EF4444]' : risk.overallRisk === 'WARNING' ? 'text-[#F59E0B]' : 'text-[#10B981]';
  const unacked = simulator.getAlerts().filter((a) => !a.acknowledged).length;
  const pipelineStages: { title: string; desc: string; metrics: [string, string, string][]; note: string; to: string; cta: string }[] = [
    {
      title: 'Data Collection',
      desc: 'Collect physiological and environmental measurements from sensors or research datasets.',
      metrics: [
        ['HEART RATE', `${vitals.heartRate} bpm`, 'text-[#F8FAFC]'],
        ['SpO2', `${vitals.spO2.toFixed(1)} %`, 'text-[#F8FAFC]'],
        ['CABIN TEMP', `${env.cabinTemperature.toFixed(1)} °C`, 'text-[#F8FAFC]'],
        ['SMOKE', `${env.smokeDensity.toFixed(2)} ppm`, 'text-[#F8FAFC]'],
      ],
      note: 'Raw synthetic samples arrive every simulator tick from crew wearables and cabin sensors.',
      to: '/health-monitor',
      cta: 'See raw crew sensors',
    },
    {
      title: 'Data Processing',
      desc: 'Normalize, validate, and organize incoming sensor information into structured schemas.',
      metrics: [
        ['HR Δ BASELINE', `${(vitals.heartRate - 72 >= 0 ? '+' : '')}${(vitals.heartRate - 72).toFixed(0)} bpm`, 'text-[#58C7FF]'],
        ['BP', `${vitals.systolicBP}/${vitals.diastolicBP}`, 'text-[#58C7FF]'],
        ['CO₂', `${env.co2Level.toFixed(0)} ppm`, 'text-[#58C7FF]'],
        ['SAMPLES BUFFERED', `${telemetryHistory.length}`, 'text-[#58C7FF]'],
      ],
      note: 'Each value is compared with its nominal baseline and held in a rolling window for trend analysis.',
      to: '/mission-control?tab=events',
      cta: 'Open event stream',
    },
    {
      title: 'AI Analysis',
      desc: 'Detect unusual readings and analyze relationships between signals with multivariate fusion.',
      metrics: [
        ['HEALTH SCORE', `${risk.healthRiskScore}/100`, 'text-[#A78BFA]'],
        ['ENV SCORE', `${risk.environmentalRiskScore}/100`, 'text-[#A78BFA]'],
        ['FUSED SCORE', `${risk.overallScore}/100`, 'text-[#A78BFA]'],
        ['CONFIDENCE', `${risk.anomalyConfidence}%`, 'text-[#A78BFA]'],
      ],
      note: risk.explanation,
      to: '/mission-control?tab=ai',
      cta: 'Open AI Risk Engine',
    },
    {
      title: 'Risk Assessment',
      desc: 'Classify conditions into Normal, Warning, or Critical categories with confidence intervals.',
      metrics: [
        ['CLASSIFICATION', risk.overallRisk, riskTone],
        ['CREW STATUS', vitals.status, vitals.status === 'NORMAL' ? 'text-[#10B981]' : 'text-[#F59E0B]'],
        ['CABIN STATUS', env.status, env.status === 'NORMAL' ? 'text-[#10B981]' : 'text-[#F59E0B]'],
        ['PRIMARY', risk.primaryAnomaly.length > 18 ? `${risk.primaryAnomaly.slice(0, 18)}…` : risk.primaryAnomaly, 'text-[#F8FAFC] text-sm'],
      ],
      note: `Suggested review: ${risk.recommendedAction}`,
      to: '/mission-control?tab=ai',
      cta: 'Review classification',
    },
    {
      title: 'Mission Awareness',
      desc: 'Present alerts, trends, and supporting evidence in the unified dashboard interface.',
      metrics: [
        ['OPEN ALERTS', `${unacked}`, unacked ? 'text-[#F59E0B]' : 'text-[#10B981]'],
        ['TOTAL ALERTS', `${simulator.getAlerts().length}`, 'text-[#F8FAFC]'],
        ['MODULES', `${modules.length}`, 'text-[#F8FAFC]'],
        ['STREAM', isRunning ? 'LIVE' : 'PAUSED', isRunning ? 'text-[#10B981]' : 'text-[#F59E0B]'],
      ],
      note: 'Alerts surface in Mission Control with plain-language evidence and an acknowledgment workflow.',
      to: '/mission-control',
      cta: 'Launch Mission Control',
    },
  ];

  const visionCards = [
    { title: 'Predictive Astronaut Safety', icon: <Heart className="w-6 h-6" />, tone: '#58C7FF', to: '/health-monitor', cta: 'Open Health Monitor',
      desc: 'Anticipating cardiovascular deconditioning, orthostatic stress, and circadian rhythm disruption before clinical symptoms emerge.' },
    { title: 'Spacecraft Digital Twin', icon: <Layers className="w-6 h-6" />, tone: '#8B5CF6', to: '/technology/quantumnav#twin', cta: 'Explore the Digital Twin',
      desc: 'Full-vehicle physics simulation modeling thermal transfer, atmospheric fluidics, and structural fatigue under high radiation.' },
    { title: 'GPS-Denied Navigation', icon: <Compass className="w-6 h-6" />, tone: '#10B981', to: '/technology/quantumnav', cta: 'Launch QuantumNav',
      desc: 'Evaluating quantum cold-atom interferometry and optical pulsar references for autonomous position fixing beyond Earth orbit.' },
    { title: 'Space-Weather Intelligence', icon: <Sun className="w-6 h-6" />, tone: '#F59E0B', to: '/technology/radiation', cta: 'Open Radiation Monitor',
      desc: 'Integrating real-time heliospheric CMEs and magnetospheric models to dynamic orbital EVA risk scoring.' },
  ];

  const problemPoints = [
    {
      num: '01',
      title: 'Astronaut Physiological Shifts',
      desc: 'Microgravity alters hemodynamics, bone density, cardiovascular regulation, and causes vestibular disorientation. Sub-acute cardiac dysrhythmias require continuous intelligent tracking.',
      icon: <Heart className="w-6 h-6 text-[#EF4444]" />,
    },
    {
      num: '02',
      title: 'In-Cabin Combustion & Thermal Hazards',
      desc: 'In microgravity, flames do not rise—they form spherical, smoldering envelopes that spread silently without natural convective buoyancy. Detection before visible smoke is life-critical.',
      icon: <Flame className="w-6 h-6 text-[#F59E0B]" />,
    },
    {
      num: '03',
      title: 'Isolated Multi-Sensor Disconnect',
      desc: 'Traditional spacecraft systems isolate life support, biomedical telemetry, and electrical busses. Coincident warnings fail to correlate without intelligent multi-signal fusion.',
      icon: <Layers className="w-6 h-6 text-[#58C7FF]" />,
    },
    {
      num: '04',
      title: 'Communication Delay & Deep Space Gaps',
      desc: 'Beyond low Earth orbit, radio latency to Mission Control stretches from seconds to 22 minutes at Mars. Autonomous on-board AI triage must act before ground instructions arrive.',
      icon: <Radio className="w-6 h-6 text-[#8B5CF6]" />,
    },
    {
      num: '05',
      title: 'Cognitive Overload in Emergencies',
      desc: 'Astronauts experiencing high workloads or hypoxic confusion cannot analyze hundreds of raw sensor channels during compound failures. Interpretable AI explanations are essential.',
      icon: <Eye className="w-6 h-6 text-[#38BDF8]" />,
    },
    {
      num: '06',
      title: 'Sensor Drift & Micro-Anomalies',
      desc: 'Long-duration cosmic radiation induces physical sensor drift and false alarms. Intelligent algorithms must differentiate true life-threatening emergencies from telemetry noise.',
      icon: <Cpu className="w-6 h-6 text-[#10B981]" />,
    },
  ];

  return (
    <div className="min-h-screen text-[#F8FAFC] overflow-hidden">
      {/* =========================================================================
          SECTION 1: HERO
          Cinematic orbital space environment, headline, status pills, live preview
         ========================================================================= */}
      <section className="relative min-h-[88vh] pt-44 pb-16 flex items-start justify-center">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Col: Headlines & Value Proposition */}
            <div className="lg:col-span-12 max-w-6xl mx-auto space-y-7 text-center">
              {/* Emerging Startup Status Labels */}
              <div className="hero-reveal inline-flex flex-wrap items-center justify-center gap-2" style={{ animationDelay: '0s' }}>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#58C7FF]/10 text-[#58C7FF] border border-[#58C7FF]/30 flex items-center gap-1.5 shadow-[0_0_15px_rgba(88,199,255,0.2)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#58C7FF] animate-ping" />
                  AI-Powered Safety Intelligence
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30">
                  Human Spaceflight Research
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30">
                  Mission Monitoring Systems
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="hero-reveal hero-glow text-5xl sm:text-6xl lg:text-7xl xl:text-[5rem] font-bold font-display tracking-tight leading-[1.08]" style={{ animationDelay: '0.08s' }}>
                Intelligence Beyond Earth.{' '}
                <span className="hero-glow-gradient bg-gradient-to-r from-[#58C7FF] via-[#A5E4FF] to-[#4F8FE8] bg-clip-text text-transparent block mt-2" style={{ textShadow: 'none' }}>
                  Safety Without Limits.
                </span>
              </h1>

              {/* Subheadline */}
              <p className="hero-reveal text-lg sm:text-xl text-[#DCE6F2] leading-relaxed max-w-3xl mx-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]" style={{ animationDelay: '0.16s' }}>
                ASTRA-SENTINEL AI is developing intelligent astronaut safety and spacecraft monitoring technologies
                that combine AI-driven anomaly detection, physiological monitoring, and environmental intelligence
                to support safer human space exploration.
              </p>

              {/* Primary Action Buttons */}
              <div className="hero-reveal flex flex-col sm:flex-row items-center justify-center gap-4 pt-2" style={{ animationDelay: '0.24s' }}>
                <Link
                  to="/platform"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#58C7FF] to-[#3B82F6] text-[#05070D] shadow-[0_0_30px_rgba(88,199,255,0.55)] hover:shadow-[0_0_50px_rgba(88,199,255,0.8)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <span>Explore Our Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/technology"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm glass-panel text-[#F8FAFC] hover:border-[#58C7FF]/50 transition-all duration-300"
                >
                  <span>Discover Our Technology</span>
                </Link>

                <Link
                  to="/mission-control"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-mono text-xs text-[#58C7FF] hover:underline"
                >
                  <Activity className="w-4 h-4 animate-pulse" />
                  Launch Dashboard
                </Link>
              </div>

              {/* Transparent Disclaimer Badge */}
              <div className="hero-reveal pt-2 text-xs font-mono text-[#64748B]" style={{ animationDelay: '0.3s' }}>
                PROTOTYPE EVALUATION ENVIRONMENT • OPEN SPACE SCIENCE DATA INTEGRATION
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1B: LIVE PROTOTYPE CONSOLE (over the Earth limb, as in the reference)
         ========================================================================= */}
      <section className="relative pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-mono tracking-[0.25em] text-[#58C7FF] uppercase">Live Prototype Console</span>
              <h2 className="text-3xl sm:text-4xl xl:text-5xl font-bold font-display leading-tight">
                Watch the safety engine read the crew and the cabin — together.
              </h2>
              <p className="text-base text-[#CBD5E1]/90 leading-relaxed max-w-xl">
                Simulated telemetry streams through the same fusion logic used in Mission Control. Trigger a demo emergency
                to see the risk classification respond in real time.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <Link to="/health-monitor" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono glass-panel hover:border-[#58C7FF]/50">
                  <Heart className="w-4 h-4 text-[#F87171]" /> Astronaut Health Monitor
                </Link>
                <Link to="/technology/quantumnav" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono glass-panel hover:border-[#8B5CF6]/60">
                  <Compass className="w-4 h-4 text-[#A78BFA]" /> QuantumNav Research
                </Link>
              </div>
            </div>

            {/* Right Col: Interactive Visual Product Preview Card */}
            <div className="lg:col-span-6">
              <div className="space-card rounded-2xl p-5 border border-[#58C7FF]/30 shadow-[0_0_35px_rgba(88,199,255,0.15)] relative scanline">
                {/* Header status bar */}
                <div className="flex items-center justify-between pb-3 border-b border-[#1E2D44]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
                    <span className="text-xs font-mono font-semibold text-[#F8FAFC]">SENTINEL CORE • LIVE DEMO</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                    risk.overallRisk === 'CRITICAL' ? 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40' :
                    risk.overallRisk === 'WARNING' ? 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/40' :
                    'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40'
                  }`}>
                    RISK: {risk.overallRisk}
                  </span>
                </div>

                {/* Astronaut Vitals Mini Panel */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#05070D]/70 border border-[#1E2D44]">
                    <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
                      <span>HEART RATE</span>
                      <Heart className="w-3.5 h-3.5 text-[#EF4444]" />
                    </div>
                    <div className="flex items-baseline gap-1 mt-1 font-mono">
                      <span className="text-xl font-bold text-[#F8FAFC]">{vitals.heartRate}</span>
                      <span className="text-[10px] text-[#64748B]">BPM</span>
                    </div>
                    <div className="text-[10px] font-mono text-[#10B981] mt-0.5">SpO2: {vitals.spO2}%</div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#05070D]/70 border border-[#1E2D44]">
                    <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
                      <span>CABIN TEMP</span>
                      <Flame className="w-3.5 h-3.5 text-[#F59E0B]" />
                    </div>
                    <div className="flex items-baseline gap-1 mt-1 font-mono">
                      <span className="text-xl font-bold text-[#F8FAFC]">{env.cabinTemperature.toFixed(1)}</span>
                      <span className="text-[10px] text-[#64748B]">°C</span>
                    </div>
                    <div className="text-[10px] font-mono text-[#58C7FF] mt-0.5">Press: {env.cabinPressure.toFixed(1)} kPa</div>
                  </div>
                </div>

                {/* AI Risk Score Bar */}
                <div className="mt-4 p-3 rounded-xl bg-[#05070D]/70 border border-[#1E2D44]">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#94A3B8]">AI FUSION RISK SCORE</span>
                    <span className="text-[#58C7FF] font-bold">{risk.overallScore} / 100</span>
                  </div>
                  <div className="w-full bg-[#101826] h-2 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        risk.overallRisk === 'CRITICAL' ? 'bg-[#EF4444]' :
                        risk.overallRisk === 'WARNING' ? 'bg-[#F59E0B]' :
                        'bg-[#10B981]'
                      }`}
                      style={{ width: `${Math.max(5, risk.overallScore)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#94A3B8] mt-2 leading-tight">
                    {risk.primaryAnomaly}
                  </p>
                </div>

                {/* Quick Simulation Trigger Buttons */}
                <div className="mt-4 flex items-center justify-between gap-2 pt-2">
                  <button
                    onClick={() => simulator.triggerDemoEmergency()}
                    className="flex-1 py-2 px-3 rounded-lg text-xs font-mono font-semibold bg-[#EF4444]/20 hover:bg-[#EF4444]/30 text-[#EF4444] border border-[#EF4444]/40 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Trigger Demo Emergency
                  </button>

                  <button
                    onClick={() => simulator.reset()}
                    className="py-2 px-3 rounded-lg text-xs font-mono bg-[#1E2D44] hover:bg-[#2A3F5F] text-[#F8FAFC] transition-colors flex items-center gap-1"
                    title="Reset to Nominal Baseline"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-3 text-center">
                  <Link
                    to="/mission-control"
                    className="text-xs font-mono text-[#58C7FF] hover:underline inline-flex items-center gap-1"
                  >
                    Open Full Mission Control Dashboard <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: COMPANY INTRODUCTION
          Building Intelligence for the Next Era of Space Exploration
         ========================================================================= */}
      <section className="py-20 band border-y relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-mono text-[#58C7FF] tracking-widest uppercase">Company Mission</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">
              Building Intelligence for the Next Era of Space Exploration
            </h2>
            <p className="text-base text-[#94A3B8] leading-relaxed">
              Human space exploration introduces complex safety challenges. Astronaut health, spacecraft environmental conditions,
              equipment reliability, and mission awareness must be continuously monitored.
            </p>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              ASTRA-SENTINEL AI explores how artificial intelligence, multi-sensor analysis, and space research data can help identify
              abnormal conditions and support mission-control decision-making. Our focus is on developing intelligent safety monitoring
              systems that bring critical information together in a unified interface.
            </p>
          </div>

          {/* Three Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
            <Link to="/health-monitor" className="space-card clickable-card rounded-2xl p-6 relative group block">
              <div className="w-12 h-12 rounded-xl bg-[#58C7FF]/15 text-[#58C7FF] border border-[#58C7FF]/30 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-[#F8FAFC]">Astronaut Health Intelligence</h3>
              <p className="text-sm text-[#94A3B8] mt-2 leading-relaxed">
                Continuous physiological tracking across ECG, pulse oximetry, core thermal equilibrium, and fatigue indices to detect early symptoms of microgravity deconditioning.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-mono text-[#58C7FF]">Open Health Monitor <ArrowRight className="w-3 h-3" /></span>
            </Link>

            <div className="space-card rounded-2xl p-6 relative group">
              <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-[#F8FAFC]">Spacecraft Environmental Safety</h3>
              <p className="text-sm text-[#94A3B8] mt-2 leading-relaxed">
                Real-time atmospheric analysis tracking cabin pressure gradients, volatile organic compounds, and micro-aerosols for early combustion anomaly prevention.
              </p>
            </div>

            <div className="space-card rounded-2xl p-6 relative group">
              <div className="w-12 h-12 rounded-xl bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-[#F8FAFC]">AI-Powered Mission Awareness</h3>
              <p className="text-sm text-[#94A3B8] mt-2 leading-relaxed">
                Multivariate statistical fusion combining biological signals with hull telemetry to present mission controllers with explainable risk scores and triage procedures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: THE PROBLEM
          Space Is Unforgiving. Every Signal Matters.
         ========================================================================= */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-mono text-[#EF4444] tracking-widest uppercase">The Critical Challenge</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">
              Space Is Unforgiving. Every Signal Matters.
            </h2>
            <p className="text-base text-[#94A3B8] leading-relaxed">
              In low Earth orbit and deep space journeys, failure modes develop silently. The human body and spacecraft life support operate at the boundary of survival.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problemPoints.map((item) => (
              <div key={item.num} className="space-card rounded-2xl p-6 relative border border-[#1E2D44] hover:border-[#58C7FF]/40 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-[#05070D] border border-[#1E2D44]">
                    {item.icon}
                  </div>
                  <span className="text-xs font-mono text-[#64748B] font-bold">CHALLENGE {item.num}</span>
                </div>
                <h3 className="text-base font-bold font-display text-[#F8FAFC]">{item.title}</h3>
                <p className="text-sm text-[#94A3B8] mt-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: OUR SOLUTION
          One Intelligent Safety Layer. Multiple Critical Signals.
         ========================================================================= */}
      <section className="py-24 band border-y relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-mono text-[#58C7FF] tracking-widest uppercase">Architecture Solution</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">
              One Intelligent Safety Layer. Multiple Critical Signals.
            </h2>
            <p className="text-base text-[#94A3B8] leading-relaxed">
              Our platform concept combines astronaut health monitoring, spacecraft environmental sensing, AI-based anomaly detection,
              and mission-control visualization to help identify potential safety risks through a unified system.
            </p>
          </div>

          {/* Animated Data-Flow Interactive Visualizer */}
          <div className="space-card rounded-3xl p-6 sm:p-10 border border-[#58C7FF]/30 relative overflow-hidden">
            <div className="text-xs font-mono text-[#58C7FF] mb-6 flex items-center justify-between">
              <span>ACTIVE DATA FUSION PIPELINE</span>
              <span className="hidden sm:inline">CYCLE: 50Hz SUB-HERTZ INFERENCE</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 relative">
              {flowSteps.map((step, idx) => {
                const isActive = activeFlowStep === idx;
                return (
                  <div
                    key={step.num}
                    onClick={() => setActiveFlowStep(idx)}
                    className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 relative ${
                      isActive
                        ? 'bg-[#58C7FF]/15 border-[#58C7FF] shadow-[0_0_20px_rgba(88,199,255,0.25)] scale-105'
                        : 'bg-[#05070D]/80 border-[#1E2D44] hover:border-[#58C7FF]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-mono font-bold ${isActive ? 'text-[#58C7FF]' : 'text-[#64748B]'}`}>
                        {step.num}
                      </span>
                      {isActive && <span className="w-2 h-2 rounded-full bg-[#58C7FF] animate-ping" />}
                    </div>
                    <h4 className="text-sm font-bold text-[#F8FAFC]">{step.title}</h4>
                    <p className="text-[11px] text-[#94A3B8] mt-1.5 leading-snug">{step.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Simulated Live Anomaly Example Flow */}
            <div className="mt-8 p-4 rounded-xl bg-[#05070D] border border-[#1E2D44] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#F59E0B]/20 text-[#F59E0B]">
                  <Workflow className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono font-semibold text-[#F8FAFC]">Example Real-Time Cross-Correlation</div>
                  <div className="text-xs text-[#94A3B8]">Astronaut HR rises to 124 BPM + Cabin Temp 33.8°C + Smoke 0.72 ppm ➔ AI Risk Engine triggers Emergency Alert</div>
                </div>
              </div>
              <button
                onClick={() => simulator.triggerDemoEmergency()}
                className="px-4 py-2 rounded-lg text-xs font-mono bg-[#EF4444]/20 hover:bg-[#EF4444]/30 text-[#EF4444] border border-[#EF4444]/40 shrink-0 transition-colors"
              >
                Demonstrate Cross-Anomaly
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: CORE TECHNOLOGY
          Designed for Intelligent Space Safety (6 Cards)
         ========================================================================= */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-mono text-[#58C7FF] tracking-widest uppercase">System Portfolio</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">
              Designed for Intelligent Space Safety
            </h2>
            <p className="text-base text-[#94A3B8]">
              Advanced modular engines engineered to ingest multi-source spaceflight signals and produce explainable safety awareness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tech 1 */}
            <Link to="/technology/astrohealth" className="space-card clickable-card rounded-2xl p-6 relative group hover:border-[#58C7FF]/50 transition-colors block">
              <div className="p-3 rounded-xl bg-[#58C7FF]/10 text-[#58C7FF] border border-[#58C7FF]/25 w-fit mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-[#F8FAFC]">1. AstroHealth AI</h3>
              <p className="text-sm text-[#94A3B8] mt-2 leading-relaxed">
                Analyze astronaut physiological data such as heart rate, oxygen saturation, and temperature to identify unusual patterns.
              </p>
              <div className="mt-4 pt-3 border-t border-[#1E2D44] flex items-center justify-between text-xs font-mono">
                <span className="text-[#64748B]">STATUS</span>
                <span className="text-[#10B981]">LIVE MONITOR →</span>
              </div>
            </Link>

            {/* Tech 2 */}
            <Link to="/technology/firehealth" className="space-card clickable-card rounded-2xl p-6 relative group hover:border-[#F59E0B]/50 transition-colors block">
              <div className="p-3 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/25 w-fit mb-4">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-[#F8FAFC]">2. FireHealth AI · Aegis FDS</h3>
              <p className="text-sm text-[#94A3B8] mt-2 leading-relaxed">
                Watches smoke, heat, carbon monoxide and oxygen in every compartment; when two sensors agree a fire has started, it sounds the alarm and shows where.
              </p>
              <div className="mt-4 pt-3 border-t border-[#1E2D44] flex items-center justify-between text-xs font-mono">
                <span className="text-[#64748B]">STATUS</span>
                <span className="text-[#10B981]">LIVE APP →</span>
              </div>
            </Link>

            {/* Tech 3 */}
            <div className="space-card rounded-2xl p-6 relative group hover:border-[#8B5CF6]/50 transition-colors">
              <div className="p-3 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/25 w-fit mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-[#F8FAFC]">3. AI Risk Engine</h3>
              <p className="text-sm text-[#94A3B8] mt-2 leading-relaxed">
                Use anomaly detection, statistical analysis, and multi-sensor fusion to classify unusual conditions into risk categories.
              </p>
              <div className="mt-4 pt-3 border-t border-[#1E2D44] flex items-center justify-between text-xs font-mono">
                <span className="text-[#64748B]">STATUS</span>
                <span className="text-[#10B981]">PROTOTYPE ACTIVE</span>
              </div>
            </div>

            {/* Tech 4 */}
            <div className="space-card rounded-2xl p-6 relative group hover:border-[#38BDF8]/50 transition-colors">
              <div className="p-3 rounded-xl bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/25 w-fit mb-4">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-[#F8FAFC]">4. Mission Control Intelligence</h3>
              <p className="text-sm text-[#94A3B8] mt-2 leading-relaxed">
                Present astronaut status, spacecraft telemetry, risk assessments, and emergency alerts through a unified monitoring interface.
              </p>
              <div className="mt-4 pt-3 border-t border-[#1E2D44] flex items-center justify-between text-xs font-mono">
                <span className="text-[#64748B]">STATUS</span>
                <span className="text-[#10B981]">PROTOTYPE ACTIVE</span>
              </div>
            </div>

            {/* Tech 5: Clearly Labeled Research */}
            <div className="space-card rounded-2xl p-6 relative group border-dashed border-[#58C7FF]/40">
              <div className="p-3 rounded-xl bg-[#58C7FF]/10 text-[#58C7FF] border border-[#58C7FF]/25 w-fit mb-4">
                <Sun className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-display text-[#F8FAFC]">5. SolarShield</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30">RESEARCH</span>
              </div>
              <p className="text-sm text-[#94A3B8] mt-2 leading-relaxed">
                Explore space-weather information and radiation-risk research using appropriate external data sources and onboard measurement concepts.
              </p>
              <div className="mt-4 pt-3 border-t border-[#1E2D44] flex items-center justify-between text-xs font-mono">
                <span className="text-[#64748B]">MATURITY</span>
                <span className="text-[#8B5CF6]">RESEARCH CONCEPT</span>
              </div>
            </div>

            {/* Tech 6: Clearly Labeled Research */}
            <div className="space-card rounded-2xl p-6 relative group border-dashed border-[#8B5CF6]/40">
              <div className="p-3 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/25 w-fit mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-display text-[#F8FAFC]">6. QuantumNav</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30">RESEARCH</span>
              </div>
              <p className="text-sm text-[#94A3B8] mt-2 leading-relaxed">
                Explore future navigation concepts involving inertial sensing and quantum sensor simulation for GPS-denied environments.
              </p>
              <div className="mt-4 pt-3 border-t border-[#1E2D44] flex items-center justify-between text-xs font-mono">
                <span className="text-[#64748B]">MATURITY</span>
                <span className="text-[#8B5CF6]">RESEARCH CONCEPT</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5B: ASTRONAUT HEALTH MONITOR (embedded live module)
         ========================================================================= */}
      <section id="health-monitor" className="py-24 relative scroll-mt-24">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
            <div>
              <span className="text-xs font-mono text-[#F87171] tracking-widest uppercase">AstroHealth AI · Live</span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display mt-2">Astronaut Health Monitor</h2>
              <p className="text-sm text-[#94A3B8] mt-2 max-w-2xl">
                Suit sensor map, ECG trace, per-crew vitals, cabin metrics and the fused risk engine. Use the controls to
                trigger a demo emergency or generate a mission health report.
              </p>
            </div>
            <Link to="/health-monitor" className="px-5 py-2.5 rounded-lg text-xs font-mono font-semibold bg-[#58C7FF] text-[#05070D] hover:bg-[#8AD8FF] inline-flex items-center gap-1.5 shadow-[0_0_20px_rgba(88,199,255,0.35)] w-fit">
              Open full Health Monitor <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <HealthSuite compact />
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: PRODUCT PREVIEW
          Inside the ASTRA-SENTINEL Mission Control Platform
         ========================================================================= */}
      <section className="py-24 band border-y relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-mono text-[#58C7FF] tracking-widest uppercase">Live Platform Demonstration</span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display mt-2">
                Inside the ASTRA-SENTINEL Mission Control Platform
              </h2>
              <p className="text-sm text-[#94A3B8] mt-2 max-w-xl">
                Experience the interactive telemetry consoles, spacecraft module inspection, and AI risk categorization in real time.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => isRunning ? simulator.pause() : simulator.start()}
                className="px-4 py-2 rounded-lg text-xs font-mono bg-[#1E2D44] hover:bg-[#2A3F5F] text-[#F8FAFC] flex items-center gap-1.5 transition-colors"
              >
                {isRunning ? <Pause className="w-3.5 h-3.5 text-[#F59E0B]" /> : <Play className="w-3.5 h-3.5 text-[#10B981]" />}
                <span>{isRunning ? 'Pause Stream' : 'Resume Stream'}</span>
              </button>

              <Link
                to="/mission-control"
                className="px-5 py-2.5 rounded-lg text-xs font-mono font-semibold bg-[#58C7FF] text-[#05070D] hover:bg-[#38BDF8] flex items-center gap-1.5 shadow-[0_0_20px_rgba(88,199,255,0.4)] transition-all"
              >
                <span>Launch Mission Control</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Interactive Live Preview Console */}
          <div className="space-y-6">
            {/* Telemetry Graphs Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <TelemetryChart
                title="Heart Rate"
                unit="BPM"
                data={telemetryHistory.map((d) => ({ time: d.time, value: d.heartRate }))}
                color="#EF4444"
                strokeColor="#EF4444"
                warningThreshold={100}
                criticalThreshold={118}
                height={150}
              />
              <TelemetryChart
                title="Arterial SpO2"
                unit="%"
                data={telemetryHistory.map((d) => ({ time: d.time, value: d.spO2 }))}
                color="#10B981"
                strokeColor="#10B981"
                warningThreshold={95}
                criticalThreshold={92}
                height={150}
                yMin={88}
                yMax={100}
              />
              <TelemetryChart
                title="Cabin Temperature"
                unit="°C"
                data={telemetryHistory.map((d) => ({ time: d.time, value: d.cabinTemp }))}
                color="#F59E0B"
                strokeColor="#F59E0B"
                warningThreshold={26}
                criticalThreshold={31}
                height={150}
              />
              <TelemetryChart
                title="Smoke Sensor"
                unit="ppm"
                data={telemetryHistory.map((d) => ({ time: d.time, value: d.smokeDensity }))}
                color="#58C7FF"
                strokeColor="#58C7FF"
                warningThreshold={0.15}
                criticalThreshold={0.4}
                height={150}
                yMin={0}
                yMax={1}
              />
            </div>

            {/* Spacecraft Module Visualizer */}
            <SpacecraftModuleViewer modules={modules} />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: HOW IT WORKS
          From Sensor Signals to Mission Intelligence (5 Steps)
         ========================================================================= */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-mono text-[#58C7FF] tracking-widest uppercase">Process Workflow</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">
              From Sensor Signals to Mission Intelligence
            </h2>
            <p className="text-base text-[#94A3B8]">
              A five-stage pipeline translating continuous telemetry into instant situational awareness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {pipelineStages.map((st, idx) => (
              <button
                key={st.title}
                type="button"
                onClick={() => setActiveStage(idx)}
                aria-pressed={activeStage === idx}
                className={`space-card clickable-card rounded-2xl p-5 text-left relative ${
                  activeStage === idx ? 'space-card-glow-cyan' : 'border border-[#1E2D44]'
                }`}
              >
                <span className="text-xs font-mono font-bold text-[#58C7FF] block mb-2">0{idx + 1}</span>
                <h3 className="text-base font-bold font-display text-[#F8FAFC]">{st.title}</h3>
                <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">{st.desc}</p>
                <span className="mt-3 inline-block text-[10px] font-mono text-[#58C7FF]/80">
                  {activeStage === idx ? '● INSPECTING' : 'Click to inspect →'}
                </span>
              </button>
            ))}
          </div>

          {/* Live inspector for the selected stage, fed by the running simulator */}
          <div className="mt-6 space-card rounded-2xl p-6 border border-[#58C7FF]/25">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono">
                <Search className="w-4 h-4 text-[#58C7FF]" />
                <span className="text-[#94A3B8]">STAGE 0{activeStage + 1} ·</span>
                <span className="text-[#F8FAFC] font-semibold uppercase">{pipelineStages[activeStage].title}</span>
                <span className="ml-2 text-[#10B981]">{isRunning ? '● LIVE' : '❚❚ PAUSED'}</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveStage((activeStage + 4) % 5)}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono border border-white/10 text-[#94A3B8] hover:text-white"
                >
                  ← Prev
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStage((activeStage + 1) % 5)}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono border border-white/10 text-[#94A3B8] hover:text-white"
                >
                  Next →
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
              {pipelineStages[activeStage].metrics.map(([k, v, tone]) => (
                <div key={k} className="p-3 rounded-xl bg-[#05070D]/60 border border-white/5">
                  <span className="text-[10px] font-mono text-[#64748B] block">{k}</span>
                  <span className={`text-lg font-mono font-bold ${tone}`}>{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-[#94A3B8] max-w-2xl">{pipelineStages[activeStage].note}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => simulator.triggerDemoEmergency()}
                  className="px-3 py-2 rounded-lg text-xs font-mono bg-[#EF4444]/15 text-[#FCA5A5] border border-[#EF4444]/40 hover:bg-[#EF4444]/25 inline-flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" /> Inject anomaly
                </button>
                <button
                  type="button"
                  onClick={() => navigate(pipelineStages[activeStage].to)}
                  className="px-3 py-2 rounded-lg text-xs font-mono font-semibold bg-[#58C7FF] text-[#05070D] hover:bg-[#8AD8FF] inline-flex items-center gap-1.5"
                >
                  {pipelineStages[activeStage].cta} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: NASA DATA AND RESEARCH
          Built Around Open Space Science
         ========================================================================= */}
      <section className="py-24 band border-y relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-mono text-[#58C7FF] tracking-widest uppercase">Open Science Grounding</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">
              Built Around Open Space Science
            </h2>
            <p className="text-base text-[#94A3B8]">
              ASTRA-SENTINEL AI explores publicly available space science datasets and APIs to support research,
              visualization, and prototype development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VERIFIED_DATASETS.slice(0, 4).map((dataset) => (
              <div key={dataset.id} className="space-card rounded-2xl p-6 border border-[#1E2D44] hover:border-[#58C7FF]/40 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-semibold text-[#58C7FF]">{dataset.source}</span>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                    dataset.integrationStatus === 'Connected' ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40' :
                    'bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/40'
                  }`}>
                    {dataset.integrationStatus}
                  </span>
                </div>
                <h3 className="text-base font-bold font-display text-[#F8FAFC]">{dataset.title}</h3>
                <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">{dataset.description}</p>

                <div className="mt-4 pt-3 border-t border-[#1E2D44] space-y-1.5 text-xs font-mono">
                  <div className="text-[#58C7FF]/90 font-medium">Use Case: {dataset.useCase}</div>
                  <div className="text-[#64748B]">Data Type: {dataset.dataType}</div>
                </div>

                <div className="mt-4 flex items-center justify-between pt-2">
                  <a
                    href={dataset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-[#94A3B8] hover:text-[#58C7FF] flex items-center gap-1 transition-colors"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <Link
                    to="/research"
                    className="text-xs font-mono text-[#58C7FF] hover:underline"
                  >
                    Provenance Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/research"
              className="inline-flex items-center gap-2 text-xs font-mono text-[#58C7FF] hover:underline"
            >
              <Database className="w-4 h-4" />
              Explore All External Scientific Data Sources & Provenance Metadata <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: FUTURE VISION
          Beyond Monitoring. Toward Predictive Space Safety. (4 Cards)
         ========================================================================= */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-mono text-[#8B5CF6] tracking-widest uppercase">Long-Term Research Horizon</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">
              Beyond Monitoring. Toward Predictive Space Safety.
            </h2>
            <p className="text-base text-[#94A3B8]">
              Our long-term research direction explores predictive safety intelligence, spacecraft digital twins,
              resilient navigation, and intelligent decision-support systems for future human space missions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visionCards.map((c) => (
              <Link key={c.title} to={c.to} className="space-card clickable-card rounded-2xl p-6 border border-[#1E2D44] flex flex-col group">
                <div className="p-3 rounded-xl w-fit mb-4" style={{ background: `${c.tone}1A`, color: c.tone }}>
                  {c.icon}
                </div>
                <h3 className="text-base font-bold font-display text-[#F8FAFC]">{c.title}</h3>
                <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed flex-1">{c.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-mono group-hover:gap-2 transition-all" style={{ color: c.tone }}>
                  {c.cta} <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 10: FINAL CTA
          The Future of Space Safety Starts With Intelligence.
         ========================================================================= */}
      <section className="py-20 relative overflow-hidden band border-t">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-bold font-display tracking-tight">
            The Future of Space Safety Starts With Intelligence.
          </h2>
          <p className="text-base text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
            Explore how ASTRA-SENTINEL AI brings astronaut health, spacecraft safety, and mission intelligence together into a single unified operational prototype.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/platform"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#58C7FF] to-[#3B82F6] text-[#05070D] shadow-[0_0_30px_rgba(88,199,255,0.4)] hover:shadow-[0_0_40px_rgba(88,199,255,0.6)] transition-all"
            >
              Explore the Platform
            </Link>

            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm bg-[#101826] text-[#F8FAFC] border border-[#1E2D44] hover:border-[#58C7FF]/50 hover:bg-[#162235] transition-all"
            >
              Contact Our Team
            </Link>

            <Link
              to="/mission-control"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-mono text-xs text-[#58C7FF] flex items-center justify-center gap-1.5 hover:underline"
            >
              <Activity className="w-4 h-4" />
              Launch Mission Control
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
