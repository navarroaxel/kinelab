import { describe, expect, it } from "vitest";

import type { HoistParams } from "@/types/simulator";

import {
  COUNTERWEIGHT_SPEED_RATIO,
  G,
  computeHoistState,
  counterweightSpeed,
  efficiencyAtWattmeterReading,
  maxCounterweightMass,
  mechanicalPower,
} from "./hoistKinematics";

const params: HoistParams = {
  loadMass: 300,
  counterweightMass: 100,
  speed: 2,
  wattmeterReading: 2200,
};

describe("counterweightSpeed / maxCounterweightMass", () => {
  it("moves the counterweight at twice the load's speed", () => {
    expect(COUNTERWEIGHT_SPEED_RATIO).toBe(2);
    expect(counterweightSpeed(2)).toBe(4);
    expect(counterweightSpeed(0)).toBe(0);
  });

  it("caps the counterweight at half the load", () => {
    expect(maxCounterweightMass(300)).toBe(150);
  });
});

describe("mechanicalPower", () => {
  it("is T₁ · (2·v) with T₁ = load·g/2 − counterweight·g", () => {
    const t2 = (300 * G) / 2;
    const t1 = t2 - 100 * G;
    expect(mechanicalPower(300, 100, 2)).toBeCloseTo(t1 * 4, 6);
  });

  it("reduces to load·g/2 · 2v with no counterweight", () => {
    expect(mechanicalPower(300, 0, 2)).toBeCloseTo(((300 * G) / 2) * 4, 6);
  });

  it("decreases monotonically as the counterweight grows", () => {
    const powers = [0, 50, 100, 150].map((cw) => mechanicalPower(300, cw, 2));
    for (let i = 1; i < powers.length; i++) {
      expect(powers[i]).toBeLessThan(powers[i - 1]);
    }
  });

  it("never goes negative — the counterweight is clamped to load/2", () => {
    expect(mechanicalPower(300, 150, 2)).toBeCloseTo(0, 9);
    expect(mechanicalPower(300, 400, 2)).toBeCloseTo(0, 9);
    expect(mechanicalPower(300, 400, 2)).toBe(mechanicalPower(300, 150, 2));
  });

  it("is zero when the load is not moving", () => {
    expect(mechanicalPower(300, 100, 0)).toBe(0);
  });

  it("accepts a gravity override", () => {
    expect(mechanicalPower(300, 100, 2, 10)).toBeCloseTo(
      ((300 * 10) / 2 - 100 * 10) * 4,
      9,
    );
  });
});

describe("computeHoistState", () => {
  it("solves the reference case with a plausible efficiency", () => {
    const s = computeHoistState(params);
    expect(s.mechanicalPower).toBeCloseTo(((300 * G) / 2 - 100 * G) * 4, 6);
    expect(s.electricalPower).toBe(2200);
    expect(s.counterweightSpeed).toBe(4);
    expect(s.efficiency).toBeCloseTo(s.mechanicalPower / 2200, 12);
    expect(s.efficiency).toBeLessThan(1);
    expect(s.exceedsInput).toBe(false);
  });

  it("flags a mechanical output larger than the electrical input", () => {
    const s = computeHoistState({ ...params, wattmeterReading: 100 });
    expect(s.exceedsInput).toBe(true);
    expect(s.efficiency).toBeGreaterThan(1);
  });

  it("returns a zero efficiency for a zero wattmeter reading", () => {
    expect(
      computeHoistState({ ...params, wattmeterReading: 0 }).efficiency,
    ).toBe(0);
  });
});

describe("efficiencyAtWattmeterReading", () => {
  it("agrees with the state at the nominal reading and halves when the reading doubles", () => {
    const nominal = computeHoistState(params).efficiency;
    expect(efficiencyAtWattmeterReading(2200, params)).toBeCloseTo(nominal, 12);
    expect(efficiencyAtWattmeterReading(4400, params)).toBeCloseTo(
      nominal / 2,
      12,
    );
  });

  it("returns 0 for a non-positive reading", () => {
    expect(efficiencyAtWattmeterReading(0, params)).toBe(0);
    expect(efficiencyAtWattmeterReading(-10, params)).toBe(0);
  });
});
