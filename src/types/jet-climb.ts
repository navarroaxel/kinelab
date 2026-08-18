// ---------------------------------------------------------------------------
// Jet aircraft: climb to level flight (/jet-climb) — core simulator.
// Variable-mass-flow propulsion (steady thrust) + quadratic aerodynamic drag.
// ---------------------------------------------------------------------------

export interface JetClimbParams {
  massMg: number; // Mg, aircraft mass, default 16
  climbAngleDeg: number; // deg, climb angle above horizontal, default 18
  climbSpeedKmh: number; // km/h, constant speed held during the climb, default 774
  massFlowRate: number; // kg/s, air ingested by the engines, default 300
  exhaustVelocity: number; // m/s, exhaust speed relative to the aircraft, default 665
}

export interface JetClimbVisibility {
  showVectors: boolean; // thrust / drag arrows on the aircraft
  showSpeedLines: boolean; // scrolling background speed lines
}

export interface JetClimbState {
  thrust: number; // N, steady thrust from the engines, T = ṁ·v_rel
  v0: number; // m/s, climb speed (also the level-flight starting speed)
  weightAlongPath: number; // N, m·g·sin θ — the component balanced by drag during the climb
  drag0: number; // N, drag at v0 (equals T − weightAlongPath during the climb)
  dragCoeff: number; // N·s²/m², k in D = k·v²
  initialAccel: number; // m/s², acceleration the instant level flight begins
  vMax: number; // m/s, terminal horizontal speed, T = k·v_max²
  timeConstant: number; // 1/s, rate constant λ = √(T·k)/m in v(t) = v_max·tanh(λt + c₀)
}

export interface JetClimbSample {
  t: number; // s, elapsed time since leveling off
  v: number; // m/s, horizontal speed at t
  a: number; // m/s², horizontal acceleration at t
}
