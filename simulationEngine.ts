import {
  AstronautVitals,
  EnvironmentalMetrics,
  AIRiskAssessment,
  MissionAlert,
  SpacecraftModule,
  MissionStatus,
  TelemetryPoint,
  SimulationScenario,
  RiskLevel,
} from '../types';
import { evaluateRisk } from './aiRiskEngine';

export const SCENARIOS: SimulationScenario[] = [
  {
    id: 'nominal',
    name: 'Nominal Orbital Operations',
    description: 'Illustrative orbital demo scenario. Synthetic vitals and environmental telemetry remain within configured demo thresholds.',
    severity: 'NORMAL',
    expectedAlert: 'No abnormal signatures detected.',
  },
  {
    id: 'cabin_heat',
    name: 'Thermal Control Loop Variance',
    description: 'Secondary ammonia coolant loop throttle lag causes gradual cabin warming and mild astronaut compensatory tachycardia.',
    severity: 'WARNING',
    expectedAlert: 'WARNING: Thermal excursion detected in Life Support Subsystem.',
  },
  {
    id: 'smoke_anomaly',
    name: 'Emergency Micro-Fire & Smoke Hazard',
    description: 'Illustrative demo with simultaneous synthetic smoke, cabin-temperature, and crew-signal changes.',
    severity: 'CRITICAL',
    expectedAlert: 'CRITICAL: Synthetic environmental signals crossed demo thresholds and need review.',
  },
  {
    id: 'hypoxia_leak',
    name: 'Micro-Meteoroid Puncture / Depressurization',
    description: 'Slow structural seal leakage causing cabin pressure decline and early astronaut arterial oxygen desaturation.',
    severity: 'CRITICAL',
    expectedAlert: 'CRITICAL: Rapid pressure decline detected in Crew Module.',
  },
  {
    id: 'eva_stress',
    name: 'Extravehicular Activity (EVA) High Workload',
    description: 'Astronaut spacewalk conducting orbital assembly. Elevated metabolic rate, elevated heart rate, and increased cognitive fatigue.',
    severity: 'WARNING',
    expectedAlert: 'WARNING: Astronaut physiological load approaching maximum rated endurance.',
  },
];

export const INITIAL_MODULES: SpacecraftModule[] = [
  {
    id: 'mod_crew',
    name: 'Crew Cabin',
    status: 'NORMAL',
    temperature: 22.4,
    pressure: 101.3,
    powerDrawKw: 4.2,
    integrityPercent: 99.8,
    details: 'Primary astronaut habitat, sleep stations, and mission payload consoles.',
  },
  {
    id: 'mod_eclss',
    name: 'Life Support (ECLSS)',
    status: 'NORMAL',
    temperature: 21.0,
    pressure: 101.4,
    powerDrawKw: 6.8,
    integrityPercent: 99.2,
    details: 'Electrolysis oxygen generation, CO2 scrubbers, trace contaminant filters.',
  },
  {
    id: 'mod_power',
    name: 'Electrical & Solar Arrays',
    status: 'NORMAL',
    temperature: 24.1,
    pressure: 101.2,
    powerDrawKw: 14.5,
    integrityPercent: 98.7,
    details: 'Triple-junction GaAs photovoltaic arrays, 120V DC distribution busses.',
  },
  {
    id: 'mod_nav',
    name: 'Navigation & Guidance',
    status: 'NORMAL',
    temperature: 19.8,
    pressure: 101.3,
    powerDrawKw: 3.1,
    integrityPercent: 100.0,
    details: 'Star trackers, redundant ring-laser gyros, QuantumNav simulated inertial reference.',
  },
  {
    id: 'mod_comms',
    name: 'Deep Space Communications',
    status: 'NORMAL',
    temperature: 22.8,
    pressure: 101.1,
    powerDrawKw: 2.9,
    integrityPercent: 99.5,
    details: 'Illustrative high-gain Ka-band communications module; simulated status only.',
  },
];

export const INITIAL_STATUS: MissionStatus = {
  missionId: 'ASTRA-DEMO-EXPEDITION-01',
  phase: 'Orbital Cruise (LEO Flight)',
  crewCount: 4,
  spacecraftStatus: 'NOMINAL',
  commsStatus: 'OPTIMAL',
  signalLatencySec: 1.24,
  dataSyncStatus: 'LIVE_SIMULATED',
  orbitalAltitudeKm: 418.5,
  velocityKmS: 7.66,
  activeSince: 'T+14d 08h 22m',
};

