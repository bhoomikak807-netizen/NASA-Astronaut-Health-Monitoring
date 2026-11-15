// ASTRA-SENTINEL AI — Core Domain Types

export type RiskLevel = 'NORMAL' | 'WARNING' | 'CRITICAL';

export interface AstronautVitals {
  id: string;
  name: string;
  role: string;
  heartRate: number; // BPM (Normal: 60-95)
  spO2: number; // % (Normal: 96-100)
  temperature: number; // °C (Normal: 36.5 - 37.3)
  fatigueIndex: number; // 0-100 (Normal: < 40)
  systolicBP: number; // mmHg (Normal: 110-125)
  diastolicBP: number; // mmHg (Normal: 70-82)
  respirationRate: number; // breaths/min (Normal: 12-18)
  status: RiskLevel;
}

export interface EnvironmentalMetrics {
  cabinTemperature: number; // °C (Normal: 21.0 - 23.5)
  cabinPressure: number; // kPa (Normal: 101.3 ± 1.5)
  smokeDensity: number; // ppm / index (Normal: 0 - 0.15)
  airQualityAQI: number; // 0-500 (Good: < 40)
  co2Level: number; // ppm (Normal: 400 - 800)
  o2Percentage: number; // % (Normal: 20.8 - 21.5)
  vocIndex: number; // Volatile Organic Compounds (Normal: < 50)
  radiationDoseRate: number; // μSv/h (Normal: 0.15 - 0.40)
  status: RiskLevel;
}

export interface AIRiskAssessment {
  overallRisk: RiskLevel;
  overallScore: number; // 0-100
  healthRiskScore: number; // 0-100
  environmentalRiskScore: number; // 0-100
  anomalyConfidence: number; // % e.g. 94.8%
  primaryAnomaly: string;
  explanation: string;
  recommendedAction: string;
  lastUpdated: string;
}

export interface MissionAlert {
  id: string;
  timestamp: string;
  severity: RiskLevel;
  source: 'AstroHealth AI' | 'FireHealth AI' | 'Multi-Sensor Fusion' | 'Atmospheric Subsystem' | 'SolarShield Research' | 'QuantumNav';
  title: string;
  description: string;
  acknowledged: boolean;
  affectedModule?: string;
  metricSnapshot?: Record<string, number | string>;
}

export interface SpacecraftModule {
  id: string;
  name: string;
  status: RiskLevel;
  temperature: number;
  pressure: number;
  powerDrawKw: number;
  integrityPercent: number;
  details: string;
}

export interface MissionStatus {
  missionId: string;
  phase: string;
  crewCount: number;
  spacecraftStatus: 'NOMINAL' | 'DEGRADED' | 'EMERGENCY';
  commsStatus: 'OPTIMAL' | 'DEGRADED' | 'BLACKOUT';
  signalLatencySec: number;
  dataSyncStatus: 'LIVE_SIMULATED' | 'SYNCED' | 'BUFFERING';
  orbitalAltitudeKm: number;
  velocityKmS: number;
  activeSince: string;
}

export interface TelemetryPoint {
  time: string;
  heartRate: number;
  spO2: number;
  cabinTemp: number;
  cabinPressure: number;
  smokeDensity: number;
  co2Level: number;
}

export interface NasaDataset {
  id: string;
  title: string;
  source: 'NASA OSDR' | 'NASA DONKI' | 'NASA FIRMS' | 'NASA Image & Video';
  description: string;
  useCase: string;
  url: string;
  apiUrl: string;
  dataType: string;
  integrationStatus: 'Connected' | 'Available for integration' | 'Research reference' | 'Simulated fallback';
  lastUpdated?: string;
  metadata?: Record<string, string>;
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  severity: RiskLevel;
  expectedAlert: string;
}
