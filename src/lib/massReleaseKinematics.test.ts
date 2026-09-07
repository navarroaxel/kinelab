import { describe, expect, it } from "vitest";
import { computeDerived, displacementAt } from "./massReleaseKinematics";
import type { MassReleaseParams } from "@/types/simulator";

// The statement: M1 = 0.5 kg, M2 = 0.8 kg hang from a spring; M2 is removed
// at t = 0. TP prints its answers with g = 9.8.
const BASE: MassReleaseParams = {
  hangingMass: 0.8,
  remainingMass: 0.5,
  stiffness: 19.6, // VIB 6's k = 0.196 N/cm
  damping: 0,
};

describe("VIB 6 — undamped (ζ = 0)", () => {
  it("matches the textbook amplitude, natural frequency, period and rate", () => {
    const d = computeDerived(BASE, 9.8);
    expect(d.x0 * 100).toBeCloseTo(40, 6); // cm
    expect(d.naturalFrequency).toBeCloseTo(6.261, 3);
    expect(d.period!).toBeCloseTo(1.0035, 3);
    expect(d.frequency!).toBeCloseTo(0.9965, 3);
  });

  it("flags the spring slack (x0 exceeds M1's own static deflection)", () => {
    const d = computeDerived(BASE, 9.8);
    expect(d.slack).toBe(true);
    expect(d.slackThreshold * 100).toBeCloseTo(25, 6); // cm
  });

  it("never settles (undamped free vibration)", () => {
    const d = computeDerived(BASE, 9.8);
    expect(d.tauSlow).toBe(Infinity);
    expect(d.settlingTime).toBe(Infinity);
  });

  it("reduces displacementAt to x0·cos(ω0·t)", () => {
    const d = computeDerived(BASE, 9.8);
    const t = 0.31;
    expect(displacementAt(t, d)).toBeCloseTo(
      d.x0 * Math.cos(d.naturalFrequency * t),
      8,
    );
  });
});

describe("underdamped slack — the actual first trough, not just x0", () => {
  // ẋ(0) = 0 makes every extremum land at t_n = n·π/ωd exactly, so the first
  // trough (n = 1) has an exact magnitude x0·e^(−πζ/√(1−ζ²)) — decaying
  // envelopes mean x0 > slackThreshold alone is necessary but not sufficient.

  it("still goes slack when the decayed first trough clears the threshold", () => {
    // Lightly damped: the envelope barely shrinks by the first trough.
    const LIGHT: MassReleaseParams = {
      hangingMass: 0.8,
      remainingMass: 0.5,
      stiffness: 19.6,
      damping: 0.1,
    };
    const d = computeDerived(LIGHT, 9.8);
    expect(d.regime).toBe("underdamped");
    expect(d.x0).toBeGreaterThan(d.slackThreshold);
    expect(d.slack).toBe(true);
  });

  it("does NOT go slack when x0 > threshold but the decayed trough doesn't reach it", () => {
    // M2 = 0.6 kg gives x0 = 30 cm (> the 25 cm threshold), but ζ = 0.3
    // decays the first trough down to ~11 cm — nowhere near slack.
    const params: MassReleaseParams = {
      hangingMass: 0.6,
      remainingMass: 0.5,
      stiffness: 19.6,
      damping: 0.3 * 2 * Math.sqrt(19.6 * 0.5),
    };
    const d = computeDerived(params, 9.8);
    expect(d.regime).toBe("underdamped");
    expect(d.x0 * 100).toBeCloseTo(30, 3);
    expect(d.slackThreshold * 100).toBeCloseTo(25, 3);
    expect(d.x0).toBeGreaterThan(d.slackThreshold); // the naive check says slack…
    expect(d.slack).toBe(false); // …but it never actually happens

    // Confirm against the real trajectory: the first trough (at t = π/ωd)
    // is the global minimum, and it sits above -slackThreshold.
    const tFirstTrough = Math.PI / d.dampedOmega!;
    const trough = displacementAt(tFirstTrough, d);
    expect(trough).toBeGreaterThan(-d.slackThreshold);
    expect(trough * 100).toBeCloseTo(-11.17, 1);
  });
});

