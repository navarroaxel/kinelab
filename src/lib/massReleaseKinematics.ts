import type {
  MassReleaseDerived,
  MassReleaseParams,
  MassReleaseRegime,
} from "@/types/simulator";
import { dampingRatioFrom } from "@/lib/vibrationTransmissibility";

export const G = 9.81; // m/s²

// ---------------------------------------------------------------------------
// M₂ hangs alongside M₁ from a spring; at t = 0, M₂ is suddenly removed.
// Neither position nor velocity can jump, so relative to the NEW equilibrium
// (where M₁ alone balances the spring), the initial condition is x(0) = x₀,
// ẋ(0) = 0, with x₀ = M₂·g/k — independent of M₁, since removing M₂ shifts
// the equilibrium by exactly the deflection M₂'s own weight used to add.
// From there it's M₁ẍ + cẋ + kx = 0, free vibration, split into the usual
// three regimes by the discriminant — see forcedVibrationKinematics for why
// that split (rather than one closed form) is unavoidable.
// ---------------------------------------------------------------------------

export function computeDerived(
  params: MassReleaseParams,
  g = G,
): MassReleaseDerived {
  const {
    hangingMass: M2,
    remainingMass: M1,
    stiffness: k,
    damping: c,
  } = params;

  if (M1 <= 0 || M2 <= 0 || k <= 0 || c < 0) {
    throw new RangeError(
      "hangingMass, remainingMass, and stiffness must be positive, and damping must be non-negative",
    );
  }

  const x0 = (M2 * g) / k;
  const naturalFrequency = Math.sqrt(k / M1);
  const dampingRatio = dampingRatioFrom(c, k, M1);

  const regime: MassReleaseRegime =
    dampingRatio === 0
      ? "undamped"
      : dampingRatio < 1
        ? "underdamped"
        : dampingRatio === 1
          ? "critical"
          : "overdamped";

  let dampedOmega: number | null = null;
  let s1: number | null = null;
  let s2: number | null = null;
  let A1: number | null = null;
  let A2: number | null = null;

  if (regime === "undamped" || regime === "underdamped") {
    dampedOmega = naturalFrequency * Math.sqrt(1 - dampingRatio * dampingRatio);
  } else {
    // Real roots of M1·s² + c·s + k = 0. s1 is the "+" root — closer to
    // zero, so it decays slower and dominates the long-term response; s2 is
    // the "−" root, decaying away almost immediately.
    const discriminant = c * c - 4 * M1 * k;
    const sqrtDiscriminant = Math.sqrt(Math.max(discriminant, 0));
    s1 = (-c + sqrtDiscriminant) / (2 * M1);
    s2 = (-c - sqrtDiscriminant) / (2 * M1);

    if (regime === "overdamped") {
      A1 = (x0 * s2) / (s2 - s1);
      A2 = x0 - A1;
    }
  }

  const slackThreshold = (M1 * g) / k;
  // Slack requires the motion to actually swing back past the threshold.
  // Critical/overdamped release from rest is provably monotonic — it decays
  // from x0 straight to 0 without ever crossing back through it — so no
  // amount of x0 exceeding the threshold can produce real slack there.
  //
  // For the oscillatory regimes, x0 > slackThreshold is necessary but not
  // sufficient: an underdamped swing decays, so the first trough may never
  // reach -x0. Because ẋ(0) = 0 exactly, t = 0 is itself an extremum, which
  // forces every later extremum to land at t_n = n·π/ωd exactly (independent
  // of the phase) — so the first trough (n = 1) has an exact closed form:
  // |x(π/ωd)| = x0·e^(−ζω0·π/ωd) = x0·e^(−πζ/√(1−ζ²)), which reduces to x0
  // itself at ζ = 0 (undamped). Slack occurs iff that magnitude — not the
  // raw x0 — exceeds the threshold.
  const firstTroughMagnitude =
    regime === "undamped" || regime === "underdamped"
      ? x0 *
        Math.exp(
          (-Math.PI * dampingRatio) / Math.sqrt(1 - dampingRatio * dampingRatio),
        )
      : 0;
  const slack =
    (regime === "undamped" || regime === "underdamped") &&
    firstTroughMagnitude > slackThreshold;

  const tauSlow =
    regime === "undamped"
      ? Infinity
      : regime === "underdamped"
        ? 1 / (dampingRatio * naturalFrequency)
        : 1 / Math.abs(s1!);
  const settlingTime = regime === "undamped" ? Infinity : 4 * tauSlow;

  const period = regime === "undamped" ? (2 * Math.PI) / naturalFrequency : null;
  const frequency = period !== null ? 1 / period : null;
  const vMax = regime === "undamped" ? x0 * naturalFrequency : null;
  const aMax =
    regime === "undamped" ? x0 * naturalFrequency * naturalFrequency : null;

  return {
    x0,
    naturalFrequency,
    dampingRatio,
    regime,
    dampedOmega,
    s1,
    s2,
    A1,
    A2,
    slackThreshold,
    slack,
    tauSlow,
    settlingTime,
    period,
    frequency,
    vMax,
    aMax,
  };
}

/**
 * x(t), the displacement from the new equilibrium. Three closed forms, one
 * per regime — undamped and underdamped share a formula (it reduces exactly
 * to x₀·cos(ω₀t) at ζ = 0, since the sin term's own coefficient vanishes);
 * critical is guarded separately since the general overdamped formula
 * divides by s2 − s1 = 0 there.
 */
export function displacementAt(t: number, derived: MassReleaseDerived): number {
  const { x0, naturalFrequency: w0, dampingRatio: zeta, regime } = derived;

  if (regime === "undamped" || regime === "underdamped") {
    const wd = derived.dampedOmega!;
    return (
      Math.exp(-zeta * w0 * t) *
      (x0 * Math.cos(wd * t) + ((zeta * w0 * x0) / wd) * Math.sin(wd * t))
    );
  }

  if (regime === "critical") {
    return x0 * (1 + w0 * t) * Math.exp(-w0 * t);
  }

  // overdamped
  return (
    derived.A1! * Math.exp(derived.s1! * t) +
    derived.A2! * Math.exp(derived.s2! * t)
  );
}
