// ---------------------------------------------------------------------------
// PD 9 — Two blocks linked by a 1:1 pulley, one on an incline, one on the
// flat with an applied force at angle θ (/particle-dynamics/pulley-friction)
// ---------------------------------------------------------------------------

export interface PulleyFrictionParams {
  weightA: number; // N, block A's weight (on the flat), default 1000
  weightB: number; // N, block B's weight (on the incline), default 200
  frictionCoefficient: number; // μ, same for both blocks, default 0.25
  inclineAngle: number; // deg, incline under block B, default 37
  pullAngle: number; // deg, angle of F above the horizontal on block A, default 20
}

export interface PulleyFrictionVisibility {
  showBlocks: boolean;
  showForceSweep: boolean;
}

export interface PulleyFrictionState {
  cableTension: number; // N, T — required to drag B up the incline at constant speed
  appliedForce: number; // N, F(θ) at the current pullAngle
  optimalAngle: number; // deg, θ that minimizes F
  minimumForce: number; // N, F at the optimal angle
}
