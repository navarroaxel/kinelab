// ---------------------------------------------------------------------------
// Core — Banked curve with friction (/banked-curve)
// Hibbeler 13-53 / 13-54 — maximum and minimum speed on a banked track
// ---------------------------------------------------------------------------

export interface BankedCurveParams {
  mass: number; // kg, default 1700
  bankDeg: number; // deg, track bank angle θ, default 20
  radius: number; // m, radius of curvature ρ, default 100
  mu: number; // static friction coefficient, default 0.2
  gravity: number; // m/s², default 9.81
  speed: number; // m/s, the constant speed the car is driving at
}

export interface BankedCurveVisibility {
  showForces: boolean; // N, W and the friction arrow at the car
  showNet: boolean; // the resultant m·v²/ρ pointing at the centre
  showTrack: boolean; // the banked road surface
  showPath: boolean; // the car's circular path and the radius line
  showAxes: boolean; // vertical axis through the centre
}

/** Speed limits for a given track; both are independent of the mass. */
export interface BankedCurveLimits {
  idealSpeed: number; // m/s, the speed that needs no friction at all
  minSpeed: number; // m/s, 0 when μ ≥ tan θ (the car can simply stand still)
  maxSpeed: number | null; // m/s, null when μ ≥ cot θ (no upper limit exists)
}

/** The car's force balance at one particular speed. */
export interface BankedCurveState {
  speed: number; // m/s
  normal: number; // N, always positive
  friction: number; // N, signed — positive means friction acts *down* the slope
  muRequired: number; // |friction| / normal
  netForce: number; // N, m·v²/ρ toward the centre
  slipping: boolean; // |muRequired| > μ
  slipsUphill: boolean; // which way it would let go: outward/up or inward/down
  azimuth: number; // rad, where the car currently is on the circle
}
