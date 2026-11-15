import { lazy, Suspense, useEffect, useState } from "react";
import { engine, gps, useEngine, useGps } from "./lib/store";
import { formatMET } from "./sim/engine";
import { Dot, Src } from "./components/ui";
import { utc } from "./lib/format";
import Overview from "./tabs/Overview";
import LiveNav from "./tabs/LiveNav";
import EarthGps from "./tabs/EarthGps";
import QuantumSensor from "./tabs/QuantumSensor";
import PulsarNav from "./tabs/PulsarNav";
import Research from "./tabs/Research";

const DeepSpace = lazy(() => import("./tabs/DeepSpace"));
const DigitalTwin = lazy(() => import("./tabs/DigitalTwin"));

export type MissionMode = "A" | "B" | "C";

const TABS = [
  { id: "overview", label: "Mission Overview" },
  { id: "live", label: "Live Navigation" },
  { id: "gps", label: "Earth GPS" },
  { id: "deepspace", label: "Deep Space" },
  { id: "quantum", label: "Quantum Sensor" },
  { id: "pulsar", label: "Pulsar Navigation" },
  { id: "twin", label: "Digital Twin" },
  { id: "research", label: "Research & Logs" },
] as const;
export type TabId = (typeof TABS)[number]["id"];

export const MODE_LABEL: Record<MissionMode, string> = {
  A: "Mode A · Earth GPS",
  B: "Mode B · Cislunar simulation",
  C: "Mode C · Deep-space simulation",
};

function initialTab(): TabId {
  const h = location.hash.replace("#", "");
  return (TABS.find((t) => t.id === h)?.id ?? "overview") as TabId;
}

