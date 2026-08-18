import { describe, expect, it } from "vitest";

import {
  computeParabolicSpringState,
  normalForce,
  pathEndX,
  pathSlope,
  pathY,
  radiusOfCurvature,
  rk4Step,
  speedAt,
  springStretch,
  tangentialAccel,
} from "./parabolicSpringKinematics";
import type { ParabolicSpringParams } from "@/types/simulator";

// Hibbeler 13-74: 6 kg block on y = 2 − 0.5x², k = 10 N/m, L₀ = 0.5 m.
// Asked at x = 1 m with v = 4 m/s.
const STATEMENT: ParabolicSpringParams = {
  mass: 6,
  stiffness: 10,
  naturalLength: 0.5,
  vertex: 2,
  curvatureCoeff: 0.5,
  gravity: 9.81,
  startX: 1,
  startSpeed: 4,
};

describe("the path", () => {
  it("passes through the vertex and reaches the ground at √(a/b)", () => {
    expect(pathY(0, STATEMENT)).toBe(2);
    expect(pathY(1, STATEMENT)).toBe(1.5);
    expect(pathEndX(STATEMENT)).toBeCloseTo(2, 12);
    expect(pathY(pathEndX(STATEMENT), STATEMENT)).toBeCloseTo(0, 12);
  });

  it("has slope −2bx, so 45° down at x = 1", () => {
    expect(pathSlope(0, STATEMENT)).toBe(-0);
    expect(pathSlope(1, STATEMENT)).toBe(-1);
    expect(computeParabolicSpringState(STATEMENT, 1, 4).inclineDeg).toBeCloseTo(
      45,
      12,
    );
  });

  it("gives ρ = 2√2 m at x = 1", () => {
    expect(radiusOfCurvature(1, STATEMENT)).toBeCloseTo(2 * Math.SQRT2, 12);
    // Flattest at the vertex, where ρ = 1/(2b).
    expect(radiusOfCurvature(0, STATEMENT)).toBeCloseTo(1, 12);
  });
});

describe("the spring", () => {
  it("is held horizontal, so its length is just x", () => {
    expect(springStretch(1, STATEMENT)).toBeCloseTo(0.5, 12);
    expect(springStretch(0.5, STATEMENT)).toBeCloseTo(0, 12);
    // Compressed when the block is closer to the axis than the free length.
    expect(springStretch(0, STATEMENT)).toBeCloseTo(-0.5, 12);
  });

  it("pulls with kΔ = 5 N at the statement instant", () => {
    expect(
      computeParabolicSpringState(STATEMENT, 1, 4).springForce,
    ).toBeCloseTo(5, 12);
  });
});

describe("the textbook answers at x = 1 m, v = 4 m/s", () => {
  const state = computeParabolicSpringState(STATEMENT, 1, 4);

  it("gives N = 11.2 N", () => {
    expect(state.normal).toBeCloseTo(11.2, 1);
    expect(state.contactLost).toBe(false);
  });

  it("gives a rate of increase of speed of 6.35 m/s²", () => {
    expect(state.tangentialAccel).toBeCloseTo(6.35, 2);
  });

  it("balances the normal direction: applied − N = m·v²/ρ", () => {
    // Weight and spring projected on n̂, worked out by hand.
    const applied = (58.86 + 5) / Math.SQRT2;
    expect(state.centripetal).toBeCloseTo((6 * 16) / (2 * Math.SQRT2), 6);
    expect(applied - state.normal).toBeCloseTo(state.centripetal, 6);
  });
});

describe("structure of the two equations", () => {
  it("keeps the tangential acceleration independent of the speed", () => {
    expect(tangentialAccel(1, STATEMENT)).toBeCloseTo(
      computeParabolicSpringState(STATEMENT, 1, 40).tangentialAccel,
      12,
    );
  });

  it("makes the normal force fall as v², eventually going negative", () => {
    const slow = normalForce(1, 0, STATEMENT);
    const fast = normalForce(1, 8, STATEMENT);
    expect(slow).toBeGreaterThan(fast);
    // N = applied − m·v²/ρ, so quadrupling v² drops N by 4×(m v²/ρ).
    expect(slow - fast).toBeCloseTo((6 * 64) / (2 * Math.SQRT2), 6);
    expect(normalForce(1, 20, STATEMENT)).toBeLessThan(0);
    expect(computeParabolicSpringState(STATEMENT, 1, 20).contactLost).toBe(
      true,
    );
  });

  it("has nothing but the spring acting tangentially at the vertex", () => {
    // At x = 0 the path is horizontal, so gravity is purely normal there and
    // the compressed spring is the only thing pushing the block along.
    const at0 = tangentialAccel(0, STATEMENT);
    expect(at0).toBeCloseTo(
      (STATEMENT.stiffness * STATEMENT.naturalLength) / STATEMENT.mass,
      12,
    );
  });

  it("supports the block against gravity alone when at rest at the vertex", () => {
    // N = mg − m·v²/ρ with v = 0.
    expect(normalForce(0, 0, STATEMENT)).toBeCloseTo(6 * 9.81, 9);
  });
});

describe("speedAt — energy conservation", () => {
  it("returns the starting speed at the starting point", () => {
    expect(speedAt(1, 1, 4, STATEMENT)!).toBeCloseTo(4, 12);
  });

  it("speeds the block up on the way down", () => {
    const atEnd = speedAt(2, 1, 4, STATEMENT)!;
    // ½mv² = ½·6·16 + 6·9.81·1.5 − (11.25 − 1.25)
    expect(atEnd).toBeCloseTo(Math.sqrt((2 * (48 + 88.29 - 10)) / 6), 6);
    expect(atEnd).toBeGreaterThan(4);
  });

  it("slows it down going back up toward the vertex", () => {
    const atVertex = speedAt(0, 1, 4, STATEMENT)!;
    // The spring stores the same energy at x = 0 and x = 1 (±0.5 m either
    // way), so only gravity does net work over that stretch.
    expect(atVertex).toBeCloseTo(Math.sqrt((2 * (48 - 29.43)) / 6), 6);
  });

  it("reports unreachable points as null", () => {
    // Released from rest at the vertex, the block cannot climb back past it.
    expect(speedAt(1, 0, 0, STATEMENT)).not.toBeNull();
    expect(speedAt(0, 1.9, 0, STATEMENT)).toBeNull();
  });
});

describe("rk4Step", () => {
  it("conserves energy along a full descent", () => {
    let state = { x: 1, speed: 4 };
    const total = (s: { x: number; speed: number }) =>
      0.5 * STATEMENT.mass * s.speed ** 2 +
      STATEMENT.mass * STATEMENT.gravity * pathY(s.x, STATEMENT) +
      0.5 * STATEMENT.stiffness * springStretch(s.x, STATEMENT) ** 2;

    const initial = total(state);
    for (let i = 0; i < 2000 && state.x < 2; i++) {
      state = rk4Step(state, STATEMENT, 0.0005);
    }
    expect(Math.abs(total(state) - initial) / initial).toBeLessThan(1e-6);
  });

  it("agrees with the closed-form energy speed", () => {
    let state = { x: 1, speed: 4 };
    for (let i = 0; i < 4000 && state.x < 1.8; i++) {
      state = rk4Step(state, STATEMENT, 0.0005);
    }
    expect(state.speed).toBeCloseTo(speedAt(state.x, 1, 4, STATEMENT)!, 5);
  });
});
