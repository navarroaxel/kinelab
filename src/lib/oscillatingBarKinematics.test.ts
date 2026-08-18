import { describe, expect, it } from "vitest";

import {
  accelerationTerms,
  barAngle,
  barAngleLimits,
  computeOscillatingBarState,
  crankAngleFor,
  toDegrees,
} from "./oscillatingBarKinematics";
import type { OscillatingBarParams } from "@/types/simulator";

// The statement: b = 1 m, OB = 2b, ω = 3 rad/s, asked at θ = 20°.
const STATEMENT: OscillatingBarParams = {
  barLength: 1,
  separation: 2,
  omega: 3,
  targetThetaDeg: 20,
};

const DEG = Math.PI / 180;

describe("geometry", () => {
  it("closes the loop: tan θ = b·sen φ / (d − b·cos φ)", () => {
    for (const deg of [0, 23.16, 60, 140, 250]) {
      const phi = deg * DEG;
      const theta = barAngle(phi, STATEMENT);
      expect(Math.tan(theta)).toBeCloseTo(
        Math.sin(phi) / (2 - Math.cos(phi)),
        10,
      );
    }
  });

  it("puts the crank at φ = 23.16° when θ = 20°", () => {
    const phi = crankAngleFor(20 * DEG, STATEMENT)!;
    expect(toDegrees(phi)).toBeCloseTo(23.16, 2);
    expect(toDegrees(barAngle(phi, STATEMENT))).toBeCloseTo(20, 9);
  });

  it("oscillates rather than rotates, swinging only ±30° for d = 2b", () => {
    const limits = barAngleLimits(STATEMENT);
    expect(toDegrees(limits.maxBarAngle)).toBeCloseTo(30, 9);
    expect(limits.reachable).toBe(true);

    let widest = 0;
    for (let deg = 0; deg < 360; deg += 0.25) {
      widest = Math.max(widest, Math.abs(barAngle(deg * DEG, STATEMENT)));
    }
    expect(toDegrees(widest)).toBeCloseTo(30, 1);
  });

  it("refuses a target beyond the swing", () => {
    expect(crankAngleFor(45 * DEG, STATEMENT)).toBeNull();
    expect(barAngleLimits({ ...STATEMENT, targetThetaDeg: 45 }).reachable).toBe(
      false,
    );
  });
});

describe("the answers at θ = 20°", () => {
  const phi = crankAngleFor(20 * DEG, STATEMENT)!;
  const state = computeOscillatingBarState(STATEMENT, phi);

  it("gives BC an angular velocity of 1.90 rad/s, clockwise", () => {
    expect(state.thetaRate).toBeCloseTo(1.903, 3);
    expect(state.barOmega).toBeCloseTo(-1.903, 3);
  });

  it("gives BC an angular acceleration of 12.15 rad/s², counterclockwise", () => {
    expect(state.thetaAccel).toBeCloseTo(-12.15, 2);
    expect(state.barAlpha).toBeCloseTo(12.15, 2);
  });

  it("has the pin 1.150 m from B, sliding outward at 2.052 m/s", () => {
    expect(state.reach).toBeCloseTo(1.1499, 3);
    expect(state.reachRate).toBeCloseTo(2.0521, 3);
    expect(state.reachAccel).toBeCloseTo(10.731, 2);
  });

  it("moves the pin at b·ω with an acceleration of b·ω² toward O", () => {
    expect(state.pinSpeed).toBeCloseTo(3, 12);
    expect(state.pinAccel).toBeCloseTo(9, 12);
  });
});

