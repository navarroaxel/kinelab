// ---------------------------------------------------------------------------
// PD 12 — Escalator motor efficiency (/particle-dynamics/escalator)
// ---------------------------------------------------------------------------

export interface EscalatorParams {
  voltage: number; // V, line-to-line RMS, three-phase supply, default 380
  lineCurrent: number; // A, RMS per line at full load, default 5.365
  powerFactor: number; // cos φ from the motor nameplate, range [0.5, 1], default 0.9
  numPeople: number; // passengers carried per trip, range [1, 30], default 30
  personMass: number; // kg, average passenger mass, default 75
  height: number; // m, vertical rise, default 7
  liftTime: number; // s, time to carry the load up, default 60
}

export interface EscalatorVisibility {
  showPassengers: boolean; // riders on the belt
  showPowerFlow: boolean; // P_elec in / P_mech out arrows at the motor
}

export interface EscalatorState {
  electricalPower: number; // W, three-phase input power drawn from the line
  mechanicalPower: number; // W, useful power delivered to lift the passengers
  efficiency: number; // mechanicalPower / electricalPower, 0..1
  climbSpeed: number; // m/s, vertical rise rate (height / liftTime)
  workOutput: number; // J, total work done lifting all passengers
}
