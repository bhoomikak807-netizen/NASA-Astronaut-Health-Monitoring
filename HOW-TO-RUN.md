# Run ASTRA-SENTINEL AI in VS Code

## What you need (once)
- **Node.js 18 or newer** (LTS recommended): https://nodejs.org. Check it with `node -v`.
- **VS Code**: https://code.visualstudio.com
- *(Optional)* Python 3, only for the AI-assistant backend. The website works without it.

## Start the website
1. Unzip `ASTRA-SENTINEL-integrated.zip`.
2. In VS Code choose **File → Open Folder…** and open the `astra-sentinel-ai` folder (the one that contains this file).
3. Open the terminal: **Terminal → New Terminal**.
4. Install everything (first time only, about a minute):
   ```
   npm install
   ```
5. Start the site:
   ```
   npm run dev
   ```
   Your browser opens **http://localhost:3000** automatically. Leave the terminal running while you use the site.
   Stop it with **Ctrl + C**.

### One-click alternatives
- **Terminal → Run Task… → "ASTRA: Install dependencies"**, then **Terminal → Run Build Task** (Ctrl/Cmd + Shift + B) to start the site.
- **Run and Debug** panel (Ctrl/Cmd + Shift + D) → **"ASTRA: Open website in Chrome"** (or Edge) starts the site and opens a debuggable browser.

## Pages to try
| Page | Address |
| --- | --- |
| Home (animated orbital hero) | http://localhost:3000/ |
| QuantumNav Research | http://localhost:3000/technology/quantumnav |
| Astronaut Health Monitor | http://localhost:3000/health-monitor |
| Mission Control | http://localhost:3000/mission-control |
| AstroHealth AI (crew-health agent) | http://localhost:3000/technology/astrohealth |
| FireHealth AI · Aegis FDS (fire alarm) | http://localhost:3000/technology/firehealth |
| Spacecraft Radiation Monitor | http://localhost:3000/technology/radiation |

## Emergency alarm sounds
Press **Trigger Demo Emergency** (Home, Mission Control or Health Monitor) with your speakers on. A loud two-tone siren sounds for CRITICAL and high beeps for WARNING, with a flashing banner and **Silence alarm** button.
The speaker button in the bottom-right corner mutes, sets the volume and plays a test alarm. Browsers only allow sound after you click somewhere on the page.

## Optional: AI assistant backend
Run the task **"ASTRA: Start optional AI backend (Python)"** (or `cd backend` then `python3 app/server.py`, on Windows `python app\server.py`).
It listens on port 8000; the website forwards `/api` calls to it automatically. Copy `.env.example` to `.env` to add your own API keys.

## Fastest version
`npm run dev` is for editing (it compiles pages on demand). For the fastest loading, build once and serve the optimized site:
```
npm run build
npm run preview
```
That opens http://localhost:4173.

## Optional: AstroHealth AI with Claude
AstroHealth AI's built-in AstroAgent works with no setup. For free-form answers from Claude, copy `modules/astrohealth-ai/.env.example` to `modules/astrohealth-ai/.env`, add your Anthropic API key, then run the task **"ASTRA: Start AstroHealth AI backend (Claude)"** (or `npm start` inside `modules/astrohealth-ai`). The website picks it up automatically.

## Other commands
| Command | What it does |
| --- | --- |
| `npm run build` | Production build into `frontend/dist` |
| `npm run preview` | Serve that production build at http://localhost:4173 |
| `npm test` | Run the risk-engine unit tests |

## Troubleshooting
- **`npm` is not recognized** → install Node.js, then close and reopen VS Code.
- **Port 3000 already in use** → Vite picks the next free port; use the address printed in the terminal.
- **Blank page after unzip** → make sure you opened the `astra-sentinel-ai` folder itself, not its parent, and ran `npm install` first.
- **PowerShell says scripts are disabled** (Windows) → in the VS Code terminal choose **Command Prompt** from the `+ ▾` menu, or run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.
