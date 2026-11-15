import { useSyncExternalStore } from "react";
import { engine } from "./store";

/**
 * Optional connection to the FastAPI backend in /backend. The backend also runs a simulation:
 * its values are labelled EXTERNAL because they arrive over the network, not because they are real spacecraft data.
 */
export type BackendStatus = "disconnected" | "connecting" | "connected" | "error";

class BackendClient {
  url: string = (import.meta.env.VITE_BACKEND_URL as string | undefined) ?? "http://localhost:8000";
  status: BackendStatus = "disconnected";
  message = "Not connected.";
  count = 0;
  lastWall: number | null = null;
  last: Record<string, unknown> | null = null;
  private ws: WebSocket | null = null;
  private v = 0;
  private ls = new Set<() => void>();
  subscribe = (f: () => void) => { this.ls.add(f); return () => { this.ls.delete(f); }; };
  getVersion = () => this.v;
  private emit() { this.v++; this.ls.forEach((f) => f()); }

  async connect(url: string) {
    this.disconnect(false);
    this.url = url.replace(/\/$/, "");
    this.status = "connecting"; this.message = `Checking ${this.url}/health …`; this.emit();
    try {
      const ctl = new AbortController();
      const timer = setTimeout(() => ctl.abort(), 4000);
      const res = await fetch(`${this.url}/health`, { signal: ctl.signal });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const h = await res.json();
      this.message = `Backend ${h.service ?? ""} ${h.version ?? ""} reachable. Opening telemetry stream…`;
      this.emit();
    } catch (err) {
      this.status = "error";
      this.message = `Could not reach ${this.url}. Network is blocked inside the artifact; run locally.`;
      this.emit();
      return;
    }
    try {
      const wsUrl = this.url.replace(/^http/, "ws") + "/ws/telemetry";
      const ws = new WebSocket(wsUrl);
      this.ws = ws;
      engine.reportExternal("backend feed", true, null);
      ws.onopen = () => { this.status = "connected"; this.message = `Streaming from ${wsUrl}`; this.emit(); };
      ws.onmessage = (m) => {
        try { this.last = JSON.parse(m.data); } catch { this.last = { raw: String(m.data).slice(0, 200) }; }
        this.count++; this.lastWall = Date.now();
        engine.reportExternal("backend feed", true, this.lastWall);
        this.emit();
      };
      ws.onerror = () => { this.status = "error"; this.message = "Telemetry stream error."; this.emit(); };
      ws.onclose = () => { if (this.status !== "error") { this.status = "disconnected"; this.message = "Stream closed."; } engine.reportExternal("backend feed", false, this.lastWall); this.ws = null; this.emit(); };
    } catch (err) {
      this.status = "error"; this.message = `WebSocket failed: ${(err as Error).message}`; this.emit();
    }
  }

  disconnect(emit = true) {
    if (this.ws) { this.ws.onclose = null; this.ws.close(); this.ws = null; }
    engine.reportExternal("backend feed", false, this.lastWall);
    this.status = "disconnected"; this.message = "Disconnected.";
    if (emit) this.emit();
  }
}

export const backend = new BackendClient();
export function useBackend() {
  useSyncExternalStore(backend.subscribe, backend.getVersion);
  return backend;
}
