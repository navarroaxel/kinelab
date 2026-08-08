import { describe, expect, it } from "vitest";

import type { ParachutistParams } from "@/types/simulator";

import {
  G,
  computeParachutistState,
  positionAtTime,
  terminalSpeed,
  timeConstant,
  velocityAtTime,
} from "./parachutistKinematics";

const params: ParachutistParams = {
  mass: 80,
  beta: 100,
  initialSpeed: 20,
};

describe("terminalSpeed / timeConstant", () => {
  it("solves the reference case (80 kg, β=100)", () => {
    expect(terminalSpeed(80, 100)).toBeCloseTo((80 * G) / 100, 9);
    expect(timeConstant(80, 100)).toBeCloseTo(0.8, 9);
  });

  it("returns Infinity for zero drag", () => {
    expect(terminalSpeed(80, 0)).toBe(Infinity);
    expect(timeConstant(80, 0)).toBe(Infinity);
  });
});

describe("velocityAtTime", () => {
  const vt = terminalSpeed(80, 100);
  const tau = timeConstant(80, 100);

  it("starts at v0 and converges to v_t as t → ∞", () => {
    expect(velocityAtTime(0, 20, vt, tau)).toBe(20);
    expect(velocityAtTime(1e6, 20, vt, tau)).toBeCloseTo(vt, 6);
  });

  it("approaches v_t from below when v0 < v_t", () => {
    const v0 = vt - 2;
    const v1 = velocityAtTime(1, v0, vt, tau);
    const v2 = velocityAtTime(2, v0, vt, tau);
    expect(v0).toBeLessThan(v1);
    expect(v1).toBeLessThan(v2);
    expect(v2).toBeLessThan(vt);
  });

  it("approaches v_t from above when v0 > v_t — it never overshoots or diverges", () => {
    const v0 = vt + 5;
    const v1 = velocityAtTime(1, v0, vt, tau);
    const v2 = velocityAtTime(2, v0, vt, tau);
    expect(v0).toBeGreaterThan(v1);
    expect(v1).toBeGreaterThan(v2);
    expect(v2).toBeGreaterThan(vt);
  });
});

describe("positionAtTime", () => {
  const vt = terminalSpeed(80, 100);
  const tau = timeConstant(80, 100);

  it("starts at zero", () => {
    expect(positionAtTime(0, 20, vt, tau)).toBe(0);
  });

  it("is monotonically increasing", () => {
    const z1 = positionAtTime(1, 20, vt, tau);
    const z2 = positionAtTime(2, 20, vt, tau);
    expect(z2).toBeGreaterThan(z1);
  });

  it("approaches v_t·t plus a constant offset as the transient term decays", () => {
    // z(t) = v_t·t + (v0 − v_t)·τ·(1 − e^(−t/τ)); for large t the exponential
    // vanishes, leaving a constant offset (v0 − v_t)·τ rather than 0.
    const t = 100;
    const asymptote = vt * t + (20 - vt) * tau;
    expect(positionAtTime(t, 20, vt, tau)).toBeCloseTo(asymptote, 3);
  });
});

describe("computeParachutistState", () => {
  it("solves the reference case and always claims convergence", () => {
    const s = computeParachutistState(params);
    expect(s.terminalSpeed).toBeCloseTo((80 * G) / 100, 9);
    expect(s.timeConstant).toBeCloseTo(0.8, 9);
    expect(s.approachesLimit).toBe(true);
  });
});
