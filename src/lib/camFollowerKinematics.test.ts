import { describe, expect, it } from "vitest";

import {
  camFollowerExtremes,
  camHeight,
  camSlope,
  computeCamFollowerState,
  wrapAngle,
} from "./camFollowerKinematics";
import type { CamFollowerParams } from "@/types/simulator";

// Hibbeler 13-91: a 2 kg rod on a cam with r = 0.1 m, z = 0.02 sin θ, θ̇ = 5 rad/s.
const STATEMENT: CamFollowerParams = {
  mass: 2,
  radius: 0.1,
  amplitude: 0.02,
  thetaDot: 5,
  gravity: 9.81,
};

const DEG = Math.PI / 180;

describe("camHeight", () => {
  it("peaks at ±amplitude a quarter turn from the crossings", () => {
    expect(camHeight(0, 0.02)).toBeCloseTo(0, 12);
    expect(camHeight(Math.PI / 2, 0.02)).toBeCloseTo(0.02, 12);
    expect(camHeight(-Math.PI / 2, 0.02)).toBeCloseTo(-0.02, 12);
  });
});

describe("camSlope", () => {
  it("is steepest where the profile crosses zero", () => {
    // tan φ = (A/r)·cos θ → φ = atan(0.2) at θ = 0.
    expect(camSlope(0, 0.02, 0.1)).toBeCloseTo(Math.atan(0.2), 12);
    expect(camSlope(Math.PI, 0.02, 0.1)).toBeCloseTo(-Math.atan(0.2), 12);
  });

  it("is flat at the crest and the trough", () => {
    expect(camSlope(Math.PI / 2, 0.02, 0.1)).toBeCloseTo(0, 12);
    expect(camSlope((3 * Math.PI) / 2, 0.02, 0.1)).toBeCloseTo(0, 12);
  });
});

describe("computeCamFollowerState", () => {
  it("differentiates the profile through the chain rule", () => {
    const st = computeCamFollowerState(STATEMENT, 0);
    expect(st.z).toBeCloseTo(0, 12);
    expect(st.zDot).toBeCloseTo(0.1, 12); // A·θ̇ = 0.02 × 5
    expect(st.zDDot).toBeCloseTo(0, 12);

    const crest = computeCamFollowerState(STATEMENT, Math.PI / 2);
    expect(crest.z).toBeCloseTo(0.02, 12);
    expect(crest.zDot).toBeCloseTo(0, 12);
    expect(crest.zDDot).toBeCloseTo(-0.5, 12); // −A·θ̇² = −0.02 × 25
  });

  it("balances the vertical: N_z = m(g + z̈)", () => {
    for (const deg of [0, 45, 90, 210, 300]) {
      const st = computeCamFollowerState(STATEMENT, deg * DEG);
      expect(st.normalVertical).toBeCloseTo(
        STATEMENT.mass * (STATEMENT.gravity + st.zDDot),
        12,
      );
    }
  });

  it("reads 18.62 N at the crest and 20.62 N at the trough", () => {
    expect(
      computeCamFollowerState(STATEMENT, Math.PI / 2).normalVertical,
    ).toBeCloseTo(18.62, 10);
    expect(
      computeCamFollowerState(STATEMENT, (3 * Math.PI) / 2).normalVertical,
    ).toBeCloseTo(20.62, 10);
  });

  it("has no slope correction where the profile is flat", () => {
    const crest = computeCamFollowerState(STATEMENT, Math.PI / 2);
    expect(crest.normalMagnitude).toBeCloseTo(crest.normalVertical, 12);
  });

  it("tilts the true normal where the profile is steep", () => {
    const st = computeCamFollowerState(STATEMENT, 0);
    expect(st.normalMagnitude).toBeCloseTo(
      st.normalVertical / Math.cos(Math.atan(0.2)),
      12,
    );
    expect(st.normalMagnitude).toBeGreaterThan(st.normalVertical);
  });

  it("flags lost contact once the cam would have to pull", () => {
    expect(computeCamFollowerState(STATEMENT, Math.PI / 2).contactLost).toBe(
      false,
    );
    // A·θ̇² > g at the crest — the rod goes ballistic and leaves the cam.
    const fast = { ...STATEMENT, thetaDot: 30 };
    const crest = computeCamFollowerState(fast, Math.PI / 2);
    expect(crest.zDDot).toBeLessThan(-STATEMENT.gravity);
    expect(crest.contactLost).toBe(true);
  });
});

describe("camFollowerExtremes", () => {
  it("reproduces the textbook answer: 20.6 N and 18.6 N", () => {
    const ex = camFollowerExtremes(STATEMENT);
    expect(ex.verticalMax).toBeCloseTo(20.62, 2);
    expect(ex.verticalMin).toBeCloseTo(18.62, 2);
    expect(ex.verticalMaxTheta).toBeCloseTo((3 * Math.PI) / 2, 2);
    expect(ex.verticalMinTheta).toBeCloseTo(Math.PI / 2, 2);
  });

  it("agrees with the vertical answer for the statement's shallow cam", () => {
    // At sin θ = ∓1 the slope is zero, so the 1/cos φ factor is exactly 1 —
    // the two models coincide at the extremes even though they differ between.
    const ex = camFollowerExtremes(STATEMENT);
    expect(ex.normalMax).toBeCloseTo(ex.verticalMax, 3);
    expect(ex.normalMin).toBeCloseTo(ex.verticalMin, 3);
  });

  it("separates the two models once the cam profile is steep", () => {
    // A/r = 0.5 — the 1/cos φ factor now beats the inertia term, so the true
    // normal force peaks away from the trough.
    const steep = { ...STATEMENT, amplitude: 0.05 };
    const ex = camFollowerExtremes(steep);
    expect(ex.normalMax).toBeGreaterThan(ex.verticalMax + 0.2);
    expect(Math.abs(ex.normalMaxTheta - (3 * Math.PI) / 2)).toBeGreaterThan(0.2);
  });

  it("never reports a max below its min", () => {
    const ex = camFollowerExtremes(STATEMENT);
    expect(ex.verticalMax).toBeGreaterThanOrEqual(ex.verticalMin);
    expect(ex.normalMax).toBeGreaterThanOrEqual(ex.normalMin);
  });
});

describe("wrapAngle", () => {
  it("folds any angle into one revolution", () => {
    expect(wrapAngle(0)).toBe(0);
    expect(wrapAngle(2 * Math.PI + 1)).toBeCloseTo(1, 12);
    expect(wrapAngle(-1)).toBeCloseTo(2 * Math.PI - 1, 12);
  });
});
