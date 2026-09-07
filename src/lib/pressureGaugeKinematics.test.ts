import { describe, expect, it } from "vitest";
import { computeDerived, errorAt } from "./pressureGaugeKinematics";
import type { PressureGaugeParams } from "@/types/simulator";

// The statement: k = 175 N/cm, 600 cycles/min, 2 % error limit.
const STATEMENT: PressureGaugeParams = {
  stiffness: 17_500, // 175 N/cm
  cyclesPerMinute: 600,
  errorLimit: 0.02,
};

describe("computeDerived", () => {
  it("matches the textbook pulsation and frequency ratio", () => {
    const d = computeDerived(STATEMENT);
    expect(d.omega).toBeCloseTo(62.832, 3);
    expect(d.rMax).toBeCloseTo(0.14, 3);
  });

  it("matches the textbook maximum piston mass", () => {
    const d = computeDerived(STATEMENT);
    expect(d.maxMass * 1000).toBeCloseTo(86.9, 1); // g
  });

  it("matches the memorable ω₀/ω design rule for 1 %, 2 %, 5 %", () => {
    expect(
      computeDerived({ ...STATEMENT, errorLimit: 0.01 }).frequencyRatioRequired,
    ).toBeCloseTo(10.05, 2);
    expect(
      computeDerived({ ...STATEMENT, errorLimit: 0.02 }).frequencyRatioRequired,
    ).toBeCloseTo(7.14, 2);
    expect(
      computeDerived({ ...STATEMENT, errorLimit: 0.05 }).frequencyRatioRequired,
    ).toBeCloseTo(4.58, 2);
  });

  it("requiredNaturalFrequency/omega reproduces frequencyRatioRequired", () => {
    const d = computeDerived(STATEMENT);
    expect(d.requiredNaturalFrequency / d.omega).toBeCloseTo(
      d.frequencyRatioRequired,
      6,
    );
  });

  it("the design mass really sits at the error limit", () => {
    const d = computeDerived(STATEMENT);
    const naturalFrequencyAtMaxMass = Math.sqrt(
      STATEMENT.stiffness / d.maxMass,
    );
    const r = d.omega / naturalFrequencyAtMaxMass;
    expect(r).toBeCloseTo(d.rMax, 6);
    expect(errorAt(r)).toBeCloseTo(STATEMENT.errorLimit, 6);
  });

  it("a tighter error limit demands a higher frequency margin and less mass", () => {
    const loose = computeDerived({ ...STATEMENT, errorLimit: 0.05 });
    const tight = computeDerived({ ...STATEMENT, errorLimit: 0.01 });
    expect(tight.frequencyRatioRequired).toBeGreaterThan(
      loose.frequencyRatioRequired,
    );
    expect(tight.maxMass).toBeLessThan(loose.maxMass);
  });

  it.each([
    ["stiffness", 0],
    ["stiffness", -1],
    ["cyclesPerMinute", 0],
    ["errorLimit", 0],
    ["errorLimit", -0.02],
  ] as const)("rejects invalid %s (%d)", (key, value) => {
    expect(() => computeDerived({ ...STATEMENT, [key]: value })).toThrow(
      RangeError,
    );
  });
});

describe("errorAt", () => {
  it("is zero at r = 0 (quasi-static, no error)", () => {
    expect(errorAt(0)).toBe(0);
  });

  it("grows without bound as r → 1", () => {
    expect(errorAt(0.99)).toBeGreaterThan(errorAt(0.9));
    expect(errorAt(0.999)).toBeGreaterThan(errorAt(0.99));
  });

  it("goes negative past r = 1 (the gauge under-reads instead)", () => {
    expect(errorAt(1.5)).toBeLessThan(0);
  });
});
