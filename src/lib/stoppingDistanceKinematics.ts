import type {
  StoppingDistanceCase,
  StoppingDistanceParams,
} from "@/types/simulator";

export const G = 9.81; // m/s²

const KMH_TO_MS = 1 / 3.6;

export function computeCase(
  speedKmh: number,
  reactionTime: number,
  decelFactor: number,
  obstacleDistance: number,
): StoppingDistanceCase {
  const v0 = speedKmh * KMH_TO_MS;
  const a = decelFactor * G;
  const d1 = v0 * reactionTime;
  const tf = a > 0 ? v0 / a : 0;
  const d2 = a > 0 ? (v0 * v0) / (2 * a) : 0;
  const D = d1 + d2;
  const tTotal = reactionTime + tf;

  if (process.env.NODE_ENV === "development" && a > 0) {
    // Cross-check D against a numerical integration of v(t) over [0, tTotal].
    const steps = 2000;
    const dt = tTotal / steps;
    let numeric = 0;
    for (let i = 0; i < steps; i++) {
      const t0 = i * dt;
      const t1 = t0 + dt;
      numeric +=
        ((velocityAt(v0, a, reactionTime, t0) +
          velocityAt(v0, a, reactionTime, t1)) /
          2) *
        dt;
    }
    const rel = Math.abs(numeric - D) / Math.max(D, 1e-9);
    if (rel > 1e-3) {
      console.warn(
        `[stoppingDistance] D mismatch at v0=${speedKmh}km/h: analytic=${D.toFixed(4)} numeric=${numeric.toFixed(4)} (rel=${rel.toExponential(2)})`,
      );
    }
  }

  return {
    speedKmh,
    v0,
    a,
    d1,
    tf,
    d2,
    D,
    tTotal,
    exceedsObstacle: D > obstacleDistance,
  };
}

export function computeAllCases(
  params: StoppingDistanceParams,
): StoppingDistanceCase[] {
  return params.speedsKmh.map((speedKmh) =>
    computeCase(
      speedKmh,
      params.reactionTime,
      params.decelFactor,
      params.obstacleDistance,
    ),
  );
}

function velocityAt(
  v0: number,
  a: number,
  reactionTime: number,
  t: number,
): number {
  if (t <= reactionTime) return v0;
  const braking = t - reactionTime;
  return Math.max(v0 - a * braking, 0);
}

export function velocityAtTime(c: StoppingDistanceCase, t: number): number {
  return velocityAt(c.v0, c.a, c.tTotal - c.tf, t);
}

export function positionAtTime(c: StoppingDistanceCase, t: number): number {
  const reactionTime = c.tTotal - c.tf;
  if (t <= reactionTime) return c.v0 * t;
  if (t <= c.tTotal) {
    const tau = t - reactionTime;
    return c.d1 + c.v0 * tau - 0.5 * c.a * tau * tau;
  }
  return c.D;
}
