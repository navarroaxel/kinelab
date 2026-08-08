import { describe, expect, it } from "vitest";

import type { AtwoodParams } from "@/types/simulator";

import {
  G,
  acceleration,
  computeAtwoodState,
  tension1,
  tension2,
} from "./atwoodKinematics";

const params: AtwoodParams = {
  mass1: 5,
  mass2: 8,
  pulleyMomentOfInertia: 0,
  pulleyRadius: 0.1,
};

describe("acceleration", () => {
  it("solves the massless-pulley textbook case: a = (m2−m1)g/(m1+m2)", () => {
    expect(acceleration(params)).toBeCloseTo(((8 - 5) * G) / (5 + 8), 9);
  });

  it("is zero for equal masses", () => {
    expect(acceleration({ ...params, mass1: 5, mass2: 5 })).toBeCloseTo(0, 9);
  });

  it("flips sign when the mass ratio flips", () => {
    const a1 = acceleration(params);
    const a2 = acceleration({ ...params, mass1: 8, mass2: 5 });
    expect(a2).toBeCloseTo(-a1, 9);
  });

  it("decreases in magnitude as the pulley's inertia grows", () => {
    const a0 = acceleration(params);
    const a1 = acceleration({ ...params, pulleyMomentOfInertia: 0.1 });
    const a2 = acceleration({ ...params, pulleyMomentOfInertia: 0.5 });
    expect(Math.abs(a1)).toBeLessThan(Math.abs(a0));
    expect(Math.abs(a2)).toBeLessThan(Math.abs(a1));
  });

  it("treats a zero pulley radius as no extra inertial load", () => {
    expect(
      acceleration({ ...params, pulleyMomentOfInertia: 0.5, pulleyRadius: 0 }),
    ).toBeCloseTo(acceleration(params), 9);
  });
});

describe("tension1 / tension2", () => {
  it("gives equal tension on both sides when the pulley is massless", () => {
    expect(tension1(params)).toBeCloseTo(tension2(params), 6);
  });

  it("solves the reference values (m1=5, m2=8 kg)", () => {
    const a = acceleration(params);
    expect(tension1(params)).toBeCloseTo(5 * (G + a), 9);
    expect(tension2(params)).toBeCloseTo(8 * (G - a), 9);
  });

  it("splits the tension once the pulley has real inertia, widening the gap (T2 > T1, since m2 > m1)", () => {
    const equal = tension1(params) - tension2(params);
    const withInertia = { ...params, pulleyMomentOfInertia: 0.3 };
    expect(equal).toBeCloseTo(0, 6);
    expect(tension2(withInertia)).toBeGreaterThan(tension1(withInertia));
  });
});

describe("computeAtwoodState", () => {
  it("bundles acceleration and both tensions consistently", () => {
    const s = computeAtwoodState(params);
    expect(s.acceleration).toBeCloseTo(acceleration(params), 9);
    expect(s.tension1).toBeCloseTo(tension1(params), 9);
    expect(s.tension2).toBeCloseTo(tension2(params), 9);
  });
});
