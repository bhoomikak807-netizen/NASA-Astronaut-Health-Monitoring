export const fx = (v: number | null | undefined, d = 2) => (v === null || v === undefined || !isFinite(v) ? "—" : v.toFixed(d));
export const fe = (v: number | null | undefined, d = 2) => (v === null || v === undefined || !isFinite(v) ? "—" : v.toExponential(d));
export const fk = (v: number) => Math.round(v).toLocaleString("en-US");
/** Smart number: fixed for mid-range, exponential for very small or large magnitudes. */
export const fs = (v: number | null | undefined, d = 3) => {
  if (v === null || v === undefined || !isFinite(v)) return "—";
  const a = Math.abs(v);
  if (a !== 0 && (a < 1e-3 || a >= 1e13)) return v.toExponential(d - 1);
  return v.toLocaleString("en-US", { maximumFractionDigits: d });
};
export const utc = (iso: string | number) => new Date(iso).toISOString().replace("T", " ").slice(0, 19) + "Z";
