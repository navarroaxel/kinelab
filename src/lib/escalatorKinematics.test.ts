import { describe, expect, it } from "vitest";

import type { EscalatorParams } from "@/types/simulator";

import {
  G,
  computeEscalatorState,
  efficiencyAtPeopleCount,
  electricalPower,
  mechanicalPower,
} from "./escalatorKinematics";

const params: EscalatorParams = {
  voltage: 380,
  lineCurrent: 5.365,
  powerFactor: 0.9,
  numPeople: 30,
  personMass: 75,
  height: 7,
  liftTime: 60,
};

describe("electricalPower", () => {
  it("is √3 · V · I · cos φ", () => {
    expect(electricalPower(380, 5.365, 0.9)).toBeCloseTo(
      Math.sqrt(3) * 380 * 5.365 * 0.9,
      9,
    );
  });

  it("scales linearly with each factor", () => {
    const p = electricalPower(380, 5, 0.9);
    expect(electricalPower(760, 5, 0.9)).toBeCloseTo(2 * p, 9);
    expect(electricalPower(380, 10, 0.9)).toBeCloseTo(2 * p, 9);
    expect(electricalPower(380, 5, 0.45)).toBeCloseTo(p / 2, 9);
  });

  it("is zero at zero current", () => {
    expect(electricalPower(380, 0, 0.9)).toBe(0);
  });
});

describe("mechanicalPower", () => {
  it("is n·m·g·h / t", () => {
    expect(mechanicalPower(30, 75, 7, 60)).toBeCloseTo(
      (30 * 75 * G * 7) / 60,
      9,
    );
  });

  it("returns 0 rather than Infinity for a zero lift time", () => {
    expect(mechanicalPower(30, 75, 7, 0)).toBe(0);
    expect(mechanicalPower(30, 75, 7, -5)).toBe(0);
  });

  it("is zero with no passengers", () => {
    expect(mechanicalPower(0, 75, 7, 60)).toBe(0);
  });
});

describe("computeEscalatorState", () => {
  it("solves the reference case with an efficiency below 1", () => {
    const s = computeEscalatorState(params);
    expect(s.electricalPower).toBeCloseTo(3178.02, 1);
    expect(s.mechanicalPower).toBeCloseTo(2575.125, 6);
    expect(s.efficiency).toBeGreaterThan(0);
    expect(s.efficiency).toBeLessThan(1);
    expect(s.efficiency).toBeCloseTo(s.mechanicalPower / s.electricalPower, 12);
  });

  it("derives the climb speed and total work output", () => {
    const s = computeEscalatorState(params);
    expect(s.climbSpeed).toBeCloseTo(7 / 60, 12);
    expect(s.workOutput).toBeCloseTo(30 * 75 * G * 7, 9);
    // Work / time is exactly the useful mechanical power.
    expect(s.workOutput / params.liftTime).toBeCloseTo(s.mechanicalPower, 9);
  });

  it("guards against division by zero", () => {
    expect(
      computeEscalatorState({ ...params, lineCurrent: 0 }).efficiency,
    ).toBe(0);
    expect(computeEscalatorState({ ...params, liftTime: 0 }).climbSpeed).toBe(
      0,
    );
  });
});

describe("efficiencyAtPeopleCount", () => {
  it("is linear in the passenger count and agrees with the state at the nominal count", () => {
    expect(efficiencyAtPeopleCount(params.numPeople, params)).toBeCloseTo(
      computeEscalatorState(params).efficiency,
      12,
    );
    expect(efficiencyAtPeopleCount(15, params)).toBeCloseTo(
      efficiencyAtPeopleCount(30, params) / 2,
      12,
    );
    expect(efficiencyAtPeopleCount(0, params)).toBe(0);
  });

  it("returns 0 when there is no electrical input", () => {
    expect(efficiencyAtPeopleCount(30, { ...params, voltage: 0 })).toBe(0);
  });
});
