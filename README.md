> **Quick start (VS Code):** open this folder, then run `npm install` and `npm run dev` in the terminal. Full steps: [HOW-TO-RUN.md](HOW-TO-RUN.md).

# ASTRA-SENTINEL AI — SpaceTech Mission Intelligence & Astronaut Safety Platform

> **"Intelligence Beyond Earth. Safety Without Limits."**  
> *Protecting Human Life Beyond Earth Through Intelligent Space Systems.*

---

## 1. Executive Overview & Brand Identity

**ASTRA-SENTINEL AI** is an AI-powered SpaceTech startup concept and prototype platform focused on astronaut safety, spacecraft environmental monitoring, and predictive mission intelligence. 

In long-duration spaceflight—whether aboard commercial low Earth orbit stations, the Lunar Gateway, or future Mars transit vehicles—subtle biological degradation and environmental failures develop quietly. ASTRA-SENTINEL AI unifies astronaut physiological telemetry, cabin environmental sensors, and open space science research into an explainable, real-time safety layer for mission controllers and flight crews.

### Mandatory Prototype Disclosure
> **Note on Organization & Certification Status:**  
> ASTRA-SENTINEL AI is an independent SpaceTech research and prototype initiative. It is not an established NASA contractor, certified aerospace manufacturer, or operational flight-qualified system. Public NASA datasets (OSDR, DONKI, FIRMS) and open space science repositories are integrated strictly for scientific calibration, baseline validation, and prototype demonstration.

---

## 2. Key Capabilities & Innovations

1. **AstroHealth AI**: Continuous biological telemetry tracking (ECG heart rate, arterial SpO2 pulse oximetry, core body temperature, and cognitive fatigue indices) with personal baseline drift modeling.
2. **FireHealth AI**: A simulation-only environmental signal review assistant for smoke, cabin temperature, pressure, and air-quality values. It does not confirm an onboard fire or issue commands.
3. **Multi-Sensor Cross-Correlation Fusion**: Solves the isolation problem between biomedical flight surgeons and spacecraft ECLSS life-support consoles by detecting coincident multi-subsystem excursions (e.g. rising astronaut heart rate occurring simultaneously with cabin thermal elevation and smoke aerosol accumulation).
4. **Mission Control Dashboard (`/mission-control`)**: High-density, dark-navy aerospace monitoring console displaying real-time rolling telemetry charts, spacecraft module schematics, an explainable alert timeline, and deterministic simulation controls.
5. **Open Space Science Provenance**: Direct integration with NASA Open Science Data Repository (OSDR), NASA DONKI heliospheric alerts, NASA FIRMS active fire radiometry, and live queries against the official public NASA Image & Video Library.

---

## 3. Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Bundler & Tooling**: Vite 5
- **Styling & UI**: Tailwind CSS (Space Grotesk, Inter, JetBrains Mono)
- **Icons**: Lucide React
- **Motion**: Framer Motion
- **Visuals & Charts**: Custom Aerospace SVG Telemetry Charts (scanlines, threshold highlights, real-time pulse dots)
- **Routing**: Client-side SPA routing (`/`, `/about`, `/technology`, `/platform`, `/mission-control`, `/research`, `/contact`)

### Backend
- **Core Server**: Python 3 standard library HTTP REST server (`backend/app/server.py`) with zero external pip dependencies for 100% out-of-the-box instant execution.
- **FastAPI / Uvicorn Service**: (`backend/app/main.py`) with Pydantic validation, CORS middleware, and HTTPX async client.
- **Data Integrations**: NASA DONKI, NASA OSDR, NASA FIRMS, NASA Image & Video Library.

---

## 4. Project Structure

