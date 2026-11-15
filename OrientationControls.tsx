import { useEngine } from "../lib/store";
import { Button } from "./ui";
import type { V3 } from "../sim/vec";

const DEG = Math.PI / 180;
const AXES = ["Roll", "Pitch", "Yaw"] as const;

/** Commanded attitude. The simulated spacecraft slews toward it at up to 0.5°/s. */
export default function OrientationControls({ idPrefix }: { idPrefix: string }) {
  const e = useEngine();
  const set = (i: number, deg: number) => {
    const c = [...e.attCmd] as V3;
    c[i] = deg * DEG;
    e.setAttitudeCmd(c);
  };
  return (
    <div className="grid gap-2">
      {AXES.map((a, i) => (
        <label key={a} htmlFor={`${idPrefix}-${a}`} className="grid grid-cols-[52px_minmax(0,1fr)_96px] items-center gap-2 text-[12.5px] text-slate-400">
          {a}
          <input id={`${idPrefix}-${a}`} type="range" min={-180} max={180} step={1} value={Math.round(e.attCmd[i] / DEG)} onChange={(ev) => set(i, Number(ev.target.value))} />
          <span className="tnum text-right font-mono text-[12px] text-slate-200">
            {(e.attT[i] / DEG).toFixed(1)}° <span className="text-slate-500">→ {(e.attCmd[i] / DEG).toFixed(0)}°</span>
          </span>
        </label>
      ))}
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={() => e.setAttitudeCmd([0, 0, 0])}>Zero attitude</Button>
      </div>
    </div>
  );
}