export default function App() {
  const e = useEngine();
  const g = useGps();
  const [tab, setTabState] = useState<TabId>(initialTab);
  const [mode, setModeState] = useState<MissionMode>("C");
  const [now, setNow] = useState(Date.now());

  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  useEffect(() => {
    const onHash = () => setTabState(initialTab());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  useEffect(() => {
    // feed the safety monitor with the age of external/device telemetry
    engine.reportExternal("device GPS", g.tracking, g.last ? g.last.wall : null);
  }, [g.tracking, g.last, now]);
  useEffect(() => {
    if (mode === "A" && gps.tracking && !engine.running) engine.checkAlerts();
  }, [mode, now]);

  const setTab = (t: TabId) => {
    setTabState(t);
    try { history.replaceState(null, "", `#${t}`); } catch { /* sandboxed */ }
    window.scrollTo({ top: 0 });
  };
  const setMode = (m: MissionMode) => {
    setModeState(m);
    if (m === "A") { engine.pause(); engine.addLog("control", "Mission mode A selected: Earth GPS with real device location."); }
    if (m === "B" && engine.mode !== "B") engine.reset("moon");
    if (m === "C" && engine.mode !== "C") engine.reset(engine.config.destination === "jupiter" ? "jupiter" : "mars");
  };
  // keep mission mode consistent when the destination is changed elsewhere
  useEffect(() => { if (mode !== "A" && engine.mode !== mode) setModeState(engine.mode); }, [e.version]);

  const health = e.filterHealth();
  const activeAlerts = e.alerts.filter((a) => a.active);
  const worst = activeAlerts.some((a) => a.severity === "critical") ? "critical" : activeAlerts.length ? "warning" : "ok";
  const lastSample = e.history[e.history.length - 1];
  const isReal = mode === "A";
  const gpsLevel = g.status === "tracking" ? "ok" : g.status === "idle" ? "off" : g.status === "requesting" ? "warning" : "critical";

  const ctx = { mode, setMode, setTab };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-200">
      <header className="sticky top-[env(safe-area-inset-top,0px)] z-50 border-b border-navy-700 bg-navy-950/95 backdrop-blur">
        <div className="gutter mx-auto flex max-w-[1500px] flex-wrap items-center gap-x-6 gap-y-2 py-2.5">
          <button type="button" onClick={() => setTab("overview")} className="flex items-center gap-2.5 text-left">
            <svg viewBox="0 0 32 32" className="h-7 w-7 text-cyan-400" aria-hidden>
              <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <ellipse cx="16" cy="16" rx="14" ry="5.5" fill="none" stroke="currentColor" strokeWidth="1.2" transform="rotate(-30 16 16)" />
              <circle cx="16" cy="16" r="3.4" fill="#FF5C61" />
            </svg>
            <span>
              <span className="block font-display text-[16px] font-bold leading-tight tracking-wide [font-stretch:115%]">QuantumNav Live</span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">Autonomous Space Navigation &amp; Tracking</span>
            </span>
          </button>

          <dl className="ml-auto grid grid-cols-2 gap-x-5 gap-y-1 text-[11.5px] sm:grid-cols-3 xl:flex xl:flex-wrap xl:items-center">
            <Item k="MET"><span className="tnum font-mono text-slate-100">{isReal ? "—" : formatMET(e.t)}</span></Item>
            <Item k="Nav mode"><span className="text-slate-100">{MODE_LABEL[mode].split(" · ")[0]}{!isReal && <span className="text-slate-400"> · {e.config.destination.toUpperCase()}</span>}</span></Item>
            <Item k="Data source">
              {isReal
                ? <span className="flex items-center gap-1.5"><Dot level={gpsLevel} />Device GPS: {g.status}</span>
                : <span className="flex items-center gap-1.5"><Dot level={e.running ? "ok" : "off"} />Sim engine {e.running ? "running" : e.arrived ? "complete" : "paused"}</span>}
            </Item>
            <Item k="Updated">
              <span className="tnum font-mono text-slate-100">{isReal ? (g.last ? utc(g.last.wall).slice(11) : "no fix") : lastSample ? utc(lastSample.wall).slice(11) : "—"}</span>
            </Item>
            <Item k="Sensor health">
              <span className="flex items-center gap-1.5"><Dot level={isReal ? gpsLevel : worst === "ok" ? health.level : worst} />{isReal ? (g.status === "tracking" ? "GPS fix" : "No fix") : activeAlerts.length ? `${activeAlerts.length} alert${activeAlerts.length > 1 ? "s" : ""}` : health.label}</span>
            </Item>
            <Item k="Data"><Src kind={isReal ? "real" : "sim"} /></Item>
          </dl>
        </div>
        <nav aria-label="Dashboard sections" className="gutter mx-auto max-w-[1500px]">
          <div role="tablist" className="-mb-px flex gap-1 overflow-x-auto">
            {TABS.map((t) => (
              <button key={t.id} role="tab" type="button" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
                className={`whitespace-nowrap border-b-2 px-3 py-2 text-[13px] transition-colors ${tab === t.id ? "border-cyan-400 text-cyan-300" : "border-transparent text-slate-400 hover:text-slate-100"}`}>
                {t.label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="gutter mx-auto max-w-[1500px] pb-16 pt-6">
        <Suspense fallback={<p className="text-slate-400">Loading 3D view…</p>}>
          {tab === "overview" && <Overview {...ctx} />}
          {tab === "live" && <LiveNav {...ctx} />}
          {tab === "gps" && <EarthGps {...ctx} />}
          {tab === "deepspace" && <DeepSpace {...ctx} />}
          {tab === "quantum" && <QuantumSensor />}
          {tab === "pulsar" && <PulsarNav />}
          {tab === "twin" && <DigitalTwin {...ctx} />}
          {tab === "research" && <Research />}
        </Suspense>
      </main>

      <footer className="gutter mx-auto max-w-[1500px] border-t border-navy-800 py-6 text-[12px] text-slate-500">
        QuantumNav Live is an exploratory research and simulation platform. It is not an aerospace-certified or space-deployed navigation system. Simulated outputs are not suitable for spacecraft flight operations.
      </footer>
    </div>
  );
}

function Item({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">{k}</dt>
      <dd className="m-0 truncate">{children}</dd>
    </div>
  );
}

export interface TabCtx { mode: MissionMode; setMode: (m: MissionMode) => void; setTab: (t: TabId) => void }
