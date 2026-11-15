"""
QuantumNav Live backend (FastAPI).

Run:  uvicorn main:app --reload --port 8000
All outputs are simulated; see models.py.
"""
from __future__ import annotations

import asyncio
import os

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from models import PULSARS, DeepSpaceSim, gdop

VERSION = "1.0.0"
ALLOWED = [o.strip() for o in os.getenv("QN_ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:4173").split(",") if o.strip()]
STREAM_INTERVAL = float(os.getenv("QN_STREAM_INTERVAL", "1.0"))
STREAM_SIM_STEP = float(os.getenv("QN_STREAM_SIM_STEP", "21600"))

app = FastAPI(title="QuantumNav Live backend", version=VERSION)
app.add_middleware(CORSMiddleware, allow_origins=ALLOWED, allow_methods=["GET", "POST"], allow_headers=["*"])


class SimRequest(BaseModel):
    target: str = Field("mars", pattern="^(mars|jupiter)$")
    seed: int = 20261114
    days: float = Field(30, gt=0, le=1200)
    sample_every_days: float = Field(1, gt=0)
    pulsars: list[str] = ["B1937+21", "J0437-4715", "B0531+21", "J0030+0451"]
    obs_time_s: float = Field(7200, ge=60)


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "quantumnav-backend", "version": VERSION, "simulated": True}


@app.get("/pulsars")
def pulsars() -> dict:
    return {k: {"ra_deg": v[0], "dec_deg": v[1], "period_ms": v[2], "sigma_1h_us_assumed": v[3]} for k, v in PULSARS.items()}


@app.get("/gdop")
def get_gdop(names: str) -> dict:
    ids = [n for n in names.split(",") if n]
    unknown = [n for n in ids if n not in PULSARS]
    if unknown:
        raise HTTPException(400, f"Unknown pulsars: {', '.join(unknown)}")
    return {"pulsars": ids, "gdop": gdop(ids)}


@app.post("/simulate")
def simulate(req: SimRequest) -> dict:
    unknown = [n for n in req.pulsars if n not in PULSARS]
    if unknown:
        raise HTTPException(400, f"Unknown pulsars: {', '.join(unknown)}")
    sim = DeepSpaceSim(target=req.target, seed=req.seed, pulsars=req.pulsars, obs_time=req.obs_time_s)
    out = [sim.sample()]
    elapsed = 0.0
    while elapsed < req.days and not out[-1]["arrived"]:
        sim.advance(req.sample_every_days * 86400)
        elapsed += req.sample_every_days
        out.append(sim.sample())
    return {"simulated": True, "notice": "Simulation output. Not for flight operations.", "samples": out}


@app.websocket("/ws/telemetry")
async def telemetry(ws: WebSocket) -> None:
    await ws.accept()
    sim = DeepSpaceSim()
    try:
        while True:
            await asyncio.to_thread(sim.advance, STREAM_SIM_STEP)
            await ws.send_json(sim.sample())
            if sim.t >= sim.tof:
                sim = DeepSpaceSim(seed=sim.seed + 1)
            await asyncio.sleep(STREAM_INTERVAL)
    except WebSocketDisconnect:
        return
