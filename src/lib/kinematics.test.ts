import { describe, expect, it } from "vitest";

import type { SimulatorParams } from "@/types/simulator";

import { computeKinematics } from "./kinematics";

const base: SimulatorParams = {
  poleX: 0,
  poleY: 0,
  angularVelocity: 60, // deg/s
  angularAcceleration: 0,
  circleRadius: 100,
};

const OMEGA = (60 * Math.PI) / 180; // rad/s, matching base.angularVelocity

describe("computeKinematics", () => {
  it("places the point on the circle of radius R", () => {
    for (const phi of [0, 0.7, Math.PI / 2, 2.3, Math.PI]) {
      const s = computeKinematics(phi, base.angularVelocity, base);
      expect(Math.hypot(s.ptx, s.pty)).toBeCloseTo(base.circleRadius, 9);
    }
  });

  it("reduces to pure rotation when the pole sits at the centre", () => {
    for (const phi of [0, 1.1, Math.PI / 2, 4.0]) {
      const s = computeKinematics(phi, base.angularVelocity, base);
      expect(s.r).toBeCloseTo(base.circleRadius, 9);
      expect(s.theta).toBeCloseTo(phi > Math.PI ? phi - 2 * Math.PI : phi, 9);
      expect(s.rDot).toBeCloseTo(0, 9);
      expect(s.rThetaDot).toBeCloseTo(base.circleRadius * OMEGA, 9);
    }
  });

  it("matches the closed forms ṙ = Rω·sin(θ−φ) and rθ̇ = Rω·cos(φ−θ) for an offset pole", () => {
    const params = { ...base, poleX: 37, poleY: -19 };
    for (const phi of [0.2, 1.4, 3.0, 5.5]) {
      const s = computeKinematics(phi, params.angularVelocity, params);
      const Rw = params.circleRadius * OMEGA;
      expect(s.rDot).toBeCloseTo(Rw * Math.sin(s.theta - phi), 9);
      expect(s.rThetaDot).toBeCloseTo(Rw * Math.cos(phi - s.theta), 9);
    }
  });

  it("keeps the polar decomposition norm-preserving", () => {
    const params = { ...base, poleX: -55, poleY: 22, angularAcceleration: 40 };
    for (const phi of [0.1, 2.2, 4.4]) {
      const s = computeKinematics(phi, params.angularVelocity, params);
      expect(Math.hypot(s.rDot, s.rThetaDot)).toBeCloseTo(
        Math.hypot(s.vx, s.vy),
        9,
      );
      expect(Math.hypot(s.ar, s.aTheta)).toBeCloseTo(Math.hypot(s.ax, s.ay), 9);
    }
  });

  it("keeps velocity tangent (perpendicular to the radius) and acceleration split into a_t / a_N", () => {
    const params = { ...base, angularAcceleration: 30 };
    const alpha = (30 * Math.PI) / 180;
    for (const phi of [0.3, 1.9, 3.6]) {
      const s = computeKinematics(phi, params.angularVelocity, params);
      expect(s.ptx * s.vx + s.pty * s.vy).toBeCloseTo(0, 6);
      expect(Math.hypot(s.vx, s.vy)).toBeCloseTo(
        params.circleRadius * OMEGA,
        9,
      );
      expect(s.at).toBeCloseTo(params.circleRadius * alpha, 9);
      expect(s.aN).toBeCloseTo(params.circleRadius * OMEGA ** 2, 9);
      expect(Math.hypot(s.ax, s.ay)).toBeCloseTo(Math.hypot(s.at, s.aN), 9);
    }
  });

  it("has zero velocity and acceleration when the disc is at rest", () => {
    const s = computeKinematics(1.2, 0, { ...base, angularAcceleration: 0 });
    expect(s.vx).toBeCloseTo(0, 12);
    expect(s.vy).toBeCloseTo(0, 12);
    expect(s.ax).toBeCloseTo(0, 12);
    expect(s.ay).toBeCloseTo(0, 12);
    expect(s.aN).toBeCloseTo(0, 12);
    expect(s.at).toBeCloseTo(0, 12);
  });

  it("reports ω back in deg/s, unconverted", () => {
    expect(computeKinematics(0, -140, base).omega).toBe(-140);
  });
});
