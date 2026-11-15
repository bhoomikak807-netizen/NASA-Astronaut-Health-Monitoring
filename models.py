"""
Simulation models for QuantumNav Live (server side).

Everything here is SIMULATION. No spacecraft telemetry, pulsar observations or GNSS signals are received.
Units: km, s, rad unless noted. Mirrors the browser engine in src/sim/engine.ts.
"""
from __future__ import annotations

from dataclasses import dataclass, field

import numpy as np
from scipy.integrate import solve_ivp

C_KMS = 299_792.458
AU_KM = 1.495978707e8
MU_SUN = 1.32712440018e11
K_EFF = 4 * np.pi / 780.241e-9  # rad/m
OBLIQUITY = np.deg2rad(23.4393)
PLANET_A = {"earth": 1.0 * AU_KM, "mars": 1.523679 * AU_KM, "jupiter": 5.2044 * AU_KM}

# name: (RA deg, Dec deg, period ms, timing sigma for 1 h observation in µs — the sigma is a model assumption)
PULSARS = {
    "B1937+21": (294.9107, 21.5831, 1.5578, 8.0),
    "J0437-4715": (69.3163, -47.2525, 5.7575, 15.0),
    "B0531+21": (83.6332, 22.0145, 33.7, 20.0),
    "J0030+0451": (7.6143, 4.8610, 4.8654, 25.0),
    "B1821-24": (276.1333, -24.8697, 3.0543, 12.0),
    "B1855+09": (284.4016, 9.7215, 5.3621, 30.0),
}


def pulsar_dir(name: str) -> np.ndarray:
    ra, dec, _, _ = PULSARS[name]
    a, d = np.deg2rad(ra), np.deg2rad(dec)
    eq = np.array([np.cos(d) * np.cos(a), np.cos(d) * np.sin(a), np.sin(d)])
    ce, se = np.cos(OBLIQUITY), np.sin(OBLIQUITY)
    return np.array([eq[0], eq[1] * ce + eq[2] * se, -eq[1] * se + eq[2] * ce])


def gdop(names: list[str]) -> float | None:
    if len(names) < 3:
        return None
    H = np.array([pulsar_dir(n) for n in names])
    try:
        return float(np.sqrt(np.trace(np.linalg.inv(H.T @ H))))
    except np.linalg.LinAlgError:
        return None


def hohmann(target: str) -> tuple[np.ndarray, float]:
    """Initial heliocentric state and time of flight for an Earth-to-target Hohmann-type transfer."""
    r1, r2 = PLANET_A["earth"], PLANET_A[target]
    a = (r1 + r2) / 2
    tof = np.pi * np.sqrt(a**3 / MU_SUN)
    v = np.sqrt(MU_SUN * (2 / r1 - 1 / a))
    return np.array([r1, 0, 0, 0, v, 0.05]), float(tof)


def two_body(_t: float, y: np.ndarray, f: np.ndarray) -> np.ndarray:
    r = y[:3]
    a = -MU_SUN * r / np.linalg.norm(r) ** 3 + f
    return np.concatenate([y[3:], a])


@dataclass
class CaiConfig:
    T: float = 0.5
    atoms: float = 1e6
    contrast: float = 0.5
    cycle: float = 1.5
    bias_init: float = 5e-9  # m/s²
    bias_rw: float = 2e-12  # m/s²/√s

    @property
    def accel_noise(self) -> float:  # m/s² per shot
        return 1 / (self.contrast * np.sqrt(self.atoms)) / (K_EFF * self.T**2)


