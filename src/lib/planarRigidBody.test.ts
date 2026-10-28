import { describe, expect, it } from "vitest";
import {
  accelerationAt,
  instantCenter,
  omegaFromCenter,
  omegaFromTwoPoints,
  rotationalVelocity,
  solveLinear2,
  velocityAt,
} from "./planarRigidBody";

describe("velocityAt / rotationalVelocity", () => {
  it("rotates +90° for a CCW ω", () => {
    const v = rotationalVelocity(2, { x: 3, y: 0 });
    expect(v.x).toBeCloseTo(0);
    expect(v.y).toBeCloseTo(6);
  });

  it("flips with the sense of ω", () => {
    const v = rotationalVelocity(-2, { x: 3, y: 0 });
    expect(v.y).toBeCloseTo(-6);
  });

  it("adds the translation of the reference point", () => {
    const v = velocityAt({ x: 1, y: 1 }, 1, { x: 0, y: 2 });
    expect(v.x).toBeCloseTo(-1);
    expect(v.y).toBeCloseTo(1);
  });
});

describe("accelerationAt", () => {
  it("splits into tangential and normal parts that sum with a_Q", () => {
    const a = accelerationAt({ x: 1, y: 2 }, 3, 4, { x: 2, y: 0 });
    expect(a.tangential.x).toBeCloseTo(0);
    expect(a.tangential.y).toBeCloseTo(8);
    expect(a.normal.x).toBeCloseTo(-18);
    expect(a.normal.y).toBeCloseTo(0);
    expect(a.total.x).toBeCloseTo(-17);
    expect(a.total.y).toBeCloseTo(10);
  });
});

describe("omegaFromTwoPoints / omegaFromCenter", () => {
  it("recovers ω from two points of the same body", () => {
    const omega = -2.5;
    const r = { x: 0.3, y: -0.8 };
    const vQ = { x: 4, y: -1 };
    const vP = velocityAt(vQ, omega, r);
    expect(omegaFromTwoPoints(vP, vQ, r)).toBeCloseTo(omega);
  });

  it("recovers ω from a velocity and the instantaneous centre", () => {
    const c = { x: 1, y: 1 };
    const p = { x: 3, y: 2 };
    const v = rotationalVelocity(1.7, { x: p.x - c.x, y: p.y - c.y });
    expect(omegaFromCenter(v, p, c)).toBeCloseTo(1.7);
  });
});

describe("instantCenter", () => {
  it("is the rolling contact of a wheel", () => {
    // Wheel of radius 1 rolling right (ω = −1): the hub moves at (1, 0) and the
    // rim point level with it, at (1, 1), moves at (1, −1). The contact is (0, 0).
    const c = instantCenter(
      { x: 0, y: 1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: -1 },
    );
    expect(c).not.toBeNull();
    expect(c!.x).toBeCloseTo(0);
    expect(c!.y).toBeCloseTo(0);
  });

  it("is null for a pure translation (parallel velocities)", () => {
    expect(
      instantCenter({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 5 }, { x: 1, y: 0 }),
    ).toBeNull();
  });
});

describe("solveLinear2", () => {
  it("solves a regular system", () => {
    const sol = solveLinear2(2, 1, 1, 3, 5, 10);
    expect(sol![0]).toBeCloseTo(1);
    expect(sol![1]).toBeCloseTo(3);
  });

  it("returns null for a singular matrix", () => {
    expect(solveLinear2(1, 2, 2, 4, 1, 2)).toBeNull();
  });
});
