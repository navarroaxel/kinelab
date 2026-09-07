import type {
  VibrationIsolationDerived,
  VibrationIsolationParams,
} from "@/types/simulator";
import {
  transmissibility,
  transmissibilityPeak,
} from "@/lib/vibrationTransmissibility";

// ---------------------------------------------------------------------------
// The only exercise in the section that solves backwards: given a target
// transmissibility T, find the frequency ratio r that achieves it. Squaring
// T = √[1+(2ζr)²]/D and writing u = r² turns this into a quadratic
// a·u² + b·u + c = 0 with a = T², b = T²·(4ζ²−2) − 4ζ², c = T² − 1; taking
// the "+" root and r = √u gives the (unique, on the isolating branch r ≥ √2)
// answer — see vib.md for the derivation.
// ---------------------------------------------------------------------------

export function computeSolution(
  params: VibrationIsolationParams,
): VibrationIsolationDerived {
  const {
    mass,
    stiffness,
    dampingRatio: zeta,
    targetTransmissibility: T,
  } = params;

  if (mass <= 0 || stiffness <= 0 || zeta < 0 || T <= 0) {
    throw new RangeError(
      "mass and stiffness must be positive, dampingRatio must be non-negative, and targetTransmissibility must be positive",
    );
  }

  const naturalFrequency = Math.sqrt(stiffness / mass);
  const peak = transmissibilityPeak(zeta);
  const undampedR = Math.sqrt(1 + 1 / T);

  // The curve never exceeds its own peak, so if the target is at least that
  // high, T(r) ≤ target holds at every frequency — there is no single
  // critical ω to solve for.
  if (T >= peak.value) {
    return {
      naturalFrequency,
      peakTransmissibility: peak.value,
      status: "reachable_everywhere",
      frequencyRatio: null,
      omega: null,
      rpm: null,
      transmissibilityCheck: null,
      undampedR,
    };
  }

  const a = T * T;
  const b = T * T * (4 * zeta * zeta - 2) - 4 * zeta * zeta;
  const c = T * T - 1;
  const discriminant = b * b - 4 * a * c;

  if (discriminant < 0) {
    return {
      naturalFrequency,
      peakTransmissibility: peak.value,
      status: "unattainable",
      frequencyRatio: null,
      omega: null,
      rpm: null,
      transmissibilityCheck: null,
      undampedR,
    };
  }

  const u = (-b + Math.sqrt(discriminant)) / (2 * a);

  if (u <= 0) {
    return {
      naturalFrequency,
      peakTransmissibility: peak.value,
      status: "unattainable",
      frequencyRatio: null,
      omega: null,
      rpm: null,
      transmissibilityCheck: null,
      undampedR,
    };
  }

  const frequencyRatio = Math.sqrt(u);
  const omega = frequencyRatio * naturalFrequency;
  const rpm = (omega * 60) / (2 * Math.PI);
  const transmissibilityCheck = transmissibility(frequencyRatio, zeta);

  return {
    naturalFrequency,
    peakTransmissibility: peak.value,
    status: "solved",
    frequencyRatio,
    omega,
    rpm,
    transmissibilityCheck,
    undampedR,
  };
}
