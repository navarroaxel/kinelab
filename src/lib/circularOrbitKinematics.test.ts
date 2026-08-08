import { describe, expect, it } from "vitest";

import type { CircularOrbitParams } from "@/types/simulator";

import {
  altitudeAtSpeed,
  angularVelocity,
  computeOrbit,
  orbitalPeriod,
  orbitalRadiusMeters,
} from "./circularOrbitKinematics";

const params: CircularOrbitParams = { vKmh: 24_000, R: 6372, g: 9.806 };

describe("orbitalRadiusMeters", () => {
  it("satisfies the law it was solved from: v²/r = g·(R/r)²", () => {
    const v = 7000;
    const R = 6.372e6;
    const r = orbitalRadiusMeters(v, R, 9.806);
    expect((v * v) / r).toBeCloseTo(9.806 * (R / r) ** 2, 9);
  });

  it("puts a body at the surface when v² = g·R", () => {
    const R = 6.372e6;
    const g = 9.806;
    expect(orbitalRadiusMeters(Math.sqrt(g * R), R, g) / R).toBeCloseTo(1, 9);
  });

  it("shrinks the orbit as the speed grows (r ∝ 1/v²)", () => {
    const R = 6.372e6;
    const r1 = orbitalRadiusMeters(5000, R, 9.806);
    const r2 = orbitalRadiusMeters(10_000, R, 9.806);
    expect(r2 / (r1 / 4)).toBeCloseTo(1, 9);
  });
});

describe("orbitalPeriod / angularVelocity", () => {
  it("is the circumference divided by the speed", () => {
    expect(orbitalPeriod(1000, 10)).toBeCloseTo(200 * Math.PI, 9);
  });

  it("relates ω and T by T = 2π/ω", () => {
    const r = 7e6;
    const v = 7500;
    expect(orbitalPeriod(r, v)).toBeCloseTo(
      (2 * Math.PI) / angularVelocity(r, v),
      6,
    );
  });
});

describe("computeOrbit", () => {
  it("converts to SI and reports radius/altitude in km", () => {
    const s = computeOrbit(params);
    expect(s.v).toBeCloseTo(24_000 / 3.6, 9);
    expect(s.h).toBeCloseTo(s.r - params.R, 9);
    expect(s.r).toBeGreaterThan(params.R);
    expect(s.hitsSurface).toBe(false);
  });

  it("keeps a_n consistent with v²/r", () => {
    const s = computeOrbit(params);
    expect(s.aN).toBeCloseTo((s.v * s.v) / (s.r * 1000), 9);
    expect(s.aN).toBeCloseTo(params.g * (params.R / s.r) ** 2, 9);
  });

  it("closes the period against 2πr/v", () => {
    const s = computeOrbit(params);
    expect(s.T).toBeCloseTo((2 * Math.PI * s.r * 1000) / s.v, 6);
  });

  it("flags speeds too high to sustain an orbit above the surface", () => {
    const fast = computeOrbit({ ...params, vKmh: 40_000 });
    expect(fast.hitsSurface).toBe(true);
    expect(fast.h).toBeLessThan(0);
  });
});

describe("altitudeAtSpeed", () => {
  it("agrees with computeOrbit at the same speed", () => {
    expect(altitudeAtSpeed(params.vKmh, params.R, params.g)).toBeCloseTo(
      computeOrbit(params).h,
      6,
    );
  });

  it("decreases monotonically with speed", () => {
    const hs = [16_000, 20_000, 24_000, 30_000].map((v) =>
      altitudeAtSpeed(v, params.R, params.g),
    );
    for (let i = 1; i < hs.length; i++) {
      expect(hs[i]).toBeLessThan(hs[i - 1]);
    }
  });
});
