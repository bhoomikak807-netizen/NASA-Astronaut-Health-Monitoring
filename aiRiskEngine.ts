import { AstronautVitals, EnvironmentalMetrics, AIRiskAssessment, RiskLevel } from '../types';

/**
 * ASTRA-SENTINEL Prototype AI Risk Engine
 * Implements multi-sensor statistical fusion & interpretable rule-based anomaly detection.
 * Evaluates physiological vitals and spacecraft environmental telemetry in real-time.
 */
export function evaluateRisk(
  vitals: AstronautVitals,
  env: EnvironmentalMetrics
): AIRiskAssessment {
  let healthScore = 0;
  let envScore = 0;
  const anomalies: string[] = [];
  const explanations: string[] = [];

  // 1. Health Signal Evaluation
  // Heart Rate (Nominal: 60 - 95 BPM)
  if (vitals.heartRate > 115) {
    healthScore += 45;
    anomalies.push(`Heart-rate signal above demo range (${vitals.heartRate} BPM)`);
  } else if (vitals.heartRate > 98) {
    healthScore += 25;
    anomalies.push(`Heart-rate signal above demo range (${vitals.heartRate} BPM)`);
  } else if (vitals.heartRate < 50) {
    healthScore += 30;
    anomalies.push(`Heart-rate signal below demo range (${vitals.heartRate} BPM)`);
  }

  // SpO2 Blood Oxygen (Nominal: 95% - 100%)
  if (vitals.spO2 < 92) {
    healthScore += 50;
    anomalies.push(`SpO2 signal below demo range (${vitals.spO2.toFixed(1)}%)`);
  } else if (vitals.spO2 < 95) {
    healthScore += 25;
    anomalies.push(`SpO2 signal below demo range (${vitals.spO2.toFixed(1)}%)`);
  }

  // Body Temperature (Nominal: 36.5 - 37.4 °C)
  if (vitals.temperature > 38.2) {
    healthScore += 35;
    anomalies.push(`Body-temperature signal above demo range (${vitals.temperature.toFixed(1)}°C)`);
  } else if (vitals.temperature > 37.5) {
    healthScore += 15;
    anomalies.push(`Body-temperature signal above demo range (${vitals.temperature.toFixed(1)}°C)`);
  }

  // Fatigue Index (0-100)
  if (vitals.fatigueIndex > 70) {
    healthScore += 20;
    anomalies.push(`High Cognitive Fatigue (${vitals.fatigueIndex}/100)`);
  }

  // 2. Environmental Signal Evaluation
  // Smoke Sensor Density (Nominal: < 0.10 ppm)
  if (env.smokeDensity > 0.40) {
    envScore += 65;
    anomalies.push(`Critical Particulate / Smoke Density (${env.smokeDensity.toFixed(2)} ppm)`);
  } else if (env.smokeDensity > 0.15) {
    envScore += 35;
    anomalies.push(`Combustion Precursor Detected (${env.smokeDensity.toFixed(2)} ppm)`);
  }

  // Cabin Temperature (Nominal: 20.0 - 24.0 °C)
  if (env.cabinTemperature > 31.0) {
    envScore += 45;
    anomalies.push(`Extreme Thermal Excursion (${env.cabinTemperature.toFixed(1)}°C)`);
  } else if (env.cabinTemperature > 26.0) {
    envScore += 20;
    anomalies.push(`Elevated Cabin Temperature (${env.cabinTemperature.toFixed(1)}°C)`);
  }

  // Cabin Pressure (Nominal: 99.0 - 103.0 kPa)
  if (env.cabinPressure < 90.0) {
    envScore += 70;
    anomalies.push(`Depressurization Hazard (${env.cabinPressure.toFixed(1)} kPa)`);
  } else if (env.cabinPressure < 97.0) {
    envScore += 25;
    anomalies.push(`Sub-nominal Cabin Pressure (${env.cabinPressure.toFixed(1)} kPa)`);
  }

  // Air Quality AQI / CO2
  if (env.airQualityAQI > 120 || env.co2Level > 1400) {
    envScore += 30;
    anomalies.push(`Toxic Atmosphere Index (AQI ${env.airQualityAQI}, CO2 ${env.co2Level} ppm)`);
  }

  // Clamp individual scores 0-100
  healthScore = Math.min(100, healthScore);
  envScore = Math.min(100, envScore);

  // 3. Multi-Sensor Cross-Correlated Fusion
  // When BOTH astronaut vitals AND cabin environment display coincident degradation:
  let fusionMultiplier = 1.0;
  const fireCorrelation = env.smokeDensity > 0.20 && env.cabinTemperature > 26.0 && vitals.heartRate > 95;
  const hypoxiaPressureCorrelation = env.cabinPressure < 97.0 && vitals.spO2 < 95;

  if (fireCorrelation) {
    fusionMultiplier = 1.35;
    explanations.push(
      'CORRELATED ENVIRONMENTAL ANOMALY: Simulated cabin temperature and smoke readings crossed configured demo thresholds while the heart-rate signal was elevated. These signals do not confirm an onboard fire or diagnose a person.'
    );
  } else if (hypoxiaPressureCorrelation) {
    fusionMultiplier = 1.25;
    explanations.push(
      'CORRELATED DEMO PATTERN: Cabin pressure and SpO2 signals both crossed configured demo thresholds. These synthetic readings do not confirm a real leak or diagnose a person.'
    );
  }

  const rawCombined = (healthScore * 0.45 + envScore * 0.55) * fusionMultiplier;
  const overallScore = Math.min(100, Math.round(rawCombined));

  // Determine Categorical Risk
  let overallRisk: RiskLevel = 'NORMAL';
  if (overallScore >= 60 || envScore >= 70 || healthScore >= 70 || fireCorrelation) {
    overallRisk = 'CRITICAL';
  } else if (overallScore >= 25 || envScore >= 35 || healthScore >= 35) {
    overallRisk = 'WARNING';
  }

  // Confidence estimation based on signal consensus
  const anomalyConfidence = anomalies.length > 0
    ? Math.min(99.2, +(82.0 + anomalies.length * 3.8).toFixed(1))
    : 98.5;

  let primaryAnomaly = 'All systems nominal';
  let recommendedAction = 'Maintain routine orbital monitoring cycle.';

  if (overallRisk === 'CRITICAL') {
    primaryAnomaly = fireCorrelation
      ? 'CRITICAL: Correlated simulated environmental anomaly'
      : anomalies[0] || 'CRITICAL: Multi-subsystem excursion';
    recommendedAction = fireCorrelation
      ? 'Verify smoke, temperature, and air-quality channels independently, then consult the applicable verified mission-approved response checklist. This prototype does not issue spacecraft commands.'
      : 'Request qualified mission-control review and consult verified mission-approved guidance. This prototype does not issue spacecraft commands.';
  } else if (overallRisk === 'WARNING') {
    primaryAnomaly = anomalies[0] || 'WARNING: Telemetry variance detected';
    recommendedAction = 'Recheck the relevant sensor and recent trend, review sensor health, and consult qualified personnel or approved guidance as appropriate.';
  }

  const explanation = explanations.length > 0
    ? explanations.join(' ')
    : anomalies.length > 0
    ? `Elevated risk triggered by: ${anomalies.join(', ')}.`
    : 'Supplied synthetic readings are within this prototype’s configured demo thresholds. This is not evidence of operational safety or medical fitness.';

  return {
    overallRisk,
    overallScore,
    healthRiskScore: Math.round(healthScore),
    environmentalRiskScore: Math.round(envScore),
    anomalyConfidence,
    primaryAnomaly,
    explanation,
    recommendedAction,
    lastUpdated: new Date().toLocaleTimeString(),
  };
}
