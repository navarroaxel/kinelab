import type { SpringStopParams, SpringStopState } from "@/types/simulator";

export const G = 9.81; // m/s²

export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function springForceAtPrecompression(
  springConstant: number,
  precompression: number,
): number {
  return springConstant * precompression;
}

/**
 * Work-energy from the point 10 m up the incline (speed v) to the moment
 * of maximum additional spring compression δ (speed = 0):
 *
 *   ½mv² + mg·sinθ·(L+δ) − μmg·cosθ·(L+δ) − [F0·δ + ½k·δ²] = 0
 *
 * The bracketed term is the work done AGAINST the spring — its force
 * ramps linearly from F0 (already precompressed) to F0 + kδ, so the work
 * is the area of that trapezoid, F0·δ + ½k·δ². Regrouping in δ gives a
 * quadratic; the physically meaningful root is the positive one.
 */
export function additionalDeformation(
  params: SpringStopParams,
  g = G,
): number | null {
  const theta = degToRad(params.inclineAngle);
  const { packageMass: m, frictionCoefficient: mu, distanceToSpring: L, speedAtDistance: v } =
    params;
  const F0 = springForceAtPrecompression(
    params.springConstant,
    params.precompression,
  );

  const A = 0.5 * params.springConstant;
  const B = F0 - m * g * Math.sin(theta) + mu * m * g * Math.cos(theta);
  const C = -(
    0.5 * m * v ** 2 +
    m * g * Math.sin(theta) * L -
    mu * m * g * Math.cos(theta) * L
  );

  const discriminant = B ** 2 - 4 * A * C;
  if (discriminant < 0 || A === 0) return null;

  const root1 = (-B + Math.sqrt(discriminant)) / (2 * A);
  const root2 = (-B - Math.sqrt(discriminant)) / (2 * A);
  const positiveRoots = [root1, root2].filter((r) => r > 0);
  return positiveRoots.length > 0 ? Math.min(...positiveRoots) : null;
}

/**
 * Remaining kinetic energy once the package has traveled an additional
 * distance x past the spring's first-contact point (x=0 at contact,
 * x=δ at the point of maximum compression where this returns 0).
 */
export function remainingEnergyAt(
  x: number,
  params: SpringStopParams,
  g = G,
): number {
  const theta = degToRad(params.inclineAngle);
  const { packageMass: m, frictionCoefficient: mu, distanceToSpring: L, speedAtDistance: v } =
    params;
  const F0 = springForceAtPrecompression(
    params.springConstant,
    params.precompression,
  );
  const travelled = L + x;
  const springWork = F0 * x + 0.5 * params.springConstant * x ** 2;
  return (
    0.5 * m * v ** 2 +
    m * g * Math.sin(theta) * travelled -
    mu * m * g * Math.cos(theta) * travelled -
    springWork
  );
}

export function computeSpringStopState(
  params: SpringStopParams,
): SpringStopState {
  const delta = additionalDeformation(params);
  const F0 = springForceAtPrecompression(
    params.springConstant,
    params.precompression,
  );

  return {
    springForceAtPrecompression: F0,
    additionalDeformation: delta ?? 0,
    maxSpringForce: F0 + params.springConstant * (delta ?? 0),
    valid: delta !== null,
  };
}
