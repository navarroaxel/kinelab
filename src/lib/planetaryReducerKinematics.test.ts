import { describe, expect, it } from "vitest";
import {
  computePlanetaryReducerState,
  planetaryReducerResult,
} from "./planetaryReducerKinematics";
import type { PlanetaryReducerParams } from "@/types/simulator";

// CCR N°15's own numbers: sun and planets all r = 20 cm, ring fixed, ω_A =
// 1200 rpm counter-clockwise. r_E = r_A + 2r = 60 cm is derived, not given.
const STATEMENT: PlanetaryReducerParams = {
  sunRadius: 0.2,
  planetRadius: 0.2,
  rpmSun: 1200,
};

describe("planetaryReducerResult — CCR N°15 statement", () => {
  const r = planetaryReducerResult(STATEMENT);

  it("derives the ring radius", () => {
    expect(r.ringRadius).toBeCloseTo(0.6, 10);
  });

  it("gives v_J = 25.13 m/s", () => {
    expect(r.vJ).toBeCloseTo(25.13, 2);
  });

  it("gives v_O = 12.57 m/s", () => {
    expect(r.vO).toBeCloseTo(12.57, 2);
  });

  it("gives ω_planet = 600 rpm, clockwise", () => {
    expect(r.rpmPlanet).toBeCloseTo(-600, 6);
  });

  it("gives ω_carrier = 300 rpm, same sense as the sun", () => {
    expect(r.rpmCarrier).toBeCloseTo(300, 6);
  });

  it("gives a reduction ratio of 1/4", () => {
    expect(r.ratio).toBeCloseTo(0.25, 10);
  });

  it("flips every sense with the sun's", () => {
    const m = planetaryReducerResult({ ...STATEMENT, rpmSun: -1200 });
    expect(m.rpmPlanet).toBeCloseTo(600, 6);
    expect(m.rpmCarrier).toBeCloseTo(-300, 6);
    expect(m.vO).toBeCloseTo(-12.57, 2);
  });
});

describe("planetaryReducerResult — other proportions", () => {
  it("follows ω_c = ω_A·r_A/(2r_A + 2r) when the planets are smaller", () => {
    const p = { sunRadius: 0.3, planetRadius: 0.1, rpmSun: 900 };
    const r = planetaryReducerResult(p);
    expect(r.ringRadius).toBeCloseTo(0.5, 10);
    expect(r.rpmCarrier).toBeCloseTo(900 * (0.3 / 0.8), 6);
    // The planet's centre is carried at the arm's rate on a circle of r_A + r.
    expect(Math.abs(r.vO)).toBeCloseTo(Math.abs(r.omegaCarrier) * 0.4, 6);
  });
});

describe("computePlanetaryReducerState", () => {
  const s = computePlanetaryReducerState(STATEMENT, 0.01);

  it("keeps the planet's contact with the ring at zero velocity (its instantaneous centre)", () => {
    // Velocity of the ring-contact point of the planet: v_O + ω_p ẑ × (J_ring − O).
    const O = s.centers[0];
    const K = s.contactRing[0];
    const rx = K.x - O.x;
    const ry = K.y - O.y;
    const vx = s.vOVec[0].x - s.omegaPlanet * ry;
    const vy = s.vOVec[0].y + s.omegaPlanet * rx;
    expect(Math.hypot(vx, vy)).toBeLessThan(1e-6);
  });

  it("places three planets 120° apart, each at distance r_A + r", () => {
    for (const c of s.centers) {
      expect(Math.hypot(c.x, c.y)).toBeCloseTo(0.4, 10);
    }
    const a0 = Math.atan2(s.centers[0].y, s.centers[0].x);
    const a1 = Math.atan2(s.centers[1].y, s.centers[1].x);
    const gap = (((a1 - a0) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    expect(gap).toBeCloseTo((2 * Math.PI) / 3, 10);
  });

  it("speeds of v_J and v_O match the closed form", () => {
    expect(Math.hypot(s.vJVec[0].x, s.vJVec[0].y)).toBeCloseTo(25.13, 2);
    expect(Math.hypot(s.vOVec[0].x, s.vOVec[0].y)).toBeCloseTo(12.57, 2);
  });
});
