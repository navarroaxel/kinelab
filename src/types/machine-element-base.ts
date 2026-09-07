// ---------------------------------------------------------------------------
// Mechanical Vibrations — VIB 4, Machine element on a moving support
// (/mechanical-vibrations/machine-element-base)
// A damped element riding a support that oscillates below resonance.
// ---------------------------------------------------------------------------

export interface MachineElementBaseParams {
  mass: number; // kg, M, default 400
  springCount: number; // number of identical springs, default 2
  springStiffness: number; // N/m, k per spring, default 39200 (392 N/cm)
  damping: number; // N·s/m, total damping c, default 3920 (39.2 N·s/cm)
  supportAmplitude: number; // m, y_M, default 0.003 (3 mm)
  supportOmega: number; // rad/s, ω of the support motion, default 7.5
}

export interface MachineElementBaseDerived {
  stiffness: number; // N/m, k = springCount·springStiffness
  naturalFrequency: number; // rad/s, ω₀ = √(k/M)
  dampingRatio: number; // ζ = c/(2√(kM))
  frequencyRatio: number; // r = ω/ω₀
  transmissibility: number; // T = X_M/y_M
  amplitude: number; // m, X_M = T·y_M
  undampedAmplitude: number; // m, y_M/|1 − r²| — the c = 0 comparison
  basePhase: number; // rad, ψ — phase of the base-motion forcing term
  responsePhase: number; // rad, φ — phase of the response relative to that forcing
  phaseLag: number; // rad, δ = φ − ψ, lag of the element behind the support
  isSingularResonance: boolean; // ζ = 0 exactly at r = 1 — amplitude is unbounded (Infinity)
}

export interface MachineElementBaseState extends MachineElementBaseDerived {
  t: number; // s, elapsed simulation time
  supportDisplacement: number; // m, S(t)
  elementDisplacement: number; // m, x(t)
}
