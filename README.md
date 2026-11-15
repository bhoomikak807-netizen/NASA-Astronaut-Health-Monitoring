# QuantumNav Live

Autonomous Space Navigation & Tracking System: an interactive research dashboard that shows how a spacecraft could navigate where terrestrial GNSS is unavailable, by fusing a simulated cold-atom inertial sensor, star tracker attitude and pulsar timing in a Kalman filter. An Earth GPS module uses the device's real location where the browser allows it.

> QuantumNav Live is an exploratory research and simulation platform. It is not an aerospace-certified or space-deployed navigation system. Simulated outputs are not suitable for spacecraft flight operations.

## What is real and what is simulated

| Data | Source | Label in UI |
|---|---|---|
| Device latitude, longitude, altitude, accuracy, heading, speed | Browser Geolocation API on this device | REAL |
| Filtered ground speed and course | Kalman filter over real device fixes | DERIVED |
| Spacecraft state, interferometer, star tracker, pulsar residuals, GNSS in Mode B | In-browser seeded simulation | SIMULATED |
| True errors and true sensor bias | Simulation ground truth, for evaluating the filter | SIM TRUTH |
| Backend telemetry stream | Optional FastAPI service (also a simulation) | EXTERNAL |

No spacecraft telemetry, real pulsar observations or external navigation feeds are connected.

## Features

- **Mission Overview**: mode selector (A Earth GPS, B cislunar, C deep space) with data source, assumptions and limitations; status summary.
- **Header status strip**: mission elapsed time, navigation mode, data source state, last telemetry update (UTC), sensor health, REAL/SIMULATED indicator.
- **Live Navigation**: fused position, velocity, attitude quaternion, 1σ uncertainties, residuals, sensor contributions, filter health; eight live charts; pause/resume/reset/step, speed and update-interval controls; clear history; CSV export; Markdown mission report.
- **Earth GPS**: start/stop tracking, permission/denied/unavailable/timeout/unsupported/insecure states, Leaflet map with accuracy circle and trail, history table, constant-velocity Kalman filter for derived speed and course. Heading and speed are shown only when the device reports them.
- **Deep Space**: React Three Fiber scene with Sun, Earth, Moon, Mars and Jupiter, planned/estimated/true paths, destination picker (Moon flyby, Mars, Jupiter), distances and light times, orientation commands.
- **Quantum Sensor**: animated pulse sequence, configurable acceleration/rotation/T/N/contrast/bias/drift/scale factor, phase, noise, dynamic range, fringe plot, seeded Monte Carlo shots, live readings from the navigation simulation.
- **Pulsar Navigation**: six catalogued pulsars, selection, sky map, GDOP, pulse train and folded profile, residual table and scatter, snapshot least-squares position correction, phase-ambiguity detection.
- **Digital Twin**: clickable 3D spacecraft (bus, solar arrays, high- and low-gain antennas, IMU, star trackers, cold-atom sensor, pulsar timing subsystem, engine) with purpose, status and simulated telemetry.
- **Safety monitor** (demonstration logic): position uncertainty, bias growth, unexpected acceleration, missing measurements, conflicting observations, pulse-phase ambiguity, stale external telemetry; configurable thresholds; injection controls to exercise each alert.
- **Research & Logs**: equations, sensor assumptions, live configuration, provenance, limitations, references, experiment log with notes, backend connection panel, and the original QuantumNav Research page preserved in full.

## Stack

React 18 + TypeScript, Vite 5, Tailwind CSS 3, Three.js with React Three Fiber and drei, Recharts, Leaflet with Natural Earth coastlines (world-atlas + topojson-client). Optional backend: Python FastAPI, NumPy, SciPy.

## Run the frontend

Requires Node 18+.

```bash
npm install
npm run dev
```

Open http://localhost:5173. Device GPS needs a secure context; `localhost` counts as secure.

Other scripts:

```bash
npm run build            # type-check and build a single self-contained dist/index.html
npm run preview          # serve the build at http://localhost:4173
npm run build:artifact   # also write dist/artifact.html for publishing as a claude.ai artifact
```

### Environment variables

Copy `.env.example` to `.env.local`. All are optional and none are secrets (anything prefixed `VITE_` is bundled into the browser code, so never put API keys there).

| Variable | Purpose |
|---|---|
| `VITE_BACKEND_URL` | Default backend URL in the Backend connection panel |
| `VITE_TILE_URL` | Raster tile URL template for the Earth GPS map; unset uses the offline coastline basemap |
| `VITE_TILE_ATTRIBUTION` | Attribution text required by your tile provider |

## Run the backend (optional)

Requires Python 3.10+.

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Endpoints:

- `GET /health`
- `GET /pulsars`
- `GET /gdop?names=B1937+21,J0437-4715,B0531+21`
- `POST /simulate` with `{"target": "mars", "days": 30, "sample_every_days": 1}`: batch run using SciPy `solve_ivp` (DOP853)
- `WS /ws/telemetry`: streams one simulated sample per `QN_STREAM_INTERVAL` seconds

Backend settings live in `backend/.env.example` (`QN_ALLOWED_ORIGINS`, `QN_STREAM_INTERVAL`, `QN_STREAM_SIM_STEP`). Then use **Research & Logs → Backend connection → Connect** in the dashboard.

## Running inside a claude.ai artifact

The published artifact is the same build. The artifact sandbox:

- blocks geolocation, so Earth GPS reports the permission error and explains why; run locally for real GPS;
- blocks network connections, so the backend panel reports that it cannot connect;
- routes CSV and report downloads through the viewer's save confirmation.

## Model summary

- Navigation filter: 9-state linearised Kalman filter (position, velocity, accelerometer bias), RK4 propagation with the gravity model and bias-corrected specific force, sequential scalar updates for pulsar ranges and GNSS fixes. A separate per-axis filter estimates attitude and gyro bias from star tracker fixes.
- Unaided dead reckoning runs alongside the filter so the growth of inertial error without external fixes is visible.
- Interferometer: Δφ = k_eff·a·T² + 2·k_eff·Ω·v·T², shot-noise phase noise 1/(C√N), initial bias, bias random walk, scale-factor error.
- Pulsars: real catalog positions and periods, Gaussian timing noise (a model assumption), geometric Roemer delay only, phase wrapping at one pulse period.
- Trajectories: Mode B Earth + Moon point masses with a translunar transfer; Mode C Sun two-body Hohmann-type transfers. Planet orbits circular and coplanar.

See **Research & Logs → Model limitations** in the app for the full list.

## Project layout

```
src/
  sim/          engine.ts (dynamics, filter, alerts), cai.ts, pulsars.ts, constants.ts, rng.ts, vec.ts
  lib/          store.ts (singletons + hooks), gps.ts, backend.ts, download.ts, report.ts, format.ts
  components/   ui.tsx, SimControls, TelemetryCharts, SafetyMonitor, SpacecraftModel, OrientationControls
  tabs/         Overview, LiveNav, EarthGps, DeepSpace, QuantumSensor, PulsarNav, DigitalTwin, Research
  legacy/       dossier.html (original QuantumNav Research page) and its shadow-DOM wrapper
backend/        main.py (FastAPI), models.py (NumPy/SciPy), requirements.txt
```