@dataclass
class DeepSpaceSim:
    """9-state Kalman filter (r, v, accelerometer bias) over a two-body transfer with pulsar range updates."""

    target: str = "mars"
    seed: int = 20261114
    pulsars: list[str] = field(default_factory=lambda: ["B1937+21", "J0437-4715", "B0531+21", "J0030+0451"])
    obs_time: float = 7200.0
    step: float = 1800.0
    cai: CaiConfig = field(default_factory=CaiConfig)

    def __post_init__(self) -> None:
        self.rng = np.random.default_rng(self.seed)
        self.truth, self.tof = hohmann(self.target)
        self.t = 0.0
        self.bias_true = self.cai.bias_init / 1000 * self.rng.normal(size=3)
        sr0, sv0 = 8.0, 2e-5
        self.x = np.concatenate([self.truth[:3] + sr0 * self.rng.normal(size=3), self.truth[3:] + sv0 * self.rng.normal(size=3), np.zeros(3)])
        self.P = np.diag([sr0**2] * 3 + [sv0**2] * 3 + [(self.cai.bias_init / 1000) ** 2] * 3)
        self.next_obs = self.obs_time
        self.idx = 0
        self.last_residual_us: float | None = None

    def _propagate(self, y: np.ndarray, h: float, f: np.ndarray) -> np.ndarray:
        sol = solve_ivp(two_body, (0, h), y, args=(f,), method="DOP853", rtol=1e-10, atol=1e-6)
        return sol.y[:, -1]

    def step_once(self) -> None:
        h = self.step
        c = self.cai
        self.truth = self._propagate(self.truth, h, np.zeros(3))
        self.bias_true += c.bias_rw / 1000 * np.sqrt(h) * self.rng.normal(size=3)
        shots = max(1.0, h / c.cycle)
        f_meas = self.bias_true + c.accel_noise / 1000 / np.sqrt(shots) * self.rng.normal(size=3)

        self.x[:6] = self._propagate(self.x[:6], h, f_meas - self.x[6:])
        r = self.x[:3]
        d = np.linalg.norm(r)
        G = MU_SUN / d**3 * (3 * np.outer(r, r) / d**2 - np.eye(3))
        Phi = np.eye(9)
        Phi[:3, 3:6] = np.eye(3) * h
        Phi[3:6, :3] = G * h
        Phi[3:6, 6:] = -np.eye(3) * h
        Phi[:3, 6:] = -np.eye(3) * h**2 / 2
        qa = (c.accel_noise / 1000) ** 2 * c.cycle + 1e-26
        Q = np.zeros((9, 9))
        Q[:3, :3] = np.eye(3) * qa * h**3 / 3
        Q[:3, 3:6] = Q[3:6, :3] = np.eye(3) * qa * h**2 / 2
        Q[3:6, 3:6] = np.eye(3) * qa * h
        Q[6:, 6:] = np.eye(3) * (c.bias_rw / 1000) ** 2 * h
        self.P = Phi @ self.P @ Phi.T + Q
        self.t += h

        if self.t >= self.next_obs and self.pulsars:
            name = self.pulsars[self.idx % len(self.pulsars)]
            self.idx += 1
            n = pulsar_dir(name)
            _, _, period_ms, sig_ref = PULSARS[name]
            sig_km = C_KMS * sig_ref * np.sqrt(3600 / self.obs_time) * 1e-6
            z = n @ self.truth[:3] + sig_km * self.rng.normal()
            lam = C_KMS * period_ms * 1e-3
            y = z - n @ self.x[:3]
            y -= lam * np.round(y / lam)  # pulse phase is ambiguous by one period
            Hrow = np.concatenate([n, np.zeros(6)])
            S = Hrow @ self.P @ Hrow + sig_km**2
            K = self.P @ Hrow / S
            self.x += K * y
            self.P -= np.outer(K, Hrow @ self.P)
            self.P = (self.P + self.P.T) / 2
            self.last_residual_us = float(y / C_KMS * 1e6)
            self.next_obs = self.t + self.obs_time

    def advance(self, dt: float) -> None:
        end = min(self.t + dt, self.tof)
        while self.t < end - 1e-6:
            self.step_once()

    def sample(self) -> dict:
        err = float(np.linalg.norm(self.x[:3] - self.truth[:3]))
        return {
            "source": "backend-simulation",
            "simulated": True,
            "met_s": self.t,
            "target": self.target,
            "r_km": self.x[:3].tolist(),
            "v_kms": self.x[3:6].tolist(),
            "sigma_r_km": float(np.sqrt(np.trace(self.P[:3, :3]))),
            "sigma_v_ms": float(np.sqrt(np.trace(self.P[3:6, 3:6])) * 1000),
            "bias_est_ms2": float(np.linalg.norm(self.x[6:]) * 1000),
            "pulsar_residual_us": self.last_residual_us,
            "truth_error_km": err,
            "arrived": self.t >= self.tof - 1e-6,
        }
