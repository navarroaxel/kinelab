import { describe, expect, it } from "vitest";

import type { HelicopterLiftParams } from "@/types/simulator";

import {
  G,
  computeHelicopterLiftState,
  massFlowRate,
  maxLoadAtExhaustVelocity,
  thrustForce,
  wakeArea,
} from "./helicopterLiftKinematics";

const params: HelicopterLiftParams = {
  exhaustVelocity: 80,
  wakeDiameter: 30,
  heliWeight: 3500,
  airDensity: 0.076,
};

describe("wakeArea", () => {
  it("is π/4 · d²", () => {
    expect(wakeArea(30)).toBeCloseTo((Math.PI / 4) * 900, 9);
  });

  it("is zero at zero diameter", () => {
    expect(wakeArea(0)).toBe(0);
  });
});

describe("massFlowRate", () => {
  it("is ρ/g · A · v", () => {
    const area = wakeArea(30);
    expect(massFlowRate(0.076, area, 80)).toBeCloseTo(
      (0.076 / G) * area * 80,
      9,
    );
  });

  it("scales linearly with density, area, and velocity", () => {
    const area = wakeArea(30);
    const base = massFlowRate(0.076, area, 80);
    expect(massFlowRate(0.152, area, 80)).toBeCloseTo(2 * base, 9);
    expect(massFlowRate(0.076, 2 * area, 80)).toBeCloseTo(2 * base, 9);
    expect(massFlowRate(0.076, area, 160)).toBeCloseTo(2 * base, 9);
  });
});

describe("thrustForce", () => {
  it("is ṁ · v", () => {
    expect(thrustForce(133.4688, 80)).toBeCloseTo(133.4688 * 80, 6);
  });
});

describe("computeHelicopterLiftState", () => {
  it("solves the reference case (Hibbeler): thrust ≈ 10 677 lb, load ≈ 7 177 lb", () => {
    const s = computeHelicopterLiftState(params);
    expect(s.wakeArea).toBeCloseTo(706.858, 2);
    expect(s.massFlowRate).toBeCloseTo(133.469, 2);
    expect(s.thrust).toBeCloseTo(10677.5, -1);
    expect(s.maxLoad).toBeCloseTo(7177.5, -1);
  });

  it("negative maxLoad flags that the rotor can't even lift its own weight", () => {
    const s = computeHelicopterLiftState({ ...params, exhaustVelocity: 10 });
    expect(s.thrust).toBeLessThan(params.heliWeight);
    expect(s.maxLoad).toBeLessThan(0);
  });

  it("is zero flow / zero thrust at zero exhaust velocity", () => {
    const s = computeHelicopterLiftState({ ...params, exhaustVelocity: 0 });
    expect(s.massFlowRate).toBe(0);
    expect(s.thrust).toBe(0);
    expect(s.maxLoad).toBe(-params.heliWeight);
  });
});

describe("maxLoadAtExhaustVelocity", () => {
  it("agrees with the state at the nominal velocity", () => {
    expect(maxLoadAtExhaustVelocity(80, params)).toBeCloseTo(
      computeHelicopterLiftState(params).maxLoad,
      9,
    );
  });

  it("grows quadratically with exhaust velocity", () => {
    const loadAt40 = maxLoadAtExhaustVelocity(40, params) + params.heliWeight;
    const loadAt80 = maxLoadAtExhaustVelocity(80, params) + params.heliWeight;
    expect(loadAt80).toBeCloseTo(4 * loadAt40, 6);
  });
});
