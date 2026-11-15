import { NavEngine, formatMET, eulerToQuat } from "../sim/engine";
import { PULSARS } from "../sim/pulsars";
import { accelNoisePerShot, gyroNoisePerShot } from "../sim/cai";
import { AU_KM } from "../sim/constants";

export function buildReport(e: NavEngine): string {
  const c = e.config;
  const r = e.posEst, v = e.velEst;
  const q = eulerToQuat(e.attE);
  const b = e.pulsarBatch();
  const hist = e.history;
  const maxErr = hist.reduce((m, s) => Math.max(m, s.errFused), 0);
  const maxSig = hist.reduce((m, s) => Math.max(m, s.sigR), 0);
  const frame = e.mode === "B" ? "Earth-centred ecliptic frame" : "heliocentric ecliptic frame";
  const lines = [
    "# QuantumNav Live — Mission Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "> QuantumNav Live is an exploratory research and simulation platform. It is not an aerospace-certified or space-deployed navigation system. Simulated outputs are not suitable for spacecraft flight operations.",
    "",
    "**All values in this report are simulated** with a seeded random-number generator. No spacecraft telemetry, pulsar observations or external data feeds were used.",
    "",
    "## Scenario",
    `- Mission mode: ${e.mode === "B" ? "B (cislunar simulation)" : "C (deep-space simulation)"}`,
    `- Destination: ${c.destination}`,
    `- Seed: ${c.seed}`,
    `- Mission elapsed time: ${formatMET(e.t)} of ${formatMET(e.tEnd)}`,
    `- Frame: ${frame}; units km, km/s`,
    "",
    "## Final navigation estimate",
    `- Position (km): ${r.map((x) => x.toFixed(1)).join(", ")}  (|r| = ${(Math.hypot(...r) / (e.mode === "C" ? AU_KM : 1)).toFixed(e.mode === "C" ? 4 : 0)} ${e.mode === "C" ? "AU" : "km"})`,
    `- Velocity (km/s): ${v.map((x) => x.toFixed(5)).join(", ")}`,
    `- Attitude quaternion (w, x, y, z): ${q.map((x) => x.toFixed(5)).join(", ")}`,
    `- 1σ position uncertainty: ${e.sigR.toFixed(3)} km; 1σ velocity uncertainty: ${(e.sigV * 1000).toFixed(4)} m/s`,
    `- Filter health: ${e.filterHealth().label}`,
    "",
    "## Evaluation against simulation truth",
    `- Fused position error now: ${e.errFused.toFixed(3)} km (max over history ${maxErr.toFixed(3)} km)`,
    `- Unaided inertial dead-reckoning error now: ${e.errDR.toFixed(1)} km`,
    `- Max 1σ uncertainty over history: ${maxSig.toFixed(3)} km`,
    "",
    "## Sensor contributions",
    `- Inertial propagation steps: ${e.contrib.inertial}`,
    `- Pulsar timing updates: ${e.contrib.pulsar} (total position correction ${e.corrSum.pulsar.toFixed(2)} km)`,
    `- Star tracker updates: ${e.contrib.star}`,
    `- Simulated GNSS updates: ${e.contrib.gnss} (total position correction ${e.corrSum.gnss.toFixed(2)} km)`,
    `- Pulsar set: ${c.pulsar.selected.join(", ") || "none"}; geometric DOP ${b.gdop ? b.gdop.toFixed(2) : "n/a (fewer than 3 pulsars)"}`,
    "",
    "## Sensor model configuration",
    `- Cold-atom interferometer: T = ${c.cai.T} s, N = ${c.cai.atoms.toExponential(1)} atoms, contrast ${c.cai.contrast}, cycle ${c.cai.cycle} s`,
    `- Per-shot acceleration noise: ${accelNoisePerShot(c.cai).toExponential(2)} m/s²; rotation noise ${gyroNoisePerShot(c.cai).toExponential(2)} rad/s`,
    `- Initial bias ${c.cai.biasInit.toExponential(1)} m/s², bias random walk ${c.cai.biasRW.toExponential(1)} m/s²/√s, scale-factor error ${c.cai.scaleFactorPpm} ppm`,
    `- Star tracker: ${c.star.sigmaArcsec} arcsec 1σ per axis${c.star.outage ? " (outage active)" : ""}`,
    `- Pulsar observation time ${c.pulsar.obsTime} s, noise scale ×${c.pulsar.noiseScale}${c.pulsar.outage ? " (outage active)" : ""}`,
    "",
    "## Alerts (demonstration logic, not flight-certified)",
    ...(e.alerts.length ? e.alerts.slice(0, 40).map((a) => `- [${a.severity.toUpperCase()}] ${formatMET(a.met)} — ${a.title}${a.active ? " (active)" : ""}: ${a.explanation}`) : ["- None raised."]),
    "",
    "## Pulsars used",
    ...PULSARS.filter((p) => c.pulsar.selected.includes(p.id)).map((p) => `- ${p.name}: P = ${p.periodMs} ms, RA ${p.raDeg.toFixed(3)}°, Dec ${p.decDeg.toFixed(3)}°`),
    "",
    "## Model assumptions and limitations",
    "- Planets on circular, coplanar orbits; Moon on a circular orbit in the ecliptic plane.",
    "- Mode C uses two-body Sun gravity only: no planetary perturbations, capture or flyby dynamics.",
    "- Mode B uses Earth plus Moon point-mass gravity in an Earth-centred frame.",
    "- Pulsar measurements include only the geometric (Roemer) delay; Shapiro and Einstein delays, clock errors and timing-model errors are not simulated.",
    "- The interferometer model is shot-noise limited; vibration, wavefront and laser-phase errors are omitted.",
    "- The navigation filter is a 9-state linearised Kalman filter (position, velocity, accelerometer bias) with sequential scalar updates.",
    "",
    "## Recent experiment log",
    ...e.log.slice(-30).map((l) => `- ${l.wall} · ${formatMET(l.met)} · ${l.kind}: ${l.text}`),
    "",
  ];
  return lines.join("\n");
}
