import { describe, expect, it } from "vitest";

import type { RadarTrackingParams } from "@/types/simulator";

import {
  aircraftAcceleration,
  aircraftPosition,
  aircraftVelocity,
  computeRadarTrackingState,
  phiAtTime,
  speedAtTime,
  thetaAtTime,
  timeForPhi,
} from "./radarTrackingKinematics";

const params: RadarTrackingParams = {
  v0: 150,
  at: 25,
  rhoTraj: 2000,
  radarX: -800,
  radarY: -600,
};

describe("speedAtTime / phiAtTime", () => {
  it("is uniformly accelerated along the arc", () => {
    expect(speedAtTime(0, params)).toBe(150);
    expect(speedAtTime(4, params)).toBeCloseTo(150 + 100, 12);
    expect(phiAtTime(0, params)).toBe(0);
    expect(phiAtTime(4, params)).toBeCloseTo(
      (150 * 4 + 0.5 * 25 * 16) / 2000,
      12,
    );
  });

  it("has v as ρ·dφ/dt", () => {
    const t = 3;
    const h = 1e-6;
    const dphidt =
      (phiAtTime(t + h, params) - phiAtTime(t - h, params)) / (2 * h);
    expect(params.rhoTraj * dphidt).toBeCloseTo(speedAtTime(t, params), 5);
  });
});

describe("timeForPhi", () => {
  it("inverts phiAtTime", () => {
    for (const phi of [0.05, 0.2, 0.5]) {
      expect(phiAtTime(timeForPhi(phi, params), params)).toBeCloseTo(phi, 9);
    }
  });

  it("falls back to the linear form when a_t = 0", () => {
    const noAccel = { ...params, at: 0 };
    const t = timeForPhi(0.3, noAccel);
    expect(t).toBeCloseTo((0.3 * 2000) / 150, 12);
    expect(phiAtTime(t, noAccel)).toBeCloseTo(0.3, 12);
  });
});

describe("aircraft kinematics on the arc", () => {
  it("stays on a circle of radius ρ centred above the lowest point", () => {
    for (const phi of [0, 0.2, 0.6]) {
      const p = aircraftPosition(phi, params);
      expect(Math.hypot(p.x, p.y - params.rhoTraj)).toBeCloseTo(
        params.rhoTraj,
        9,
      );
    }
  });

  it("starts at the lowest point moving horizontally", () => {
    expect(aircraftPosition(0, params)).toEqual({ x: 0, y: 0 });
    const vel = aircraftVelocity(0, 150);
    expect(vel.vx).toBeCloseTo(150, 12);
    expect(vel.vy).toBeCloseTo(0, 12);
  });

  it("has a speed of exactly v regardless of φ", () => {
    for (const phi of [0, 0.3, 1.1]) {
      const { vx, vy } = aircraftVelocity(phi, 180);
      expect(Math.hypot(vx, vy)).toBeCloseTo(180, 9);
    }
  });

  it("splits the acceleration into a_t along v and a_n = v²/ρ toward the centre", () => {
    const phi = 0.4;
    const v = 180;
    const { ax, ay } = aircraftAcceleration(phi, v, params);
    const { vx, vy } = aircraftVelocity(phi, v);
    const tx = vx / v;
    const ty = vy / v;
    expect(ax * tx + ay * ty).toBeCloseTo(params.at, 9); // tangential part
    expect(-ax * ty + ay * tx).toBeCloseTo((v * v) / params.rhoTraj, 9); // normal
    expect(Math.hypot(ax, ay)).toBeCloseTo(
      Math.hypot(params.at, (v * v) / params.rhoTraj),
      9,
    );
  });
});

describe("computeRadarTrackingState", () => {
  it("reports the aircraft's position relative to the radar", () => {
    const s = computeRadarTrackingState(params, 5);
    const p = aircraftPosition(phiAtTime(5, params), params);
    expect(s.x).toBeCloseTo(p.x - params.radarX, 9);
    expect(s.y).toBeCloseTo(p.y - params.radarY, 9);
    expect(s.r).toBeCloseTo(Math.hypot(s.x, s.y), 9);
    expect(s.thetaDeg).toBeCloseTo((Math.atan2(s.y, s.x) * 180) / Math.PI, 9);
  });

  it("decomposes the velocity without changing its magnitude", () => {
    const t = 5;
    const s = computeRadarTrackingState(params, t);
    expect(Math.hypot(s.rDot, s.rThetaDot)).toBeCloseTo(
      speedAtTime(t, params),
      6,
    );
    expect(s.rThetaDot).toBeCloseTo(s.r * s.thetaDot, 9);
  });

  it("matches finite differences of r(t) and θ(t)", () => {
    const t = 5;
    const h = 1e-3;
    const rAt = (tt: number) => computeRadarTrackingState(params, tt).r;

    expect((rAt(t + h) - rAt(t - h)) / (2 * h)).toBeCloseTo(
      computeRadarTrackingState(params, t).rDot,
      4,
    );
    expect((rAt(t + h) - 2 * rAt(t) + rAt(t - h)) / (h * h)).toBeCloseTo(
      computeRadarTrackingState(params, t).rDDot,
      3,
    );
    expect(
      (thetaAtTime(t + h, params) - thetaAtTime(t - h, params)) / (2 * h),
    ).toBeCloseTo(computeRadarTrackingState(params, t).thetaDot, 6);
    expect(
      (thetaAtTime(t + h, params) -
        2 * thetaAtTime(t, params) +
        thetaAtTime(t - h, params)) /
        (h * h),
    ).toBeCloseTo(computeRadarTrackingState(params, t).thetaDDot, 6);
  });

  it("echoes t and φ", () => {
    const s = computeRadarTrackingState(params, 7);
    expect(s.t).toBe(7);
    expect(s.phi).toBeCloseTo(phiAtTime(7, params), 12);
  });

  it("moves the radar without changing the aircraft's motion", () => {
    const moved = computeRadarTrackingState(
      { ...params, radarX: 0, radarY: 0 },
      5,
    );
    const p = aircraftPosition(phiAtTime(5, params), params);
    expect(moved.x).toBeCloseTo(p.x, 9);
    expect(moved.y).toBeCloseTo(p.y, 9);
    expect(moved.phi).toBeCloseTo(computeRadarTrackingState(params, 5).phi, 12);
  });
});