describe("VIB 7 — overdamped (ζ = 3.5)", () => {
  const VIB7: MassReleaseParams = {
    ...BASE,
    stiffness: 392, // 3.92 N/cm
    damping: 98, // 0.98 N·s/cm
  };

  it("matches the textbook natural frequency and damping ratio", () => {
    const d = computeDerived(VIB7, 9.8);
    expect(d.naturalFrequency).toBeCloseTo(28, 6);
    expect(d.dampingRatio).toBeCloseTo(3.5, 6);
    expect(d.regime).toBe("overdamped");
  });

  it("matches the textbook roots (correcting the TP's own arithmetic slip)", () => {
    const d = computeDerived(VIB7, 9.8);
    expect(d.s1).toBeCloseTo(-4.085, 3);
    expect(d.s2).toBeCloseTo(-191.915, 3);
    // The TP handout prints s2 = −192.035, which fails Vieta's formulas —
    // assert the invariants instead of the (wrong) published number.
    expect(d.s1! + d.s2!).toBeCloseTo(-VIB7.damping / VIB7.remainingMass, 6);
    expect(d.s1! * d.s2!).toBeCloseTo(VIB7.stiffness / VIB7.remainingMass, 6);
  });

  it("matches the textbook coefficients A1, A2", () => {
    const d = computeDerived(VIB7, 9.8);
    expect(d.A1! * 100).toBeCloseTo(2.0435, 2); // cm
    expect(d.A2! * 100).toBeCloseTo(-0.0435, 2); // cm
    // A1 + A2 must reproduce x(0) = x0 exactly.
    expect(d.A1! + d.A2!).toBeCloseTo(d.x0, 10);
  });

  it("has no period/frequency/vMax/aMax — those are undamped-only", () => {
    const d = computeDerived(VIB7, 9.8);
    expect(d.period).toBeNull();
    expect(d.frequency).toBeNull();
    expect(d.vMax).toBeNull();
    expect(d.aMax).toBeNull();
  });

  it("never actually goes slack, even though x0 exceeds the threshold", () => {
    // Same M1/M2 as VIB 6 (so x0 > slackThreshold is still true here), but
    // overdamped release from rest is monotonic — it can't swing back past
    // the threshold the way genuine oscillation can.
    const d = computeDerived(VIB7, 9.8);
    expect(d.x0).toBeGreaterThan(d.slackThreshold);
    expect(d.slack).toBe(false);
  });

  it("settles roughly 4× the slow time constant", () => {
    const d = computeDerived(VIB7, 9.8);
    expect(d.tauSlow).toBeCloseTo(1 / 4.085, 3);
    expect(d.settlingTime).toBeCloseTo(4 / 4.085, 3);
  });
});

describe("critically damped (ζ = 1) — the guarded degenerate case", () => {
  // c = 2√(kM1) puts ζ exactly at 1; s1 = s2 = -ω0, where the general
  // overdamped A1/A2 formula divides by s2 - s1 = 0.
  const M1 = 0.5;
  const k = 19.6;
  const CRITICAL: MassReleaseParams = {
    hangingMass: 0.8,
    remainingMass: M1,
    stiffness: k,
    damping: 2 * Math.sqrt(k * M1),
  };

  it("is classified as critical, with s1 = s2 = -ω0", () => {
    const d = computeDerived(CRITICAL, 9.8);
    expect(d.regime).toBe("critical");
    expect(d.dampingRatio).toBeCloseTo(1, 10);
    expect(d.s1).toBeCloseTo(-d.naturalFrequency, 10);
    expect(d.s2).toBeCloseTo(-d.naturalFrequency, 10);
    expect(d.A1).toBeNull();
    expect(d.A2).toBeNull();
    // Same masses as VIB 6 (x0 > slackThreshold), but critical release from
    // rest is also monotonic — never actually slack.
    expect(d.x0).toBeGreaterThan(d.slackThreshold);
    expect(d.slack).toBe(false);
  });

  it("evaluates displacementAt without NaN via the guarded closed form", () => {
    const d = computeDerived(CRITICAL, 9.8);
    for (const t of [0, 0.1, 0.5, 1, 2, 5]) {
      const x = displacementAt(t, d);
      expect(Number.isFinite(x)).toBe(true);
      expect(x).toBeCloseTo(
        d.x0 * (1 + d.naturalFrequency * t) * Math.exp(-d.naturalFrequency * t),
        10,
      );
    }
  });

  it("starts at x0 with zero initial velocity", () => {
    const d = computeDerived(CRITICAL, 9.8);
    expect(displacementAt(0, d)).toBeCloseTo(d.x0, 10);
    const dt = 1e-6;
    const slope = (displacementAt(dt, d) - displacementAt(0, d)) / dt;
    expect(slope).toBeCloseTo(0, 3);
  });
});

describe("computeDerived guards", () => {
  it.each([
    ["hangingMass", 0],
    ["hangingMass", -0.8],
    ["remainingMass", 0],
    ["stiffness", 0],
    ["damping", -1],
  ] as const)("rejects invalid %s (%d)", (key, value) => {
    expect(() => computeDerived({ ...BASE, [key]: value })).toThrow(
      RangeError,
    );
  });
});
