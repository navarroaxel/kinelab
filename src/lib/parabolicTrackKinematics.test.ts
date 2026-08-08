import { describe, expect, it } from "vitest";

import type { ParabolicTrackParams } from "@/types/simulator";

import {
  computeParabolicTrackState,
  motionTangent,
} from "./parabolicTrackKinematics";

const params: ParabolicTrackParams = { coeff: 1 / 80, xA: 10, v: 12, vDot: 4 };

describe("computeParabolicTrackState", () => {
  it("evaluates the parabola and its derivatives", () => {
    const s = computeParabolicTrackState(params);
    expect(s.x).toBe(10);
    expect(s.y).toBeCloseTo(100 / 80, 12);
    expect(s.slope).toBeCloseTo(20 / 80, 12);
    expect(s.curvature2nd).toBeCloseTo(2 / 80, 12);
  });

  it("uses the standard radius-of-curvature formula", () => {
    const s = computeParabolicTrackState(params);
    expect(s.Rc).toBeCloseTo(
      Math.pow(1 + s.slope ** 2, 1.5) / Math.abs(s.curvature2nd),
      9,
    );
  });

  it("is tightest at the vertex, where Rc = 1/|2c|", () => {
    const atVertex = computeParabolicTrackState({ ...params, xA: 0 });
    expect(atVertex.Rc).toBeCloseTo(1 / (2 * params.coeff), 9);
    expect(atVertex.Rc).toBeLessThan(computeParabolicTrackState(params).Rc);
    expect(atVertex.slope).toBe(0);
  });

  it("decomposes the acceleration into a_t and a_n = v²/Rc", () => {
    const s = computeParabolicTrackState(params);
    expect(s.at).toBe(params.vDot);
    expect(s.an).toBeCloseTo((params.v * params.v) / s.Rc, 9);
    expect(s.a).toBeCloseTo(Math.hypot(s.at, s.an), 12);
    expect(s.betaDeg).toBeCloseTo((Math.atan2(s.an, s.at) * 180) / Math.PI, 12);
  });

  it("has no normal acceleration when the skater is at rest", () => {
    const s = computeParabolicTrackState({ ...params, v: 0 });
    expect(s.an).toBe(0);
    expect(s.a).toBeCloseTo(Math.abs(params.vDot), 12);
    expect(s.betaDeg).toBeCloseTo(0, 12);
  });

  it("places the curvature centre one Rc away, on the concave (upper) side", () => {
    const s = computeParabolicTrackState(params);
    expect(Math.hypot(s.centerX - s.x, s.centerY - s.y)).toBeCloseTo(s.Rc, 9);
    expect(s.centerY).toBeGreaterThan(s.y);
    // The centre→point vector is perpendicular to the tangent (1, slope).
    const dx = s.x - s.centerX;
    const dy = s.y - s.centerY;
    expect(dx * 1 + dy * s.slope).toBeCloseTo(0, 6);
  });

  it("is mirror-symmetric about the vertex", () => {
    const left = computeParabolicTrackState({ ...params, xA: -10 });
    const right = computeParabolicTrackState(params);
    expect(left.y).toBeCloseTo(right.y, 12);
    expect(left.slope).toBeCloseTo(-right.slope, 12);
    expect(left.Rc).toBeCloseTo(right.Rc, 12);
    expect(left.centerX).toBeCloseTo(-right.centerX, 9);
    expect(left.centerY).toBeCloseTo(right.centerY, 9);
  });
});

describe("motionTangent", () => {
  it("is a unit vector", () => {
    const { tx, ty } = motionTangent(10, 0.25);
    expect(Math.hypot(tx, ty)).toBeCloseTo(1, 12);
  });

  it("points toward the vertex from either side", () => {
    expect(motionTangent(10, 0.25).tx).toBeLessThan(0); // moving left
    expect(motionTangent(-10, -0.25).tx).toBeGreaterThan(0); // moving right
  });

  it("is parallel to the track's tangent direction (1, slope)", () => {
    const slope = 0.25;
    const { tx, ty } = motionTangent(10, slope);
    expect(ty / tx).toBeCloseTo(slope, 12);
  });

  it("degenerates to the zero vector exactly at the vertex", () => {
    expect(motionTangent(0, 0)).toEqual({ tx: 0, ty: 0 });
  });
});
