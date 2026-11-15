import { memo, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Scatter, ScatterChart, ZAxis } from "recharts";
import { useEngine } from "../lib/store";
import { Sample } from "../sim/engine";
import { Panel } from "./ui";
import { AU_KM } from "../sim/constants";

const AX = { stroke: "#5B6F8C", fontSize: 10.5, fontFamily: "IBM Plex Mono, monospace" };
const GRID = "#16263F";
const COL = { a: "#4FD1EE", b: "#B79BFF", c: "#F5B547", d: "#3DDC84", e: "#FF5C61", f: "#8A9BB3" };

type Row = Record<string, number | null>;

const tick = (v: number) => (Math.abs(v) >= 1e4 || (Math.abs(v) < 1e-2 && v !== 0) ? v.toExponential(1) : Number(v.toPrecision(3)).toString());

const Chart = memo(function Chart({ title, data, xKey, xLabel, lines, unit, log }: {
  title: string; data: Row[]; xKey: string; xLabel: string; unit: string; log?: boolean;
  lines: { key: string; name: string; color: string; dash?: string }[];
}) {
  return (
    <Panel title={title} src="sim" right={<span className="font-mono text-[10.5px] text-slate-500">{unit}</span>}>
      <div className="h-[190px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="2 4" />
            <XAxis dataKey={xKey} type="number" domain={["dataMin", "dataMax"]} tick={AX} stroke={AX.stroke} tickFormatter={(v) => Number(v).toFixed(1)} label={{ value: xLabel, position: "insideBottomRight", offset: -2, fill: "#5B6F8C", fontSize: 10 }} />
            <YAxis tick={AX} stroke={AX.stroke} width={58} tickFormatter={tick} scale={log ? "log" : "auto"} domain={log ? ["auto", "auto"] : ["auto", "auto"]} allowDataOverflow={false} />
            <Tooltip contentStyle={{ background: "#0A1424", border: "1px solid #2A4468", fontSize: 12 }} labelFormatter={(v) => `${xLabel} ${Number(v).toFixed(3)}`} formatter={(v: number) => (typeof v === "number" ? tick(v) : v)} />
            {lines.length > 1 && <Legend wrapperStyle={{ fontSize: 11 }} iconSize={8} />}
            {lines.map((l) => (
              <Line key={l.key} type="monotone" dataKey={l.key} name={l.name} stroke={l.color} strokeDasharray={l.dash} dot={false} strokeWidth={1.6} isAnimationActive={false} connectNulls />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
});

export function useChartData(history: Sample[], mode: "B" | "C") {
  return useMemo(() => {
    const div = mode === "B" ? 3600 : 86400;
    const pdiv = mode === "B" ? 1000 : AU_KM;
    const pos = (v: number) => v / pdiv;
    return history.map((s) => ({
      x: s.met / div,
      rx: pos(s.rx), ry: pos(s.ry), rz: pos(s.rz), r: pos(s.r),
      vx: s.vx, vy: s.vy, vz: s.vz, v: s.v,
      acc: s.acc, omega: s.omega, phase: s.phase,
      resUs: s.resUs,
      sigR: s.sigR > 0 ? s.sigR : null, errFused: s.errFused > 0 ? s.errFused : null, errDR: s.errDR > 0 ? s.errDR : null,
      correction: s.correction,
    }));
  }, [history, history.length, history[history.length - 1]]);
}

export default function TelemetryCharts() {
  const e = useEngine();
  const data = useChartData(e.history, e.mode);
  const xLabel = e.mode === "B" ? "h" : "d";
  const posUnit = e.mode === "B" ? "10³ km" : "AU";
  const frame = e.mode === "B" ? "Earth-centred" : "heliocentric";
  return (
    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
      <Chart title={`Position (${frame})`} data={data} xKey="x" xLabel={xLabel} unit={posUnit} lines={[{ key: "rx", name: "x", color: COL.a }, { key: "ry", name: "y", color: COL.b }, { key: "rz", name: "z", color: COL.c }]} />
      <Chart title="Velocity" data={data} xKey="x" xLabel={xLabel} unit="km/s" lines={[{ key: "vx", name: "vx", color: COL.a }, { key: "vy", name: "vy", color: COL.b }, { key: "v", name: "|v|", color: COL.d }]} />
      <Chart title="Acceleration (bias-corrected)" data={data} xKey="x" xLabel={xLabel} unit="m/s²" lines={[{ key: "acc", name: "|f|", color: COL.c }]} />
      <Chart title="Angular velocity (CAI gyro)" data={data} xKey="x" xLabel={xLabel} unit="rad/s" lines={[{ key: "omega", name: "|ω|", color: COL.b }]} />
      <Chart title="Interferometer phase shift (x axis)" data={data} xKey="x" xLabel={xLabel} unit="rad" lines={[{ key: "phase", name: "Δφ", color: COL.e }]} />
      <Chart title="Pulsar timing residual (pre-fit)" data={data} xKey="x" xLabel={xLabel} unit="µs" lines={[{ key: "resUs", name: "residual", color: COL.a }]} />
      <Chart title="Position uncertainty and error" data={data} xKey="x" xLabel={xLabel} unit="km · log" log lines={[{ key: "sigR", name: "1σ (filter)", color: COL.a }, { key: "errFused", name: "fused error*", color: COL.d }, { key: "errDR", name: "dead-reckoning error*", color: COL.e, dash: "4 3" }]} />
      <Chart title="Sensor fusion corrections" data={data} xKey="x" xLabel={xLabel} unit="km per update" lines={[{ key: "correction", name: "|Δr|", color: COL.d }]} />
    </div>
  );
}

export function PulsarResidualScatter() {
  const e = useEngine();
  const div = e.mode === "B" ? 3600 : 86400;
  const series = useMemo(() => {
    const ids = Array.from(new Set(e.pulsarLog.map((o) => o.id)));
    return ids.map((id) => ({ id, pts: e.pulsarLog.filter((o) => o.id === id).map((o) => ({ x: o.met / div, y: o.resUs })) }));
  }, [e.pulsarLog.length, e.version]);
  const colors = [COL.a, COL.b, COL.c, COL.d, COL.e, COL.f];
  return (
    <div className="h-[230px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={GRID} strokeDasharray="2 4" />
          <XAxis dataKey="x" type="number" name="time" tick={AX} stroke={AX.stroke} tickFormatter={(v) => Number(v).toFixed(1)} domain={["dataMin", "dataMax"]} label={{ value: e.mode === "B" ? "h" : "d", position: "insideBottomRight", offset: -2, fill: "#5B6F8C", fontSize: 10 }} />
          <YAxis dataKey="y" type="number" name="residual" unit=" µs" tick={AX} stroke={AX.stroke} width={64} tickFormatter={tick} />
          <ZAxis range={[14, 14]} />
          <Tooltip contentStyle={{ background: "#0A1424", border: "1px solid #2A4468", fontSize: 12 }} formatter={(v: number) => tick(v)} />
          <Legend wrapperStyle={{ fontSize: 11 }} iconSize={8} />
          {series.map((s, i) => <Scatter key={s.id} name={s.id} data={s.pts} fill={colors[i % colors.length]} isAnimationActive={false} />)}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
