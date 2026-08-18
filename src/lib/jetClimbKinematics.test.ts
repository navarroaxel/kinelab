import { describe, expect, it } from "vitest";

import type { JetClimbParams } from "@/types/simulator";

import {
  G,
  accelAtTime,
  computeJetClimbState,
  speedAtTime,
  thrustForce,
} from "./jetClimbKinematics";

const params: JetClimbParams = {
  massMg: 16,
  climbAngleDeg: 18,
  climbSpeedKmh: 774,
  massFlowRate: 300,
  exhaustVelocity: 665,
};

describe("thrustForce", () => {
  it("is ṁ · v_rel", () => {
    expect(thrustForce(300, 665)).toBe(300 * 665);
  });
});

describe("computeJetClimbState", () => {
  it("solves the reference case: a0 ≈ 3.03 m/s², v_max ≈ 247.1 m/s (≈ 889.7 km/h)", () => {
    const s = computeJetClimbState(params);
    expect(s.thrust).toBe(199500);
    expect(s.v0).toBeCloseTo(215, 6);
    expect(s.initialAccel).toBeCloseTo(3.0315, 3);
    expect(s.vMax).toBeCloseTo(247.13, 1);
    expect((s.vMax * 3.6)).toBeCloseTo(889.67, 0);
  });

  it("initial acceleration equals g·sin θ exactly", () => {
    const s = computeJetClimbState(params);
    const angle = (params.climbAngleDeg * Math.PI) / 180;
    expect(s.initialAccel).toBeCloseTo(G * Math.sin(angle), 9);
  });

  it("drag at v0 equals thrust minus the weight component along the path", () => {
    const s = computeJetClimbState(params);
    expect(s.drag0).toBeCloseTo(s.thrust - s.weightAlongPath, 6);
    expect(s.dragCoeff * s.v0 * s.v0).toBeCloseTo(s.drag0, 6);
  });

  it("thrust equals k·v_max² at the terminal speed", () => {
    const s = computeJetClimbState(params);
    expect(s.dragCoeff * s.vMax * s.vMax).toBeCloseTo(s.thrust, 3);
  });
});

describe("speedAtTime", () => {
  it("starts at v0 and asymptotically approaches v_max", () => {
    const s = computeJetClimbState(params);
    expect(speedAtTime(0, s)).toBeCloseTo(s.v0, 6);
    expect(speedAtTime(500, s)).toBeCloseTo(s.vMax, 3);
    expect(speedAtTime(30, s)).toBeGreaterThan(s.v0);
    expect(speedAtTime(30, s)).toBeLessThan(s.vMax);
  });

  it("is monotonically increasing toward v_max", () => {
    const s = computeJetClimbState(params);
    let prev = speedAtTime(0, s);
    for (let t = 1; t <= 60; t++) {
      const v = speedAtTime(t, s);
      expect(v).toBeGreaterThanOrEqual(prev);
      prev = v;
    }
  });
});

describe("accelAtTime", () => {
  it("matches the analytic initial acceleration at t = 0", () => {
    const s = computeJetClimbState(params);
    const mass = params.massMg * 1000;
    expect(accelAtTime(0, s, mass)).toBeCloseTo(s.initialAccel, 3);
  });

  it("decays to zero as v approaches v_max", () => {
    const s = computeJetClimbState(params);
    const mass = params.massMg * 1000;
    expect(accelAtTime(500, s, mass)).toBeCloseTo(0, 3);
  });
});
