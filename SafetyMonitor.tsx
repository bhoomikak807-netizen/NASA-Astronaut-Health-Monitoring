import { useEngine } from "../lib/store";
import { formatMET } from "../sim/engine";
import { utc } from "../lib/format";
import { Button, Dot, NumField, Panel, Toggle } from "./ui";

export default function SafetyMonitor({ showThresholds = true }: { showThresholds?: boolean }) {
  const e = useEngine();
  const th = e.config.thresholds;
  const active = e.alerts.filter((a) => a.active);
  return (
    <Panel title="Navigation safety monitor" src="sim"
      right={<span className="rounded border border-warn/50 px-1.5 py-px font-mono text-[10px] tracking-wider text-warn">DEMO LOGIC</span>}>
      <div className="grid gap-4">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => e.injectThrust()} title="Adds a small unplanned acceleration for a short period">Inject unexpected thrust</Button>
          <Button onClick={() => e.injectBiasJump()} title="Steps the true accelerometer bias">Inject bias step</Button>
          <Toggle id="pulsar-outage" checked={e.config.pulsar.outage} onChange={(v) => e.setPulsarOutage(v)} label="Pulsar outage" />
          <Toggle id="star-outage" checked={e.config.star.outage} onChange={(v) => e.setStarOutage(v)} label="Star tracker outage" />
        </div>

        <div aria-live="polite" className="grid gap-2">
          <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-slate-400">{active.length ? `${active.length} active` : "No active alerts"}</div>
          <ul className="grid max-h-[340px] gap-2 overflow-y-auto pr-1">
            {e.alerts.length === 0 && <li className="text-[13px] text-slate-500">No alerts yet.</li>}
            {e.alerts.slice(0, 50).map((a) => (
              <li key={a.id} className={`rounded border px-3 py-2 ${a.active ? (a.severity === "critical" ? "border-crit/60 bg-crit/10" : "border-warn/50 bg-warn/5") : "border-navy-700 bg-navy-850 opacity-70"}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <Dot level={a.active ? (a.severity === "critical" ? "critical" : "warning") : "off"} />
                  <span className={`font-mono text-[10.5px] uppercase tracking-wider ${a.severity === "critical" ? "text-crit" : "text-warn"}`}>{a.severity}</span>
                  <span className="text-[13.5px] font-medium text-slate-100">{a.title}</span>
                  <span className="ml-auto font-mono text-[11px] text-slate-500">{formatMET(a.met)} · {utc(a.wall).slice(11)}{a.active ? "" : " · cleared"}</span>
                </div>
                <p className="mt-1 text-[12.5px] text-slate-300">{a.explanation}</p>
                <p className="mt-0.5 text-[12.5px] text-slate-400"><span className="text-slate-500">Suggested check: </span>{a.action}</p>
              </li>
            ))}
          </ul>
        </div>

        {showThresholds && (
          <details className="rounded border border-navy-700 px-3 py-2">
            <summary className="cursor-pointer text-[13px] text-slate-300">Thresholds</summary>
            <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
              <NumField id="th-pos" label="Position 1σ limit" unit="km" value={th.posSigmaKm} min={0.001} onChange={(v) => e.updateThresholds({ posSigmaKm: v })} />
              <NumField id="th-bias" label="Bias limit" unit="m/s²" value={th.biasMs2} min={0} onChange={(v) => e.updateThresholds({ biasMs2: v })} />
              <NumField id="th-acc" label="Unexpected accel." unit="m/s²" value={th.unexpectedAccMs2} min={0} onChange={(v) => e.updateThresholds({ unexpectedAccMs2: v })} />
              <NumField id="th-miss" label="Missing fix after" unit="× obs. time" value={th.missingFactor} min={1} onChange={(v) => e.updateThresholds({ missingFactor: v })} />
              <NumField id="th-nis" label="Residual limit (NIS)" unit="σ²" value={th.nisLimit} min={1} onChange={(v) => e.updateThresholds({ nisLimit: v })} />
              <NumField id="th-stale" label="Stale telemetry after" unit="s" value={th.staleSec} min={1} onChange={(v) => e.updateThresholds({ staleSec: v })} />
            </div>
          </details>
        )}
      </div>
    </Panel>
  );
}
