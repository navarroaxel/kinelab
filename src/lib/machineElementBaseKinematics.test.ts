import { describe, expect, it } from "vitest";
import {
  computeDerived,
  elementDisplacementAt,
  supportDisplacementAt,
} from "./machineElementBaseKinematics";
import type { MachineElementBaseParams } from "@/types/simulator";

// The statement: M = 400 kg on 2 springs of k = 392 N/cm; c = 39.2 N·s/cm;
// support at ω = 7.5 s⁻¹, y_M = 3 mm.
const STATEMENT: MachineElementBaseParams = {
  mass: 400,
  springCount: 2,
  springStiffness: 39_200, // 392 N/cm
  damping: 3_920, // 39.2 N·s/cm
  supportAmplitude: 0.003,
  supportOmega: 7.5,
};

describe("computeDerived", () => {
  it("matches the textbook natural frequency and damping ratio", () => {
    const d = computeDerived(STATEMENT);
    expect(d.naturalFrequency).toBeCloseTo(14, 6);
    expect(d.dampingRatio).toBeCloseTo(0.35, 6);
  });

  it("matches the textbook frequency ratio and dissipation term", () => {
    const d = computeDerived(STATEMENT);
    expect(d.frequencyRatio).toBeCloseTo(0.5357, 4);
    expect(2 * d.dampingRatio * d.frequencyRatio).toBeCloseTo(0.375, 6);
  });

  it("matches the textbook response amplitude and phase lag", () => {
    const d = computeDerived(STATEMENT);
    expect(d.amplitude * 1000).toBeCloseTo(3.98, 2); // mm
    expect((d.phaseLag * 180) / Math.PI).toBeCloseTo(7.2, 1);
  });

  it("shows damping helps below r = √2 (unlike an isolation problem)", () => {
    const d = computeDerived(STATEMENT);
    expect(d.amplitude).toBeLessThan(d.undampedAmplitude);
    expect(d.undampedAmplitude * 1000).toBeCloseTo(4.21, 2); // mm
  });

  it.each([
    ["mass", 0],
    ["mass", -400],
    ["springCount", 0],
    ["springStiffness", 0],
    ["supportAmplitude", 0],
    ["damping", -1],
    ["supportOmega", -1],
  ] as const)("rejects invalid %s (%d)", (key, value) => {
    expect(() => computeDerived({ ...STATEMENT, [key]: value })).toThrow(
      RangeError,
    );
  });
});

describe("supportDisplacementAt", () => {
  it("starts at zero and reaches +y_M a quarter period later", () => {
    const quarterPeriod = Math.PI / 2 / STATEMENT.supportOmega;
    expect(supportDisplacementAt(0, STATEMENT)).toBeCloseTo(0, 10);
    expect(supportDisplacementAt(quarterPeriod, STATEMENT)).toBeCloseTo(
      STATEMENT.supportAmplitude,
      6,
    );
  });
});

describe("elementDisplacementAt", () => {
  it("peaks at the response amplitude, lagging the support by δ", () => {
    const d = computeDerived(STATEMENT);
    const tPeak = (Math.PI / 2 + d.phaseLag) / STATEMENT.supportOmega;
    expect(elementDisplacementAt(tPeak, STATEMENT, d)).toBeCloseTo(
      d.amplitude,
      6,
    );
  });

  it("oscillates with the same period as the support", () => {
    const d = computeDerived(STATEMENT);
    const period = (2 * Math.PI) / STATEMENT.supportOmega;
    const t = 0.29;
    expect(elementDisplacementAt(t + period, STATEMENT, d)).toBeCloseTo(
      elementDisplacementAt(t, STATEMENT, d),
      8,
    );
  });
});
