import { describe, expect, it } from "vitest";

import type { StoppingDistanceParams } from "@/types/simulator";

import {
  G,
  computeAllCases,
  computeCase,
  positionAtTime,
  velocityAtTime,
} from "./stoppingDistanceKinematics";

const params: StoppingDistanceParams = {
  speedsKmh: [40, 80, 100],
  reactionTime: 0.7,
  decelFactor: 0.5,
  obstacleDistance: 50,
};

describe("computeCase", () => {
  it("splits the distance into reaction and braking phases", () => {
    const c = computeCase(80, 0.7, 0.5, 50);
    const v0 = 80 / 3.6;
    expect(c.v0).toBeCloseTo(v0, 12);
    expect(c.a).toBeCloseTo(0.5 * G, 12);
    expect(c.d1).toBeCloseTo(v0 * 0.7, 12);
    expect(c.d2).toBeCloseTo((v0 * v0) / (2 * 0.5 * G), 9);
    expect(c.D).toBeCloseTo(c.d1 + c.d2, 12);
    expect(c.tf).toBeCloseTo(v0 / (0.5 * G), 9);
    expect(c.tTotal).toBeCloseTo(0.7 + c.tf, 12);
  });

  it("makes the braking distance grow with the square of the speed", () => {
    const slow = computeCase(40, 0.7, 0.5, 50);
    const fast = computeCase(80, 0.7, 0.5, 50);
    expect(fast.d2 / slow.d2).toBeCloseTo(4, 9);
    expect(fast.d1 / slow.d1).toBeCloseTo(2, 9); // reaction distance is linear
  });

  it("flags cases that overrun the obstacle", () => {
    expect(computeCase(40, 0.7, 0.5, 50).exceedsObstacle).toBe(false);
    expect(computeCase(100, 0.7, 0.5, 50).exceedsObstacle).toBe(true);
  });

  it("degenerates safely when there is no braking", () => {
    const c = computeCase(80, 0.7, 0, 50);
    expect(c.a).toBe(0);
    expect(c.tf).toBe(0);
    expect(c.d2).toBe(0);
    expect(c.D).toBeCloseTo(c.d1, 12);
  });

  it("reduces to pure braking with zero reaction time", () => {
    const c = computeCase(80, 0, 0.5, 50);
    expect(c.d1).toBe(0);
    expect(c.D).toBeCloseTo(c.d2, 12);
    expect(c.tTotal).toBeCloseTo(c.tf, 12);
  });

  it("matches a numerical integration of v(t)", () => {
    const c = computeCase(100, 0.7, 0.5, 50);
    const steps = 200_000;
    const dt = c.tTotal / steps;
    let x = 0;
    for (let i = 0; i < steps; i++) {
      x +=
        ((velocityAtTime(c, i * dt) + velocityAtTime(c, (i + 1) * dt)) / 2) *
        dt;
    }
    expect(x).toBeCloseTo(c.D, 3);
  });
});

describe("computeAllCases", () => {
  it("returns one case per configured speed, in order", () => {
    const cases = computeAllCases(params);
    expect(cases.map((c) => c.speedKmh)).toEqual([40, 80, 100]);
    for (let i = 1; i < cases.length; i++) {
      expect(cases[i].D).toBeGreaterThan(cases[i - 1].D);
    }
  });

  it("threads the shared reaction time, deceleration and obstacle through", () => {
    const cases = computeAllCases({ ...params, obstacleDistance: 10 });
    expect(cases.every((c) => c.exceedsObstacle)).toBe(true);
    expect(cases.every((c) => c.a === 0.5 * G)).toBe(true);
  });
});

describe("velocityAtTime", () => {
  const c = computeCase(80, 0.7, 0.5, 50);

  it("holds v0 through the reaction phase, then ramps down to rest", () => {
    expect(velocityAtTime(c, 0)).toBeCloseTo(c.v0, 12);
    expect(velocityAtTime(c, 0.7)).toBeCloseTo(c.v0, 12);
    expect(velocityAtTime(c, 0.7 + c.tf / 2)).toBeCloseTo(c.v0 / 2, 9);
    expect(velocityAtTime(c, c.tTotal)).toBeCloseTo(0, 9);
  });

  it("clamps at zero after the stop", () => {
    expect(velocityAtTime(c, c.tTotal + 10)).toBe(0);
  });
});

describe("positionAtTime", () => {
  const c = computeCase(80, 0.7, 0.5, 50);

  it("is linear during the reaction phase", () => {
    expect(positionAtTime(c, 0)).toBe(0);
    expect(positionAtTime(c, 0.35)).toBeCloseTo(c.v0 * 0.35, 12);
    expect(positionAtTime(c, 0.7)).toBeCloseTo(c.d1, 12);
  });

  it("reaches exactly D at the stop and stays there", () => {
    expect(positionAtTime(c, c.tTotal)).toBeCloseTo(c.D, 9);
    expect(positionAtTime(c, c.tTotal + 100)).toBe(c.D);
  });

  it("increases monotonically and never overshoots D", () => {
    let prev = -1;
    for (let i = 0; i <= 200; i++) {
      const x = positionAtTime(c, (i / 200) * c.tTotal);
      expect(x).toBeGreaterThanOrEqual(prev);
      expect(x).toBeLessThanOrEqual(c.D + 1e-9);
      prev = x;
    }
  });
});
