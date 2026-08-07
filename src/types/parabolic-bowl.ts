// ---------------------------------------------------------------------------
// PD 5 — Sphere on a parabolic track (/particle-dynamics/parabolic-bowl)
// ---------------------------------------------------------------------------

export interface ParabolicBowlParams {
  sphereMass: number; // kg, default 1
  sag: number; // m, "flecha" H — vertical drop from the supports to the vertex, default 2
  span: number; // m, "vano" L — horizontal distance between the two supports, default 6
  gLimit: number; // design limit at the vertex, in units of g, default 4
}

export interface ParabolicBowlVisibility {
  showSphere: boolean; // the moving sphere + track
  showNormalForce: boolean; // N arrow at the sphere's current position
}

export interface ParabolicBowlState {
  bottomAcceleration: number; // m/s², a_n at the vertex — the quantity the design limit constrains
  bottomAccelerationInGs: number; // bottomAcceleration / g
  normalForceAtBottom: number; // N, N(0) = m·g·(1 + 16H²/L²)
  minSpanForLimit: number; // m, smallest span L that keeps the vertex within gLimit·g, for the current sag
  exceedsLimit: boolean; // bottomAccelerationInGs > gLimit — this span/sag combo fails the design check
}
