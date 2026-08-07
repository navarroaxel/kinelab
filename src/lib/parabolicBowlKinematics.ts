import type {
  ParabolicBowlParams,
  ParabolicBowlState,
} from "@/types/simulator";

export const G = 9.81; // m/s²

/**
 * Track shape: y(x) = (4H/L²)·x², vertex at the origin (x=0, y=0), with
 * the two supports at x = ±L/2 sitting at height y = H — matching the
 * "flecha" (sag) H and "vano" (span) L of the statement.
 */
export function trackHeight(x: number, sag: number, span: number): number {
  return (4 * sag * x ** 2) / span ** 2;
}

export function trackSlope(x: number, sag: number, span: number): number {
  return (8 * sag * x) / span ** 2;
}

/** y''(x) — constant for a parabola. */
export function trackCurvature(sag: number, span: number): number {
  return (8 * sag) / span ** 2;
}

/** Energy conservation from rest at height `sag` above the vertex: v² = 2g·(H − y(x)). */
export function speedSquaredAt(
  x: number,
  sag: number,
  span: number,
  g = G,
): number {
  return Math.max(2 * g * (sag - trackHeight(x, sag, span)), 0);
}

/**
 * Normal force at x: resolving Newton's second law along the track's local
 * normal, N − mg·cos θ = m·v²/ρ, with cos θ = 1/√(1+y'²) and
 * v²/ρ = v²·y''/(1+y'²)^(3/2) for a curve y(x).
 */
export function normalForceAt(
  x: number,
  mass: number,
  sag: number,
  span: number,
  g = G,
): number {
  const yPrime = trackSlope(x, sag, span);
  const yDoublePrime = trackCurvature(sag, span);
  const v2 = speedSquaredAt(x, sag, span, g);
  const cosTheta = 1 / Math.sqrt(1 + yPrime ** 2);
  return (
    mass * g * cosTheta +
    (mass * v2 * yDoublePrime) / (1 + yPrime ** 2) ** 1.5
  );
}

/**
 * At the vertex the tangent is horizontal, so the sphere's entire
 * acceleration is the centripetal term v²/ρ — this is what the "no more
 * than 4g" design limit actually constrains, independent of mass.
 */
export function bottomAcceleration(
  sag: number,
  span: number,
  g = G,
): number {
  return (16 * g * sag ** 2) / span ** 2;
}

/** Smallest span (for a given sag) that keeps the vertex acceleration within `gLimit`·g. */
export function minSpanForLimit(sag: number, gLimit: number): number {
  return gLimit > 0 ? (4 * sag) / Math.sqrt(gLimit) : Infinity;
}

export function computeParabolicBowlState(
  params: ParabolicBowlParams,
): ParabolicBowlState {
  const aBottom = bottomAcceleration(params.sag, params.span);
  const aBottomInGs = aBottom / G;

  return {
    bottomAcceleration: aBottom,
    bottomAccelerationInGs: aBottomInGs,
    normalForceAtBottom: normalForceAt(0, params.sphereMass, params.sag, params.span),
    minSpanForLimit: minSpanForLimit(params.sag, params.gLimit),
    exceedsLimit: aBottomInGs > params.gLimit,
  };
}
