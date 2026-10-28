import { describe, expect, it } from "vitest";
import {
  computePinSlotBarInstant,
  computePinSlotBarState,
  pinSlotBarLimits,
} from "./pinSlotBarKinematics";
import type { PinSlotBarParams } from "@/types/simulator";

// CCR N°16's own numbers: C at the origin, O = (40, 20) cm, L = CA = 20 cm,
// ω_BO = 2 rad/s clockwise (signed −2 in the CCW-positive convention this
// module uses throughout). At the statement instant, A = (20, 0) — AC
// horizontal, θ = 45° between OA and the... (the figure's own reference).
const STATEMENT_PARAMS: PinSlotBarParams = {
  pivotOx: 40,
  pivotOy: 20,
  armLength: 20,
  omegaBO: -2,
  phi0Deg: -135,
};

describe("computePinSlotBarInstant — CCR N°16 statement instant", () => {
  const phi0 = (-135 * Math.PI) / 180;
  const state = computePinSlotBarInstant(phi0, -2, STATEMENT_PARAMS);

  it("reproduces the pin position", () => {
    expect(state.ax).toBeCloseTo(20, 6);
    expect(state.ay).toBeCloseTo(0, 6);
    expect(state.r).toBeCloseTo(Math.sqrt(800), 6);
  });

  it("matches ω_AC = 4 rad/s (CCW) and γ_AC = −32 rad/s² (CW)", () => {
    expect(state.omegaAC).toBeCloseTo(4, 6);
    expect(state.alphaAC).toBeCloseTo(-32, 4);
  });

  it("matches the velocity decomposition", () => {
    expect(state.vArr.x).toBeCloseTo(-40, 4);
    expect(state.vArr.y).toBeCloseTo(40, 4);
    expect(state.vRel.x).toBeCloseTo(40, 4);
    expect(state.vRel.y).toBeCloseTo(40, 4);
    expect(state.vA.x).toBeCloseTo(0, 4);
    expect(state.vA.y).toBeCloseTo(80, 4);
  });

  it("matches the acceleration decomposition", () => {
    expect(state.aArr.x).toBeCloseTo(80, 3);
    expect(state.aArr.y).toBeCloseTo(80, 3);
    expect(state.aCor.x).toBeCloseTo(160, 3);
    expect(state.aCor.y).toBeCloseTo(-160, 3);
    expect(state.aRel.x).toBeCloseTo(-560, 2);
    expect(state.aRel.y).toBeCloseTo(-560, 2);
    expect(state.aA.x).toBeCloseTo(-320, 2);
    expect(state.aA.y).toBeCloseTo(-640, 2);
  });

  it("v_rel points toward O while a_rel points away — the slide is about to reverse", () => {
    const towardO = { x: -state.ax + 40, y: -state.ay + 20 };
    // v_rel and (A→O) should point the same way; a_rel is anti-parallel to it.
    const vRelDotTowardO =
      state.vRel.x * towardO.x + state.vRel.y * towardO.y;
    const aRelDotTowardO =
      state.aRel.x * towardO.x + state.aRel.y * towardO.y;
    expect(vRelDotTowardO).toBeGreaterThan(0);
    expect(aRelDotTowardO).toBeLessThan(0);
  });
});

describe("pinSlotBarLimits", () => {
  it("brackets the statement instant", () => {
    const { phiMin, phiMax } = pinSlotBarLimits(STATEMENT_PARAMS);
    const phi0 = ((-135 * Math.PI) / 180 + 2 * Math.PI) % (2 * Math.PI);
    // phi0 normalised into the same unwrapped branch as the bounds.
    const normalized =
      phi0 < phiMin ? phi0 + 2 * Math.PI : phi0 > phiMax ? phi0 - 2 * Math.PI : phi0;
    expect(normalized).toBeGreaterThanOrEqual(phiMin - 1e-9);
    expect(normalized).toBeLessThanOrEqual(phiMax + 1e-9);
  });
});

describe("computePinSlotBarState", () => {
  it("sits at the statement configuration at t = 0", () => {
    const state = computePinSlotBarState(STATEMENT_PARAMS, 0);
    expect(state.ax).toBeCloseTo(20, 6);
    expect(state.ay).toBeCloseTo(0, 6);
    expect(state.omegaAC).toBeCloseTo(4, 6);
    expect(state.alphaAC).toBeCloseTo(-32, 4);
  });

  it("keeps φ within its swing limits over time", () => {
    const { phiMin, phiMax } = pinSlotBarLimits(STATEMENT_PARAMS);
    for (let t = 0; t <= 20; t += 0.37) {
      const state = computePinSlotBarState(STATEMENT_PARAMS, t);
      expect(state.phi).toBeGreaterThanOrEqual(phiMin - 1e-9);
      expect(state.phi).toBeLessThanOrEqual(phiMax + 1e-9);
    }
  });
});
