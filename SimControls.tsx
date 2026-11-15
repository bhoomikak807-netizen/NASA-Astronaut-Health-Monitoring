import { useState } from "react";
import { useEngine } from "../lib/store";
import { SPEEDS, INTERVALS, Destination, formatMET } from "../sim/engine";
import { Button, Select, Toast } from "./ui";
import { offerDownload } from "../lib/download";
import { buildReport } from "../lib/report";

export function RunControls({ compact = false }: { compact?: boolean }) {
  const e = useEngine();
  const speeds = SPEEDS[e.mode];
  return (
    <div className="flex flex-wrap items-center gap-2">
      {!e.running ? (
        <Button variant="primary" onClick={() => e.start()} disabled={e.arrived} title={e.arrived ? "Scenario complete. Reset to run again." : undefined}>
          ▶ {e.t > 0 ? "Resume" : "Start"}
        </Button>
      ) : (
        <Button onClick={() => e.pause()}>❚❚ Pause</Button>
      )}
      <Button onClick={() => e.reset()}>↺ Reset</Button>
      <Button variant="ghost" onClick={() => e.tick()} disabled={e.running || e.arrived} title="Advance one telemetry step">Step</Button>
      <Select id={`speed-${compact ? "c" : "f"}`} label="Speed" value={Math.min(e.speedIdx, speeds.length - 1)} options={speeds.map((s, i) => ({ v: i, label: s.label }))} onChange={(i) => e.setSpeedIdx(i)} />
      {!compact && (
        <Select id="interval" label="Update every" value={e.intervalMs} options={INTERVALS.map((v) => ({ v, label: `${v} ms` }))} onChange={(v) => e.setIntervalMs(v)} />
      )}
      <span className="tnum font-mono text-[12px] text-slate-400">{formatMET(e.t)} / {formatMET(e.tEnd)}</span>
    </div>
  );
}

export function DestinationPicker({ onPick }: { onPick?: (d: Destination) => void }) {
  const e = useEngine();
  const opts: { v: Destination; label: string }[] = [
    { v: "moon", label: "Moon flyby (Mode B, cislunar)" },
    { v: "mars", label: "Mars transfer (Mode C)" },
    { v: "jupiter", label: "Jupiter transfer (Mode C)" },
  ];
  const [dest, setDest] = useState<Destination>(e.config.destination);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select id="dest" label="Destination" value={dest} options={opts} onChange={setDest} />
      <Button variant="primary" onClick={() => { e.reset(dest); onPick?.(dest); }}>Generate trajectory</Button>
    </div>
  );
}

export function DataControls() {
  const e = useEngine();
  const [msg, setMsg] = useState<string | null>(null);
  const stamp = () => new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button onClick={() => { e.clearHistory(); setMsg("History cleared."); }}>Clear history</Button>
      <Button onClick={async () => { const r = await offerDownload(`quantumnav-telemetry-${stamp()}.csv`, e.toCsv()); setMsg(r.message); }} disabled={e.history.length < 1}>Export CSV</Button>
      <Button onClick={async () => { const r = await offerDownload(`quantumnav-mission-report-${stamp()}.md`, buildReport(e)); setMsg(r.message); }}>Download report</Button>
      <Toast msg={msg} />
    </div>
  );
}
