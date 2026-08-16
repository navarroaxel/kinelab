// ---------------------------------------------------------------------------
// Core — Forced vibration with viscous damping (/forced-vibration)
// m·ẍ + c·ẋ + k·x = F₀·cos(ω·t)
// ---------------------------------------------------------------------------

export interface ForcedVibrationParams {
  mass: number; // kg, default 10
  stiffness: number; // N/m, default 100000 (100 kN/m)
  damping: number; // N·s/m, default 500
  forceAmplitude: number; // N, F₀, default 1000
  forcingOmega: number; // rad/s, ω of the applied force, default 120
  initialDisplacement: number; // m, x(0), default 0
  initialVelocity: number; // m/s, ẋ(0), default 0
  forceEnabled: boolean; // off leaves the free response alone
  slowMotion: number; // simulation seconds per real second, default 0.05
}

export interface ForcedVibrationVisibility {
  showSpringForce: boolean;
  showDamperForce: boolean;
  showAppliedForce: boolean;
  showEnvelope: boolean; // the ±X band the steady state settles into
  showEquilibrium: boolean; // the static equilibrium line
}

/** Everything that follows from the parameters alone — no time involved. */
export interface ForcedVibrationProperties {
  naturalOmega: number; // rad/s, ωn = √(k/m)
  naturalHz: number; // Hz
  criticalDamping: number; // N·s/m, c_c = 2√(k·m)
  dampingRatio: number; // ζ = c/c_c
  frequencyRatio: number; // r = ω/ωn
  staticDeflection: number; // m, δ_st = F₀/k
  magnification: number; // X/δ_st
  steadyAmplitude: number; // m, X with the current damping
  undampedAmplitude: number; // m, X with c = 0 — Infinity exactly at r = 1
  steadyPhase: number; // rad, in [0, π)
  dampedOmega: number; // rad/s, ωd = ωn√(1−ζ²); 0 once overdamped
  decayRate: number; // 1/s, ζ·ωn — the envelope is e^(−decayRate·t)
  logDecrement: number; // δ, per damped cycle
  regime: "undamped" | "underdamped" | "critical" | "overdamped";
}

/** The system at one instant. */
export interface ForcedVibrationState {
  time: number; // s
  displacement: number; // m
  velocity: number; // m/s
  acceleration: number; // m/s²
  appliedForce: number; // N
  springForce: number; // N, −k·x
  damperForce: number; // N, −c·ẋ
}
