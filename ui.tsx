import { ReactNode, useState } from "react";

export type SourceKind = "real" | "external" | "sim" | "derived" | "truth";

const SRC: Record<SourceKind, { label: string; cls: string; title: string }> = {
  real: { label: "REAL", cls: "border-ok/60 text-ok", title: "Measured by this device" },
  external: { label: "EXTERNAL", cls: "border-warn/60 text-warn", title: "Received from an external feed" },
  sim: { label: "SIMULATED", cls: "border-sim/60 text-sim", title: "Synthetic, seeded simulation output" },
  derived: { label: "DERIVED", cls: "border-cyan-400/60 text-cyan-300", title: "Computed from the values shown" },
  truth: { label: "SIM TRUTH", cls: "border-slate-500 text-slate-400", title: "Simulation ground truth. Unavailable on a real spacecraft; shown only to evaluate the filter." },
};

export function Src({ kind }: { kind: SourceKind }) {
  const s = SRC[kind];
  return (
    <span title={s.title} className={`inline-flex items-center rounded border px-1.5 py-px font-mono text-[10px] tracking-wider ${s.cls}`}>
      {s.label}
    </span>
  );
}

export function Panel({ title, src, right, children, className = "" }: { title?: ReactNode; src?: SourceKind; right?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`min-w-0 rounded-md border border-navy-700 bg-navy-900/80 ${className}`}>
      {(title || right) && (
        <header className="flex flex-wrap items-center gap-2 border-b border-navy-700 px-4 py-2.5">
          {title && <h3 className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-slate-300">{title}</h3>}
          {src && <Src kind={src} />}
          <div className="ml-auto flex flex-wrap items-center gap-2">{right}</div>
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}

export function KV({ k, v, unit, src, hint }: { k: ReactNode; v: ReactNode; unit?: string; src?: SourceKind; hint?: string }) {
  return (
    <div className="flex min-w-0 items-baseline justify-between gap-3 border-b border-navy-800 py-1.5 last:border-b-0" title={hint}>
      <span className="flex items-center gap-1.5 text-[13px] text-slate-400">{k}{src && <Src kind={src} />}</span>
      <span className="tnum truncate text-right font-mono text-[13px] text-slate-100">
        {v}{unit && <span className="ml-1 text-slate-500">{unit}</span>}
      </span>
    </div>
  );
}

export function Stat({ label, value, unit, src, tone = "default" }: { label: string; value: ReactNode; unit?: string; src?: SourceKind; tone?: "default" | "ok" | "warn" | "crit" }) {
  const toneCls = { default: "text-slate-50", ok: "text-ok", warn: "text-warn", crit: "text-crit" }[tone];
  return (
    <div className="min-w-0 rounded-md border border-navy-700 bg-navy-900/80 px-4 py-3">
      <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-slate-400">{label}{src && <Src kind={src} />}</div>
      <div className={`tnum mt-1 truncate font-display text-[22px] font-semibold [font-stretch:110%] ${toneCls}`}>
        {value}{unit && <span className="ml-1 font-sans text-[13px] font-normal text-slate-400">{unit}</span>}
      </div>
    </div>
  );
}

type BtnVariant = "primary" | "default" | "danger" | "ghost";
export function Button({ children, onClick, variant = "default", disabled, title, pressed }: { children: ReactNode; onClick?: () => void; variant?: BtnVariant; disabled?: boolean; title?: string; pressed?: boolean }) {
  const cls = {
    primary: "bg-cyan-500 text-navy-950 hover:bg-cyan-400 border-cyan-400",
    default: "bg-navy-800 text-slate-100 hover:bg-navy-700 border-navy-600",
    danger: "bg-crit/10 text-crit hover:bg-crit/20 border-crit/50",
    ghost: "bg-transparent text-slate-300 hover:bg-navy-800 border-transparent",
  }[variant];
  return (
    <button type="button" title={title} aria-pressed={pressed} disabled={disabled} onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded border px-3 py-1.5 text-[13px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${cls}`}>
      {children}
    </button>
  );
}

export function Toggle({ id, checked, onChange, label }: { id: string; checked: boolean; onChange: (v: boolean) => void; label: ReactNode }) {
  return (
    <label htmlFor={id} className="inline-flex cursor-pointer items-center gap-2 text-[13px] text-slate-300">
      <input id={id} type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="relative h-4 w-7 rounded-full bg-navy-600 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-3 after:w-3 after:rounded-full after:bg-slate-300 after:transition-transform peer-checked:bg-cyan-500 peer-checked:after:translate-x-3 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-cyan-400" />
      {label}
    </label>
  );
}

export function Select<T extends string | number>({ id, value, options, onChange, label }: { id: string; value: T; options: { v: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <label htmlFor={id} className="inline-flex items-center gap-2 text-[13px] text-slate-400">
      {label}
      <select id={id} value={String(value)} onChange={(e) => { const o = options.find((x) => String(x.v) === e.target.value); if (o) onChange(o.v); }}
        className="rounded border border-navy-600 bg-navy-800 px-2 py-1 text-[13px] text-slate-100">
        {options.map((o) => <option key={String(o.v)} value={String(o.v)}>{o.label}</option>)}
      </select>
    </label>
  );
}

export function NumField({ id, label, value, onChange, step, min, max, unit, hint }: { id: string; label: string; value: number; onChange: (v: number) => void; step?: number | "any"; min?: number; max?: number; unit?: string; hint?: string }) {
  const [text, setText] = useState(String(value));
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) { setLastValue(value); setText(String(value)); }
  const invalid = text.trim() === "" || !isFinite(Number(text)) || (min !== undefined && Number(text) < min) || (max !== undefined && Number(text) > max);
  return (
    <label htmlFor={id} className="grid gap-1 text-[12.5px] text-slate-400" title={hint}>
      <span>{label}{unit && <span className="text-slate-500"> ({unit})</span>}</span>
      <input id={id} inputMode="decimal" value={text} step={step}
        onChange={(e) => { setText(e.target.value); const n = Number(e.target.value); if (e.target.value.trim() !== "" && isFinite(n) && (min === undefined || n >= min) && (max === undefined || n <= max)) onChange(n); }}
        aria-invalid={invalid}
        className={`tnum w-full rounded border bg-navy-800 px-2 py-1 font-mono text-[13px] text-slate-100 ${invalid ? "border-crit" : "border-navy-600"}`} />
      {invalid && <span className="text-[11.5px] text-crit">Enter a number{min !== undefined ? ` ≥ ${min}` : ""}{max !== undefined ? ` and ≤ ${max}` : ""}.</span>}
    </label>
  );
}

export function Dot({ level }: { level: "ok" | "warning" | "critical" | "off" }) {
  const c = { ok: "bg-ok", warning: "bg-warn", critical: "bg-crit", off: "bg-slate-600" }[level];
  return <span aria-hidden className={`inline-block h-2 w-2 flex-none rounded-full ${c}`} />;
}

export function Note({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "warn" }) {
  const cls = tone === "warn" ? "border-warn/40 bg-warn/10 text-amber-100" : "border-cyan-500/30 bg-cyan-500/5 text-slate-300";
  return <div className={`rounded border px-3 py-2 text-[13px] leading-relaxed ${cls}`}>{children}</div>;
}

export function Toast({ msg }: { msg: string | null }) {
  if (!msg) return null;
  return <div role="status" className="rounded border border-navy-600 bg-navy-800 px-3 py-1.5 text-[12.5px] text-slate-200">{msg}</div>;
}
