import { describe, expect, it } from "vitest";

import type { RailCarCouplingParams } from "@/types/simulator";

import {
  avgForce,
  computeRailCarCouplingState,
  finalSpeed,
  impulse,
  kmhToMs,
  speed1DuringCoupling,
  speed2DuringCoupling,
} from "./railCarCouplingKinematics";

const params: RailCarCouplingParams = {
  mass1: 40_000,
  mass2: 60_000,
  speed1Kmh: 2,
  couplingTime: 3,
};

describe("finalSpeed", () => {
  it("conserves momentum", () => {
    const vf = finalSpeed(40_000, 5, 60_000);
    expect(40_000 * 5).toBeCloseTo(100_000 * vf, 9);
  });

  it("halves the speed for equal masses", () => {
    expect(finalSpeed(1000, 8, 1000)).toBeCloseTo(4, 12);
  });

  it("is unchanged when the struck car has no mass", () => {
    expect(finalSpeed(1000, 8, 0)).toBeCloseTo(8, 12);
  });

  it("always lands between rest and the initial speed", () => {
    for (const m2 of [1, 100, 10_000, 1e6]) {
      const vf = finalSpeed(40_000, 3, m2);
      expect(vf).toBeGreaterThan(0);
      expect(vf).toBeLessThan(3);
    }
  });
});

describe("impulse / avgForce", () => {
  it("equals the momentum lost by the moving car", () => {
    const vf = finalSpeed(40_000, 5, 60_000);
    expect(impulse(40_000, 5, vf)).toBeCloseTo(40_000 * (5 - vf), 6);
  });

  it("matches the momentum gained by the struck car", () => {
    const vf = finalSpeed(40_000, 5, 60_000);
    expect(impulse(40_000, 5, vf)).toBeCloseTo(60_000 * vf, 6);
  });

  it("divides the impulse by the coupling time", () => {
    expect(avgForce(6000, 3)).toBeCloseTo(2000, 12);
  });

  it("returns 0 rather than Infinity for an instantaneous coupling", () => {
    expect(avgForce(6000, 0)).toBe(0);
    expect(avgForce(6000, -1)).toBe(0);
  });
});

describe("computeRailCarCouplingState", () => {
  it("solves the reference case (40 t at 2 km/h into 60 t over 3 s)", () => {
    const s = computeRailCarCouplingState(params);
    expect(s.speed1).toBeCloseTo(2 / 3.6, 12);
    expect(s.finalSpeed).toBeCloseTo(0.4 * (2 / 3.6), 12); // 40/100 of v1
    expect(s.impulse).toBeCloseTo(40_000 * (s.speed1 - s.finalSpeed), 6);
    expect(s.avgForce).toBeCloseTo(s.impulse / 3, 6);
  });

  it("scales the mean force inversely with the coupling time", () => {
    const slow = computeRailCarCouplingState({ ...params, couplingTime: 6 });
    const fast = computeRailCarCouplingState({ ...params, couplingTime: 3 });
    expect(fast.avgForce).toBeCloseTo(2 * slow.avgForce, 6);
  });
});

describe("speed ramps during coupling", () => {
  const v1 = kmhToMs(2);
  const vf = finalSpeed(params.mass1, v1, params.mass2);
  const T = params.couplingTime;

  it("starts at v1 / rest and ends at the common speed", () => {
    expect(speed1DuringCoupling(0, v1, vf, T)).toBe(v1);
    expect(speed2DuringCoupling(0, vf, T)).toBe(0);
    expect(speed1DuringCoupling(T, v1, vf, T)).toBe(vf);
    expect(speed2DuringCoupling(T, vf, T)).toBe(vf);
  });

  it("holds the end values outside the coupling window", () => {
    expect(speed1DuringCoupling(-5, v1, vf, T)).toBe(v1);
    expect(speed2DuringCoupling(-5, vf, T)).toBe(0);
    expect(speed1DuringCoupling(T + 10, v1, vf, T)).toBe(vf);
    expect(speed2DuringCoupling(T + 10, vf, T)).toBe(vf);
  });

  it("ramps linearly, meeting at the midpoint value", () => {
    expect(speed1DuringCoupling(T / 2, v1, vf, T)).toBeCloseTo(
      (v1 + vf) / 2,
      12,
    );
    expect(speed2DuringCoupling(T / 2, vf, T)).toBeCloseTo(vf / 2, 12);
  });

  it("conserves momentum at every instant of the ramp", () => {
    for (const t of [0, 0.5, 1.5, 2.9, 3]) {
      const p =
        params.mass1 * speed1DuringCoupling(t, v1, vf, T) +
        params.mass2 * speed2DuringCoupling(t, vf, T);
      expect(p).toBeCloseTo(params.mass1 * v1, 6);
    }
  });

  it("snaps to the end state when the coupling is instantaneous", () => {
    expect(speed1DuringCoupling(0.5, v1, vf, 0)).toBe(v1);
    expect(speed2DuringCoupling(0.5, vf, 0)).toBe(0);
  });
});
