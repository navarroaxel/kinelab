import { describe, expect, it } from "vitest";

import type { VehiclePowerParams } from "@/types/simulator";

import {
  G,
  MIN_CALIB_SPEED_SEPARATION_KMH,
  computeVehiclePowerState,
  fitCoefficients,
  flatPower,
  flatPowerAtKmh,
  gradeForce,
  kmhToMs,
  slopePower,
} from "./vehiclePowerKinematics";

const params: VehiclePowerParams = {
  vehicleMass: 1600,
  calibSpeed1Kmh: 50,
  calibPower1: 6,
  calibSpeed2Kmh: 60,
  calibPower2: 10,
  targetSpeedKmh: 90,
  slopeSpeedKmh: 60,
  gradeDeg: 5,
};

describe("kmhToMs", () => {
  it("converts km/h to m/s", () => {
    expect(kmhToMs(36)).toBeCloseTo(10, 12);
    expect(kmhToMs(0)).toBe(0);
    expect(kmhToMs(-36)).toBeCloseTo(-10, 12);
  });
});

describe("fitCoefficients", () => {
  it("recovers the coefficients it was generated from", () => {
    const a = 180;
    const b = 0.45;
    const v1 = 12;
    const v2 = 25;
    const fit = fitCoefficients(
      v1,
      flatPower(v1, a, b),
      v2,
      flatPower(v2, a, b),
    );
    expect(fit.a).toBeCloseTo(a, 6);
    expect(fit.b).toBeCloseTo(b, 9);
  });

  it("reproduces both calibration readings exactly", () => {
    const v1 = kmhToMs(50);
    const v2 = kmhToMs(60);
    const { a, b } = fitCoefficients(v1, 6000, v2, 10000);
    expect(flatPower(v1, a, b)).toBeCloseTo(6000, 6);
    expect(flatPower(v2, a, b)).toBeCloseTo(10000, 6);
  });

  it("returns zeros instead of NaN when the two speeds coincide", () => {
    expect(fitCoefficients(10, 5000, 10, 6000)).toEqual({ a: 0, b: 0 });
  });

  it("returns zeros when a calibration speed is zero (singular system)", () => {
    expect(fitCoefficients(0, 0, 20, 8000)).toEqual({ a: 0, b: 0 });
  });
});

describe("flatPower", () => {
  it("is P = a·v + b·v³", () => {
    expect(flatPower(10, 200, 0.5)).toBeCloseTo(200 * 10 + 0.5 * 1000, 9);
  });

  it("is zero at rest", () => {
    expect(flatPower(0, 200, 0.5)).toBe(0);
  });
});

describe("gradeForce", () => {
  it("is mg·sin θ", () => {
    expect(gradeForce(1600, 30)).toBeCloseTo(1600 * G * 0.5, 6);
  });

  it("vanishes on a flat road and flips sign downhill", () => {
    expect(gradeForce(1600, 0)).toBeCloseTo(0, 12);
    expect(gradeForce(1600, -5)).toBeCloseTo(-gradeForce(1600, 5), 9);
  });
});

describe("slopePower", () => {
  it("equals the flat-road power plus the grade's work rate", () => {
    const v = kmhToMs(60);
    const [a, b] = [200, 0.5];
    expect(slopePower(v, a, b, 1600, 5)).toBeCloseTo(
      flatPower(v, a, b) + gradeForce(1600, 5) * v,
      6,
    );
  });

  it("reduces to the flat-road power at zero grade", () => {
    const v = kmhToMs(60);
    expect(slopePower(v, 200, 0.5, 1600, 0)).toBeCloseTo(
      flatPower(v, 200, 0.5),
      9,
    );
  });
});

describe("computeVehiclePowerState", () => {
  it("fits the calibration points given in kW and reproduces them", () => {
    const s = computeVehiclePowerState(params);
    expect(flatPower(kmhToMs(50), s.a, s.b)).toBeCloseTo(6000, 6);
    expect(flatPower(kmhToMs(60), s.a, s.b)).toBeCloseTo(10000, 6);
  });

  it("predicts a larger power at the higher target speed", () => {
    const s = computeVehiclePowerState(params);
    expect(s.targetPowerFlat).toBeGreaterThan(10000);
    expect(s.invalidCalibration).toBe(false);
  });

  it("charges more power on a grade than on the flat at the same speed", () => {
    const s = computeVehiclePowerState(params);
    const flatAt60 = flatPower(kmhToMs(params.slopeSpeedKmh), s.a, s.b);
    expect(s.targetPowerSlope).toBeGreaterThan(flatAt60);
    expect(s.targetPowerSlope - flatAt60).toBeCloseTo(
      s.gradeForce * kmhToMs(params.slopeSpeedKmh),
      6,
    );
  });

  it("flags calibration speeds closer together than the minimum separation", () => {
    const sep = MIN_CALIB_SPEED_SEPARATION_KMH;
    expect(
      computeVehiclePowerState({ ...params, calibSpeed2Kmh: 50 + sep / 2 })
        .invalidCalibration,
    ).toBe(true);
    expect(
      computeVehiclePowerState({ ...params, calibSpeed2Kmh: 50 + sep })
        .invalidCalibration,
    ).toBe(false);
  });
});

describe("flatPowerAtKmh", () => {
  it("agrees with computeVehiclePowerState at the target speed", () => {
    const s = computeVehiclePowerState(params);
    expect(flatPowerAtKmh(params.targetSpeedKmh, params)).toBeCloseTo(
      s.targetPowerFlat,
      6,
    );
  });

  it("passes through both calibration readings", () => {
    expect(flatPowerAtKmh(50, params)).toBeCloseTo(6000, 6);
    expect(flatPowerAtKmh(60, params)).toBeCloseTo(10000, 6);
  });
});
