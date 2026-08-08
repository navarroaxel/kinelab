import { describe, expect, it } from "vitest";

import type { RingParams } from "@/types/simulator";

import {
  classifyMotion,
  computeRingState,
  computeVMin,
  rk4Step,
  speedToThetaDot,
} from "./ringKinematics";

const params: RingParams = { radius: 100, gravity: 200, initialSpeed: 0 };

/** Per-unit-mass total energy of the state (θ, θ̇). */
const energy = (theta: number, thetaDot: number, R: number, g: number) =>
  0.5 * (R * thetaDot) ** 2 + g * R * (1 - Math.cos(theta));

describe("rk4Step", () => {
  it("leaves the stable equilibrium at the bottom untouched", () => {
    const s = rk4Step(0, 0, 0.016, params.gravity, params.radius);
    expect(s.theta).toBeCloseTo(0, 12);
    expect(s.thetaDot).toBeCloseTo(0, 12);
  });

  it("accelerates back toward the bottom when released from rest off-centre", () => {
    const s = rk4Step(0.5, 0, 0.01, params.gravity, params.radius);
    expect(s.thetaDot).toBeLessThan(0);
    expect(s.theta).toBeLessThan(0.5);
  });

  it("conserves energy over a full oscillation", () => {
    const { radius: R, gravity: g } = params;
    let theta = 1.0;
    let thetaDot = 0;
    const e0 = energy(theta, thetaDot, R, g);
    const dt = 1 / 240;
    for (let i = 0; i < 5000; i++) {
      ({ theta, thetaDot } = rk4Step(theta, thetaDot, dt, g, R));
    }
    const drift = Math.abs(energy(theta, thetaDot, R, g) - e0) / e0;
    expect(drift).toBeLessThan(1e-8);
  });

  it("reproduces the small-angle pendulum period to within 1%", () => {
    const { radius: R, gravity: g } = params;
    const theta0 = 0.02;
    let theta = theta0;
    let thetaDot = 0;
    const dt = 1e-4;
    let t = 0;
    // Released from rest at the amplitude, θ first crosses zero at T/4.
    while (theta > 0 && t < 100) {
      ({ theta, thetaDot } = rk4Step(theta, thetaDot, dt, g, R));
      t += dt;
    }
    const period = 4 * t;
    const expected = 2 * Math.PI * Math.sqrt(R / g);
    expect(Math.abs(period - expected) / expected).toBeLessThan(0.01);
  });

  it("agrees with a much finer integration (4th-order convergence)", () => {
    const { radius: R, gravity: g } = params;
    const run = (steps: number, total: number) => {
      let theta = 0.8;
      let thetaDot = 0;
      const dt = total / steps;
      for (let i = 0; i < steps; i++) {
        ({ theta, thetaDot } = rk4Step(theta, thetaDot, dt, g, R));
      }
      return theta;
    };
    expect(run(100, 1)).toBeCloseTo(run(10_000, 1), 6);
  });
});

describe("computeRingState", () => {
  it("derives position, height and speed at the bottom", () => {
    const s = computeRingState(0, 0, params);
    expect(s.px).toBeCloseTo(0, 12);
    expect(s.py).toBeCloseTo(-params.radius, 12);
    expect(s.h).toBeCloseTo(0, 12);
    expect(s.v).toBe(0);
    expect(s.KE).toBe(0);
    expect(s.PE).toBe(0);
  });

  it("puts the particle at the top with h = 2R when θ = π", () => {
    const s = computeRingState(Math.PI, 0, params);
    expect(s.py).toBeCloseTo(params.radius, 12);
    expect(s.h).toBeCloseTo(2 * params.radius, 12);
  });

  it("reports N = g + Rθ̇² at the bottom and loses contact at the top when too slow", () => {
    const bottom = computeRingState(0, 1, params);
    expect(bottom.N).toBeCloseTo(params.gravity + params.radius, 9);
    expect(bottom.hasContact).toBe(true);

    const slowTop = computeRingState(Math.PI, 0.5, params);
    expect(slowTop.N).toBeLessThan(0);
    expect(slowTop.hasContact).toBe(false);
  });

  it("gives exactly N = 0 at the top when launched at v_min", () => {
    const { radius: R, gravity: g } = params;
    // Energy: ½v₀² = ½v_top² + g·2R, with v₀ = v_min = √(5gR) ⟹ v_top² = gR.
    const vTop = Math.sqrt(g * R);
    const s = computeRingState(Math.PI, vTop / R, params);
    expect(s.N).toBeCloseTo(0, 9);
    expect(s.hasContact).toBe(true);
  });

  it("uses |θ̇| for speed, so direction does not change the energy", () => {
    const cw = computeRingState(0.6, -2, params);
    const ccw = computeRingState(0.6, 2, params);
    expect(cw.v).toBe(ccw.v);
    expect(cw.KE).toBe(ccw.KE);
    expect(cw.PE).toBe(ccw.PE);
  });
});

describe("computeVMin / speedToThetaDot", () => {
  it("returns √(5gR)", () => {
    expect(computeVMin(200, 100)).toBeCloseTo(Math.sqrt(5 * 200 * 100), 12);
    expect(computeVMin(0, 100)).toBe(0);
  });

  it("converts a bottom speed into an angular rate", () => {
    expect(speedToThetaDot(300, 100)).toBeCloseTo(3, 12);
  });

  it("guards against a zero radius rather than returning Infinity", () => {
    expect(speedToThetaDot(300, 0)).toBe(0);
  });
});

describe("classifyMotion", () => {
  const g = 200;
  const R = 100;
  const vMin = computeVMin(g, R);

  it("classifies below, at, and above v_min", () => {
    expect(classifyMotion(vMin * 0.5, g, R)).toBe("oscillation");
    expect(classifyMotion(vMin, g, R)).toBe("critical");
    expect(classifyMotion(vMin * 1.5, g, R)).toBe("full_loop");
  });

  it("treats speeds within the tolerance band as critical", () => {
    expect(classifyMotion(vMin * (1 + 1e-5), g, R)).toBe("critical");
    expect(classifyMotion(vMin * (1 - 1e-5), g, R)).toBe("critical");
  });

  it("classifies rest as oscillation", () => {
    expect(classifyMotion(0, g, R)).toBe("oscillation");
  });
});
