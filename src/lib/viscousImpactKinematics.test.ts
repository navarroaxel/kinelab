import { describe, expect, it } from "vitest";

import type { ViscousImpactParams } from "@/types/simulator";

import {
  computeViscousImpactState,
  decelRate,
  dragConstant,
  penetrationDepth,
  positionAtTime,
  velocityAtDepth,
  velocityAtTime,
} from "./viscousImpactKinematics";

const params: ViscousImpactParams = {
  bulletMass: 0.014,
  entrySpeed: 500,
  exitSpeed: 200,
  plateThickness: 0.025,
};

describe("decelRate / dragConstant", () => {
  it("solves the reference case (500→200 m/s across 25 mm)", () => {
    expect(decelRate(500, 200, 0.025)).toBeCloseTo(12000, 6);
    expect(dragConstant(0.014, 12000)).toBeCloseTo(168, 6);
  });

  it("returns 0 for a non-positive plate thickness", () => {
    expect(decelRate(500, 200, 0)).toBe(0);
    expect(decelRate(500, 200, -1)).toBe(0);
  });
});

describe("velocityAtDepth / penetrationDepth", () => {
  it("decays linearly with distance, not time", () => {
    const decel = decelRate(500, 200, 0.025);
    expect(velocityAtDepth(0, 500, decel)).toBe(500);
    expect(velocityAtDepth(0.025, 500, decel)).toBeCloseTo(200, 6);
  });

  it("clamps at zero rather than going negative", () => {
    const decel = decelRate(500, 200, 0.025);
    expect(velocityAtDepth(1, 500, decel)).toBe(0);
  });

  it("matches the reference penetration depth (~41.7 mm)", () => {
    const decel = decelRate(500, 200, 0.025);
    expect(penetrationDepth(500, decel)).toBeCloseTo(0.041667, 5);
  });

  it("returns Infinity when there's no deceleration", () => {
    expect(penetrationDepth(500, 0)).toBe(Infinity);
  });
});

describe("positionAtTime / velocityAtTime", () => {
  it("approaches the penetration depth asymptotically", () => {
    const decel = decelRate(500, 200, 0.025);
    const depth = penetrationDepth(500, decel);
    expect(positionAtTime(1e6, 500, decel)).toBeCloseTo(depth, 6);
    expect(positionAtTime(0, 500, decel)).toBe(0);
  });

  it("falls back to linear motion when decel is 0", () => {
    expect(positionAtTime(2, 500, 0)).toBe(1000);
  });

  it("decays exponentially in time, consistent with positionAtTime's derivative", () => {
    const decel = decelRate(500, 200, 0.025);
    expect(velocityAtTime(0, 500, decel)).toBe(500);
    expect(velocityAtTime(1e6, 500, decel)).toBeCloseTo(0, 6);
  });
});

describe("computeViscousImpactState", () => {
  it("solves the reference case with a valid, finite penetration depth", () => {
    const s = computeViscousImpactState(params);
    expect(s.valid).toBe(true);
    expect(s.decelRate).toBeCloseTo(12000, 6);
    expect(s.dragConstant).toBeCloseTo(168, 6);
    expect(s.penetrationDepth).toBeCloseTo(0.041667, 5);
  });

  it("is invalid when the bullet doesn't actually decelerate", () => {
    const s = computeViscousImpactState({ ...params, exitSpeed: 500 });
    expect(s.valid).toBe(false);
    expect(s.decelRate).toBe(0);
    expect(s.penetrationDepth).toBe(Infinity);
  });

  it("is invalid when the exit speed exceeds the entry speed", () => {
    const s = computeViscousImpactState({ ...params, exitSpeed: 600 });
    expect(s.valid).toBe(false);
  });
});
