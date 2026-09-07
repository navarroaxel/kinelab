import { describe, expect, it } from "vitest";
import {
  computeDerived,
  displacementAt,
  rotorAngleAt,
} from "./rotatingUnbalanceKinematics";
import type { RotatingUnbalanceParams } from "@/types/simulator";

// The statement: M = 25 kg on 4 springs of k = 1960 N/cm; m = 0.030 kg at
// e = 15 cm; n = 1500 rpm.
const STATEMENT: RotatingUnbalanceParams = {
  motorMass: 25,
  springCount: 4,
  springStiffness: 196_000, // 1960 N/cm
  unbalanceMass: 0.03,
  eccentricity: 0.15,
  rpm: 1500,
  dampingRatio: 0,
};

describe("computeDerived", () => {
  it("matches the textbook undamped case (ζ = 0)", () => {
    const d = computeDerived(STATEMENT);
    expect(d.naturalFrequency).toBeCloseTo(177.09, 2);
    expect(d.frequencyRatio).toBeCloseTo(0.887, 3);
    expect(d.amplitude * 1000).toBeCloseTo(0.664, 2); // mm
  });

  it("matches the textbook damped case (ζ = 0.125)", () => {
    const d = computeDerived({ ...STATEMENT, dampingRatio: 0.125 });
    expect(d.amplitude * 1000).toBeCloseTo(0.461, 2); // mm
    expect((d.phase * 180) / Math.PI).toBeCloseTo(46.1, 1);
  });

  it("approaches the m·e/M asymptote as rpm grows", () => {
    const d = computeDerived({ ...STATEMENT, rpm: 1_000_000 });
    const asymptote = (STATEMENT.unbalanceMass * STATEMENT.eccentricity) /
      STATEMENT.motorMass;
    expect(asymptote * 1000).toBeCloseTo(0.18, 2); // mm
    expect(d.amplitude).toBeCloseTo(d.asymptote, 6);
    expect(d.asymptote).toBeCloseTo(asymptote, 10);
  });

  it("starts at zero amplitude, unlike a constant-force drive", () => {
    const d = computeDerived({ ...STATEMENT, rpm: 0 });
    expect(d.amplitude).toBe(0);
  });

  it("flags operation near resonance", () => {
    expect(computeDerived(STATEMENT).nearResonance).toBe(false);
    const atResonanceRpm =
      (computeDerived(STATEMENT).naturalFrequency * 60) / (2 * Math.PI);
    const d = computeDerived({ ...STATEMENT, rpm: atResonanceRpm });
    expect(d.nearResonance).toBe(true);
  });

  it("has an interior peak only while ζ < 1/√2", () => {
    const light = computeDerived({ ...STATEMENT, dampingRatio: 0.125 });
    expect(light.peakR).not.toBeNull();
    expect(light.peakValue).not.toBeNull();
    expect(light.peakR!).toBeCloseTo(1 / Math.sqrt(1 - 2 * 0.125 * 0.125), 6);

    const heavy = computeDerived({ ...STATEMENT, dampingRatio: 0.8 });
    expect(heavy.peakR).toBeNull();
    expect(heavy.peakValue).toBeNull();
  });

  it.each([
    ["motorMass", 0],
    ["motorMass", -25],
    ["springCount", 0],
    ["springStiffness", 0],
    ["unbalanceMass", 0],
    ["eccentricity", 0],
    ["rpm", -1],
    ["dampingRatio", -0.1],
  ] as const)("rejects invalid %s (%d)", (key, value) => {
    expect(() => computeDerived({ ...STATEMENT, [key]: value })).toThrow(
      RangeError,
    );
  });

  it("flags the singular resonance (ζ = 0 exactly at r = 1 exactly)", () => {
    // k/M = 1 and this rpm round-trip to ω = 1 exactly in floating point
    // (unlike the statement's own numbers, where sqrt/π rounding leaves r
    // a hair off 1) — the cleanest way to hit the genuine bitwise Infinity.
    const AT_RESONANCE: RotatingUnbalanceParams = {
      ...STATEMENT,
      motorMass: 1,
      springCount: 1,
      springStiffness: 1,
      rpm: (1 * 60) / (2 * Math.PI),
    };
    const singular = computeDerived(AT_RESONANCE);
    expect(singular.frequencyRatio).toBe(1);
    expect(singular.isSingularResonance).toBe(true);
    expect(singular.amplitude).toBe(Infinity);

    // Any damping at all, or being off resonance, keeps it finite.
    const damped = computeDerived({ ...AT_RESONANCE, dampingRatio: 0.01 });
    expect(damped.isSingularResonance).toBe(false);
    expect(computeDerived(STATEMENT).isSingularResonance).toBe(false);
  });
});

describe("displacementAt", () => {
  it("starts at −sin(φ)·amplitude at t = 0", () => {
    const d = computeDerived({ ...STATEMENT, dampingRatio: 0.125 });
    expect(displacementAt(0, d)).toBeCloseTo(-d.amplitude * Math.sin(d.phase), 10);
  });

  it("oscillates with the same period as the rotor", () => {
    const d = computeDerived({ ...STATEMENT, dampingRatio: 0.125 });
    const period = (2 * Math.PI) / d.omega;
    const t = 0.013;
    expect(displacementAt(t + period, d)).toBeCloseTo(displacementAt(t, d), 8);
  });

  it("stays finite (renders flat) at the singular resonance instead of NaN", () => {
    const d = computeDerived({
      ...STATEMENT,
      motorMass: 1,
      springCount: 1,
      springStiffness: 1,
      rpm: (1 * 60) / (2 * Math.PI),
    });
    expect(d.isSingularResonance).toBe(true);
    // Infinity·sin(ω·t) is NaN at every zero crossing of sin — t = 0 is one.
    expect(Number.isNaN(d.amplitude * Math.sin(0))).toBe(true);
    expect(displacementAt(0, d)).toBe(0);
    expect(displacementAt(0.37, d)).toBe(0);
  });
});

describe("rotorAngleAt", () => {
  it("wraps into [0, 2π)", () => {
    const d = computeDerived(STATEMENT);
    const period = (2 * Math.PI) / d.omega;
    const angle = rotorAngleAt(3.7 * period, d);
    expect(angle).toBeGreaterThanOrEqual(0);
    expect(angle).toBeLessThan(2 * Math.PI);
  });

  it("advances at the rotor's own ω, independent of r or ζ", () => {
    const undamped = computeDerived(STATEMENT);
    const damped = computeDerived({ ...STATEMENT, dampingRatio: 0.5 });
    expect(rotorAngleAt(0.001, undamped)).toBeCloseTo(
      rotorAngleAt(0.001, damped),
      10,
    );
  });
});
