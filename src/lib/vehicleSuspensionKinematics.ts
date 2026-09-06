import type {
  VehicleSuspensionDerived,
  VehicleSuspensionParams,
} from "@/types/simulator";
import { transmissibility as transmissibilityOf } from "@/lib/vibrationTransmissibility";

export const G = 9.81; // m/s²

/**
 * Base excitation of a damped single-degree-of-freedom system: the platform
 * moves as y(t) = Y0·sin(ωt) and drags the mass through the springs and
 * dampers. Because the CG sits at the centroid of the 4 wheels, the motion
 * stays pure vertical translation (no rocking), so the 4 springs/dampers
 * collapse into one equivalent spring/damper — k_eq = springCount·k,
 * c_eq = damperCount·c — and the whole car is an ordinary SDOF base-
 * excitation problem.
 */
export function computeDerived(
  params: VehicleSuspensionParams,
  g = G,
): VehicleSuspensionDerived {
  const {
    vehicleMass: m,
    springCount,
    staticDeflection,
    damperCount,
    dampingPerDamper,
    frequencyRatio: r,
  } = params;

  // Guard against non-physical inputs (zero/negative mass, deflection, or
  // counts) producing division-by-zero or NaN — sliders already keep these
  // positive, but the module is also called directly (e.g. from tests).
  if (m <= 0 || staticDeflection <= 0 || springCount <= 0 || damperCount <= 0) {
    throw new RangeError(
      "vehicleMass, staticDeflection, springCount, and damperCount must all be positive",
    );
  }

  const springStiffness = (m * g) / (springCount * staticDeflection);
  const equivalentStiffness = springCount * springStiffness;
  const equivalentDamping = damperCount * dampingPerDamper;

  const naturalFrequency = Math.sqrt(equivalentStiffness / m);
  const dampingRatio =
    equivalentDamping / (2 * Math.sqrt(equivalentStiffness * m));

  const excitationFrequency = r * naturalFrequency;

  // Base motion appears as an effective forcing c·Y0·ω·cos(ωt) + k·Y0·sin(ωt)
  // = F0·sin(ωt + ψ), with tan ψ = cω/k = 2ζr.
  const basePhase = Math.atan(2 * dampingRatio * r);

  // Standard forced-response phase (relative to that forcing), tan φ =
  // cω/(k − mω²) = 2ζr/(1 − r²); atan2 keeps φ in (0, π) through resonance.
  const responsePhase = Math.atan2(
    2 * dampingRatio * r,
    1 - r * r,
  );

  const phaseLag = responsePhase - basePhase;

  const transmissibility = transmissibilityOf(r, dampingRatio);

  const responseAmplitude = transmissibility * params.excitationAmplitude;

  return {
    springStiffness,
    equivalentStiffness,
    equivalentDamping,
    naturalFrequency,
    dampingRatio,
    excitationFrequency,
    transmissibility,
    responseAmplitude,
    basePhase,
    responsePhase,
    phaseLag,
  };
}

export function platformDisplacementAt(
  t: number,
  params: VehicleSuspensionParams,
  derived: VehicleSuspensionDerived,
): number {
  return params.excitationAmplitude * Math.sin(derived.excitationFrequency * t);
}

export function vehicleDisplacementAt(
  t: number,
  derived: VehicleSuspensionDerived,
): number {
  return (
    derived.responseAmplitude *
    Math.sin(derived.excitationFrequency * t - derived.phaseLag)
  );
}
