import type { VehiclePowerParams, VehiclePowerState } from "@/types/simulator";

export const G = 9.81; // m/s²

export function kmhToMs(kmh: number): number {
  return kmh / 3.6;
}

// The two calibration speeds must differ enough for the 2×2 solve below to
// stay well-conditioned — the determinant is v1·v2·(v2−v1)·(v2+v1), which
// vanishes as v1 → v2. useVehiclePowerSimulator keeps the two sliders at
// least this far apart; this constant is shared so the pure math and the
// UI guard can't drift out of sync.
export const MIN_CALIB_SPEED_SEPARATION_KMH = 1;

/**
 * Retarding force F(v) = a + b·v² has two calibration readings, each
 * giving one equation in the unknowns a, b via P = F(v)·v = a·v + b·v³
 * (constant-speed driving: drive force exactly balances the resistance).
 * Two speeds/powers give a 2×2 linear system, solved directly.
 *
 * Degenerate (v1 ≈ v2, so the determinant is ~0) returns {a: 0, b: 0}
 * rather than dividing by ~0 into NaN/Infinity — a defensive backstop,
 * since normal UI use never reaches this (see the constant above).
 */
export function fitCoefficients(
  v1: number,
  p1: number,
  v2: number,
  p2: number,
): { a: number; b: number } {
  const det = v1 * v2 ** 3 - v1 ** 3 * v2;
  if (Math.abs(det) < 1e-6) {
    return { a: 0, b: 0 };
  }
  const a = (p1 * v2 ** 3 - v1 ** 3 * p2) / det;
  const b = (v1 * p2 - v2 * p1) / det;
  return { a, b };
}

/** Power to the wheels at speed v on a flat road: P = a·v + b·v³. */
export function flatPower(v: number, a: number, b: number): number {
  return a * v + b * v ** 3;
}

/** Weight component along a `gradeDeg` incline: mg·sin θ. */
export function gradeForce(
  vehicleMass: number,
  gradeDeg: number,
  g = G,
): number {
  return vehicleMass * g * Math.sin((gradeDeg * Math.PI) / 180);
}

/** Power to the wheels at speed v on a `gradeDeg` incline: flat-road power plus the grade's extra work rate. */
export function slopePower(
  v: number,
  a: number,
  b: number,
  vehicleMass: number,
  gradeDeg: number,
  g = G,
): number {
  return flatPower(v, a, b) + gradeForce(vehicleMass, gradeDeg, g) * v;
}

export function computeVehiclePowerState(
  params: VehiclePowerParams,
): VehiclePowerState {
  const v1 = kmhToMs(params.calibSpeed1Kmh);
  const v2 = kmhToMs(params.calibSpeed2Kmh);
  const { a, b } = fitCoefficients(
    v1,
    params.calibPower1 * 1000,
    v2,
    params.calibPower2 * 1000,
  );

  const targetPowerFlat = flatPower(kmhToMs(params.targetSpeedKmh), a, b);
  const slopeV = kmhToMs(params.slopeSpeedKmh);
  const targetPowerSlope = slopePower(
    slopeV,
    a,
    b,
    params.vehicleMass,
    params.gradeDeg,
  );

  return {
    a,
    b,
    targetPowerFlat,
    targetPowerSlope,
    gradeForce: gradeForce(params.vehicleMass, params.gradeDeg),
    invalidCalibration:
      Math.abs(params.calibSpeed1Kmh - params.calibSpeed2Kmh) <
      MIN_CALIB_SPEED_SEPARATION_KMH,
  };
}

/** Flat-road power as a function of speed (km/h in, W out) — for the equations plot. */
export function flatPowerAtKmh(
  speedKmh: number,
  params: VehiclePowerParams,
): number {
  const v1 = kmhToMs(params.calibSpeed1Kmh);
  const v2 = kmhToMs(params.calibSpeed2Kmh);
  const { a, b } = fitCoefficients(
    v1,
    params.calibPower1 * 1000,
    v2,
    params.calibPower2 * 1000,
  );
  return flatPower(kmhToMs(speedKmh), a, b);
}
