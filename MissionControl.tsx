import React from 'react';
import { MissionControl as MissionControlDashboard } from './MissionControlLegacy';

/**
 * Mission Control route.
 * Renders the React dashboard (simulated telemetry, pause/resume/reset, demo emergency,
 * charts, module viewer, alert acknowledgment). The earlier iframe pointed at an empty
 * /mission-hud folder (missing from the delivered ZIP), which produced a broken page.
 * SIMULATED TELEMETRY / DEMO ENVIRONMENT — not a flight system or medical device.
 */
export function MissionControl() {
  return (
    <div className="hud-mc">
      <MissionControlDashboard />
    </div>
  );
}

export default MissionControl;
