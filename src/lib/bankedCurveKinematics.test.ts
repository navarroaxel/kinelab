import { describe, expect, it } from "vitest";

import {
  bankedCurveLimits,
  computeBankedCurveState,
  idealSpeed,
  requiredMu,
} from "./bankedCurveKinematics";
import type { BankedCurveParams } from "@/types/simulator";

// Hibbeler 13-53 / 13-54: 1700 kg, θ = 20°, ρ = 100 m, μs = 0.2.
const TRACK = {
  radius: 100,
  gravity: 9.81,
  bankDeg: 20,
  mu: 0.2,
};

const STATEMENT: BankedCurveParams = {
  ...TRACK,
  mass: 1700,
  speed: 20,
};

describe("bankedCurveLimits — the textbook answers", () => {
  const limits = bankedCurveLimits(TRACK);

  it("gives 24.4 m/s as the maximum speed (13-53)", () => {
    expect(limits.maxSpeed).toBeCloseTo(24.43, 2);
  });

  it("gives 12.2 m/s as the minimum speed (13-54)", () => {
    expect(limits.minSpeed).toBeCloseTo(12.25, 2);
  });

  it("brackets the frictionless ideal speed", () => {
    expect(limits.idealSpeed).toBeCloseTo(18.9, 1);
    expect(limits.minSpeed).toBeLessThan(limits.idealSpeed);
    expect(limits.maxSpeed!).toBeGreaterThan(limits.idealSpeed);
  });
});

describe("bankedCurveLimits — degenerate cases", () => {
  it("collapses both limits onto the ideal speed with no friction", () => {
    const limits = bankedCurveLimits({ ...TRACK, mu: 0 });
    expect(limits.minSpeed).toBeCloseTo(limits.idealSpeed, 9);
    expect(limits.maxSpeed).toBeCloseTo(limits.idealSpeed, 9);
  });

  it("drops the minimum to zero once μ reaches tan θ", () => {
    // tan 20° ≈ 0.364 — the car can sit still on the bank without sliding.
    expect(bankedCurveLimits({ ...TRACK, mu: 0.364 }).minSpeed).toBe(0);
    expect(bankedCurveLimits({ ...TRACK, mu: 0.9 }).minSpeed).toBe(0);
  });

  it("reports no maximum at all once μ reaches cot θ", () => {
    // cot 20° ≈ 2.747.
    expect(bankedCurveLimits({ ...TRACK, mu: 2.8 }).maxSpeed).toBeNull();
    expect(bankedCurveLimits({ ...TRACK, mu: 2.7 }).maxSpeed).not.toBeNull();
  });

  it("needs no bank and no speed range on the flat when μ = 0", () => {
    const flat = bankedCurveLimits({ ...TRACK, bankDeg: 0, mu: 0 });
    expect(flat.idealSpeed).toBe(0);
    expect(flat.minSpeed).toBe(0);
    expect(flat.maxSpeed).toBe(0);
  });

  it("recovers the flat-curve result v = √(μgρ)", () => {
    const flat = bankedCurveLimits({ ...TRACK, bankDeg: 0 });
    expect(flat.maxSpeed).toBeCloseTo(Math.sqrt(0.2 * 9.81 * 100), 9);
    expect(flat.minSpeed).toBe(0);
  });
});

describe("idealSpeed", () => {
  it("is √(ρ·g·tan θ)", () => {
    expect(idealSpeed(100, 9.81, 20)).toBeCloseTo(
      Math.sqrt(100 * 9.81 * Math.tan((20 * Math.PI) / 180)),
      9,
    );
  });
});

describe("requiredMu", () => {
  const limits = bankedCurveLimits(TRACK);

  it("hits exactly +μ at the maximum speed", () => {
    expect(requiredMu(limits.maxSpeed!, TRACK)).toBeCloseTo(0.2, 9);
  });

  it("hits exactly −μ at the minimum speed", () => {
    expect(requiredMu(limits.minSpeed, TRACK)).toBeCloseTo(-0.2, 9);
  });

  it("is zero at the ideal speed", () => {
    expect(requiredMu(limits.idealSpeed, TRACK)).toBeCloseTo(0, 12);
  });

  it("rises monotonically with speed", () => {
    let previous = -Infinity;
    for (let v = 0; v <= 60; v += 2) {
      const mu = requiredMu(v, TRACK);
      expect(mu).toBeGreaterThan(previous);
      previous = mu;
    }
  });

  it("needs friction up the slope when parked on the bank", () => {
    expect(requiredMu(0, TRACK)).toBeCloseTo(
      -Math.tan((20 * Math.PI) / 180),
      9,
    );
  });
});

describe("computeBankedCurveState", () => {
  it("balances the vertical and supplies the centripetal force", () => {
    const st = computeBankedCurveState(STATEMENT);
    const theta = (20 * Math.PI) / 180;
    // N·cos θ − f·sin θ = m·g
    expect(
      st.normal * Math.cos(theta) - st.friction * Math.sin(theta),
    ).toBeCloseTo(STATEMENT.mass * STATEMENT.gravity, 6);
    // N·sin θ + f·cos θ = m·v²/ρ
    expect(
      st.normal * Math.sin(theta) + st.friction * Math.cos(theta),
    ).toBeCloseTo(st.netForce, 6);
  });

  it("keeps μ_required independent of the mass", () => {
    const light = computeBankedCurveState({ ...STATEMENT, mass: 900 });
    const heavy = computeBankedCurveState({ ...STATEMENT, mass: 2600 });
    expect(light.muRequired).toBeCloseTo(heavy.muRequired, 12);
    expect(heavy.normal / light.normal).toBeCloseTo(2600 / 900, 12);
  });

  it("flags slipping outside the limits and not inside", () => {
    const limits = bankedCurveLimits(TRACK);
    expect(
      computeBankedCurveState({ ...STATEMENT, speed: limits.idealSpeed })
        .slipping,
    ).toBe(false);
    const tooFast = computeBankedCurveState({
      ...STATEMENT,
      speed: limits.maxSpeed! + 2,
    });
    expect(tooFast.slipping).toBe(true);
    expect(tooFast.slipsUphill).toBe(true);
    const tooSlow = computeBankedCurveState({
      ...STATEMENT,
      speed: limits.minSpeed - 2,
    });
    expect(tooSlow.slipping).toBe(true);
    expect(tooSlow.slipsUphill).toBe(false);
  });

  it("needs no friction at the ideal speed", () => {
    const limits = bankedCurveLimits(TRACK);
    const st = computeBankedCurveState({
      ...STATEMENT,
      speed: limits.idealSpeed,
    });
    expect(st.friction).toBeCloseTo(0, 9);
    expect(st.muRequired).toBeCloseTo(0, 12);
  });

  it("keeps the normal force positive even at rest", () => {
    const st = computeBankedCurveState({ ...STATEMENT, speed: 0 });
    expect(st.normal).toBeGreaterThan(0);
    expect(st.netForce).toBe(0);
  });
});
