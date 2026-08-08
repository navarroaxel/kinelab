import { describe, expect, it } from "vitest";

import type { PulleyFrictionParams } from "@/types/simulator";

import {
  appliedForce,
  cableTension,
  degToRad,
  minimumForce,
  optimalAngle,
} from "./pulleyFrictionKinematics";

const params: PulleyFrictionParams = {
  weightA: 1000,
  weightB: 200,
  frictionCoefficient: 0.25,
  inclineAngle: 37,
  pullAngle: 20,
};

describe("degToRad", () => {
  it("converts degrees to radians", () => {
    expect(degToRad(90)).toBeCloseTo(Math.PI / 2, 12);
  });
});

describe("cableTension", () => {
  it("solves the reference case (T ≈ 160.3 N)", () => {
    expect(cableTension(params)).toBeCloseTo(160.3, 1);
  });

  it("is independent of block A's parameters", () => {
    const t1 = cableTension(params);
    const t2 = cableTension({ ...params, weightA: 5000, pullAngle: 45 });
    expect(t2).toBeCloseTo(t1, 9);
  });

  it("grows with the incline angle", () => {
    const t1 = cableTension({ ...params, inclineAngle: 20 });
    const t2 = cableTension({ ...params, inclineAngle: 50 });
    expect(t2).toBeGreaterThan(t1);
  });
});

describe("appliedForce", () => {
  it("solves the reference case at θ=20° (F ≈ 556.6 N)", () => {
    expect(appliedForce(20, params)).toBeCloseTo(556.6, 0);
  });

  it("includes the movable pulley's 2T load, not just T", () => {
    const T = cableTension(params);
    const F = appliedForce(0, params);
    // At θ=0: F = (μ·weightA + 2T) / 1.
    expect(F).toBeCloseTo(params.frictionCoefficient * params.weightA + 2 * T, 6);
  });

  it("is minimized at the optimal angle", () => {
    const opt = optimalAngle(params);
    const fOpt = appliedForce(opt, params);
    expect(appliedForce(opt - 5, params)).toBeGreaterThan(fOpt);
    expect(appliedForce(opt + 5, params)).toBeGreaterThan(fOpt);
  });
});

describe("optimalAngle / minimumForce", () => {
  it("solves θ_opt = arctan(μ) ≈ 14.0°", () => {
    expect(optimalAngle(params)).toBeCloseTo(14.036, 2);
  });

  it("depends only on the friction coefficient", () => {
    expect(optimalAngle({ ...params, weightA: 1, weightB: 1 })).toBeCloseTo(
      optimalAngle(params),
      9,
    );
  });

  it("solves F_min ≈ 553.6 N at the reference values", () => {
    expect(minimumForce(params)).toBeCloseTo(553.6, 0);
  });

  it("agrees with appliedForce evaluated at the optimal angle", () => {
    expect(minimumForce(params)).toBeCloseTo(
      appliedForce(optimalAngle(params), params),
      9,
    );
  });
});