export const INITIAL_VITALS: AstronautVitals = {
  id: 'ASTRO-01',
  name: 'DEMO CREW 01',
  role: 'Synthetic profile',
  heartRate: 72,
  spO2: 98.6,
  temperature: 36.8,
  fatigueIndex: 24,
  systolicBP: 118,
  diastolicBP: 76,
  respirationRate: 14,
  status: 'NORMAL',
};

export const INITIAL_ENV: EnvironmentalMetrics = {
  cabinTemperature: 22.4,
  cabinPressure: 101.3,
  smokeDensity: 0.02,
  airQualityAQI: 24,
  co2Level: 490,
  o2Percentage: 20.95,
  vocIndex: 18,
  radiationDoseRate: 0.22,
  status: 'NORMAL',
};

export class TelemetrySimulator {
  private vitals: AstronautVitals = { ...INITIAL_VITALS };
  private env: EnvironmentalMetrics = { ...INITIAL_ENV };
  private risk: AIRiskAssessment;
  private modules: SpacecraftModule[] = JSON.parse(JSON.stringify(INITIAL_MODULES));
  private missionStatus: MissionStatus = { ...INITIAL_STATUS };
  private activeScenario: string = 'nominal';
  private isRunning: boolean = true;
  private intervalId: any = null;
  private telemetryHistory: TelemetryPoint[] = [];
  private alerts: MissionAlert[] = [];
  private eventHistory: { id: string; time: string; event: string; type: string }[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.risk = evaluateRisk(this.vitals, this.env);
    this.seedHistory();
    this.start();
  }

