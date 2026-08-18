// ---------------------------------------------------------------------------
// Helicopter hover lift (/helicopter-lift) — core simulator.
// Hibbeler, Engineering Mechanics: Dynamics — steady flow of a fluid stream.
// ---------------------------------------------------------------------------

export interface HelicopterLiftParams {
  exhaustVelocity: number; // ft/s, downwash speed through the wake, default 80
  wakeDiameter: number; // ft, diameter of the wake column, default 30
  heliWeight: number; // lb, weight of the helicopter + crew, default 3500
  airDensity: number; // lb/ft³, weight density of air, default 0.076
}

export interface HelicopterLiftVisibility {
  showAirflow: boolean; // animated downwash streaks through the wake column
  showForces: boolean; // thrust (up) and weight (down) vectors at the rotor
}

export interface HelicopterLiftState {
  wakeArea: number; // ft², cross-section of the wake column
  massFlowRate: number; // slug/s, mass rate of air through the wake
  thrust: number; // lb, upward force the rotor exerts on the air's reaction
  maxLoad: number; // lb, thrust minus the helicopter's own weight
}
