// ---------------------------------------------------------------------------
// PD 4 — Atwood machine (/particle-dynamics/atwood)
// ---------------------------------------------------------------------------

export interface AtwoodParams {
  mass1: number; // kg, lighter side — rises, default 5
  mass2: number; // kg, heavier side — descends, default 8
  pulleyMomentOfInertia: number; // kg·m², I — 0 recovers the massless-pulley textbook case, default 0
  pulleyRadius: number; // m, r — only matters when I > 0, default 0.1
}

export interface AtwoodVisibility {
  showMasses: boolean;
  showForces: boolean;
}

export interface AtwoodState {
  acceleration: number; // m/s², magnitude — positive means m2 descends, m1 rises
  tension1: number; // N, tension on m1's side of the string
  tension2: number; // N, tension on m2's side of the string
}
