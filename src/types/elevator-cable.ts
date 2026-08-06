// ---------------------------------------------------------------------------
// CPM 10 — Elevator and pulley (/particle-kinematics/elevator-cable)
// ---------------------------------------------------------------------------

export interface ElevatorCableParams {
  b: number; // horizontal offset A–B, m, range [1, 20], default 10
  v0: number; // constant cable unwind speed at drum C, m/s, range [0.1, 5], default 2
  x0: number; // initial horizontal position, m, range [0, 10], default 0 — the singularity at x0 = 0 is intentionally reachable
}

export interface ElevatorCableVisibility {
  showVelocity: boolean;
  showDrum: boolean;
  showTrace: boolean;
}

export interface ElevatorCableState {
  t: number; // time since t0 (the instant the car was at x0), s
  x: number; // horizontal position, m
  xDot: number; // ẋ, m/s
  xDDot: number; // ẍ, m/s²
  singular: boolean; // true only at the very first frame when x0 = 0 (ẋ → ∞)
}
