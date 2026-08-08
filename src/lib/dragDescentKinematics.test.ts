import { describe, expect, it } from "vitest";

import type { DragDescentParams } from "@/types/simulator";

import {
  accelerationAtVelocity,
  asymptoteAtTime,
  computeDragDescentState,
  kOf,
  positionAtTime,
  timeToHalfVMax,
  vMaxOf,
  velocityAtPosition,
  velocityAtTime,
} from "./dragDescentKinematics";

const params: DragDescentParams = { A: 0.122, B: 0.0007, tMax: 300 };

describe("vMaxOf / kOf", () => {
  it("is the speed where the acceleration vanishes", () => {
    const vMax = vMaxOf(params);
    expect(vMax).toBeCloseTo(Math.sqrt(params.A / params.B), 12);
    expect(accelerationAtVelocity(params, vMax)).toBeCloseTo(0, 12);
  });

  it("has k = B·v_max = √(A·B)", () => {
    expect(kOf(params)).toBeCloseTo(Math.sqrt(params.A * params.B), 12);
  });
});

describe("velocityAtTime", () => {
  it("starts from rest and approaches v_max asymptotically", () => {
    expect(velocityAtTime(params, 0)).toBe(0);
    expect(velocityAtTime(params, 1e6)).toBeCloseTo(vMaxOf(params), 9);
  });

  it("never exceeds v_max and increases monotonically", () => {
    let prev = -1;
    for (const t of [0, 10, 50, 100, 200, 400]) {
      const v = velocityAtTime(params, t);
      expect(v).toBeGreaterThan(prev);
      expect(v).toBeLessThan(vMaxOf(params));
      prev = v;
    }
  });

  it("has slope A at t = 0 (drag is still negligible)", () => {
    const h = 1e-6;
    expect(velocityAtTime(params, h) / h).toBeCloseTo(params.A, 6);
  });

  it("integrates a(v) consistently — dv/dt = A − B·v²", () => {
    const t = 40;
    const h = 1e-4;
    const dvdt =
      (velocityAtTime(params, t + h) - velocityAtTime(params, t - h)) / (2 * h);
    expect(dvdt).toBeCloseTo(
      accelerationAtVelocity(params, velocityAtTime(params, t)),
      6,
    );
  });
});

describe("positionAtTime", () => {
  it("starts at the origin", () => {
    expect(positionAtTime(params, 0)).toBe(0);
  });

  it("has v(t) as its derivative", () => {
    const t = 60;
    const h = 1e-4;
    const dxdt =
      (positionAtTime(params, t + h) - positionAtTime(params, t - h)) / (2 * h);
    expect(dxdt).toBeCloseTo(velocityAtTime(params, t), 6);
  });

  it("approaches the asymptote v_max·t − ln2/B for large t", () => {
    const t = 5000;
    expect(positionAtTime(params, t)).toBeCloseTo(
      asymptoteAtTime(params, t),
      3,
    );
  });
});

describe("velocityAtPosition", () => {
  it("agrees with v(t) evaluated at x(t) — the (t, x, v) triple is consistent", () => {
    for (const t of [5, 30, 90, 250]) {
      expect(velocityAtPosition(params, positionAtTime(params, t))).toBeCloseTo(
        velocityAtTime(params, t),
        8,
      );
    }
  });

  it("is zero at the start and clamps a negative radicand to zero", () => {
    expect(velocityAtPosition(params, 0)).toBe(0);
    expect(velocityAtPosition(params, -100)).toBe(0);
  });
});

describe("timeToHalfVMax", () => {
  it("is the time at which v = v_max/2", () => {
    const t = timeToHalfVMax(params);
    expect(velocityAtTime(params, t)).toBeCloseTo(vMaxOf(params) / 2, 9);
  });
});

describe("computeDragDescentState", () => {
  it("bundles v, x and a consistently", () => {
    const s = computeDragDescentState(params, 45);
    expect(s.t).toBe(45);
    expect(s.v).toBeCloseTo(velocityAtTime(params, 45), 12);
    expect(s.x).toBeCloseTo(positionAtTime(params, 45), 12);
    expect(s.a).toBeCloseTo(accelerationAtVelocity(params, s.v), 12);
    expect(s.vOverVmaxPct).toBeCloseTo((s.v / vMaxOf(params)) * 100, 9);
  });

  it("reports full acceleration and 0% of v_max at t = 0", () => {
    const s = computeDragDescentState(params, 0);
    expect(s.a).toBeCloseTo(params.A, 12);
    expect(s.vOverVmaxPct).toBe(0);
  });

  it("decays the acceleration toward zero as v saturates", () => {
    expect(computeDragDescentState(params, 1000).a).toBeCloseTo(0, 6);
  });
});
