import React, { useEffect, useState, useSyncExternalStore } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AlertTriangle, BellOff, Volume2, VolumeX, Siren, X } from 'lucide-react';
import { alarm } from '../../services/alarm';
import { simulator } from '../../services/simulationEngine';

const SOURCE_LABEL: Record<string, string> = {
  mission: 'Mission Control · cabin & crew fusion',
  'health-monitor': 'Astronaut Health Monitor',
};

/**
 * Global emergency alarm: feeds the Mission Control simulator into the alarm engine, shows a
 * flashing emergency banner with a Silence button while an alarm is active, and a small speaker
 * control (mute, volume, test) in the corner of every page.
 */
export const AlarmCenter: React.FC = () => {
  const state = useSyncExternalStore(alarm.subscribe, alarm.getState);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const push = () => alarm.report('mission', simulator.getRisk().overallRisk);
    push();
    return simulator.subscribe(push);
  }, []);

  const active = state.level !== 'NORMAL' && !state.silenced;
  const critical = state.level === 'CRITICAL';
  const sources = Object.entries(state.sources).filter(([, l]) => l !== 'NORMAL');

  return (
    <>
      {/* red edge pulse for critical emergencies */}
      {active && critical && <div className="alarm-edge" aria-hidden="true" />}

      {active && (
        <div
          role="alert"
          className={`fixed left-1/2 -translate-x-1/2 top-[76px] z-[60] w-[min(760px,calc(100vw-24px))] rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row sm:items-center gap-3 ${
            critical
              ? 'alarm-banner-critical border-[#EF4444] bg-[#2a0608]/85 shadow-[0_0_40px_rgba(239,68,68,0.45)]'
              : 'border-[#F59E0B] bg-[#2a1a04]/85 shadow-[0_0_30px_rgba(245,158,11,0.35)]'
          }`}
        >
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <span className={`p-2 rounded-xl shrink-0 ${critical ? 'bg-[#EF4444]/25 text-[#FCA5A5]' : 'bg-[#F59E0B]/25 text-[#FCD34D]'}`}>
              {critical ? <Siren className="w-5 h-5 animate-pulse" /> : <AlertTriangle className="w-5 h-5" />}
            </span>
            <div className="min-w-0">
              <div className={`text-xs font-mono font-bold tracking-widest ${critical ? 'text-[#FCA5A5]' : 'text-[#FCD34D]'}`}>
                {critical ? 'CRITICAL EMERGENCY ALARM' : 'CAUTION ALARM'} · SIMULATED
              </div>
              <div className="text-sm text-white mt-0.5 truncate">
                {sources.map(([s]) => SOURCE_LABEL[s] ?? s).join(' + ') || 'Anomaly detected'}
              </div>
              {!state.sounding && !state.muted && (
                <div className="text-[11px] font-mono text-[#94A3B8] mt-0.5">Click anywhere to enable alarm sound.</div>
              )}
              {state.muted && <div className="text-[11px] font-mono text-[#94A3B8] mt-0.5">Alarm sound is muted.</div>}
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            {pathname !== '/mission-control' && (
              <Link to="/mission-control?tab=ai" className="px-3 py-2 rounded-lg text-xs font-mono border border-white/20 text-white hover:bg-white/10">
                Investigate
              </Link>
            )}
            <button
              type="button"
              onClick={() => alarm.silence()}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold inline-flex items-center gap-1.5 ${
                critical ? 'bg-[#EF4444] text-white hover:bg-[#F87171]' : 'bg-[#F59E0B] text-[#1a1003] hover:bg-[#FBBF24]'
              }`}
            >
              <BellOff className="w-3.5 h-3.5" /> Silence alarm
            </button>
          </div>
        </div>
      )}

      {/* speaker control */}
      <div className="fixed right-4 bottom-4 z-[60] flex flex-col items-end gap-2">
        {open && (
          <div className="w-64 rounded-2xl glass-panel p-4 shadow-2xl shadow-black/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold tracking-widest text-[#7DD3FC]">EMERGENCY AUDIO</span>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close alarm settings" className="text-[#94A3B8] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <label className="flex items-center justify-between text-xs text-[#CBD5E1]">
              Alarm sound
              <button
                type="button"
                onClick={() => alarm.setMuted(!state.muted)}
                className={`px-2.5 py-1 rounded-md font-mono text-[11px] border ${
                  state.muted ? 'border-white/15 text-[#94A3B8]' : 'border-[#10B981]/50 text-[#34D399] bg-[#10B981]/10'
                }`}
              >
                {state.muted ? 'MUTED' : 'ON'}
              </button>
            </label>
            <label className="block text-xs text-[#CBD5E1]">
              Volume {Math.round(state.volume * 100)}%
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(state.volume * 100)}
                onChange={(e) => alarm.setVolume(Number(e.target.value) / 100)}
                className="w-full accent-[#EF4444] mt-1"
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => alarm.test('CRITICAL')} className="px-2 py-2 rounded-lg text-[11px] font-mono bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#FCA5A5] hover:bg-[#EF4444]/25">
                Test critical
              </button>
              <button type="button" onClick={() => alarm.test('WARNING')} className="px-2 py-2 rounded-lg text-[11px] font-mono bg-[#F59E0B]/15 border border-[#F59E0B]/40 text-[#FCD34D] hover:bg-[#F59E0B]/25">
                Test caution
              </button>
            </div>
            <p className="text-[10px] text-[#64748B] leading-snug">
              Sounds when the simulator or Health Monitor reaches WARNING or CRITICAL. Silencing holds until the level clears or gets worse.
            </p>
          </div>
        )}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Emergency audio settings"
          className={`relative w-12 h-12 rounded-full glass-panel flex items-center justify-center shadow-lg shadow-black/50 hover:border-[#58C7FF]/60 ${
            state.sounding ? 'alarm-fab-ring' : ''
          }`}
        >
          {state.muted ? <VolumeX className="w-5 h-5 text-[#94A3B8]" /> : <Volume2 className={`w-5 h-5 ${state.sounding ? 'text-[#F87171]' : 'text-[#58C7FF]'}`} />}
          {state.level !== 'NORMAL' && (
            <span className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full ${critical ? 'bg-[#EF4444]' : 'bg-[#F59E0B]'} animate-ping`} />
          )}
        </button>
      </div>
    </>
  );
};

export default AlarmCenter;
