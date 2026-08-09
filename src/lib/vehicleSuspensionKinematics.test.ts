import { describe, expect, it } from "vitest";
import {
  computeDerived,
  platformDisplacementAt,
  vehicleDisplacementAt,
} from "./vehicleSuspensionKinematics";
import type { VehicleSuspensionParams } from "@/types/simulator";

const PROBLEM_PARAMS: VehicleSuspensionParams = {
  vehicleMass: 1000,
  springCount: 4,
  staticDeflection: 0.09,
  damperCount: 4,
  dampingPerDamper: 6860, // 68.6 N·s/cm
  excitationAmplitude: 0.03,
  frequencyRatio: 1,
};

describe("vehicleSuspensionKinematics", () => {
  it("matches the textbook equivalent stiffness and damping", () => {
    const derived = computeDerived(PROBLEM_PARAMS);
    expect(derived.equivalentStiffness).toBeCloseTo(109000, 0);
    expect(derived.equivalentDamping).toBeCloseTo(27440, 0);
  });

  it("matches the textbook natural frequency and damping ratio", () => {
    const derived = computeDerived(PROBLEM_PARAMS);
    expect(derived.naturalFrequency).toBeCloseTo(10.4403, 3);
    expect(derived.dampingRatio).toBeCloseTo(1.3141, 3);
  });

  it("matches the textbook response amplitude at resonance (r = 1)", () => {
    const derived = computeDerived(PROBLEM_PARAMS);
    expect(derived.transmissibility).toBeCloseTo(1.0699, 3);
    expect(derived.responseAmplitude).toBeCloseTo(0.0321, 4);
  });

  it("reduces to unit transmissibility as r → 0 (quasi-static base motion)", () => {
    const derived = computeDerived({ ...PROBLEM_PARAMS, frequencyRatio: 0.001 });
    expect(derived.transmissibility).toBeCloseTo(1, 2);
    expect(derived.phaseLag).toBeCloseTo(0, 2);
  });

  it("isolates the body at high frequency ratio (TR → 0)", () => {
    const derived = computeDerived({ ...PROBLEM_PARAMS, frequencyRatio: 50 });
    expect(derived.transmissibility).toBeLessThan(0.1);
  });

  it.each([
    ["vehicleMass", 0],
    ["vehicleMass", -1000],
    ["staticDeflection", 0],
    ["staticDeflection", -0.09],
    ["springCount", 0],
    ["damperCount", 0],
  ] as const)("rejects non-positive %s (%d)", (key, value) => {
    expect(() => computeDerived({ ...PROBLEM_PARAMS, [key]: value })).toThrow(
      RangeError,
    );
  });
});

describe("platformDisplacementAt", () => {
  it("starts at zero and reaches +Y0 a quarter period later", () => {
    const derived = computeDerived(PROBLEM_PARAMS);
    expect(platformDisplacementAt(0, PROBLEM_PARAMS, derived)).toBeCloseTo(0, 10);

    const quarterPeriod = (Math.PI / 2) / derived.excitationFrequency;
    expect(
      platformDisplacementAt(quarterPeriod, PROBLEM_PARAMS, derived),
    ).toBeCloseTo(PROBLEM_PARAMS.excitationAmplitude, 6);
  });

  it("scales linearly with the platform amplitude", () => {
    const derived = computeDerived(PROBLEM_PARAMS);
    const doubled = { ...PROBLEM_PARAMS, excitationAmplitude: 0.06 };
    const t = 0.05;
    expect(platformDisplacementAt(t, doubled, derived)).toBeCloseTo(
      2 * platformDisplacementAt(t, PROBLEM_PARAMS, derived),
      10,
    );
  });
});

describe("vehicleDisplacementAt", () => {
  it("peaks at the response amplitude, lagging the platform by δ", () => {
    const derived = computeDerived(PROBLEM_PARAMS);
    const tPeak =
      (Math.PI / 2 + derived.phaseLag) / derived.excitationFrequency;
    expect(vehicleDisplacementAt(tPeak, derived)).toBeCloseTo(
      derived.responseAmplitude,
      6,
    );
  });

  it("oscillates with the same period as the platform excitation", () => {
    const derived = computeDerived(PROBLEM_PARAMS);
    const period = (2 * Math.PI) / derived.excitationFrequency;
    const t = 0.37;
    expect(vehicleDisplacementAt(t + period, derived)).toBeCloseTo(
      vehicleDisplacementAt(t, derived),
      8,
    );
  });
});
