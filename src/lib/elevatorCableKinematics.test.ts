import { describe, expect, it } from "vitest";

import type { ElevatorCableParams } from "@/types/simulator";

import {
  accelerationAtTime,
  computeElevatorCableState,
  positionAtTime,
  timeAtPosition,
  velocityAtTime,
} from "./elevatorCableKinematics";

const params: ElevatorCableParams = { b: 10, v0: 2, x0: 0 };

describe("positionAtTime", () => {
  it("satisfies the cable-length constraint √(b² + x²) = b + v0·t", () => {
    for (const t of [0.5, 2, 7, 20]) {
      const x = positionAtTime(t, params);
      expect(Math.sqrt(params.b ** 2 + x ** 2)).toBeCloseTo(
        params.b + params.v0 * t,
        9,
      );
    }
  });

  it("starts at the pulley foot (x = 0) at t = 0", () => {
    expect(positionAtTime(0, params)).toBe(0);
  });

  it("increases monotonically", () => {
    const xs = [0, 1, 4, 9, 25].map((t) => positionAtTime(t, params));
    for (let i = 1; i < xs.length; i++)
      expect(xs[i]).toBeGreaterThan(xs[i - 1]);
  });
});

describe("velocityAtTime / accelerationAtTime", () => {
  it("matches a finite difference of x(t)", () => {
    const t = 6;
    const h = 1e-5;
    const fd =
      (positionAtTime(t + h, params) - positionAtTime(t - h, params)) / (2 * h);
    expect(fd).toBeCloseTo(velocityAtTime(t, params), 6);
  });

  it("matches a finite difference of ẋ(t)", () => {
    const t = 6;
    const h = 1e-5;
    const fd =
      (velocityAtTime(t + h, params) - velocityAtTime(t - h, params)) / (2 * h);
    expect(fd).toBeCloseTo(accelerationAtTime(t, params), 6);
  });

  it("decelerates (ẍ < 0) and decays toward the cable speed v0 from above", () => {
    for (const t of [1, 5, 20]) {
      expect(accelerationAtTime(t, params)).toBeLessThan(0);
      expect(velocityAtTime(t, params)).toBeGreaterThan(params.v0);
    }
    expect(velocityAtTime(1e6, params)).toBeCloseTo(params.v0, 6);
  });

  it("blows up at t → 0, where the car moves perpendicular to the cable", () => {
    expect(velocityAtTime(1e-9, params)).toBeGreaterThan(1e3);
  });
});

describe("timeAtPosition", () => {
  it("inverts positionAtTime", () => {
    for (const x of [0, 3, 10, 40]) {
      expect(positionAtTime(timeAtPosition(x, params), params)).toBeCloseTo(
        x,
        6,
      );
    }
  });

  it("returns t = 0 for x = 0", () => {
    expect(timeAtPosition(0, params)).toBe(0);
  });
});

describe("computeElevatorCableState", () => {
  it("flags the singularity when x0 = 0 and the clock has not advanced", () => {
    const s = computeElevatorCableState(params, 0);
    expect(s.singular).toBe(true);
    expect(s.x).toBe(0);
    expect(s.xDot).toBe(Infinity);
    expect(s.xDDot).toBe(-Infinity);
  });

  it("is regular immediately after the start", () => {
    const s = computeElevatorCableState(params, 1);
    expect(s.singular).toBe(false);
    expect(Number.isFinite(s.xDot)).toBe(true);
    expect(s.xDot).toBeGreaterThan(params.v0);
    expect(s.xDDot).toBeLessThan(0);
  });

  it("offsets the clock so that τ = 0 lands exactly on x0", () => {
    const offset = { ...params, x0: 8 };
    const s = computeElevatorCableState(offset, 0);
    expect(s.x).toBeCloseTo(8, 9);
    expect(s.singular).toBe(false);
    expect(s.t).toBe(0);
  });

  it("advances from x0 by the same amount the closed form predicts", () => {
    const offset = { ...params, x0: 8 };
    const t0 = timeAtPosition(8, offset);
    const s = computeElevatorCableState(offset, 3);
    expect(s.x).toBeCloseTo(positionAtTime(t0 + 3, offset), 9);
    expect(s.xDot).toBeCloseTo(velocityAtTime(t0 + 3, offset), 9);
    expect(s.xDDot).toBeCloseTo(accelerationAtTime(t0 + 3, offset), 9);
  });
});
