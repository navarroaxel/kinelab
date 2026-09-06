import { describe, expect, it } from "vitest";
import {
  dampingRatioFrom,
  magnification,
  transmissibility,
  transmissibilityPeak,
  unbalanceMagnification,
} from "./vibrationTransmissibility";

describe("dampingRatioFrom", () => {
  it("matches c/(2√(km))", () => {
    expect(dampingRatioFrom(500, 100_000, 10)).toBeCloseTo(0.25, 10);
    expect(dampingRatioFrom(0, 100_000, 10)).toBe(0);
  });
});

describe("magnification", () => {
  it("is 1 at zero frequency — a static push", () => {
    expect(magnification(0, 0.25)).toBeCloseTo(1, 12);
    expect(magnification(0, 0)).toBeCloseTo(1, 12);
  });

  it("blows up at resonance without damping, and is 1/(2ζ) with it", () => {
    expect(magnification(1, 0)).toBe(Infinity);
    expect(magnification(1, 0.25)).toBeCloseTo(2, 9);
  });

  it("dies away well above resonance, whatever the damping", () => {
    expect(magnification(5, 0)).toBeLessThan(0.05);
    expect(magnification(5, 0.25)).toBeLessThan(0.1);
  });
});

describe("unbalanceMagnification", () => {
  it("starts at zero (r = 0)", () => {
    expect(unbalanceMagnification(0, 0.25)).toBe(0);
  });

  it("approaches the m·e/M asymptote (1) as r → ∞", () => {
    expect(unbalanceMagnification(1000, 0.125)).toBeCloseTo(1, 4);
    expect(unbalanceMagnification(1000, 0)).toBeCloseTo(1, 4);
  });

  it("blows up at resonance without damping", () => {
    expect(unbalanceMagnification(1, 0)).toBe(Infinity);
  });
});

describe("transmissibility", () => {
  it("passes through the fixed point (√2, 1) for any damping ratio", () => {
    for (const zeta of [0, 0.1, 1, 3.5]) {
      expect(transmissibility(Math.SQRT2, zeta)).toBeCloseTo(1, 9);
    }
  });

  it("is 1 at r = 0 (quasi-static base motion)", () => {
    expect(transmissibility(0, 0.3)).toBeCloseTo(1, 10);
  });

  it("blows up at resonance without damping", () => {
    expect(transmissibility(1, 0)).toBe(Infinity);
  });

  it("stays finite at resonance with damping, unlike plain magnification", () => {
    expect(transmissibility(1, 1)).toBeCloseTo(Math.sqrt(5) / 2, 6);
  });

  it("isolates (T < 1) only beyond r = √2", () => {
    expect(transmissibility(1.2, 0.2)).toBeGreaterThan(1);
    expect(transmissibility(2, 0.2)).toBeLessThan(1);
  });
});

describe("transmissibilityPeak", () => {
  it("is at r = 1 with an infinite value when undamped", () => {
    const peak = transmissibilityPeak(0);
    expect(peak.r).toBe(1);
    expect(peak.value).toBe(Infinity);
  });

  it("moves toward r = 0 as damping grows without bound", () => {
    expect(transmissibilityPeak(0.2).r).toBeLessThan(1);
    expect(transmissibilityPeak(5).r).toBeLessThan(transmissibilityPeak(0.2).r);
  });

  it("really is the maximum of transmissibility(r, ζ) over r", () => {
    const zeta = 0.2;
    const { r, value } = transmissibilityPeak(zeta);
    for (const probe of [r - 0.05, r + 0.05, 0.1, 3]) {
      expect(transmissibility(probe, zeta)).toBeLessThanOrEqual(value + 1e-9);
    }
  });
});