```
astra-sentinel-ai/
├── frontend/
│   ├── public/
│   │   └── astra-logo.svg              # Custom orbital shield & star vector logo
│   ├── src/
│   │   ├── components/
│   │   │   ├── charts/
│   │   │   │   └── TelemetryChart.tsx  # Aerospace SVG real-time telemetry graphs
│   │   │   ├── common/
│   │   │   │   ├── Footer.tsx          # Consistent footer with disclaimers
│   │   │   │   ├── Logo.tsx            # Custom vector brand logo
│   │   │   │   ├── Navbar.tsx          # Responsive navigation & status pill
│   │   │   │   └── Starfield.tsx       # Parallax deep space canvas starfield
│   │   │   └── spacecraft/
│   │   │       └── SpacecraftModuleViewer.tsx # Interactive 5-module schematic
│   │   ├── pages/
│   │   │   ├── Home.tsx                # 11 complete sections & live demo
│   │   │   ├── About.tsx               # Mission, vision, core focus & placeholders
│   │   │   ├── Technology.tsx          # In-depth 8-system breakdown & diagrams
│   │   │   ├── Platform.tsx            # 6 pillars, architecture model & use cases
│   │   │   ├── MissionControl.tsx      # Aerospace mission control dashboard
│   │   │   ├── Research.tsx            # NASA OSDR, DONKI, FIRMS & live search
│   │   │   └── Contact.tsx             # Validated transmission form
│   │   ├── services/
│   │   │   ├── aiRiskEngine.ts         # Multi-sensor fusion & explainable reasoning
│   │   │   ├── nasaService.ts          # NASA open science & image queries
│   │   │   └── simulationEngine.ts     # Deterministic simulation & scenario states
│   │   ├── types/
│   │   │   └── index.ts                # TypeScript domain models
│   │   ├── App.tsx                     # Router & layout composition
│   │   ├── index.css                   # Tailwind layers, glassmorphism & scanlines
│   │   └── main.tsx                    # React DOM root entry
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI application
│   │   └── server.py                   # Standard library REST API server
│   └── requirements.txt                # Optional pip dependencies for FastAPI
├── .env.example                        # Environment variables template
└── README.md                           # Documentation & operational guide
```

---

## 5. Quick Start & Execution

### Running the Frontend

Install the frontend dependencies, then start the development server:

```powershell
cd astra-sentinel-ai/frontend
npm install
npm run dev
```

Or to serve the production build:

```powershell
cd astra-sentinel-ai/frontend
node ./node_modules/vite/bin/vite.js preview --port 3000
```

Open your browser to: **`http://localhost:3000`**. The animated standalone HUD reference is available at **`http://localhost:3000/mission-hud-preview.html`**. The Mission Control **Environmental Safety** tab opens that same controls console inside the dashboard; the standalone preview links back to the AstroHealth and FireHealth dashboard.

### Running the Backend

The primary backend uses only Python's standard library. From the extracted project folder:

```powershell
cd astra-sentinel-ai/backend
python app\server.py
```

The API server will listen on: **`http://127.0.0.1:8000`**

### Optional: Running with FastAPI & Uvicorn

If you prefer the optional FastAPI server, install its dependencies in a virtual environment:

```powershell
cd astra-sentinel-ai/backend
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt
.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```

---

## 6. Environment Variables Setup

Copy `.env.example` to `.env`:

```env
PORT=8000
HOST=127.0.0.1
NASA_API_KEY=DEMO_KEY
NASA_FIRMS_MAP_KEY=your_firms_map_key_here
OPENAI_API_KEY=
OPENAI_MODEL=gpt-6-luna
```

