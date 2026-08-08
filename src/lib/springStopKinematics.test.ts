import { describe, expect, it } from "vitest";

import type { SpringStopParams } from "@/types/simulator";

import {
  additionalDeformation,
  computeSpringStopState,
  degToRad,
  remainingEnergyAt,
  springForceAtPrecompression,
} from "./springStopKinematics";

const params: SpringStopParams = {
  packageMass: 70,
  inclineAngle: 20,
  frictionCoefficient: 0.2,
  distanceToSpring: 10,
  speedAtDistance: 6,
  springConstant: 29430,
  precompression: 0.1,
};

describe("degToRad / springForceAtPrecompression", () => {
  it("converts degrees to radians", () => {
    expect(degToRad(180)).toBeCloseTo(Math.PI, 12);
  });

  it("F0 = k · x0", () => {
    expect(springForceAtPrecompression(29430, 0.1)).toBeCloseTo(2943, 6);
  });
});

describe("additionalDeformation", () => {
  it("solves the reference case (δ ≈ 31.2 cm)", () => {
    const delta = additionalDeformation(params);
    expect(delta).not.toBeNull();
    expect(delta!).toBeCloseTo(0.312, 2);
  });

  it("returns null when the spring constant is zero (degenerate quadratic)", () => {
    expect(additionalDeformation({ ...params, springConstant: 0 })).toBeNull();
  });

  it("grows with the incoming speed", () => {
    const d1 = additionalDeformation({ ...params, speedAtDistance: 6 })!;
    const d2 = additionalDeformation({ ...params, speedAtDistance: 10 })!;
    expect(d2).toBeGreaterThan(d1);
  });

  it("returns null when there isn't enough energy to reach the spring at all", () => {
    // Zero incoming speed, a flat "incline" (no gravity assist), and huge
    // friction: the discriminant goes negative — no real root exists.
    const result = additionalDeformation({
      ...params,
      speedAtDistance: 0,
      frictionCoefficient: 5,
      inclineAngle: 0,
    });
    expect(result).toBeNull();
  });
});

describe("remainingEnergyAt", () => {
  it("is zero at x = δ (the point of maximum compression, by construction)", () => {
    const delta = additionalDeformation(params)!;
    expect(remainingEnergyAt(delta, params)).toBeCloseTo(0, 1);
  });

  it("is positive for x between 0 and δ", () => {
    const delta = additionalDeformation(params)!;
    expect(remainingEnergyAt(delta / 2, params)).toBeGreaterThan(0);
  });

  it("equals the kinetic energy at distanceToSpring when x = 0", () => {
    expect(remainingEnergyAt(0, params)).toBeGreaterThan(0);
  });
});

describe("computeSpringStopState", () => {
  it("solves the reference case with a valid positive deformation", () => {
    const s = computeSpringStopState(params);
    expect(s.valid).toBe(true);
    expect(s.springForceAtPrecompression).toBeCloseTo(2943, 6);
    expect(s.additionalDeformation).toBeCloseTo(0.312, 2);
    expect(s.maxSpringForce).toBeCloseTo(
      s.springForceAtPrecompression + params.springConstant * s.additionalDeformation,
      6,
    );
  });

  it("falls back to a zero deformation when there's no valid root", () => {
    const s = computeSpringStopState({ ...params, springConstant: 0 });
    expect(s.valid).toBe(false);
    expect(s.additionalDeformation).toBe(0);
    expect(s.maxSpringForce).toBe(s.springForceAtPrecompression);
  });
});
