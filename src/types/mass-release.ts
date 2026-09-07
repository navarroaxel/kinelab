// ---------------------------------------------------------------------------
// Mechanical Vibrations — VIB 6 / VIB 7, Release of a hanging mass
// (/mechanical-vibrations/mass-release, VIB 7 via ?preset=mv7)
// M2 hangs from a spring alongside M1 and is removed at t = 0; M1 free-
// vibrates about the new equilibrium. One code path covers all four damping
// regimes — VIB 6 is the undamped case (c = 0), VIB 7 the overdamped one.
// ---------------------------------------------------------------------------

export type MassReleaseRegime =
  | "undamped"
  | "underdamped"
  | "critical"
  | "overdamped";

export interface MassReleaseParams {
  hangingMass: number; // kg, M₂ — removed at t = 0, sets x₀
  remainingMass: number; // kg, M₁ — stays and oscillates
  stiffness: number; // N/m, k
  damping: number; // N·s/m, c — 0 for VIB 6, > 0 for VIB 7
}

export interface MassReleaseDerived {
  x0: number; // m, new-equilibrium amplitude = M₂·g/k
  naturalFrequency: number; // rad/s, ω₀ = √(k/M₁)
  dampingRatio: number; // ζ = c/(2√(k·M₁))
  regime: MassReleaseRegime;
  dampedOmega: number | null; // rad/s, ωd = ω₀√(1−ζ²) — undamped/underdamped only
  s1: number | null; // 1/s, the slower (closer-to-zero) real root — critical/overdamped only
  s2: number | null; // 1/s, the faster (more negative) real root — critical/overdamped only
  A1: number | null; // m, x₀·s2/(s2−s1) — strictly overdamped only (ζ > 1)
  A2: number | null; // m, x₀ − A1 — strictly overdamped only
  slackThreshold: number; // m, M₁·g/k — the spring's own preload deflection
  slack: boolean; // x0 > slackThreshold — the spring would have to push
  tauSlow: number; // s, dominant decay time constant; Infinity when undamped
  settlingTime: number; // s, ≈ 4·tauSlow; Infinity when undamped
  period: number | null; // s, T = 2π/ω₀ — undamped only
  frequency: number | null; // Hz, 1/T — undamped only
  vMax: number | null; // m/s, x0·ω₀ — undamped only
  aMax: number | null; // m/s², x0·ω₀² — undamped only
}

export interface MassReleaseState extends MassReleaseDerived {
  t: number; // s, elapsed simulation time
  displacement: number; // m, x(t) from the new equilibrium
}
