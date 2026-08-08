import { describe, expect, it } from "vitest";

import type { ParabolicBowlParams } from "@/types/simulator";

import {
  G,
  bottomAcceleration,
  computeParabolicBowlState,
  minSpanForLimit,
  normalForceAt,
  speedSquaredAt,
  trackCurvature,
  trackHeight,
  trackSlope,
} from "./parabolicBowlKinematics";

const params: ParabolicBowlParams = {
  sphereMass: 1,
  sag: 2,
  span: 6,
  gLimit: 4,
};

describe("trackHeight / trackSlope / trackCurvature", () => {
  it("is zero at the vertex and equals the sag at the supports", () => {
    expect(trackHeight(0, 2, 6)).toBe(0);
    expect(trackHeight(3, 2, 6)).toBeCloseTo(2, 9); // x = span/2
    expect(trackHeight(-3, 2, 6)).toBeCloseTo(2, 9);
  });

  it("has zero slope at the vertex", () => {
    expect(trackSlope(0, 2, 6)).toBe(0);
  });

  it("has constant curvature, independent of x", () => {
    expect(trackCurvature(2, 6)).toBeCloseTo(trackCurvature(2, 6), 12);
    expect(trackCurvature(2, 6)).toBeCloseTo((8 * 2) / 6 ** 2, 9);
  });
});

describe("speedSquaredAt", () => {
  it("is zero at the supports (released from rest there)", () => {
    expect(speedSquaredAt(3, 2, 6)).toBeCloseTo(0, 6);
  });

  it("is maximal at the vertex: v² = 2gH", () => {
    expect(speedSquaredAt(0, 2, 6)).toBeCloseTo(2 * G * 2, 9);
  });

  it("never goes negative", () => {
    expect(speedSquaredAt(10, 2, 6)).toBeGreaterThanOrEqual(0);
  });
});

describe("normalForceAt / bottomAcceleration", () => {
  it("matches bottomAcceleration's centripetal term at the vertex", () => {
    const N = normalForceAt(0, 1, 2, 6);
    const aBottom = bottomAcceleration(2, 6);
    // At x=0 the tangent is horizontal: N = m·g + m·v²/ρ = m(g + aBottom).
    expect(N).toBeCloseTo(1 * (G + aBottom), 6);
  });

  it("scales linearly with mass", () => {
    const N1 = normalForceAt(0, 1, 2, 6);
    const N2 = normalForceAt(0, 3, 2, 6);
    expect(N2).toBeCloseTo(3 * N1, 6);
  });
});

describe("minSpanForLimit", () => {
  it("returns a span that puts the vertex acceleration exactly at the limit", () => {
    const L = minSpanForLimit(2, 4);
    expect(bottomAcceleration(2, L) / G).toBeCloseTo(4, 6);
  });

  it("returns Infinity for a non-positive limit", () => {
    expect(minSpanForLimit(2, 0)).toBe(Infinity);
  });
});

describe("computeParabolicBowlState", () => {
  it("solves the reference case (H=2, L=6) and flags the 4g design limit", () => {
    const s = computeParabolicBowlState(params);
    expect(s.bottomAcceleration).toBeCloseTo(bottomAcceleration(2, 6), 9);
    expect(s.bottomAccelerationInGs).toBeCloseTo(s.bottomAcceleration / G, 9);
    expect(s.exceedsLimit).toBe(s.bottomAccelerationInGs > 4);
  });

  it("flags exceedsLimit once the span is too short for the sag", () => {
    const s = computeParabolicBowlState({ ...params, span: 1 });
    expect(s.exceedsLimit).toBe(true);
  });

  it("stays within the limit for a generously long span", () => {
    const s = computeParabolicBowlState({ ...params, span: 100 });
    expect(s.exceedsLimit).toBe(false);
  });
});
