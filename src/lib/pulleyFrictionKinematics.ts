import type { PulleyFrictionParams } from "@/types/simulator";

export const G = 9.81; // m/s²

export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Tension needed to drag block B up the incline at constant velocity:
 * gravity's component along the slope plus friction, both resisting motion.
 *
 *   T = weightB · (sin α + μ·cos α)
 */
export function cableTension(params: PulleyFrictionParams): number {
  const alpha = degToRad(params.inclineAngle);
  return (
    params.weightB *
    (Math.sin(alpha) + params.frictionCoefficient * Math.cos(alpha))
  );
}

/**
 * Force needed on block A (applied at angle θ above the horizontal) to
 * drag it at constant velocity against friction and the cable tension T
 * pulling it back. Pulling upward at an angle both reduces the normal
 * force (less friction) and adds a losing cosθ projection along the
 * direction of travel — the classic "optimal drag angle" trade-off.
 *
 *   F(θ) = (μ·weightA + T) / (cos θ + μ·sin θ)
 */
export function appliedForce(
  thetaDeg: number,
  params: PulleyFrictionParams,
): number {
  const theta = degToRad(thetaDeg);
  const T = cableTension(params);
  return (
    (params.frictionCoefficient * params.weightA + T) /
    (Math.cos(theta) + params.frictionCoefficient * Math.sin(theta))
  );
}

/** θ that minimizes F(θ): the classic result θ = arctan(μ). */
export function optimalAngle(params: PulleyFrictionParams): number {
  return (Math.atan(params.frictionCoefficient) * 180) / Math.PI;
}

export function minimumForce(params: PulleyFrictionParams): number {
  return appliedForce(optimalAngle(params), params);
}
