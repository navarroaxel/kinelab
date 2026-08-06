// ---------------------------------------------------------------------------
// Vertical ring simulator (/ring)
// ---------------------------------------------------------------------------

export interface RingParams {
  radius: number; // ring radius R in world units, range [60, 130]
  gravity: number; // g in world units/s², range [50, 400], default 200
  initialSpeed: number; // v₀ at the bottom in world units/s, range [0, 600]
}

export interface RingVisibility {
  showWeight: boolean; // weight vector mg
  showNormal: boolean; // normal force vector N
  showVelocity: boolean; // velocity tangent vector
  showEnergyBar: boolean; // KE/PE stacked bar
  showTrace: boolean; // particle trail
  showCriticalMark: boolean; // highlight the v_min threshold
}

export interface RingKinematicState {
  theta: number; // current angle from bottom (rad), CCW positive
  thetaDot: number; // angular velocity (rad/s)
  v: number; // speed = R·|θ̇|
  N: number; // normal force magnitude (negative ⇒ lost contact)
  h: number; // height above bottom = R·(1 − cos θ)
  KE: number; // kinetic energy = ½·v²        (mass normalised to 1)
  PE: number; // potential energy = g·h        (mass normalised to 1)
  px: number; // particle world X
  py: number; // particle world Y
  hasContact: boolean; // N ≥ 0
}

export interface RingSample {
  t: number; // elapsed simulation time (s)
  KE: number; // kinetic energy at t (per unit mass)
  PE: number; // potential energy at t (per unit mass)
}
