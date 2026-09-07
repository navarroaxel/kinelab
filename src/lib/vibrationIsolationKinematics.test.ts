import { describe, expect, it } from "vitest";
import { computeSolution } from "./vibrationIsolationKinematics";
import { transmissibility } from "@/lib/vibrationTransmissibility";
import type { VibrationIsolationParams } from "@/types/simulator";

// The statement: M = 230 kg, k = 5194 N/cm, ζ = 0.20, target T = 0.20.
const STATEMENT: VibrationIsolationParams = {
  mass: 230,
  stiffness: 519_400, // 5194 N/cm
  dampingRatio: 0.2,
  targetTransmissibility: 0.2,
};

describe("computeSolution", () => {
  it("matches the textbook natural frequency", () => {
    const d = computeSolution(STATEMENT);
    expect(d.naturalFrequency).toBeCloseTo(47.52, 2);
  });

  it("matches the textbook quadratic root and frequency", () => {
    const d = computeSolution(STATEMENT);
    expect(d.status).toBe("solved");
    expect(d.frequencyRatio! ** 2).toBeCloseTo(8.623, 2); // u
    expect(d.frequencyRatio).toBeCloseTo(2.937, 3);
    expect(d.omega!).toBeCloseTo(139.5, 0);
  });

  it("round-trips: transmissibility at the solution matches the target", () => {
    const d = computeSolution(STATEMENT);
    expect(d.transmissibilityCheck!).toBeCloseTo(0.2, 3);
    expect(transmissibility(d.frequencyRatio!, STATEMENT.dampingRatio)).toBeCloseTo(
      0.2,
      3,
    );
  });

  it("shows damping costs speed: undampedR = √6 for T = 0.2, ζ = 0", () => {
    const d = computeSolution(STATEMENT);
    expect(d.undampedR).toBeCloseTo(Math.sqrt(6), 6);
    expect(d.undampedR).toBeCloseTo(2.449, 3);
    expect(d.frequencyRatio!).toBeGreaterThan(d.undampedR);
  });

  it("is reachable everywhere when the target is at least the curve's peak", () => {
    const d = computeSolution(STATEMENT);
    const d2 = computeSolution({
      ...STATEMENT,
      targetTransmissibility: d.peakTransmissibility,
    });
    expect(d2.status).toBe("reachable_everywhere");
    expect(d2.frequencyRatio).toBeNull();
    expect(d2.omega).toBeNull();
  });

  it("solves for an arbitrarily small target on the far side of the peak", () => {
    // For any target strictly below the peak, the isolating branch (r → ∞
    // drives T → 0) always has a root — "unattainable" is a defensive guard
    // for a boundary the quadratic never actually crosses in practice, the
    // same style /banked-curve uses for its own degenerate cases.
    const d = computeSolution({
      ...STATEMENT,
      dampingRatio: 5,
      targetTransmissibility: 0.0001,
    });
    expect(d.status).toBe("solved");
    expect(transmissibility(d.frequencyRatio!, 5)).toBeCloseTo(0.0001, 6);
  });

  it.each([
    ["mass", 0],
    ["mass", -230],
    ["stiffness", 0],
    ["dampingRatio", -0.1],
    ["targetTransmissibility", 0],
    ["targetTransmissibility", -0.2],
  ] as const)("rejects invalid %s (%d)", (key, value) => {
    expect(() => computeSolution({ ...STATEMENT, [key]: value })).toThrow(
      RangeError,
    );
  });
});