describe("closed forms against numerical differentiation", () => {
  const numerical = (
    f: (phi: number) => number,
    phi: number,
    h = 1e-5,
  ): { first: number; second: number } => ({
    first: (f(phi + h) - f(phi - h)) / (2 * h),
    second: (f(phi + h) - 2 * f(phi) + f(phi - h)) / (h * h),
  });

  it("matches dθ/dφ and d²θ/dφ² at several crank angles", () => {
    for (const deg of [10, 23.16, 75, 150, 300]) {
      const phi = deg * DEG;
      const state = computeOscillatingBarState(STATEMENT, phi);
      const { first, second } = numerical((p) => barAngle(p, STATEMENT), phi);
      // θ̇ = ω·dθ/dφ and θ̈ = ω²·d²θ/dφ², since φ̈ = 0.
      expect(state.thetaRate).toBeCloseTo(STATEMENT.omega * first, 5);
      expect(state.thetaAccel).toBeCloseTo(STATEMENT.omega ** 2 * second, 3);
    }
  });

  it("matches ṙ and r̈", () => {
    const reachOf = (p: number) => Math.sqrt(4 + 1 - 2 * 2 * Math.cos(p));
    for (const deg of [10, 23.16, 75, 150, 300]) {
      const phi = deg * DEG;
      const state = computeOscillatingBarState(STATEMENT, phi);
      const { first, second } = numerical(reachOf, phi);
      expect(state.reachRate).toBeCloseTo(STATEMENT.omega * first, 5);
      expect(state.reachAccel).toBeCloseTo(STATEMENT.omega ** 2 * second, 3);
    }
  });
});

describe("structure", () => {
  it("stops BC exactly at the extremes of its swing", () => {
    // θ̇ = 0 when cos φ = b/d, i.e. φ = 60° for d = 2b.
    const state = computeOscillatingBarState(STATEMENT, 60 * DEG);
    expect(state.thetaRate).toBeCloseTo(0, 12);
    expect(toDegrees(state.barAngle)).toBeCloseTo(30, 9);
  });

  it("turns the driven bar uniformly at half speed when d = b", () => {
    const equal = { ...STATEMENT, separation: 1 };
    for (const deg of [40, 130, 260]) {
      const state = computeOscillatingBarState(equal, deg * DEG);
      expect(state.thetaRate).toBeCloseTo(-STATEMENT.omega / 2, 9);
      expect(state.thetaAccel).toBeCloseTo(0, 9);
    }
  });

  it("scales the rates with ω and ω² and leaves the geometry alone", () => {
    const phi = 23.16 * DEG;
    const base = computeOscillatingBarState(STATEMENT, phi);
    const faster = computeOscillatingBarState({ ...STATEMENT, omega: 6 }, phi);
    expect(faster.thetaRate).toBeCloseTo(2 * base.thetaRate, 9);
    expect(faster.thetaAccel).toBeCloseTo(4 * base.thetaAccel, 9);
    expect(faster.barAngle).toBeCloseTo(base.barAngle, 12);
  });
});

describe("accelerationTerms — the rotating-frame decomposition", () => {
  it("adds up to the pin's own acceleration, b·ω² toward O", () => {
    for (const deg of [23.16, 95, 200, 310]) {
      const phi = deg * DEG;
      const state = computeOscillatingBarState(STATEMENT, phi);
      const terms = accelerationTerms(state, STATEMENT);
      expect(terms.total.x).toBeCloseTo(-9 * Math.cos(phi), 8);
      expect(terms.total.y).toBeCloseTo(-9 * Math.sin(phi), 8);
    }
  });

  it("keeps the Coriolis term non-zero wherever the pin is sliding", () => {
    const phi = crankAngleFor(20 * DEG, STATEMENT)!;
    const state = computeOscillatingBarState(STATEMENT, phi);
    const terms = accelerationTerms(state, STATEMENT);
    expect(Math.hypot(terms.coriolis.x, terms.coriolis.y)).toBeCloseTo(
      Math.abs(2 * state.barOmega * state.reachRate),
      9,
    );
    expect(Math.hypot(terms.coriolis.x, terms.coriolis.y)).toBeGreaterThan(1);
  });

  it("drops the Coriolis term where the pin momentarily stops sliding", () => {
    // ṙ = 0 at φ = 0 and φ = 180°, where OA lies along OB.
    const state = computeOscillatingBarState(STATEMENT, 0);
    const terms = accelerationTerms(state, STATEMENT);
    expect(state.reachRate).toBeCloseTo(0, 12);
    expect(Math.hypot(terms.coriolis.x, terms.coriolis.y)).toBeCloseTo(0, 12);
  });
});
