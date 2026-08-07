import type { AtwoodParams, AtwoodState } from "@/types/simulator";

export const G = 9.81; // m/s²

/**
 * Newton's second law on both masses plus the pulley's own rotational
 * equation of motion, with the inextensible string enforcing a = r·α:
 *
 *   m2·g − T2 = m2·a           (m2 descends)
 *   T1 − m1·g = m1·a           (m1 rises)
 *   (T2 − T1)·r = I·α = I·a/r  (net torque spins up the pulley)
 *
 * Adding all three and eliminating T1, T2 gives a single closed form for a.
 * Setting I = 0 collapses this to the textbook massless-pulley result
 * a = (m2 − m1)·g / (m1 + m2), with equal tension on both sides.
 */
export function acceleration(params: AtwoodParams, g = G): number {
  const { mass1: m1, mass2: m2, pulleyMomentOfInertia: I, pulleyRadius: r } =
    params;
  const effectiveInertiaMass = r > 0 ? I / r ** 2 : 0;
  return ((m2 - m1) * g) / (m1 + m2 + effectiveInertiaMass);
}

export function tension1(params: AtwoodParams, g = G): number {
  const a = acceleration(params, g);
  return params.mass1 * (g + a);
}

export function tension2(params: AtwoodParams, g = G): number {
  const a = acceleration(params, g);
  return params.mass2 * (g - a);
}

export function computeAtwoodState(params: AtwoodParams): AtwoodState {
  return {
    acceleration: acceleration(params),
    tension1: tension1(params),
    tension2: tension2(params),
  };
}
