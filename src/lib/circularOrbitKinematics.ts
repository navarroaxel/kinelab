import type {
  CircularOrbitParams,
  CircularOrbitState,
} from "@/types/simulator";

const KMH_TO_MS = 1 / 3.6;

/** Orbital radius: a_n = v²/r = g·(R/r)² ⟹ r = g·R²/v². Returns meters. */
export function orbitalRadiusMeters(
  vMs: number,
  RMeters: number,
  g: number,
): number {
  return (g * RMeters * RMeters) / (vMs * vMs);
}

export function orbitalPeriod(rMeters: number, vMs: number): number {
  return (2 * Math.PI * rMeters) / vMs;
}

/** Constant angular rate for animating the true anomaly (no RK4 needed — v and r are both constant). */
export function angularVelocity(rMeters: number, vMs: number): number {
  return vMs / rMeters;
}

export function computeOrbit(params: CircularOrbitParams): CircularOrbitState {
  const v = params.vKmh * KMH_TO_MS;
  const RMeters = params.R * 1000;
  const rMeters = orbitalRadiusMeters(v, RMeters, params.g);
  const aN = (v * v) / rMeters;

  if (process.env.NODE_ENV === "development") {
    // a_n = v²/r must equal g·(R/r)² — the equation r was solved from.
    const aNFromLaw = params.g * (RMeters / rMeters) ** 2;
    const rel = Math.abs(aNFromLaw - aN) / Math.max(aN, 1e-9);
    if (rel > 1e-6) {
      console.warn(
        `[circularOrbit] a_n mismatch: v²/r=${aN.toFixed(6)} ≠ g·(R/r)²=${aNFromLaw.toFixed(6)} (rel=${rel.toExponential(2)})`,
      );
    }
  }

  const rKm = rMeters / 1000;
  return {
    v,
    r: rKm,
    h: rKm - params.R,
    T: orbitalPeriod(rMeters, v),
    aN,
    hitsSurface: rKm <= params.R,
  };
}

/** Altitude (km) for a given orbital speed (km/h) — used for the h(v) reference plot. */
export function altitudeAtSpeed(vKmh: number, R: number, g: number): number {
  const v = vKmh * KMH_TO_MS;
  const rKm = orbitalRadiusMeters(v, R * 1000, g) / 1000;
  return rKm - R;
}
