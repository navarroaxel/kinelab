// ---------------------------------------------------------------------------
// Core — Rotating bar driving an oscillating bar (/oscillating-bar)
// Bar OA turns at constant ω; pin A slides freely along bar BC.
// ---------------------------------------------------------------------------

export interface OscillatingBarParams {
  barLength: number; // m, OA = b, default 1
  separation: number; // m, OB, default 2 (= 2b)
  omega: number; // rad/s, constant angular velocity of OA, default 3
  targetThetaDeg: number; // deg, the θ the statement asks about, default 20
}

export interface OscillatingBarVisibility {
  showVelocity: boolean; // v_A, perpendicular to OA
  showVelocityParts: boolean; // ṙ along BC and r·θ̇ across it
  showAccel: boolean; // a_A, centripetal toward O
  showAccelParts: boolean; // Euler, centripetal, Coriolis and relative terms
  showAngles: boolean; // the θ and ω arcs, and the OB baseline
  showTrace: boolean; // the circle A sweeps
}

/** The mechanism at one crank angle. */
export interface OscillatingBarState {
  crankAngle: number; // rad, φ — position of OA, measured CCW from +x
  barAngle: number; // rad, θ — inclination of BC at B, as the figure marks it
  ax: number; // m, position of the pin
  ay: number;
  reach: number; // m, r = |BA|
  reachRate: number; // m/s, ṙ — how fast the pin slides along BC
  reachAccel: number; // m/s², r̈
  thetaRate: number; // rad/s, θ̇ — how fast the inclination grows
  thetaAccel: number; // rad/s², θ̈
  barOmega: number; // rad/s, angular velocity of BC, CCW positive (= −θ̇)
  barAlpha: number; // rad/s², angular acceleration of BC, CCW positive
  pinSpeed: number; // m/s, |v_A| = b·ω
  pinAccel: number; // m/s², |a_A| = b·ω²
}

/** Swing limits of BC — it can only reach ±asin(b/OB). */
export interface OscillatingBarLimits {
  maxBarAngle: number; // rad
  reachable: boolean; // whether the statement's θ can be attained at all
}
