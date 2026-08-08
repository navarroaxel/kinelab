import { describe, expect, it } from "vitest";

import type { ElevatorCounterweightParams } from "@/types/simulator";

import {
  G,
  computeElevatorCounterweightState,
  motorPower,
} from "./elevatorCounterweightKinematics";

const params: ElevatorCounterweightParams = {
  elevatorMass: 3000,
  counterweightMass: 1000,
  elevatorVelocity: -3,
  elevatorAcceleration: 0,
};

describe("motorPower", () => {
  it("solves reference case a): descending at constant speed needs braking", () => {
    // Heavier elevator (3000 kg) descending steadily — gravity alone would
    // over-accelerate it, so the motor must brake: P < 0.
    const P = motorPower(3000, 1000, -3, 0);
    expect(P).toBeCloseTo((3000 - 1000) * G * -3, 6);
    expect(P).toBeLessThan(0);
    expect(P / 1000).toBeCloseTo(-58.86, 1);
  });

  it("solves reference case b): ascending while decelerating needs driving", () => {
    const P = motorPower(3000, 1000, 3, -0.5);
    expect(P).toBeGreaterThan(0);
    expect(P / 1000).toBeCloseTo(52.86, 1);
  });

  it("is zero when the elevator isn't moving", () => {
    expect(motorPower(3000, 1000, 0, 5)).toBe(0);
  });

  it("reduces to the pure-gravity term when acceleration is zero", () => {
    expect(motorPower(3000, 1000, 2, 0)).toBeCloseTo(
      (3000 - 1000) * G * 2,
      9,
    );
  });

  it("is zero for balanced masses moving at constant speed", () => {
    expect(motorPower(2000, 2000, 5, 0)).toBeCloseTo(0, 9);
  });

  it("accepts a gravity override", () => {
    expect(motorPower(3000, 1000, -3, 0, 10)).toBeCloseTo(
      (3000 - 1000) * 10 * -3,
      9,
    );
  });
});

describe("computeElevatorCounterweightState", () => {
  it("flags braking for reference case a)", () => {
    const s = computeElevatorCounterweightState(params);
    expect(s.isBraking).toBe(true);
    expect(s.motorPower).toBeLessThan(0);
  });

  it("flags driving for reference case b)", () => {
    const s = computeElevatorCounterweightState({
      ...params,
      elevatorVelocity: 3,
      elevatorAcceleration: -0.5,
    });
    expect(s.isBraking).toBe(false);
    expect(s.motorPower).toBeGreaterThan(0);
  });

  it("isBraking is exactly motorPower < 0", () => {
    const s = computeElevatorCounterweightState(params);
    expect(s.isBraking).toBe(s.motorPower < 0);
  });
});
