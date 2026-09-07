// ---------------------------------------------------------------------------
// Mechanical Vibrations — VIB 3, Vibration isolation (inverse problem)
// (/mechanical-vibrations/vibration-isolation)
// Given a target transmissibility, solve backwards for the frequency ratio.
// ---------------------------------------------------------------------------

export interface VibrationIsolationParams {
  mass: number; // kg, M, default 230
  stiffness: number; // N/m, k, default 519400 (5194 N/cm)
  dampingRatio: number; // ζ, default 0.20
  targetTransmissibility: number; // T, default 0.20 (20 % transmitted)
}

/**
 * "solved" — a unique r ≥ r_peak satisfies T(r) = target.
 * "reachable_everywhere" — target ≥ the curve's own peak, so T(r) ≤ target
 * at every r already; there is no single critical frequency to report.
 * "unattainable" — the quadratic in u = r² has no positive real root.
 */
export type VibrationIsolationStatus =
  | "solved"
  | "reachable_everywhere"
  | "unattainable";

export interface VibrationIsolationDerived {
  naturalFrequency: number; // rad/s, ω₀ = √(k/M)
  peakTransmissibility: number; // the curve's own maximum, transmissibilityPeak(ζ).value
  status: VibrationIsolationStatus;
  frequencyRatio: number | null; // r, null unless status === "solved"
  omega: number | null; // rad/s, ω = r·ω₀
  rpm: number | null; // ω in rev/min
  transmissibilityCheck: number | null; // T(r) recomputed forward, ≈ target
  undampedR: number; // r for the same target at ζ = 0, always defined for target > 0
}
