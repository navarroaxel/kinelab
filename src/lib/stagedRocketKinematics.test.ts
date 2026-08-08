import { describe, expect, it } from "vitest";

import type { StagedRocketParams } from "@/types/simulator";

import {
  burnTime,
  computeSingleStage,
  computeStagedRocketState,
  computeTwoStage,
  massAtTime,
  velocityAtTime,
} from "./stagedRocketKinematics";

const params: StagedRocketParams = {
  payloadMass: 540,
  singleStageMass: 19000,
  singleStageFuelMass: 17800,
  twoStageMassEach: 9500,
  twoStageFuelMassEach: 8900,
  fuelRate: 225,
  exhaustVelocity: 3600,
};

describe("burnTime / massAtTime", () => {
  it("divides fuel mass by the burn rate", () => {
    expect(burnTime(17800, 225)).toBeCloseTo(17800 / 225, 9);
  });

  it("returns 0 for a non-positive fuel rate", () => {
    expect(burnTime(17800, 0)).toBe(0);
  });

  it("depletes mass linearly with time", () => {
    expect(massAtTime(0, 19540, 225)).toBe(19540);
    const t = burnTime(17800, 225);
    expect(massAtTime(t, 19540, 225)).toBeCloseTo(19540 - 17800, 6);
  });
});

describe("velocityAtTime", () => {
  it("starts at v0 when t=0", () => {
    expect(velocityAtTime(0, 19540, 225, 3600, 5)).toBe(5);
  });

  it("increases as mass is burned off", () => {
    const v1 = velocityAtTime(10, 19540, 225, 3600);
    const v2 = velocityAtTime(20, 19540, 225, 3600);
    expect(v2).toBeGreaterThan(v1);
  });

  it("carries over the starting speed v0 (why staging helps)", () => {
    const withoutV0 = velocityAtTime(10, 19540, 225, 3600, 0);
    const withV0 = velocityAtTime(10, 19540, 225, 3600, 100);
    expect(withV0).toBeCloseTo(withoutV0 + 100, 6);
  });
});

describe("computeSingleStage", () => {
  it("solves the reference single-stage design", () => {
    const s = computeSingleStage(params);
    expect(s.initialMass).toBe(540 + 19000);
    expect(s.burnoutMass).toBe(540 + 19000 - 17800);
    expect(s.burnTime).toBeCloseTo(17800 / 225, 6);
    // Max speed is reached exactly at burnout.
    expect(s.maxSpeed).toBeCloseTo(
      velocityAtTime(s.burnTime, s.initialMass, 225, 3600),
      9,
    );
    expect(s.maxSpeed).toBeGreaterThan(0);
  });
});

describe("computeTwoStage", () => {
  it("solves the reference two-stage design and beats the single stage", () => {
    const two = computeTwoStage(params);
    const single = computeSingleStage(params);

    expect(two.initialMass).toBe(540 + 2 * 9500);
    expect(two.stageDryMass).toBe(9500 - 8900);
    expect(two.speedAtSeparation).toBeGreaterThan(0);
    expect(two.maxSpeed).toBeGreaterThan(two.speedAtSeparation);
    // Staging jettisons dead weight, so it should out-perform a single
    // stage carrying the same total fuel + structure.
    expect(two.maxSpeed).toBeGreaterThan(single.maxSpeed);
  });

  it("has stage B's speed build on stage A's separation speed", () => {
    const two = computeTwoStage(params);
    const stageBOnly = velocityAtTime(
      two.burnTimeB,
      two.massAfterSeparation,
      225,
      3600,
    );
    expect(two.maxSpeed).toBeCloseTo(stageBOnly + two.speedAtSeparation, 6);
  });
});

describe("computeStagedRocketState", () => {
  it("reports a positive speed gain from staging", () => {
    const s = computeStagedRocketState(params);
    expect(s.speedGain).toBeCloseTo(
      s.twoStage.maxSpeed - s.singleStage.maxSpeed,
      9,
    );
    expect(s.speedGain).toBeGreaterThan(0);
  });
});
