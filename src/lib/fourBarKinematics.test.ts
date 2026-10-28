import { describe, expect, it } from "vitest";
import {
  computeFourBarInstant,
  computeFourBarState,
  fourBarLimits,
  fourBarPivotA,
} from "./fourBarKinematics";
import type { FourBarParams } from "@/types/simulator";

// CCR N°10's own numbers: D at the origin, C = (0, 0.6), B = (−0.6, 0.6),
// E = (−0.3, 0.6) the midpoint of BC, ω_CD = 6 rad/s CCW. |AB| = 1.2 m is
// inferred from the figure (not in the statement).
const STATEMENT: FourBarParams = {
  omegaCD: 6,
  crankLen: 0.6,
  couplerLen: 0.6,
  rockerLen: 1.2,
  alpha0Deg: 90,
};
const ALPHA0 = Math.PI / 2;

describe("computeFourBarInstant — CCR N°10 statement instant", () => {
  const s = computeFourBarInstant(ALPHA0, 6, STATEMENT);

  it("places the joints where the statement does", () => {
    expect(s.C.x).toBeCloseTo(0);
    expect(s.C.y).toBeCloseTo(0.6);
    expect(s.B.x).toBeCloseTo(-0.6);
    expect(s.B.y).toBeCloseTo(0.6);
    expect(s.E.x).toBeCloseTo(-0.3);
    expect(s.E.y).toBeCloseTo(0.6);
  });

  it("puts the fixed pin A at floor level with D", () => {
    const A = fourBarPivotA(STATEMENT);
    expect(A.x).toBeCloseTo(-0.6 - 1.2 * Math.cos(Math.PI / 6));
    expect(A.y).toBeCloseTo(0);
  });

  it("gives ω_AB = 6 rad/s counter-clockwise", () => {
    expect(s.omegaAB).toBeCloseTo(6, 3);
  });

  it("gives ω_BC = −10.39 rad/s (clockwise)", () => {
    expect(s.omegaBC).toBeCloseTo(-10.39, 2);
  });

  it("gives v_E = 4.76 m/s", () => {
    expect(s.speedE).toBeCloseTo(4.76, 2);
  });

  it("puts the CIR of BC at (0, 0.946)", () => {
    expect(s.cir).not.toBeNull();
    expect(s.cir!.x).toBeCloseTo(0, 3);
    expect(s.cir!.y).toBeCloseTo(0.946, 3);
  });

  it("is consistent: v_B from either body agrees", () => {
    const A = s.A;
    const viaRocker = {
      x: -s.omegaAB * (s.B.y - A.y),
      y: s.omegaAB * (s.B.x - A.x),
    };
    expect(s.vB.x).toBeCloseTo(viaRocker.x, 6);
    expect(s.vB.y).toBeCloseTo(viaRocker.y, 6);
  });

  it("is consistent: a_B from either body agrees", () => {
    const rBA = { x: s.B.x - s.A.x, y: s.B.y - s.A.y };
    const viaRocker = {
      x: -s.gammaAB * rBA.y - s.omegaAB ** 2 * rBA.x,
      y: s.gammaAB * rBA.x - s.omegaAB ** 2 * rBA.y,
    };
    expect(s.aB.x).toBeCloseTo(viaRocker.x, 6);
    expect(s.aB.y).toBeCloseTo(viaRocker.y, 6);
  });

  it("flips every angular velocity with the sense of ω_CD", () => {
    const m = computeFourBarInstant(ALPHA0, -6, STATEMENT);
    expect(m.omegaAB).toBeCloseTo(-s.omegaAB, 6);
    expect(m.omegaBC).toBeCloseTo(-s.omegaBC, 6);
  });
});

describe("rocker length is the one inferred input", () => {
  it("leaves ω_BC and v_E independent of |AB| (the CIR only needs AB's 30°)", () => {
    const longer = computeFourBarInstant(ALPHA0, 6, { ...STATEMENT, rockerLen: 1.6 });
    expect(longer.omegaBC).toBeCloseTo(-10.39, 2);
    expect(longer.speedE).toBeCloseTo(4.76, 2);
    // …but ω_AB = |v_B|/|AB| is not.
    expect(longer.omegaAB).toBeCloseTo(7.2 / 1.6, 3);
  });
});

describe("fourBarLimits / computeFourBarState", () => {
  it("finds stops around the statement angle (the linkage is non-Grashof)", () => {
    const limits = fourBarLimits(STATEMENT);
    expect(limits).not.toBeNull();
    expect(limits!.alphaMin).toBeLessThan(ALPHA0);
    expect(limits!.alphaMax).toBeGreaterThan(ALPHA0);
  });

  it("starts exactly at the statement instant", () => {
    const s = computeFourBarState(STATEMENT, 0);
    expect(s.omegaBC).toBeCloseTo(-10.39, 2);
  });

  it("stays finite and assembled across a long run", () => {
    for (let t = 0; t < 20; t += 0.05) {
      const s = computeFourBarState(STATEMENT, t);
      expect(Number.isFinite(s.omegaBC)).toBe(true);
      expect(Number.isFinite(s.gammaAB)).toBe(true);
      expect(Math.hypot(s.B.x - s.C.x, s.B.y - s.C.y)).toBeCloseTo(0.6, 6);
      expect(Math.hypot(s.B.x - s.A.x, s.B.y - s.A.y)).toBeCloseTo(1.2, 6);
    }
  });
});
