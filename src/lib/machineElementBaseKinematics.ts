import type {
  MachineElementBaseDerived,
  MachineElementBaseParams,
} from "@/types/simulator";
import {
  dampingRatioFrom,
  transmissibility as transmissibilityOf,
} from "@/lib/vibrationTransmissibility";

// ---------------------------------------------------------------------------
// The same base-excitation transmissibility as vehicle suspension (MV 2), but
// k comes directly from springCount·springStiffness rather than a static
// deflection, and the whole point is the operating point: r = 0.536 sits well
// below the r = √2 isolation crossover, so — unlike an isolation problem —
// adding damping here actually *shrinks* the response (4.21 → 3.98 mm).
// ---------------------------------------------------------------------------

export function computeDerived(
  params: MachineElementBaseParams,
): MachineElementBaseDerived {
  const {
    mass: M,
    springCount,
    springStiffness,
    damping: c,
    supportAmplitude: yM,
    supportOmega: omega,
  } = params;

  if (
    M <= 0 ||
    springCount <= 0 ||
    springStiffness <= 0 ||
    c < 0 ||
    yM <= 0 ||
    omega < 0
  ) {
    throw new RangeError(
      "mass, springCount, springStiffness, and supportAmplitude must be positive, and damping/supportOmega must be non-negative",
    );
  }

  const stiffness = springCount * springStiffness;
  const naturalFrequency = Math.sqrt(stiffness / M);
  const dampingRatio = dampingRatioFrom(c, stiffness, M);
  const frequencyRatio = omega / naturalFrequency;

  const transmissibility = transmissibilityOf(frequencyRatio, dampingRatio);
  const amplitude = transmissibility * yM;
  const undampedAmplitude =
    yM / Math.abs(1 - frequencyRatio * frequencyRatio);

  // Base motion appears as an effective forcing c·yM·ω·cos(ωt) + k·yM·sin(ωt)
  // = F0·sin(ωt + ψ), with tan ψ = cω/k = 2ζr — the same decomposition as
  // vehicleSuspensionKinematics.
  const basePhase = Math.atan(2 * dampingRatio * frequencyRatio);
  const responsePhase = Math.atan2(
    2 * dampingRatio * frequencyRatio,
    1 - frequencyRatio * frequencyRatio,
  );
  const phaseLag = responsePhase - basePhase;

  return {
    stiffness,
    naturalFrequency,
    dampingRatio,
    frequencyRatio,
    transmissibility,
    amplitude,
    undampedAmplitude,
    basePhase,
    responsePhase,
    phaseLag,
  };
}

/** The support's own motion S(t) = y_M·sin(ω·t). */
export function supportDisplacementAt(
  t: number,
  params: MachineElementBaseParams,
): number {
  return params.supportAmplitude * Math.sin(params.supportOmega * t);
}

/** The element's steady-state response x(t), lagging the support by δ. */
export function elementDisplacementAt(
  t: number,
  params: MachineElementBaseParams,
  derived: MachineElementBaseDerived,
): number {
  return (
    derived.amplitude *
    Math.sin(params.supportOmega * t - derived.phaseLag)
  );
}
