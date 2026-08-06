// ---------------------------------------------------------------------------
// PK 7 — Cable, pulleys and blocks (/particle-kinematics/cable-blocks)
// ---------------------------------------------------------------------------

export interface CableBlocksParams {
  aD: number; // motor D's constant acceleration driving block B, m/s², default 5
  cCoeff: number; // coefficient in a_C(t) = cCoeff·t², driving motor C, default 3
  d0: number; // initial gap between A and B, m, default 3
  runsA: number; // number of cable runs on A's side (a_A = a_C / runsA), default 2
}

export interface CableBlocksVisibility {
  showVelocity: boolean;
  showTrace: boolean;
}

export interface CableBlocksState {
  t: number;
  sA: number; // distance travelled by A (m)
  sB: number; // distance travelled by B (m)
  vA: number; // speed of A, rightward positive (m/s)
  vB: number; // speed of B, leftward — reported negative in the rightward-positive convention (m/s)
  d: number; // remaining gap = d0 − sA − sB (m)
  tMeet: number; // time at which the blocks meet (s)
  met: boolean; // t ≥ tMeet
}
