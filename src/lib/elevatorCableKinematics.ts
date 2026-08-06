import type {
  ElevatorCableParams,
  ElevatorCableState,
} from "@/types/simulator";

const SINGULAR_EPSILON = 1e-6;

/** x(t) = √(v0²t² + 2·b·v0·t), from L(t) = b + v0·t = √(b² + x²). */
export function positionAtTime(t: number, params: ElevatorCableParams): number {
  const { b, v0 } = params;
  return Math.sqrt(v0 * v0 * t * t + 2 * b * v0 * t);
}

export function velocityAtTime(t: number, params: ElevatorCableParams): number {
  const { b, v0 } = params;
  const x = positionAtTime(t, params);
  return (v0 * (v0 * t + b)) / x;
}

export function accelerationAtTime(
  t: number,
  params: ElevatorCableParams,
): number {
  const { b, v0 } = params;
  const x = positionAtTime(t, params);
  return -(b * b * v0 * v0) / (x * x * x);
}

/**
 * Time at which x(t) = x0 — inverts the quadratic v0²t² + 2·b·v0·t − x0² = 0
 * in closed form (no bisection).
 */
export function timeAtPosition(
  x0: number,
  params: ElevatorCableParams,
): number {
  const { b, v0 } = params;
  return (-b + Math.sqrt(b * b + x0 * x0)) / v0;
}

export function computeElevatorCableState(
  params: ElevatorCableParams,
  tauElapsed: number,
): ElevatorCableState {
  const t0 = timeAtPosition(params.x0, params);
  const t = t0 + tauElapsed;

  const singular = t < SINGULAR_EPSILON;
  const x = positionAtTime(t, params);
  const xDot = singular ? Infinity : velocityAtTime(t, params);
  const xDDot = singular ? -Infinity : accelerationAtTime(t, params);

  if (process.env.NODE_ENV === "development" && !singular) {
    const { b, v0 } = params;

    // Invariant 1: √(b²+x²) − (b+v0·t) ≈ 0 — this is how x(t) was derived.
    const residual = Math.sqrt(b * b + x * x) - (b + v0 * t);
    if (Math.abs(residual) > 1e-6 * Math.max(b, 1)) {
      console.warn(
        `[elevatorCable] L(t) invariant violated: residual=${residual.toExponential(2)}`,
      );
    }

    // Invariant 2: analytic ẍ vs. a finite difference of ẋ(t).
    const h = 1e-4;
    const xDotCentered =
      (velocityAtTime(t + h, params) - velocityAtTime(t - h, params)) / (2 * h);
    const rel =
      Math.abs(xDotCentered - xDDot) / Math.max(Math.abs(xDDot), 1e-9);
    if (rel > 1e-3) {
      console.warn(
        `[elevatorCable] ẍ mismatch: analytic=${xDDot.toFixed(6)} finite-diff=${xDotCentered.toFixed(6)} (rel=${rel.toExponential(2)})`,
      );
    }
  }

  return { t: tauElapsed, x, xDot, xDDot, singular };
}
