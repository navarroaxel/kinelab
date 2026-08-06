// ---------------------------------------------------------------------------
// PK 3 — Skater on a parabolic profile (/particle-kinematics/parabolic-track)
// ---------------------------------------------------------------------------

export interface ParabolicTrackParams {
  coeff: number; // y = coeff·x², default 1/80
  xA: number; // skater position, range [-30, 30], default 10
  v: number; // speed at A, range [0, 30], default 12
  vDot: number; // tangential acceleration a_t = v̇, range [-10, 10], default 4
}

export interface ParabolicTrackVisibility {
  showOsculatingCircle: boolean;
  showVelocity: boolean;
  showAcceleration: boolean; // a_t, a_n, and their resultant a
  showParallelogram: boolean;
}

export interface ParabolicTrackState {
  x: number;
  y: number; // track height at x
  slope: number; // y' = dy/dx
  curvature2nd: number; // y'' (constant for a parabola)
  Rc: number; // radius of curvature
  at: number; // tangential acceleration (= v̇, given)
  an: number; // normal acceleration = v²/Rc
  a: number; // |a| = √(at² + an²)
  betaDeg: number; // angle of a from the tangent, degrees
  centerX: number; // osculating circle centre
  centerY: number;
}
