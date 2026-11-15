"""Two scoped AI assistants for synthetic ASTRA-SENTINEL demo telemetry."""
from __future__ import annotations

import json
import os
import threading
import time
import urllib.error
import urllib.request
from typing import Any

def _load_project_env() -> None:
    env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
    try:
        with open(env_path, "r", encoding="utf-8") as env_file:
            for line in env_file:
                stripped = line.strip()
                if not stripped or stripped.startswith("#") or "=" not in stripped:
                    continue
                key, value = stripped.split("=", 1)
                value = value.strip().strip('"').strip("'")
                if key.strip():
                    os.environ.setdefault(key.strip(), value)
    except OSError:
        pass


_load_project_env()

MODEL_URL = "https://api.openai.com/v1/responses"
MODEL_NAME = os.getenv("OPENAI_MODEL", "gpt-6-luna")
_rate_buckets: dict[str, list[float]] = {}
_rate_lock = threading.Lock()


def allow_request(client_key: str, limit: int = 12, window_seconds: int = 60) -> bool:
    """Small per-process guard against accidental model-cost spikes."""
    now = time.monotonic()
    with _rate_lock:
        recent = [stamp for stamp in _rate_buckets.get(client_key, []) if now - stamp < window_seconds]
        if len(recent) >= limit:
            _rate_buckets[client_key] = recent
            return False
        recent.append(now)
        _rate_buckets[client_key] = recent
        return True

ASSISTANTS = {
    "astrohealth": {
        "name": "AstroHealth AI",
        "focus": "simulated physiological readings: heart rate, SpO2, body temperature, fatigue, blood pressure, and respiration rate",
        "system": (
            "You are AstroHealth AI, a cautious research-demo assistant. You receive synthetic telemetry only. "
            "Explain the supplied rule-engine risk and signals in plain language, then give 1-3 safe next-step suggestions. "
            "You are not a clinician: never diagnose, prescribe medication, infer a disease, or claim medical validation. "
            "Suggest checking sensor quality/trend and consulting qualified medical personnel or verified mission-approved guidance when warranted. "
            "Do not invent thresholds, crew facts, procedures, or readings. Do not issue commands. State that this is simulated demo data. "
            "Answer any user question only from the provided data and these limits. Keep the response concise with headings: "
            "Assessment, Signals, Suggested review."
        ),
    },
    "firehealth": {
        "name": "FireHealth AI",
        "focus": "simulated cabin smoke, temperature, air quality, pressure, and environmental readings",
        "system": (
            "You are FireHealth AI, a cautious spacecraft-environment research-demo assistant. You receive synthetic telemetry only. "
            "Explain the supplied rule-engine environmental risk, identify only supplied sensor signals, and give 1-3 safe next-step suggestions. "
            "Never assert an actual fire, invent spacecraft procedures, recommend specific suppression actions, or issue control commands. "
            "Recommend confirming sensor quality and independent readings and referring to verified mission-approved response guidance when warranted. "
            "Do not claim Earth satellite fire products detect fires inside spacecraft. State the readings are simulated and this is not an operational detector. "
            "Answer any user question only from the provided data and these limits. Keep the response concise with headings: "
            "Assessment, Signals, Suggested review."
        ),
    },
}


def _number(snapshot: dict[str, Any], key: str, low: float, high: float) -> float | None:
    value = snapshot.get(key)
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        return None
    if not low <= value <= high:
        return None
    return float(value)


def _clean_snapshot(assistant: str, payload: dict[str, Any]) -> dict[str, float]:
    raw = payload.get("snapshot")
    if not isinstance(raw, dict):
        raise ValueError("A telemetry snapshot is required.")
    limits = (
        {"heartRate": (0, 250), "spo2": (0, 100), "bodyTemperature": (25, 45), "fatigueIndex": (0, 100), "systolicBP": (40, 300), "diastolicBP": (20, 200), "respirationRate": (0, 80)}
        if assistant == "astrohealth"
        else {"cabinTemperature": (-20, 100), "cabinPressure": (0, 300), "smokeDensity": (0, 1000), "airQualityAQI": (0, 500), "co2Level": (0, 100000), "o2Percentage": (0, 100), "vocIndex": (0, 10000)}
    )
    clean: dict[str, float] = {}
    for key, (low, high) in limits.items():
        value = _number(raw, key, low, high)
        if value is not None:
            clean[key] = value
    if not clean:
        raise ValueError("No valid telemetry values were provided.")
    return clean


