import { describe, expect, it } from "vitest";

import type { QuickReturnParams } from "@/types/simulator";

import { extremes, solve, validate } from "./quickReturnKinematics";

const params: QuickReturnParams = { omega: 2, r: 40, L1: 150, L2: 100 };

describe("solve", () => {
  it("keeps the fixed geometry fixed", () => {
    const s = solve(params, 1.1);
    expect(s.xO).toBe(0);
    expect(s.yO).toBe(0);
    expect(s.xA).toBe(0);
    expect(s.yA).toBe(params.L2);
    expect(s.yD).toBe(params.L1);
    expect(s.yP).toBe(params.L1);
    expect(s.phi).toBe(1.1);
  });

  it("puts B on the crank circle around A", () => {
    for (const phi of [0, 1, 2.4, 5.2]) {
      const s = solve(params, phi);
      expect(Math.hypot(s.xB - 0, s.yB - params.L2)).toBeCloseTo(params.r, 9);
    }
  });

  it("keeps O, B and P collinear (P is the bar OQ extended to y = L1)", () => {
    for (const phi of [0.4, 1.9, 3.7]) {
      const s = solve(params, phi);
      expect(s.xB * s.yP - s.yB * s.xP).toBeCloseTo(0, 6);
      expect(s.xB * s.yQ - s.yB * s.xQ).toBeCloseTo(0, 6);
    }
  });

  it("reports x equal to the tool position xP", () => {
    for (const phi of [0.4, 1.9, 3.7, 5.9]) {
      const s = solve(params, phi);
      expect(s.x).toBeCloseTo(s.xP, 9);
    }
  });

  it("is centred at x = 0 when the crank is at the vertical extremes", () => {
    expect(solve(params, 0).x).toBeCloseTo(0, 9);
    expect(solve(params, Math.PI).x).toBeCloseTo(0, 9);
  });

  it("has v as the exact time derivative of x (via dx/dφ · ω)", () => {
    const h = 1e-6;
    for (const phi of [0.4, 1.9, 3.7]) {
      const dxdphi =
        (solve(params, phi + h).x - solve(params, phi - h).x) / (2 * h);
      expect(dxdphi * params.omega).toBeCloseTo(solve(params, phi).v, 4);
    }
  });

  it("has a as the exact time derivative of v", () => {
    const h = 1e-5;
    for (const phi of [0.4, 1.9, 3.7]) {
      const dvdphi =
        (solve(params, phi + h).v - solve(params, phi - h).v) / (2 * h);
      expect(dvdphi * params.omega).toBeCloseTo(solve(params, phi).a, 3);
    }
  });

  it("scales v with ω and a with ω²", () => {
    const fast = { ...params, omega: 6 };
    const phi = 1.2;
    expect(solve(fast, phi).v).toBeCloseTo(3 * solve(params, phi).v, 9);
    expect(solve(fast, phi).a).toBeCloseTo(9 * solve(params, phi).a, 9);
    expect(solve(fast, phi).x).toBeCloseTo(solve(params, phi).x, 12);
  });

  it("falls back to x = 0 when B lands on the pivot's height (y_B = 0)", () => {
    // y_B = L2 − r·cos φ = 0 requires r = L2 at φ = 0 — a degenerate build.
    const degenerate: QuickReturnParams = { ...params, r: 100, L2: 100 };
    const s = solve(degenerate, 0);
    expect(s.yB).toBe(0);
    expect(s.xP).toBe(0);
    expect(s.xQ).toBe(0);
  });
});

describe("extremes", () => {
  it("computes α = arccos(r/L2) and the stroke half-width", () => {
    const { alpha, xMax } = extremes(params);
    expect(alpha).toBeCloseTo(Math.acos(40 / 100), 12);
    expect(xMax).toBeCloseTo((150 * 40) / Math.sqrt(100 * 100 - 40 * 40), 9);
  });

  it("bounds the actual stroke: |x(φ)| ≤ xMax, attained somewhere", () => {
    const { xMax } = extremes(params);
    let peak = 0;
    for (let i = 0; i < 20_000; i++) {
      const x = Math.abs(solve(params, (i / 20_000) * 2 * Math.PI).x);
      if (x > peak) peak = x;
      expect(x).toBeLessThanOrEqual(xMax + 1e-9);
    }
    expect(peak).toBeCloseTo(xMax, 3);
  });

  it("gives a quick-return ratio above 1 — the return stroke is faster", () => {
    const { quickReturnRatio, alpha } = extremes(params);
    expect(quickReturnRatio).toBeGreaterThan(1);
    expect(quickReturnRatio).toBeCloseTo(
      (2 * Math.PI - 2 * alpha) / (2 * alpha),
      12,
    );
  });

  it("approaches a ratio of 1 as the crank shrinks (α → π/2)", () => {
    expect(extremes({ ...params, r: 0.01 }).quickReturnRatio).toBeCloseTo(1, 3);
  });
});

describe("validate", () => {
  it("requires L2 > r", () => {
    expect(validate(params)).toBe(true);
    expect(validate({ ...params, r: 100 })).toBe(false);
    expect(validate({ ...params, r: 120 })).toBe(false);
  });
});
