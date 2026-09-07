// ---------------------------------------------------------------------------
// Mechanical Vibrations — VIB 5, Pressure gauge design
// (/mechanical-vibrations/pressure-gauge)
// Undamped (ζ = 0) design problem: find the maximum piston mass that keeps
// the reading error under a limit at a given excitation frequency.
// ---------------------------------------------------------------------------

export interface PressureGaugeParams {
  stiffness: number; // N/m, k, default 17500 (175 N/cm)
  cyclesPerMinute: number; // pressure pulsation rate, default 600
  errorLimit: number; // ε, fractional reading error allowed, default 0.02 (2 %)
}

export interface PressureGaugeDerived {
  omega: number; // rad/s, ω = cyclesPerMinute·2π/60
  rMax: number; // r = √[ε/(1+ε)] — the largest frequency ratio the error limit allows
  maxMass: number; // kg, M ≤ k·r²/ω² = k·ε / [ω²·(1+ε)]
  requiredNaturalFrequency: number; // rad/s, ω₀ at M = maxMass
  frequencyRatioRequired: number; // ω₀/ω = √[(1+ε)/ε] — the actual design rule
}