def _local_reply(assistant: str, snapshot: dict[str, float], risk: dict[str, Any], question: str) -> str:
    level = str(risk.get("level", "UNKNOWN")).upper()
    explanation = str(risk.get("explanation", "No rule-engine explanation was supplied."))[:500]
    if assistant == "astrohealth":
        abnormal = []
        if snapshot.get("heartRate", 0) > 98:
            abnormal.append("heart-rate reading above the demo baseline")
        if snapshot.get("spo2", 100) < 95:
            abnormal.append("SpO2 reading below the demo baseline")
        if snapshot.get("bodyTemperature", 36.8) > 38:
            abnormal.append("body-temperature reading above the demo baseline")
        if snapshot.get("fatigueIndex", 0) > 60:
            abnormal.append("fatigue index above the demo baseline")
        signal_text = "; ".join(abnormal) if abnormal else "No supplied value crossed the assistant's simple demo review checks."
        review = "Recheck the relevant sensor and compare its recent trend. If this were a real setting, use qualified medical personnel and verified mission-approved guidance; this demo cannot diagnose or prescribe."
    else:
        abnormal = []
        if snapshot.get("smokeDensity", 0) > 0.15:
            abnormal.append("smoke-sensor value above the demo baseline")
        if snapshot.get("cabinTemperature", 0) > 26:
            abnormal.append("cabin-temperature value above the demo baseline")
        if snapshot.get("airQualityAQI", 0) > 40:
            abnormal.append("air-quality index above the demo baseline")
        signal_text = "; ".join(abnormal) if abnormal else "No supplied environmental value crossed the assistant's simple demo review checks."
        review = "Confirm sensor quality and compare independent environmental readings. Refer to verified mission-approved guidance if warranted; this prototype cannot confirm an onboard fire or operate spacecraft systems."
    answer = (
        f"Assessment: {level} according to the deterministic prototype risk engine. {explanation}\n\n"
        f"Signals: {signal_text}\n\nSuggested review: {review}\n\n"
        "Mode: local demo guidance; no language-model API key is configured. All telemetry is simulated."
    )
    if question:
        answer += "\n\nYour question was received. Local mode can summarize the supplied demo signals, but it cannot provide model-generated conversational answers."
    return answer


def _model_reply(assistant: str, snapshot: dict[str, float], risk: dict[str, Any], question: str) -> str:
    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError("model_not_configured")
    profile = ASSISTANTS[assistant]
    input_payload = {
        "assistant": profile["name"],
        "focus": profile["focus"],
        "telemetry_provenance": "synthetic browser simulation; not real astronaut or spacecraft telemetry",
        "telemetry_snapshot": snapshot,
        "deterministic_rule_engine_assessment": {
            "level": str(risk.get("level", "UNKNOWN"))[:12],
            "score": risk.get("score") if isinstance(risk.get("score"), (int, float)) else None,
            "explanation": str(risk.get("explanation", ""))[:500],
        },
        "user_question": question[:500],
    }
    request_body = json.dumps({
        "model": os.getenv("OPENAI_MODEL", MODEL_NAME),
        "instructions": profile["system"],
        "input": json.dumps(input_payload, separators=(",", ":")),
        "max_output_tokens": 320,
        "store": False,
    }).encode("utf-8")
    request = urllib.request.Request(
        MODEL_URL,
        data=request_body,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=25) as response:
            result = json.loads(response.read().decode("utf-8"))
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
        raise RuntimeError("model_unavailable") from exc
    text = result.get("output_text")
    if not text:
        chunks = []
        for item in result.get("output", []):
            if item.get("type") == "message":
                chunks.extend(part.get("text", "") for part in item.get("content", []) if part.get("type") == "output_text")
        text = "\n".join(chunk for chunk in chunks if chunk)
    if not isinstance(text, str) or not text.strip():
        raise RuntimeError("empty_model_response")
    return text.strip()[:4000]


def respond(assistant: str, payload: dict[str, Any]) -> dict[str, Any]:
    if assistant not in ASSISTANTS:
        raise ValueError("Unknown AI assistant.")
    snapshot = _clean_snapshot(assistant, payload)
    question = payload.get("question", "")
    if not isinstance(question, str) or len(question) > 500:
        raise ValueError("Question must be 500 characters or fewer.")
    risk = payload.get("risk") if isinstance(payload.get("risk"), dict) else {}
    try:
        answer = _model_reply(assistant, snapshot, risk, question.strip())
        return {"assistant": ASSISTANTS[assistant]["name"], "mode": "OPENAI_RESPONSES", "model": os.getenv("OPENAI_MODEL", MODEL_NAME), "response": answer}
    except RuntimeError as exc:
        answer = _local_reply(assistant, snapshot, risk, question.strip())
        reason = "not_configured" if str(exc) == "model_not_configured" else "model_unavailable"
        return {"assistant": ASSISTANTS[assistant]["name"], "mode": "LOCAL_FALLBACK", "reason": reason, "response": answer}
