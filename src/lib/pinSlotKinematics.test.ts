import { describe, expect, it } from "vitest";

import type { PinSlotParams } from "@/types/simulator";

import { computePinSlotState, pinOmega } from "./pinSlotKinematics";

const params: PinSlotParams = { r: 60, d: 100, v0: 120 };

describe("pinOmega", () => {
  it("is V0 / r", () => {
    expect(pinOmega(params)).toBeCloseTo(2, 12);
  });
});

describe("computePinSlotState", () => {
  it("places B on the slot circle centred at A = (d, 0)", () => {
    for (const phi of [0, 1, 2.5, 4.7]) {
      const s = computePinSlotState(params, phi);
      expect(Math.hypot(s.bx - params.d, s.by)).toBeCloseTo(params.r, 9);
    }
  });

  it("agrees with |OB| computed directly from the components", () => {
    for (const phi of [0.3, 1.8, 3.9, 5.6]) {
      const s = computePinSlotState(params, phi);
      expect(s.rho).toBeCloseTo(Math.hypot(s.bx, s.by), 9);
      expect(s.theta).toBeCloseTo(Math.atan2(s.by, s.bx), 9);
    }
  });

  it("preserves the speed: v_r² + v_⊥² = V0²", () => {
    for (const phi of [0.1, 0.9, 2.0, 3.4, 5.9]) {
      const s = computePinSlotState(params, phi);
      expect(Math.hypot(s.vr, s.vPerp)).toBeCloseTo(params.v0, 6);
    }
  });

  it("has v_⊥ = ρ·ω by construction", () => {
    const s = computePinSlotState(params, 1.3);
    expect(s.vPerp).toBeCloseTo(s.rho * s.omega, 9);
  });

  it("matches finite differences of ρ(Φ) and θ(Φ) via the chain rule", () => {
    const Omega = pinOmega(params);
    const phi = 1.3;
    const h = 1e-6;
    const plus = computePinSlotState(params, phi + h);
    const minus = computePinSlotState(params, phi - h);
    const here = computePinSlotState(params, phi);

    // ρ̇ = dρ/dΦ · Φ̇
    expect(((plus.rho - minus.rho) / (2 * h)) * Omega).toBeCloseTo(here.vr, 5);
    // θ̇ = dθ/dΦ · Φ̇
    expect(((plus.theta - minus.theta) / (2 * h)) * Omega).toBeCloseTo(
      here.omega,
      6,
    );
  });

  it("has pure transverse motion at the extremes of ρ (Φ = 0, π)", () => {
    for (const phi of [0, Math.PI]) {
      const state = computePinSlotState(params, phi);
      expect(state.vr).toBeCloseTo(0, 9);
      expect(Math.abs(state.vPerp)).toBeCloseTo(params.v0, 9);
    }
  });

  it("reaches ρ_max at Φ = 0 and ρ_min at Φ = π", () => {
    expect(computePinSlotState(params, 0).rho).toBeCloseTo(
      params.d + params.r,
      9,
    );
    expect(computePinSlotState(params, Math.PI).rho).toBeCloseTo(
      params.d - params.r,
      9,
    );
  });

  it("freezes the singular case where the pin passes through the pivot (d = r, Φ = π)", () => {
    const degenerate: PinSlotParams = { r: 60, d: 60, v0: 120 };
    const state = computePinSlotState(degenerate, Math.PI);
    expect(state.singular).toBe(true);
    expect(state.vr).toBe(0);
    expect(state.vPerp).toBe(0);
    expect(state.omega).toBe(0);
    expect(state.gamma).toBe(0);
    expect(Number.isNaN(state.rho)).toBe(false);
  });

  it("stays regular for d = r away from Φ = π", () => {
    const state = computePinSlotState({ r: 60, d: 60, v0: 120 }, 3.0);
    expect(state.singular).toBe(false);
    expect(Math.hypot(state.vr, state.vPerp)).toBeCloseTo(120, 6);
  });

  it("echoes the input Φ", () => {
    expect(computePinSlotState(params, 2.7).phi).toBe(2.7);
  });
});