  private seedHistory() {
    const now = Date.now();
    for (let i = 20; i >= 0; i--) {
      const t = new Date(now - i * 3000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      this.telemetryHistory.push({
        time: t,
        heartRate: 70 + Math.sin(i) * 3,
        spO2: 98.5 + Math.cos(i) * 0.4,
        cabinTemp: 22.3 + Math.sin(i * 0.5) * 0.3,
        cabinPressure: 101.3 + Math.cos(i) * 0.08,
        smokeDensity: 0.02 + Math.abs(Math.sin(i)) * 0.01,
        co2Level: 490 + Math.sin(i) * 15,
      });
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public start() {
    if (this.intervalId) return;
    this.isRunning = true;
    this.intervalId = setInterval(() => this.step(), 2200);
    this.notify();
  }

  public pause() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    this.addEvent('STREAM_PAUSED', 'Telemetry stream paused by operator.');
    this.notify();
  }

  public reset() {
    this.activeScenario = 'nominal';
    this.vitals = { ...INITIAL_VITALS };
    this.env = { ...INITIAL_ENV };
    this.modules = JSON.parse(JSON.stringify(INITIAL_MODULES));
    this.missionStatus = { ...INITIAL_STATUS };
    this.alerts = [];
    this.risk = evaluateRisk(this.vitals, this.env);
    this.telemetryHistory = [];
    this.seedHistory();
    this.addEvent('SYSTEM_RESET', 'Simulation reset to nominal baseline state.');
    this.notify();
  }

  public triggerDemoEmergency() {
    this.setScenario('smoke_anomaly');
  }

  public setScenario(scenarioId: string) {
    this.activeScenario = scenarioId;
    const scen = SCENARIOS.find((s) => s.id === scenarioId);

    if (scenarioId === 'smoke_anomaly') {
      // Deterministic spike: Micro-fire emergency
      this.env.smokeDensity = 0.72;
      this.env.cabinTemperature = 33.8;
      this.env.airQualityAQI = 185;
      this.env.co2Level = 1380;
      this.vitals.heartRate = 126;
      this.vitals.spO2 = 93.6;
      this.vitals.temperature = 37.8;
      this.vitals.fatigueIndex = 65;

      // Update Module states
      this.modules = this.modules.map((m) =>
        m.id === 'mod_crew'
          ? { ...m, status: 'CRITICAL', temperature: 34.2, integrityPercent: 88.4, details: 'Smoke detector active in Bay 2. Thermal overload.' }
          : m.id === 'mod_eclss'
          ? { ...m, status: 'WARNING', details: 'Air recirculation scrubber load at 94% capacity.' }
          : m
      );

      this.missionStatus.spacecraftStatus = 'EMERGENCY';

      this.createAlert(
        'CRITICAL',
        'FireHealth AI',
        'Correlated synthetic smoke and temperature readings',
        'Illustrative smoke and cabin-temperature values crossed configured demo thresholds. Verify signals and consult approved guidance in any real operation; no control action is issued.',
        'Crew Cabin'
      );

      this.createAlert(
        'WARNING',
        'AstroHealth AI',
        'Correlated synthetic health and cabin signals',
        'Demo heart-rate and SpO2 values changed alongside simulated cabin sensor alerts.',
        'Crew Cabin'
      );

      this.addEvent('EMERGENCY_TRIGGERED', 'Simulated micro-fire event initiated. Multi-sensor anomaly active.');
    } else if (scenarioId === 'cabin_heat') {
      this.env.cabinTemperature = 28.6;
      this.env.smokeDensity = 0.05;
      this.vitals.heartRate = 92;
      this.vitals.temperature = 37.5;
      this.modules = this.modules.map((m) =>
        m.id === 'mod_eclss'
          ? { ...m, status: 'WARNING', temperature: 29.1, details: 'Secondary cooling loop pressure fluctuation.' }
          : { ...m, status: 'NORMAL' }
      );
      this.missionStatus.spacecraftStatus = 'DEGRADED';
      this.createAlert(
        'WARNING',
        'Multi-Sensor Fusion',
        'Secondary Thermal Control Loop Variance',
        'Cabin ambient temperature reached 28.6°C. ECLSS thermal pump loop requires telemetry verification.',
        'Life Support (ECLSS)'
      );
      this.addEvent('SCENARIO_SET', 'Thermal control variance scenario loaded.');
    } else if (scenarioId === 'hypoxia_leak') {
      this.env.cabinPressure = 88.5;
      this.env.smokeDensity = 0.02;
      this.vitals.spO2 = 91.2;
      this.vitals.heartRate = 104;
      this.modules = this.modules.map((m) =>
        m.id === 'mod_crew'
          ? { ...m, status: 'CRITICAL', pressure: 88.5, integrityPercent: 91.0, details: 'Seal Delta-P abnormal. Atmosphere venting suspected.' }
          : m
      );
      this.missionStatus.spacecraftStatus = 'EMERGENCY';
      this.createAlert(
        'CRITICAL',
        'Atmospheric Subsystem',
        'Cabin Depressurization Warning',
        'Atmospheric pressure fell to 88.5 kPa. Hull pressure bulkhead sensor indicates pressure drop rate 0.4 kPa/min.',
        'Crew Cabin'
      );
      this.addEvent('SCENARIO_SET', 'Depressurization scenario loaded.');
    } else if (scenarioId === 'eva_stress') {
      this.vitals.heartRate = 118;
      this.vitals.fatigueIndex = 76;
      this.vitals.respirationRate = 24;
      this.env.cabinTemperature = 22.4;
      this.createAlert(
        'WARNING',
        'AstroHealth AI',
        'Astronaut Physical Exhaustion Limit',
        'Synthetic heart-rate signal remained above its demo baseline during the illustrative EVA scenario.',
        'EVA Airlock'
      );
      this.addEvent('SCENARIO_SET', 'EVA high workload scenario loaded.');
    } else {
      // Nominal
      this.reset();
      return;
    }

    this.risk = evaluateRisk(this.vitals, this.env);
    this.notify();
  }

  private step() {
    if (!this.isRunning) return;

    // Apply micro-variations depending on scenario
    const jitter = (range: number) => (Math.random() - 0.5) * range;

    if (this.activeScenario === 'nominal') {
      this.vitals.heartRate = Math.round(Math.max(62, Math.min(84, this.vitals.heartRate + jitter(2))));
      this.vitals.spO2 = +(Math.max(97.5, Math.min(99.5, this.vitals.spO2 + jitter(0.2))).toFixed(1));
      this.vitals.temperature = +(Math.max(36.6, Math.min(37.1, this.vitals.temperature + jitter(0.05))).toFixed(1));
      this.env.cabinTemperature = +(Math.max(21.5, Math.min(23.2, this.env.cabinTemperature + jitter(0.1))).toFixed(1));
      this.env.cabinPressure = +(Math.max(100.8, Math.min(101.8, this.env.cabinPressure + jitter(0.04))).toFixed(1));
      this.env.smokeDensity = +(Math.max(0.01, Math.min(0.04, this.env.smokeDensity + jitter(0.005))).toFixed(2));
      this.env.co2Level = Math.round(Math.max(450, Math.min(520, this.env.co2Level + jitter(10))));
    } else if (this.activeScenario === 'smoke_anomaly') {
      // Keep in emergency range with realistic sensor jitter
      this.env.smokeDensity = +(Math.max(0.55, Math.min(0.85, this.env.smokeDensity + jitter(0.04))).toFixed(2));
      this.env.cabinTemperature = +(Math.max(32.0, Math.min(35.5, this.env.cabinTemperature + jitter(0.2))).toFixed(1));
      this.vitals.heartRate = Math.round(Math.max(115, Math.min(134, this.vitals.heartRate + jitter(3))));
      this.vitals.spO2 = +(Math.max(92.0, Math.min(94.5, this.vitals.spO2 + jitter(0.2))).toFixed(1));
    }

    // Evaluate Risk with latest data
    this.risk = evaluateRisk(this.vitals, this.env);

    // Update vitals & env risk status flags
    this.vitals.status = this.risk.healthRiskScore > 50 ? 'CRITICAL' : this.risk.healthRiskScore > 25 ? 'WARNING' : 'NORMAL';
    this.env.status = this.risk.environmentalRiskScore > 50 ? 'CRITICAL' : this.risk.environmentalRiskScore > 25 ? 'WARNING' : 'NORMAL';

    // Append to rolling telemetry history
    const t = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.telemetryHistory.push({
      time: t,
      heartRate: this.vitals.heartRate,
      spO2: this.vitals.spO2,
      cabinTemp: this.env.cabinTemperature,
      cabinPressure: this.env.cabinPressure,
      smokeDensity: this.env.smokeDensity,
      co2Level: this.env.co2Level,
    });

    if (this.telemetryHistory.length > 25) {
      this.telemetryHistory.shift();
    }

    this.notify();
  }

  public createAlert(
    severity: RiskLevel,
    source: MissionAlert['source'],
    title: string,
    description: string,
    affectedModule?: string
  ) {
    const alert: MissionAlert = {
      id: `ALT-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 100)}`,
      timestamp: new Date().toLocaleTimeString(),
      severity,
      source,
      title,
      description,
      acknowledged: false,
      affectedModule,
    };
    this.alerts.unshift(alert);
    if (this.alerts.length > 20) this.alerts.pop();
    this.addEvent(severity, `${title} (${source})`);
  }

  public acknowledgeAlert(id: string) {
    this.alerts = this.alerts.map((a) => (a.id === id ? { ...a, acknowledged: true } : a));
    this.addEvent('ALERT_ACK', `Alert [${id}] acknowledged by flight operator.`);
    this.notify();
  }

  public dismissAlert(id: string) {
    this.alerts = this.alerts.filter((a) => a.id !== id);
    this.notify();
  }

  public addEvent(type: string, event: string) {
    this.eventHistory.unshift({
      id: Math.random().toString(36).substring(2, 9),
      time: new Date().toLocaleTimeString(),
      type,
      event,
    });
    if (this.eventHistory.length > 30) this.eventHistory.pop();
  }

  // Getters
  public getVitals(): AstronautVitals { return this.vitals; }
  public getEnv(): EnvironmentalMetrics { return this.env; }
  public getRisk(): AIRiskAssessment { return this.risk; }
  public getModules(): SpacecraftModule[] { return this.modules; }
  public getMissionStatus(): MissionStatus { return this.missionStatus; }
  public getTelemetryHistory(): TelemetryPoint[] { return this.telemetryHistory; }
  public getAlerts(): MissionAlert[] { return this.alerts; }
  public getEventHistory() { return this.eventHistory; }
  public getActiveScenario(): string { return this.activeScenario; }
  public getIsRunning(): boolean { return this.isRunning; }
}

// Global Singleton for application state
export const simulator = new TelemetrySimulator();
