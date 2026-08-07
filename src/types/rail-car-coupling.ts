// ---------------------------------------------------------------------------
// PD 13 — Rail car coupling (/particle-dynamics/rail-car-coupling)
// ---------------------------------------------------------------------------

export interface RailCarCouplingParams {
  mass1: number; // kg, moving car, default 40000 (40 t)
  mass2: number; // kg, stationary car, default 60000 (60 t)
  speed1Kmh: number; // km/h, mass1's speed before coupling, default 2
  couplingTime: number; // s, duration of the coupling impact, default 3
}

export interface RailCarCouplingVisibility {
  showForces: boolean; // impulsive-force arrows during coupling
  showVelocityLabels: boolean; // live v1(t) / v2(t) readouts
}

export interface RailCarCouplingState {
  speed1: number; // m/s, mass1's speed before coupling
  finalSpeed: number; // m/s, common speed after coupling
  impulse: number; // N·s, magnitude of the impulse exchanged
  avgForce: number; // N, magnitude of the mean impulsive force on each car
}