### Free NASA API Keys
1. **NASA Open APIs**: Sign up for a free official key at [https://api.nasa.gov/](https://api.nasa.gov/).
2. **NASA FIRMS**: Obtain a free active-fire MAP_KEY at [https://firms.modaps.eosdis.nasa.gov/api/map_key/](https://firms.modaps.eosdis.nasa.gov/api/map_key/).
3. **NASA Image & Video Library**: Requires **no API key** (`https://images-api.nasa.gov/`).

---

## 7. Interactive Simulation & Scenarios

The Mission Control Dashboard (`/mission-control`) includes a working real-time simulation engine:

| Scenario | Severity | Trigger Description |
|---|---|---|
| **Nominal Orbital Flight** | `NORMAL` | Baseline LEO flight. HR ~72 BPM, SpO2 ~98.6%, Cabin Temp ~22.4°C, Smoke 0.02 ppm. |
| **Thermal Control Variance** | `WARNING` | Coolant loop delay. Cabin Temp rises to 28.6°C, causing mild compensatory tachycardia. |
| **Trigger Demo Emergency (Environmental Signals)** | `CRITICAL` | Synthetic smoke and cabin temperature readings increase alongside simulated health signals. Creates a review alert only; it does not execute or prescribe emergency actions. |
| **Micro-Meteoroid Depressurization** | `CRITICAL` | Seal leakage drops barometric pressure to 88.5 kPa, inducing early acute hypoxia. |
| **EVA High Workload** | `WARNING` | Spacewalk assembly. Sustained HR > 115 BPM and elevated metabolic exhaustion. |

Simulation controls include:
- **Pause Stream** / **Resume Stream**
- **Reset Baseline**
- **Trigger Demo Emergency** button (present on Hero and Mission Control)
- **Alert Acknowledgment**: Click any active alert to acknowledge it in the mission log.

---

## 8. Current Prototype Limitations

1. **Simulated Telemetry**: All real-time telemetry streaming in the dashboard is generated by the synthetic simulation engine and is clearly tagged `SIMULATED TELEMETRY`.
2. **Research Concepts**: SolarShield and QuantumNav are exploratory research concepts and are not space-certified flight hardware.
3. **Non-Medical / Non-Autonomous Control**: The prototype system does not provide clinical medical diagnoses and never issues direct physical thruster or valve control commands to real spacecraft.
4. **Contact Transmission**: The contact form features full client-side validation and simulated dispatch. Production email webhooks (SendGrid/Resend) can be configured via environment variables.

---

## 9. License & Attribution

Copyright © 2026 ASTRA-SENTINEL AI Inc. All rights reserved.  
NASA open science datasets (OSDR, DONKI, FIRMS, Image Library) are governed by NASA Open Data policies. ASTRA-SENTINEL AI is an independent prototype and is not affiliated with or endorsed by NASA.

---

## Mission Control HUD (Hermes-style live console) — NEW

Open `frontend/dist/mission-hud/index.html` (or `/mission-hud/index.html` when served; source in `frontend/public/mission-hud/`). No install or build needed. After `npm run build`, `/mission-control` renders this HUD in a full-screen frame (`MissionControl.tsx`; the old dashboard is kept as `MissionControlLegacy.tsx`).

Panels (modelled on the reference console): Schematic View with live spacecraft, WARNING banner, BREACH/ANOMALY box and ANALYSIS readout · Orbit Plan (ascent, burn, propellant, ΔV) · Schedule (moving timeline, sensors, log/alerts/comms tabs) · ASTRA Telemetry (per-astronaut vs personal baseline + environment risk) · Crew/System roster.
Live parts: rotating gravity wheel, sun-tracking arrays, coolant flow, engine flames during burns, crew markers, smoke/heat/vent particles, comms packets (red = EMERGENCY).
Controls: Start/Pause/Resume (Space), Reset, scenarios A–E, Demo Emergency, Link connect/disconnect, speed ×1/×2/×4, What-If simulator, alert ACK.

### Part 4 intelligence layer (`frontend/public/mission-hud/engine.js`, tests in `part4-engine/`)
Interpretable risk engine (thresholds + personal baselines), multi-sensor fusion (simultaneous anomalies, no causal claims), trend radar, crew-level pattern flag, explainable alerts with ack, deterministic seeded simulator, priority comms queue (EMERGENCY > HIGH > NORMAL > LOW; offline queue, retry on reconnect, delivery + acknowledgment) and What-If simulator.
Run tests: `cd part4-engine && node --test engine.test.js` (22 tests).

**Limitations:** all thresholds are configurable DEMO values, not medically validated; all data is SIMULATED TELEMETRY; the comms queue is a simulated delay-tolerant prototype, not NASA DTN; the engine is JavaScript — the Python/FastAPI/Pydantic port of Part 4 is not included yet; no spacecraft commands are ever issued.


---

## 12. Visual refresh: looping HUD hero (this revision)

- `frontend/src/components/common/HudHero.tsx` + the `HUD HERO` block in `index.css` recreate the looping HUD
  reference (teal gradient, glowing planet, orbit rings, hexagons, code panel, histogram, amber WARNING blink,
  14.5 s loop). It is a **vector recreation drawn from a screen recording of the reference**, not a copy of the
  original video asset, and it is **decorative / simulated** - it displays no data.
- `prefers-reduced-motion` shows the settled composition with no movement.
- **Mission Control fix:** `/mission-control` previously embedded `/mission-hud/index.html`, an empty folder in the
  delivered ZIP. The route now renders the React dashboard (`MissionControlLegacy.tsx`) with HUD-style panels.
- `.hud-panel[data-label]` in `index.css` provides the corner-label panel chrome seen in the Hermes screenshot reference.

### Run / test / build
```
cd frontend && npm install && npm run dev      # http://localhost:5173
cd frontend && npm run build
node part4-engine/engine.test.js                # 22 tests
cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload
```
Copy `.env.example` to `.env` and add your own NASA key; keys stay on the backend.

**Hero video:** `frontend/public/media/hud-loop.mp4` (+ `hud-poster.jpg`) is the user-supplied HUD recording, used muted/looped as the Home hero background. It shows poster only under `prefers-reduced-motion`, and falls back to the vector HUD if the file fails to load. Replace the file to change the visual.

## AstroHealth AI and FireHealth AI

Mission Control contains two separate assistants. They review only the synthetic telemetry snapshot shown in the dashboard and provide signal summaries and cautious review suggestions. The deterministic rule engine remains the source of risk level and score; a language model cannot change those values or issue commands.

To enable model-generated responses, set `OPENAI_API_KEY` and optionally `OPENAI_MODEL` in the backend environment before starting `backend/app/server.py` or the optional FastAPI app. The backend calls the OpenAI Responses API; the key never enters browser code. Without a key, each assistant returns clearly labeled local rule-based demo guidance. If the provider is unavailable, the backend falls back to that local response.

The assistant request includes only the displayed synthetic numeric readings, the rule-engine level/score/explanation, and a question the user submits. Spoken questions use browser speech recognition when available and are sent only after the user starts the microphone. The browser's speech synthesis reads responses aloud. Neither assistant diagnoses a person, confirms a real onboard fire, prescribes treatment, gives invented emergency procedures, or controls spacecraft. Do not use this prototype or its generated suggestions in real operations.

The AI endpoints are `POST /api/ai/astrohealth` and `POST /api/ai/firehealth`. Requests accept a `snapshot` object, optional `question` up to 500 characters, and `risk` context. Responses report `mode` as `OPENAI_RESPONSES` or `LOCAL_FALLBACK` so the UI can accurately label their provenance.



## Integrated modules & orbital theme (Nov 2026)

| Where | What |
| --- | --- |
| `Technology ▾ → QuantumNav Research` (`/technology/quantumnav`) | QuantumNav Live, bundled from `modules/quantumnav` into `frontend/public/quantumnav/index.html`. Deep links: `/technology/quantumnav#gps`, `#twin`, … |
| `Technology ▾ → Astronaut Health Monitor` (`/health-monitor`) | Health Monitor from `modules/health-monitor`, served at `frontend/public/health-monitor/index.html`. Also embedded in Home (AstroHealth section), Technology → AstroHealth AI, and Mission Control → Astronaut Health. |
| Mission Control sidebar | Every view now shows its own panels and is linkable: `?tab=vitals | env | ai | modules | weather | events`. Event Chronology exports CSV. |
| Home | Interactive 5-stage pipeline inspector, clickable Future Vision cards, live console section. |
| Footer | Core Systems links select the subsystem; Privacy/Terms go to `/legal`. |
| Theme | `components/common/SpaceBackdrop.tsx` + "ORBITAL THEME" block in `src/index.css`: Earth limb, drifting station, stars, navy glass panels. |

To update QuantumNav: `cd modules/quantumnav && npm i && npm run build`, then copy `dist/index.html` to `frontend/public/quantumnav/index.html` and re-add the `astra-embed` `<style>`/`<script>` block after `<title>`.

## AstroHealth AI, FireHealth AI (Aegis FDS) and Radiation Monitor (Nov 2026)

| Route | Module source | Also shown in |
| --- | --- | --- |
| `/technology/astrohealth` | `modules/astrohealth-ai` | Home health section, `/health-monitor`, Mission Control → Astronaut Health and AI Risk Engine, Technology → AstroHealth AI |
| `/technology/firehealth` | `modules/aegis-fds` | Mission Control → Environmental Safety, Technology → FireHealth AI, Home and Platform cards |
| `/technology/radiation` | `modules/radiation-monitor` | Technology → SolarShield Research, Home → Space-Weather Intelligence |

Each module keeps its original file in `modules/`; the themed copy in `frontend/public/` is produced by
`python3 modules/apply_theme.py <source.html> modules/astra-theme-common.html modules/<name>/astra-theme.css frontend/public/<name>/index.html`.

**Performance:** pages are code-split and prefetched on hover/idle, embedded apps load only when scrolled near, fonts load without blocking, heavy background textures are painted after first render, and React/icons ship as separately cached vendor chunks.
