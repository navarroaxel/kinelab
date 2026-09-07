// ---------------------------------------------------------------------------
// Mechanical Vibrations — VIB 1, Rotating unbalance (/mechanical-vibrations/rotating-unbalance)
// A motor on 4 springs, shaken by its own rotor's unbalance.
// ---------------------------------------------------------------------------

export interface RotatingUnbalanceParams {
  motorMass: number; // kg, M, default 25
  springCount: number; // number of identical springs, default 4
  springStiffness: number; // N/m, k per spring, default 196000 (1960 N/cm)
  unbalanceMass: number; // kg, m, default 0.03
  eccentricity: number; // m, e, default 0.15 (15 cm)
  rpm: number; // n, rotor speed, default 1500
  dampingRatio: number; // ζ, default 0
}

export interface RotatingUnbalanceDerived {
  stiffness: number; // N/m, k = springCount·springStiffness
  naturalFrequency: number; // rad/s, ω₀ = √(k/M)
  omega: number; // rad/s, ω = rpm·2π/60
  frequencyRatio: number; // r = ω/ω₀
  forceAmplitude: number; // N, F₀ = m·e·ω²
  staticEquivalent: number; // m, F₀/k — what F₀ would deflect the springs statically
  asymptote: number; // m, m·e/M — the amplitude as r → ∞
  amplitude: number; // m, x_M = asymptote·r²/D
  phase: number; // rad, φ = atan2(2ζr, 1−r²)
  peakR: number | null; // r at the peak, null when ζ ≥ 1/√2 (no interior peak)
  peakValue: number | null; // m, amplitude at peakR
  nearResonance: boolean; // |r − 1| < 0.1
  isSingularResonance: boolean; // ζ = 0 exactly at r = 1 — amplitude is unbounded (Infinity)
}

export interface RotatingUnbalanceState extends RotatingUnbalanceDerived {
  t: number; // s, elapsed simulation time
  displacement: number; // m, x(t) — steady-state motor displacement
  rotorAngle: number; // rad, ω·t mod 2π — unbalance dot position on the rotor
}
