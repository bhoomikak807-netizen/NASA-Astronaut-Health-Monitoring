import React, { useState } from 'react';
import { SpacecraftModule } from '../../types';
import { Shield, Cpu, Wind, Zap, Compass, Radio, CheckCircle2, AlertTriangle, AlertOctagon, X } from 'lucide-react';

interface SpacecraftModuleViewerProps {
  modules: SpacecraftModule[];
  onSelectModule?: (module: SpacecraftModule) => void;
}

export const SpacecraftModuleViewer: React.FC<SpacecraftModuleViewerProps> = ({
  modules,
  onSelectModule,
}) => {
  const [selectedModule, setSelectedModule] = useState<SpacecraftModule | null>(null);

  const getStatusColor = (status: SpacecraftModule['status']) => {
    switch (status) {
      case 'CRITICAL':
        return {
          border: 'border-[#EF4444]',
          bg: 'bg-[#EF4444]/15',
          text: 'text-[#EF4444]',
          glow: 'shadow-[0_0_20px_rgba(239,68,68,0.35)]',
          badge: 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40',
        };
      case 'WARNING':
        return {
          border: 'border-[#F59E0B]',
          bg: 'bg-[#F59E0B]/15',
          text: 'text-[#F59E0B]',
          glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]',
          badge: 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/40',
        };
      default:
        return {
          border: 'border-[#58C7FF]/30',
          bg: 'bg-[#101826]/80',
          text: 'text-[#58C7FF]',
          glow: 'hover:shadow-[0_0_15px_rgba(88,199,255,0.2)]',
          badge: 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40',
        };
    }
  };

  const getModuleIcon = (id: string) => {
    switch (id) {
      case 'mod_crew':
        return <Shield className="w-5 h-5" />;
      case 'mod_eclss':
        return <Wind className="w-5 h-5" />;
      case 'mod_power':
        return <Zap className="w-5 h-5" />;
      case 'mod_nav':
        return <Compass className="w-5 h-5" />;
      case 'mod_comms':
        return <Radio className="w-5 h-5" />;
      default:
        return <Cpu className="w-5 h-5" />;
    }
  };

  const handleModuleClick = (m: SpacecraftModule) => {
    setSelectedModule(m);
    if (onSelectModule) onSelectModule(m);
  };

  return (
    <div className="space-card rounded-2xl p-5 relative overflow-hidden">
      {/* Background Accent Grid */}
      <div className="absolute inset-0 tech-grid opacity-50 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#58C7FF] animate-pulse" />
            <h3 className="text-sm font-mono tracking-wider text-[#F8FAFC] uppercase font-semibold">
              Spacecraft Subsystem Architecture
            </h3>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Select any pressurized bay or avionics truss to inspect live environmental telemetry.
          </p>
        </div>
        <div className="text-[11px] font-mono text-[#64748B] hidden sm:block">
          CAD_REF: ORBITAL-SENTINEL-MK2
        </div>
      </div>

      {/* Futuristic Spacecraft Schematic Diagram */}
      <div className="relative py-4 my-2 px-2 z-10">
        {/* Orbital Axis Trajectory line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#58C7FF]/20 to-transparent -translate-y-1/2 pointer-events-none" />

        {/* Spacecraft Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {modules.map((m) => {
            const styles = getStatusColor(m.status);
            return (
              <button
                key={m.id}
                onClick={() => handleModuleClick(m)}
                className={`relative p-4 rounded-xl border text-left transition-all duration-300 group ${styles.border} ${styles.bg} ${styles.glow} focus:outline-none`}
              >
                {/* Module Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-[#05070D]/70 border border-[#1E2D44] ${styles.text}`}>
                    {getModuleIcon(m.id)}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${styles.badge}`}>
                    {m.status}
                  </span>
                </div>

                {/* Name */}
                <h4 className="text-sm font-semibold text-[#F8FAFC] group-hover:text-[#58C7FF] transition-colors truncate">
                  {m.name}
                </h4>

                {/* Telemetry Metrics */}
                <div className="mt-3 space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between text-[#94A3B8]">
                    <span>Temp:</span>
                    <span className="text-[#F8FAFC] font-medium">{m.temperature.toFixed(1)}°C</span>
                  </div>
                  <div className="flex items-center justify-between text-[#94A3B8]">
                    <span>Pressure:</span>
                    <span className="text-[#F8FAFC] font-medium">{m.pressure.toFixed(1)} kPa</span>
                  </div>
                  <div className="flex items-center justify-between text-[#94A3B8]">
                    <span>Integrity:</span>
                    <span className={`font-semibold ${m.integrityPercent < 95 ? 'text-[#EF4444]' : 'text-[#10B981]'}`}>
                      {m.integrityPercent.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Active scan pulse for critical status */}
                {m.status === 'CRITICAL' && (
                  <div className="absolute inset-0 rounded-xl border border-[#EF4444] animate-ping pointer-events-none opacity-40" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Module Detail Modal / Drawer */}
      {selectedModule && (
        <div className="mt-4 p-4 rounded-xl bg-[#0A101B] border border-[#58C7FF]/30 relative z-20 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[#58C7FF]/15 text-[#58C7FF] border border-[#58C7FF]/30">
                {getModuleIcon(selectedModule.id)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-semibold text-[#F8FAFC]">{selectedModule.name}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getStatusColor(selectedModule.status).badge}`}>
                    STATUS: {selectedModule.status}
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] mt-0.5">{selectedModule.details}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedModule(null)}
              className="p-1 rounded-md text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E2D44] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-[#1E2D44] font-mono text-xs">
            <div className="p-2 rounded-lg bg-[#101826]">
              <span className="text-[#64748B] block text-[10px]">OPERATING TEMP</span>
              <span className="text-sm font-semibold text-[#F8FAFC]">{selectedModule.temperature.toFixed(1)} °C</span>
            </div>
            <div className="p-2 rounded-lg bg-[#101826]">
              <span className="text-[#64748B] block text-[10px]">BAROMETRIC PRESSURE</span>
              <span className="text-sm font-semibold text-[#F8FAFC]">{selectedModule.pressure.toFixed(1)} kPa</span>
            </div>
            <div className="p-2 rounded-lg bg-[#101826]">
              <span className="text-[#64748B] block text-[10px]">ELECTRICAL LOAD</span>
              <span className="text-sm font-semibold text-[#58C7FF]">{selectedModule.powerDrawKw.toFixed(1)} kW</span>
            </div>
            <div className="p-2 rounded-lg bg-[#101826]">
              <span className="text-[#64748B] block text-[10px]">STRUCTURAL INTEGRITY</span>
              <span className={`text-sm font-semibold ${selectedModule.integrityPercent < 95 ? 'text-[#EF4444]' : 'text-[#10B981]'}`}>
                {selectedModule.integrityPercent.toFixed(1)} %
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
