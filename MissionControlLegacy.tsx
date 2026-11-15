import React, { useState, useEffect } from 'react';
import {
  Activity,
  Heart,
  Flame,
  Cpu,
  Shield,
  ShieldAlert,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Clock,
  Radio,
  Compass,
  Sun,
  Eye,
  History,
  Info,
  Maximize2,
  Bell,
  Check,
} from 'lucide-react';
import { simulator, SCENARIOS } from '../services/simulationEngine';
import { TelemetryChart } from '../components/charts/TelemetryChart';
import { SpacecraftModuleViewer } from '../components/spacecraft/SpacecraftModuleViewer';
import { fetchDonkiNotifications, DonkiEvent } from '../services/nasaService';
import { useSearchParams, Link } from 'react-router-dom';
import { HealthSuite } from './HealthMonitor';
import { EmbeddedModule } from '../components/common/EmbeddedModule';

type McTab = 'overview' | 'vitals' | 'env' | 'ai' | 'modules' | 'weather' | 'events';
const MC_TABS: McTab[] = ['overview', 'vitals', 'env', 'ai', 'modules', 'weather', 'events'];

export const MissionControl: React.FC = () => {
  // Sync state with simulator
  const [vitals, setVitals] = useState(simulator.getVitals());
  const [env, setEnv] = useState(simulator.getEnv());
  const [risk, setRisk] = useState(simulator.getRisk());
  const [modules, setModules] = useState(simulator.getModules());
  const [missionStatus, setMissionStatus] = useState(simulator.getMissionStatus());
  const [telemetryHistory, setTelemetryHistory] = useState(simulator.getTelemetryHistory());
  const [alerts, setAlerts] = useState(simulator.getAlerts());
  const [eventHistory, setEventHistory] = useState(simulator.getEventHistory());
  const [isRunning, setIsRunning] = useState(simulator.getIsRunning());
  const [activeScenario, setActiveScenario] = useState(simulator.getActiveScenario());
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as McTab | null;
  const activeTab: McTab = tabParam && MC_TABS.includes(tabParam) ? tabParam : 'overview';
  const setActiveTab = (t: McTab) => {
    setSearchParams(t === 'overview' ? {} : { tab: t }, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  // Each sidebar tab focuses the console on its own panels; Overview shows everything.
  const show = (...tabs: McTab[]) => activeTab === 'overview' || tabs.includes(activeTab);
  const [donkiEvents, setDonkiEvents] = useState<DonkiEvent[]>([]);
  const [envView, setEnvView] = useState<'fire' | 'hud'>('fire');
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = simulator.subscribe(() => {
      setVitals({ ...simulator.getVitals() });
      setEnv({ ...simulator.getEnv() });
      setRisk({ ...simulator.getRisk() });
      setModules([...simulator.getModules()]);
      setMissionStatus({ ...simulator.getMissionStatus() });
      setTelemetryHistory([...simulator.getTelemetryHistory()]);
      setAlerts([...simulator.getAlerts()]);
      setEventHistory([...simulator.getEventHistory()]);
      setIsRunning(simulator.getIsRunning());
      setActiveScenario(simulator.getActiveScenario());
    });
    return unsubscribe;
  }, []);

  // Fetch DONKI space weather on mount
  useEffect(() => {
    fetchDonkiNotifications().then(setDonkiEvents);
  }, []);

  const handleScenarioChange = (id: string) => {
    simulator.setScenario(id);
  };

  const getRiskColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40';
      case 'WARNING':
        return 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/40';
      default:
        return 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40';
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-[#030712]/60 text-[#F8FAFC] flex flex-col font-sans">
      {/* =========================================================================
          MISSION CONTROL SUB-HEADER
          Mission ID, Clock, Status, Prominent "SIMULATED TELEMETRY" Badges
         ========================================================================= */}
      <div className="bg-[#0A101B] border-b border-[#1E2D44] px-4 sm:px-6 py-2.5 z-30">
        <div className="max-w-[1700px] mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Left: Mission ID & Primary Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#58C7FF] animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-wider text-[#F8FAFC]">
                {missionStatus.missionId}
              </span>
            </div>

            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-ping" />
              SIMULATED TELEMETRY
            </span>

            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#101826] text-[#94A3B8] border border-[#1E2D44] hidden md:inline">
              ALT: {missionStatus.orbitalAltitudeKm.toFixed(1)} km • VEL: {missionStatus.velocityKmS.toFixed(2)} km/s
            </span>
          </div>

          {/* Middle: Live Timestamps */}
          <div className="hidden lg:flex items-center gap-4 text-xs font-mono text-[#94A3B8]">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#58C7FF]" />
              <span>MET: {missionStatus.activeSince}</span>
            </div>
            <div className="text-[#64748B]">|</div>
            <div>UTC: {utcTime}</div>
            <div className="text-[#64748B]">|</div>
            <div className="text-[#58C7FF]">LATENCY: ~{missionStatus.signalLatencySec}s</div>
          </div>

          {/* Right: Simulation Controls & Emergency Trigger */}
          <div className="flex items-center gap-2">
            <a href="/mission-hud-preview.html" className="hidden lg:inline-flex px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#101826] hover:bg-[#172338] border border-[#1E2D44] hover:border-[#58C7FF] text-[#58C7FF] transition-colors">Site HUD Preview</a>
            <button
              onClick={() => simulator.triggerDemoEmergency()}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#EF4444] hover:bg-[#DC2626] text-[#FFFFFF] shadow-[0_0_15px_rgba(239,68,68,0.4)] flex items-center gap-1.5 transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
              <span>Trigger Demo Emergency</span>
            </button>

            <button
              onClick={() => (isRunning ? simulator.pause() : simulator.start())}
              className="p-1.5 rounded-lg bg-[#101826] border border-[#1E2D44] hover:border-[#58C7FF] text-[#F8FAFC] transition-colors"
              title={isRunning ? 'Pause Simulation Stream' : 'Resume Simulation Stream'}
            >
              {isRunning ? <Pause className="w-4 h-4 text-[#F59E0B]" /> : <Play className="w-4 h-4 text-[#10B981]" />}
            </button>

            <button
              onClick={() => simulator.reset()}
              className="p-1.5 rounded-lg bg-[#101826] border border-[#1E2D44] hover:border-[#58C7FF] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
              title="Reset Simulation to Nominal"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MAIN INTERFACE CONTAINER
          Sidebar + Scrollable Console Content
         ========================================================================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Console Sidebar Navigation */}
        <aside className="w-64 bg-[#0A101B]/95 border-r border-[#1E2D44] p-4 hidden md:flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#64748B] uppercase block mb-2 px-2">
                Console Views
              </span>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full px-3 py-2 rounded-lg text-xs font-mono text-left flex items-center gap-2.5 transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-[#58C7FF]/15 text-[#58C7FF] border-l-2 border-[#58C7FF] font-semibold'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#101826]'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>Integrated Overview</span>
                </button>

                <button
                  onClick={() => setActiveTab('vitals')}
                  className={`w-full px-3 py-2 rounded-lg text-xs font-mono text-left flex items-center gap-2.5 transition-colors ${
                    activeTab === 'vitals'
                      ? 'bg-[#58C7FF]/15 text-[#58C7FF] border-l-2 border-[#58C7FF] font-semibold'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#101826]'
                  }`}
                >
                  <Heart className="w-4 h-4 text-[#EF4444]" />
                  <span>Astronaut Health</span>
                </button>

                <button
                  onClick={() => setActiveTab('env')}
                  className={`w-full px-3 py-2 rounded-lg text-xs font-mono text-left flex items-center gap-2.5 transition-colors ${
                    activeTab === 'env'
                      ? 'bg-[#58C7FF]/15 text-[#58C7FF] border-l-2 border-[#58C7FF] font-semibold'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#101826]'
                  }`}
                >
                  <Flame className="w-4 h-4 text-[#F59E0B]" />
                  <span>Environmental Safety</span>
                </button>

                <button
                  onClick={() => setActiveTab('ai')}
                  className={`w-full px-3 py-2 rounded-lg text-xs font-mono text-left flex items-center gap-2.5 transition-colors ${
                    activeTab === 'ai'
                      ? 'bg-[#58C7FF]/15 text-[#58C7FF] border-l-2 border-[#58C7FF] font-semibold'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#101826]'
                  }`}
                >
                  <Cpu className="w-4 h-4 text-[#8B5CF6]" />
                  <span>AI Risk Engine</span>
                </button>

                <button
                  onClick={() => setActiveTab('modules')}
                  className={`w-full px-3 py-2 rounded-lg text-xs font-mono text-left flex items-center gap-2.5 transition-colors ${
                    activeTab === 'modules'
                      ? 'bg-[#58C7FF]/15 text-[#58C7FF] border-l-2 border-[#58C7FF] font-semibold'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#101826]'
                  }`}
                >
                  <Shield className="w-4 h-4 text-[#10B981]" />
                  <span>Spacecraft Modules</span>
                </button>

                <button
                  onClick={() => setActiveTab('weather')}
                  className={`w-full px-3 py-2 rounded-lg text-xs font-mono text-left flex items-center gap-2.5 transition-colors ${
                    activeTab === 'weather'
                      ? 'bg-[#58C7FF]/15 text-[#58C7FF] border-l-2 border-[#58C7FF] font-semibold'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#101826]'
                  }`}
                >
                  <Sun className="w-4 h-4 text-[#F59E0B]" />
                  <span>NASA Space Weather</span>
                </button>

                <button
                  onClick={() => setActiveTab('events')}
                  className={`w-full px-3 py-2 rounded-lg text-xs font-mono text-left flex items-center gap-2.5 transition-colors ${
                    activeTab === 'events'
                      ? 'bg-[#58C7FF]/15 text-[#58C7FF] border-l-2 border-[#58C7FF] font-semibold'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#101826]'
                  }`}
                >
                  <History className="w-4 h-4 text-[#38BDF8]" />
                  <span>Event Chronology</span>
                </button>
              </nav>
            </div>

            {/* Scenario Selector */}
            <div className="pt-4 border-t border-[#1E2D44]">
              <span className="text-[10px] font-mono tracking-widest text-[#64748B] uppercase block mb-2 px-2">
                Scenario Injector
              </span>
              <div className="space-y-1">
                {SCENARIOS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleScenarioChange(s.id)}
                    className={`w-full px-2.5 py-1.5 rounded text-[11px] font-mono text-left truncate transition-colors ${
                      activeScenario === s.id
                        ? 'bg-[#58C7FF]/20 text-[#58C7FF] font-semibold'
                        : 'text-[#94A3B8] hover:bg-[#101826]'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Stream Status */}
          <div className="p-3 rounded-xl bg-[#05070D] border border-[#1E2D44] text-xs font-mono">
            <div className="flex items-center justify-between text-[#64748B] text-[10px]">
              <span>STREAM STATUS</span>
              <span className="text-[#10B981]">ONLINE</span>
            </div>
            <div className="text-[11px] text-[#F8FAFC] font-semibold mt-1">
              {isRunning ? 'TRANSMITTING' : 'PAUSED'} • 2.2s CADENCE
            </div>
          </div>
        </aside>

        {/* Scrollable Main Content Display */}
        <main className={`flex-1 overflow-y-auto ${activeTab === 'env' ? 'p-2 sm:p-3' : 'p-4 sm:p-6 lg:p-8 space-y-6'}`}>
          {activeTab === 'env' ? (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                <div className="inline-flex gap-1.5 p-1 rounded-xl glass-panel">
                  {([
                    ['fire', 'FireHealth AI · Aegis FDS'],
                    ['hud', 'Environment HUD'],
                  ] as const).map(([id, name]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setEnvView(id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono ${envView === id ? 'bg-[#F59E0B] text-[#1a1003] font-semibold' : 'text-[#94A3B8] hover:text-white'}`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
                <Link to="/technology/firehealth" className="text-xs font-mono text-[#F59E0B] hover:underline">Open full page →</Link>
              </div>
              {envView === 'fire' ? (
                <EmbeddedModule src="/aegis-fds/index.html" title="FireHealth AI · Aegis FDS" showToolbar={false} height="calc(100vh - 230px)" minHeight={640} eager />
              ) : (
                <iframe
                  title="Environmental Controls — simulated mission HUD"
                  src="/mission-hud-preview.html?view=hud&embedded=1"
                  className="block w-full h-[calc(100vh-230px)] min-h-[640px] rounded-lg border border-[#1E2D44] bg-[#010812]"
                />
              )}
            </div>
          ) : (
            <>
          {/* Top Banner Alert for Emergency / Warning */}
          {risk.overallRisk !== 'NORMAL' && (
            <div
              className={`p-4 rounded-xl border animate-in fade-in slide-in-from-top-2 duration-300 flex items-start justify-between gap-4 ${
                risk.overallRisk === 'CRITICAL'
                  ? 'bg-[#EF4444]/15 border-[#EF4444] text-[#F8FAFC] shadow-[0_0_25px_rgba(239,68,68,0.25)]'
                  : 'bg-[#F59E0B]/15 border-[#F59E0B] text-[#F8FAFC]'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${risk.overallRisk === 'CRITICAL' ? 'text-[#EF4444]' : 'text-[#F59E0B]'}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold tracking-wider uppercase">
                      {risk.overallRisk} FLIGHT ANOMALY DETECTED
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-black/40">
                      CONFIDENCE: {risk.anomalyConfidence}%
                    </span>
                  </div>
                  <p className="text-sm font-semibold mt-0.5">{risk.primaryAnomaly}</p>
                  <p className="text-xs text-[#CBD5E1] mt-1">{risk.explanation}</p>
                  <div className="mt-2 text-xs font-mono text-[#F8FAFC] bg-black/30 p-2 rounded border border-white/10">
                    <strong className="text-[#58C7FF]">RECOMMENDED ACTION: </strong>
                    {risk.recommendedAction}
                  </div>
                </div>
              </div>

              <button
                onClick={() => simulator.reset()}
                className="px-3 py-1.5 rounded text-xs font-mono bg-black/40 hover:bg-black/60 border border-white/20 shrink-0 transition-colors"
              >
                Clear / Reset
              </button>
            </div>
          )}

          {/* Astronaut Health tab: full crew health monitor */}
          {activeTab === 'vitals' && (
            <div className="space-y-2">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold font-display">Astronaut Health Monitor</h2>
                  <p className="text-xs text-[#94A3B8]">Suit sensor map, ECG, crew vitals and fused AI risk for the demo crew.</p>
                </div>
                <Link to="/health-monitor" className="text-xs font-mono text-[#58C7FF] hover:underline">Open full page →</Link>
              </div>
              <HealthSuite compact />
            </div>
          )}

          {/* Section A & B: Astronaut Vitals & Environmental Metrics Status Cards */}
          {show('vitals', 'ai') && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Astronaut HR */}
            <div className="space-card rounded-xl p-4 border border-[#1E2D44]">
              <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
                <span>ASTRONAUT HEART RATE</span>
                <Heart className="w-4 h-4 text-[#EF4444]" />
              </div>
              <div className="flex items-baseline gap-1 mt-2 font-mono">
                <span className="text-3xl font-bold text-[#F8FAFC]">{vitals.heartRate}</span>
                <span className="text-xs text-[#64748B]">BPM</span>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1E2D44] text-[10px] font-mono">
                <span className="text-[#64748B]">BASELINE: 60-95</span>
                <span className={vitals.heartRate > 100 ? 'text-[#EF4444] font-bold' : 'text-[#10B981]'}>
                  {vitals.heartRate > 100 ? 'TACHYCARDIA' : 'NOMINAL'}
                </span>
              </div>
            </div>

            {/* Astronaut SpO2 */}
            <div className="space-card rounded-xl p-4 border border-[#1E2D44]">
              <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
                <span>ARTERIAL SpO2</span>
                <Activity className="w-4 h-4 text-[#10B981]" />
              </div>
              <div className="flex items-baseline gap-1 mt-2 font-mono">
                <span className="text-3xl font-bold text-[#F8FAFC]">{vitals.spO2.toFixed(1)}</span>
                <span className="text-xs text-[#64748B]">%</span>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1E2D44] text-[10px] font-mono">
                <span className="text-[#64748B]">THRESHOLD: &gt;95%</span>
                <span className={vitals.spO2 < 95 ? 'text-[#EF4444] font-bold' : 'text-[#10B981]'}>
                  {vitals.spO2 < 95 ? 'HYPOXIA RISK' : 'OPTIMAL'}
                </span>
              </div>
            </div>

            {/* Cabin Temp */}
            <div className="space-card rounded-xl p-4 border border-[#1E2D44]">
              <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
                <span>CABIN TEMPERATURE</span>
                <Flame className="w-4 h-4 text-[#F59E0B]" />
              </div>
              <div className="flex items-baseline gap-1 mt-2 font-mono">
                <span className="text-3xl font-bold text-[#F8FAFC]">{env.cabinTemperature.toFixed(1)}</span>
                <span className="text-xs text-[#64748B]">°C</span>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1E2D44] text-[10px] font-mono">
                <span className="text-[#64748B]">RANGE: 20-24°C</span>
                <span className={env.cabinTemperature > 26 ? 'text-[#EF4444] font-bold' : 'text-[#10B981]'}>
                  {env.cabinTemperature > 26 ? 'THERMAL EXCURSION' : 'STABLE'}
                </span>
              </div>
            </div>

            {/* Smoke Sensor Density */}
            <div className="space-card rounded-xl p-4 border border-[#1E2D44]">
              <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
                <span>SMOKE SENSOR</span>
                <ShieldAlert className="w-4 h-4 text-[#58C7FF]" />
              </div>
              <div className="flex items-baseline gap-1 mt-2 font-mono">
                <span className="text-3xl font-bold text-[#F8FAFC]">{env.smokeDensity.toFixed(2)}</span>
                <span className="text-xs text-[#64748B]">ppm</span>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1E2D44] text-[10px] font-mono">
                <span className="text-[#64748B]">ALERT: &gt;0.15 ppm</span>
                <span className={env.smokeDensity > 0.15 ? 'text-[#EF4444] font-bold' : 'text-[#10B981]'}>
                  {env.smokeDensity > 0.15 ? 'COMBUSTION DETECTED' : 'CLEAR'}
                </span>
              </div>
            </div>
          </div>
          )}

          {/* Section C: AI Risk Engine Assessment Bar */}
          {show('ai') && (
          <div className="space-card rounded-2xl p-5 border border-[#58C7FF]/30">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[#1E2D44]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#58C7FF]/15 text-[#58C7FF] border border-[#58C7FF]/30">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold font-display text-[#F8FAFC]">AI Multi-Sensor Risk Evaluation</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getRiskColor(risk.overallRisk)}`}>
                      OVERALL: {risk.overallRisk}
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    Continuous cross-correlation between astronaut hemodynamics and spacecraft cabin sensors.
                  </p>
                </div>
              </div>

              {/* Anomaly Confidence */}
              <div className="flex items-center gap-6 font-mono text-xs">
                <div>
                  <span className="text-[#64748B] block text-[10px]">HEALTH SCORE</span>
                  <span className="text-sm font-bold text-[#F8FAFC]">{risk.healthRiskScore} / 100</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[10px]">ENVIRONMENT SCORE</span>
                  <span className="text-sm font-bold text-[#F8FAFC]">{risk.environmentalRiskScore} / 100</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[10px]">CONFIDENCE</span>
                  <span className="text-sm font-bold text-[#58C7FF]">{risk.anomalyConfidence}%</span>
                </div>
              </div>
            </div>

            {/* Natural Language Explanation Box */}
            <div className="mt-4 p-4 rounded-xl bg-[#05070D] border border-[#1E2D44] font-mono text-xs text-[#94A3B8] leading-relaxed">
              <span className="text-[#58C7FF] font-semibold block mb-1">INTERPRETABLE AI REASONING:</span>
              {risk.explanation}
            </div>
          </div>
          )}

          {/* Separate model-backed assistants; synthetic snapshot only. */}
          {/* AI assistants: AstroHealth AI (crew health agent) and FireHealth AI (Aegis FDS) */}
          {show('ai') && (
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
              <div className="xl:col-span-3">
                <EmbeddedModule src="/astrohealth-ai/index.html" title="AstroHealth AI" label="AstroHealth AI · AstroAgent" minHeight={640} />
              </div>
              <Link
                to="/mission-control?tab=env"
                onClick={() => setEnvView('fire')}
                className="xl:col-span-2 space-card clickable-card rounded-2xl p-6 border border-[#F59E0B]/40 flex flex-col gap-3 self-start"
              >
                <span className="text-[10px] font-mono tracking-widest text-[#F59E0B]">FIREHEALTH AI · AEGIS FDS</span>
                <h3 className="text-lg font-bold font-display">Fire detection &amp; automatic alarm</h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Smoke, heat, CO and O₂ in eight compartments. When two sensors agree a fire has started, Aegis sounds the alarm and
                  lights the compartment on the deck plan.
                </p>
                <span className="text-xs font-mono text-[#F59E0B]">Open in Environmental Safety →</span>
              </Link>
            </div>
          )}

          {/* Section D: Spacecraft Modules Visualization */}
          {show('modules') && <SpacecraftModuleViewer modules={modules} />}

          {/* Section E: Real-Time Telemetry Graphs */}
          {show('vitals', 'modules') && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TelemetryChart
              title="Heart Rate (BPM)"
              unit="BPM"
              data={telemetryHistory.map((d) => ({ time: d.time, value: d.heartRate }))}
              color="#EF4444"
              strokeColor="#EF4444"
              warningThreshold={98}
              criticalThreshold={115}
            />

            <TelemetryChart
              title="Cabin Temperature (°C)"
              unit="°C"
              data={telemetryHistory.map((d) => ({ time: d.time, value: d.cabinTemp }))}
              color="#F59E0B"
              strokeColor="#F59E0B"
              warningThreshold={26}
              criticalThreshold={31}
            />

            <TelemetryChart
              title="Arterial SpO2 (%)"
              unit="%"
              data={telemetryHistory.map((d) => ({ time: d.time, value: d.spO2 }))}
              color="#10B981"
              strokeColor="#10B981"
              warningThreshold={95}
              criticalThreshold={92}
              yMin={88}
              yMax={100}
            />

            <TelemetryChart
              title="Smoke Density (ppm)"
              unit="ppm"
              data={telemetryHistory.map((d) => ({ time: d.time, value: d.smokeDensity }))}
              color="#58C7FF"
              strokeColor="#58C7FF"
              warningThreshold={0.15}
              criticalThreshold={0.4}
              yMin={0}
              yMax={1}
            />
          </div>
          )}

          {/* Section F: Alert Timeline with Acknowledgment */}
          {show('ai', 'events') && (
          <div className="space-card rounded-2xl p-5 border border-[#1E2D44]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1E2D44]">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#58C7FF]" />
                <h3 className="text-sm font-mono font-bold text-[#F8FAFC] tracking-wider uppercase">
                  Active Mission Alert Timeline
                </h3>
              </div>
              <span className="text-xs font-mono text-[#64748B]">
                {alerts.length} ALERTS RECORDED
              </span>
            </div>

            {alerts.length === 0 ? (
              <div className="py-8 text-center text-xs font-mono text-[#64748B]">
                NO ACTIVE DEMO ANOMALIES. ALL DISPLAYED VALUES ARE SYNTHETIC.
              </div>
            ) : (
              <div className="space-y-2.5">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono ${
                      alert.severity === 'CRITICAL'
                        ? 'bg-[#EF4444]/10 border-[#EF4444]/40'
                        : alert.severity === 'WARNING'
                        ? 'bg-[#F59E0B]/10 border-[#F59E0B]/40'
                        : 'bg-[#101826] border-[#1E2D44]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 border ${getRiskColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 text-[#F8FAFC] font-semibold">
                          <span>{alert.title}</span>
                          <span className="text-[#64748B] text-[10px]">[{alert.timestamp}]</span>
                        </div>
                        <p className="text-[11px] text-[#94A3B8] mt-0.5">{alert.description}</p>
                        <span className="text-[10px] text-[#58C7FF] mt-1 block">SOURCE: {alert.source}</span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {alert.acknowledged ? (
                        <span className="px-2.5 py-1 rounded bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 text-[10px] flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          ACKNOWLEDGED
                        </span>
                      ) : (
                        <button
                          onClick={() => simulator.acknowledgeAlert(alert.id)}
                          className="px-3 py-1 rounded bg-[#101826] hover:bg-[#1E2D44] text-[#F8FAFC] border border-[#58C7FF]/40 text-[10px] font-semibold transition-colors"
                        >
                          Acknowledge
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          )}

          {/* Event Chronology tab: every simulator event, newest first */}
          {activeTab === 'events' && (
            <div className="space-card rounded-2xl p-5 border border-[#1E2D44]">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1E2D44]">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-[#38BDF8]" />
                  <h3 className="text-sm font-mono font-bold text-[#F8FAFC] tracking-wider uppercase">Event Chronology</h3>
                </div>
                <button
                  onClick={() => {
                    const rows = ['time,type,event', ...eventHistory.map((e) => `${e.time},${e.type},"${e.event.replace(/"/g, '""')}"`)];
                    const url = URL.createObjectURL(new Blob([rows.join('\n')], { type: 'text/csv' }));
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `astra-event-log-${Date.now()}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-3 py-1 rounded text-[10px] font-mono border border-[#58C7FF]/40 text-[#58C7FF] hover:bg-[#58C7FF]/10"
                >
                  Export CSV
                </button>
              </div>
              {eventHistory.length === 0 ? (
                <div className="py-8 text-center text-xs font-mono text-[#64748B]">NO EVENTS RECORDED YET.</div>
              ) : (
                <ol className="relative border-l border-[#1E2D44] ml-2 space-y-3">
                  {eventHistory.map((e) => (
                    <li key={e.id} className="ml-4 text-xs font-mono">
                      <span className={`absolute -left-[5px] mt-1 w-2.5 h-2.5 rounded-full ${
                        e.type === 'CRITICAL' ? 'bg-[#EF4444]' : e.type === 'WARNING' ? 'bg-[#F59E0B]' : 'bg-[#58C7FF]'
                      }`} />
                      <div className="flex items-center gap-2">
                        <span className="text-[#64748B]">{e.time}</span>
                        <span className={`px-1.5 rounded text-[9px] border ${getRiskColor(e.type)}`}>{e.type}</span>
                      </div>
                      <p className="text-[#CBD5E1] mt-0.5">{e.event}</p>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}

          {/* Section G: Mission Overview & External Scientific Context */}
          {show('weather') && (
          <div className={`grid grid-cols-1 gap-4 ${activeTab === 'weather' ? '' : 'md:grid-cols-2'}`}>
            {/* Mission Profile Status */}
            {activeTab === 'overview' && (
            <div className="space-card rounded-2xl p-5 border border-[#1E2D44]">
              <h3 className="text-xs font-mono font-bold text-[#58C7FF] uppercase tracking-wider mb-4">
                Mission Profile & Comms Status
              </h3>
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#1E2D44]">
                  <span className="text-[#94A3B8]">Mission Phase</span>
                  <span className="text-[#F8FAFC] font-semibold">{missionStatus.phase}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[#1E2D44]">
                  <span className="text-[#94A3B8]">Active Crew Count</span>
                  <span className="text-[#F8FAFC] font-semibold">{missionStatus.crewCount} Astronauts</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[#1E2D44]">
                  <span className="text-[#94A3B8]">Spacecraft System State</span>
                  <span className={`font-semibold ${missionStatus.spacecraftStatus === 'NOMINAL' ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                    {missionStatus.spacecraftStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[#1E2D44]">
                  <span className="text-[#94A3B8]">Communications Link</span>
                  <span className="text-[#10B981] font-semibold">SIMULATED LINK · NOMINAL</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8]">Data Synchronization</span>
                  <span className="text-[#58C7FF] font-semibold">LIVE_SIMULATED (50Hz)</span>
                </div>
              </div>
            </div>
            )}

            {/* Space Weather Alert Context (NASA DONKI) */}
            <div className="space-card rounded-2xl p-5 border border-[#1E2D44]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-mono font-bold text-[#8B5CF6] uppercase tracking-wider">
                  NASA DONKI Space Weather Feed
                </h3>
                <span className="text-[10px] font-mono text-[#10B981]">FEED CONNECTED</span>
              </div>

              <div className="space-y-2">
                {donkiEvents.length === 0 && (
                  <div className="py-6 text-center text-xs font-mono text-[#64748B]">Loading DONKI notifications…</div>
                )}
                {donkiEvents.slice(0, activeTab === 'weather' ? 25 : 3).map((e, idx) => (
                  <a
                    key={idx}
                    href={e.messageURL || 'https://kauai.ccmc.gsfc.nasa.gov/DONKI/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-2.5 rounded-lg bg-[#05070D]/80 border border-[#1E2D44] hover:border-[#8B5CF6]/50 text-xs font-mono transition-colors"
                  >
                    <div className="flex items-center justify-between text-[#58C7FF]">
                      <span className="font-bold">[{e.messageType}] {e.messageId}</span>
                      <span className="text-[10px] text-[#64748B]">{e.messageIssueTime}</span>
                    </div>
                    <p className={`text-[11px] text-[#94A3B8] mt-1 leading-snug ${activeTab === 'weather' ? 'line-clamp-6' : 'line-clamp-2'}`}>{e.messageBody}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
          )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};


