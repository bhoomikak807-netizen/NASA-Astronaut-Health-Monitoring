import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { Activity, Flame, Heart, Loader2, Mic, Send, Square, Volume2 } from 'lucide-react';
import type { AIRiskAssessment, AstronautVitals, EnvironmentalMetrics } from '../../types';

type AssistantId = 'astrohealth' | 'firehealth';
type AssistantReply = { assistant: string; mode: 'OPENAI_RESPONSES' | 'LOCAL_FALLBACK'; model?: string; reason?: string; response: string };

interface Props {
  vitals: AstronautVitals;
  environment: EnvironmentalMetrics;
  risk: AIRiskAssessment;
}

function riskBand(score: number): string {
  return score >= 70 ? 'CRITICAL' : score >= 35 ? 'WARNING' : 'NORMAL';
}

function AssistantCard({
  id,
  title,
  description,
  Icon,
  snapshot,
  score,
  risk,
}: {
  id: AssistantId;
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
  snapshot: Record<string, number>;
  score: number;
  risk: AIRiskAssessment;
}) {
  const [question, setQuestion] = useState('');
  const [reply, setReply] = useState<AssistantReply | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [listening, setListening] = useState(false);
  const [muted, setMuted] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState('');
  const recognitionRef = useRef<any>(null);
  const level = riskBand(score);

  useEffect(() => () => {
    recognitionRef.current?.abort?.();
    window.speechSynthesis?.cancel();
  }, []);

  async function analyze(questionText = question) {
    setBusy(true);
    setError('');
    setVoiceMessage('');
    try {
      const response = await fetch(`/api/ai/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          snapshot,
          question: questionText.trim(),
          risk: { level, score, explanation: risk.explanation },
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || result.error || 'Assistant request failed.');
      setReply(result as AssistantReply);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Assistant is unavailable.');
    } finally {
      setBusy(false);
    }
  }

  function startVoiceQuestion() {
    const speechWindow = window as any;
    const Recognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setVoiceMessage('Voice input is not supported in this browser. You can type a question instead.');
      return;
    }
    window.speechSynthesis?.cancel();
    const recognition = new Recognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;
    recognition.onstart = () => { setListening(true); setVoiceMessage('Listening… browser speech recognition is active.'); };
    recognition.onerror = () => { setListening(false); setVoiceMessage('Voice input ended. Type your question or try the microphone again.'); };
    recognition.onend = () => setListening(false);
    recognition.onresult = (event: any) => {
      const transcript = String(event.results?.[0]?.[0]?.transcript || '').slice(0, 500);
      setQuestion(transcript);
      setVoiceMessage('Question recognized. Review the transcript, then press Send to submit it with the synthetic readings.');
    };
    try { recognition.start(); } catch { setListening(false); setVoiceMessage('Microphone could not start. Check the browser permission and try again.'); }
  }

  function speak() {
    if (!reply) return;
    if (muted) {
      setVoiceMessage('Voice is muted. Unmute to hear the response.');
      return;
    }
    if (!('speechSynthesis' in window)) {
      setVoiceMessage('Spoken output is not supported in this browser. The written response is available above.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${title}. ${reply.response}`);
    utterance.lang = 'en-US';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
    setVoiceMessage('Reading the response aloud.');
  }

  function stopVoice() {
    window.speechSynthesis?.cancel();
    recognitionRef.current?.abort?.();
    setListening(false);
    setVoiceMessage('Voice stopped.');
  }

  function toggleMute() {
    if (!muted) window.speechSynthesis?.cancel();
    setMuted((value) => !value);
    setVoiceMessage(muted ? 'Voice unmuted.' : 'Voice muted.');
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void analyze();
  }

  const bandClass = level === 'CRITICAL' ? 'text-[#EF4444] border-[#EF4444]/40 bg-[#EF4444]/10' : level === 'WARNING' ? 'text-[#F59E0B] border-[#F59E0B]/40 bg-[#F59E0B]/10' : 'text-[#10B981] border-[#10B981]/40 bg-[#10B981]/10';

  return (
    <article className="space-card rounded-2xl p-5 border border-[#1E2D44] min-w-0">
      <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#1E2D44]">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#58C7FF]/10 border border-[#58C7FF]/20 text-[#58C7FF]"><Icon className="w-5 h-5" /></div>
          <div><h3 className="font-display text-base font-bold text-[#F8FAFC]">{title}</h3><p className="text-[11px] leading-relaxed text-[#94A3B8] mt-1">{description}</p></div>
        </div>
        <span className={`shrink-0 rounded border px-2 py-1 text-[9px] font-mono font-bold ${bandClass}`}>{level}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        {Object.entries(snapshot).map(([key, value]) => (
          <div key={key} className="rounded-lg border border-[#1E2D44] bg-[#05070D]/70 px-3 py-2">
            <div className="text-[9px] text-[#64748B] font-mono uppercase tracking-wide">{key.replace(/([A-Z])/g, ' $1')}</div>
            <div className="text-sm font-mono text-[#DCEAF4] mt-1">{Number(value.toFixed(2))}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
        <span className="text-[9px] text-[#F59E0B] font-mono tracking-wide">SIMULATED TELEMETRY · REVIEW SUPPORT ONLY</span>
        <button type="button" onClick={() => void analyze('')} disabled={busy} className="inline-flex items-center gap-2 rounded-lg bg-[#58C7FF] px-3 py-2 text-[10px] font-bold text-[#05070D] hover:bg-[#8AD8FF] disabled:opacity-60">
          {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Activity className="w-3.5 h-3.5" />}
          {busy ? 'Analyzing…' : 'Analyze current signals'}
        </button>
      </div>

      <form onSubmit={submit} className="flex gap-2 mt-3">
        <input value={question} onChange={(e) => setQuestion(e.target.value)} maxLength={500} placeholder={`Ask ${title} about these readings…`} aria-label={`Ask ${title}`} className="min-w-0 flex-1 rounded-lg border border-[#1E2D44] bg-[#05070D] px-3 py-2 text-xs text-white placeholder:text-[#64748B] focus:border-[#58C7FF] focus:outline-none" />
        <button type="button" onClick={startVoiceQuestion} aria-label={`Ask ${title} by voice`} title="Ask by voice (microphone permission is requested by your browser)" className={`rounded-lg border px-2.5 ${listening ? 'border-[#EF4444] text-[#EF4444]' : 'border-[#1E2D44] text-[#94A3B8] hover:text-white'}`}><Mic className="w-4 h-4" /></button>
        <button type="submit" disabled={busy || !question.trim()} aria-label="Send question" className="rounded-lg border border-[#1E2D44] px-2.5 text-[#58C7FF] hover:bg-[#58C7FF]/10 disabled:opacity-40"><Send className="w-4 h-4" /></button>
      </form>

      {error && <div role="alert" className="mt-3 rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10 p-3 text-[11px] text-[#FCA5A5]">{error}</div>}
      {reply && <div className="mt-4 rounded-xl border border-[#58C7FF]/20 bg-[#05070D]/80 p-4" aria-live="polite">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className={`rounded border px-2 py-1 text-[8px] font-mono tracking-wide ${reply.mode === 'OPENAI_RESPONSES' ? 'text-[#58C7FF] border-[#58C7FF]/30' : 'text-[#F59E0B] border-[#F59E0B]/30'}`}>
            {reply.mode === 'OPENAI_RESPONSES' ? `MODEL RESPONSE · ${reply.model}` : 'LOCAL RULE-BASED DEMO GUIDANCE'}
          </span>
          <div className="flex gap-1.5">
            <button type="button" onClick={speak} className="inline-flex items-center gap-1 rounded border border-[#1E2D44] px-2 py-1 text-[9px] text-[#94A3B8] hover:text-white"><Volume2 className="w-3 h-3" /> Speak</button>
            <button type="button" onClick={stopVoice} className="inline-flex items-center gap-1 rounded border border-[#1E2D44] px-2 py-1 text-[9px] text-[#94A3B8] hover:text-white"><Square className="w-2.5 h-2.5" /> Stop</button>
            <button type="button" onClick={toggleMute} className="rounded border border-[#1E2D44] px-2 py-1 text-[9px] text-[#94A3B8] hover:text-white">{muted ? 'Unmute' : 'Mute'}</button>
          </div>
        </div>
        <p className="whitespace-pre-line text-[11px] leading-relaxed text-[#C4D0DA]">{reply.response}</p>
      </div>}
      {voiceMessage && <p className="mt-2 text-[9px] text-[#8194A3]" aria-live="polite">{voiceMessage}</p>}
      <p className="mt-3 text-[9px] leading-relaxed text-[#64748B]">Not medical advice or an operational detector. Use demo questions only; do not enter real personal or medical information. Browser speech recognition behavior depends on browser settings. You review and submit the transcript before it, along with synthetic readings, is sent to the configured model provider.</p>
    </article>
  );
}

export default function MissionAssistants({ vitals, environment, risk }: Props) {
  return (
    <section aria-labelledby="assistants-title" className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div><p className="text-[10px] font-mono tracking-[.2em] text-[#58C7FF]">AI ASSISTANTS / PROTOTYPE</p><h2 id="assistants-title" className="mt-1 text-lg font-bold font-display">Signal review & recommendations</h2></div>
        <p className="text-[10px] text-[#64748B]">OpenAI Responses API when configured · transparent local fallback otherwise</p>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <AssistantCard id="astrohealth" title="AstroHealth AI" description="Reviews the synthetic crew-health snapshot and suggests cautious next steps." Icon={Heart} snapshot={{ heartRate: vitals.heartRate, spo2: vitals.spO2, bodyTemperature: vitals.temperature, fatigueIndex: vitals.fatigueIndex, systolicBP: vitals.systolicBP, diastolicBP: vitals.diastolicBP, respirationRate: vitals.respirationRate }} score={risk.healthRiskScore} risk={risk} />
        <AssistantCard id="firehealth" title="FireHealth AI" description="Reviews synthetic cabin-environment readings; it does not confirm a fire or control systems." Icon={Flame} snapshot={{ cabinTemperature: environment.cabinTemperature, cabinPressure: environment.cabinPressure, smokeDensity: environment.smokeDensity, airQualityAQI: environment.airQualityAQI, co2Level: environment.co2Level, o2Percentage: environment.o2Percentage, vocIndex: environment.vocIndex }} score={risk.environmentalRiskScore} risk={risk} />
      </div>
    </section>
  );
}
