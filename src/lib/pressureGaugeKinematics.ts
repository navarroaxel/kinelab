import type {
  PressureGaugeDerived,
  PressureGaugeParams,
} from "@/types/simulator";

// ---------------------------------------------------------------------------
// An undamped (ζ = 0) spring-mass gauge over-reads a harmonically pulsing
// pressure by a fraction ε = 1/(1−r²) − 1 = r²/(1−r²). Capping ε caps r, and
// r = ω/ω₀ = ω·√(M/k) caps the piston mass M for a given k and pulsation ω:
//
//   r² ≤ ε/(1+ε)   ⟹   M ≤ k·r²/ω² = k·ε / [ω²·(1+ε)]
//
// The more memorable form of the same design rule is the frequency margin
// ω₀/ω = √[(1+ε)/ε] the gauge's own natural frequency needs over the
// pulsation it measures — the same instrument run at r ≫ 1 instead is an
// accelerometer/seismograph.
// ---------------------------------------------------------------------------

export function computeDerived(
  params: PressureGaugeParams,
): PressureGaugeDerived {
  const { stiffness: k, cyclesPerMinute, errorLimit: eps } = params;

  if (k <= 0 || cyclesPerMinute <= 0 || eps <= 0) {
    throw new RangeError(
      "stiffness, cyclesPerMinute, and errorLimit must all be positive",
    );
  }

  const omega = (cyclesPerMinute * 2 * Math.PI) / 60;
  const rMax = Math.sqrt(eps / (1 + eps));
  const maxMass = (k * eps) / (omega * omega * (1 + eps));
  const frequencyRatioRequired = Math.sqrt((1 + eps) / eps);
  const requiredNaturalFrequency = omega * frequencyRatioRequired;

  return {
    omega,
    rMax,
    maxMass,
    requiredNaturalFrequency,
    frequencyRatioRequired,
  };
}

/** ε(r) = r²/(1−r²) for ζ = 0 — the reading-error curve, undefined at r = 1. */
export function errorAt(r: number): number {
  return (r * r) / (1 - r * r);
}
