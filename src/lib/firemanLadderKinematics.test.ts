import { describe, expect, it } from "vitest";

import {
  S_MAX,
  S_MIN,
  computeFiremanLadderInstant,
  computeFiremanLadderState,
  ladderUnit,
  sweep,
} from "./firemanLadderKinematics";
import { cross, dot, norm } from "./vec3";
import type { FiremanLadderParams } from "@/types/simulator";

const DEG = Math.PI / 180;

// The statement instant: s = 10 m, θ₂ = 30°, ω₁ = 0.8, ω₂ = 0.5, ṡ = 1.5.
const STATEMENT = {
  s: 10,
  theta2: 30 * DEG,
  omega1: 0.8,
  omega2: 0.5,
  sDot: 1.5,
};

describe("ladderUnit", () => {
  it("is horizontal at θ₂ = 0 and vertical at θ₂ = 90°", () => {
    expect(ladderUnit(0)).toEqual({ x: 0, y: 1, z: 0 });
    const up = ladderUnit(Math.PI / 2);
    expect(up.y).toBeCloseTo(0, 12);
    expect(up.z).toBeCloseTo(1, 12);
  });

  it("stays a unit vector in the y–z plane", () => {
    for (const deg of [0, 17, 30, 45, 80]) {
      const u = ladderUnit(deg * DEG);
      expect(u.x).toBe(0);
      expect(norm(u)).toBeCloseTo(1, 12);
    }
  });
});

describe("computeFiremanLadderInstant — CCR N°14 statement instant", () => {
  const st = computeFiremanLadderInstant(STATEMENT);

  it("places B at s·û", () => {
    expect(st.r.x).toBeCloseTo(0, 6);
    expect(st.r.y).toBeCloseTo(8.6603, 3);
    expect(st.r.z).toBeCloseTo(5, 6);
  });

  it("splits the velocity into transport + relative", () => {
    expect(st.vTransport.x).toBeCloseTo(-6.9282, 3);
    expect(st.vTransport.y).toBeCloseTo(-2.5, 3);
    expect(st.vTransport.z).toBeCloseTo(4.3301, 3);

    expect(st.vRel.y).toBeCloseTo(1.299, 3);
    expect(st.vRel.z).toBeCloseTo(0.75, 3);
  });

  it("gives the textbook velocity", () => {
    expect(st.v.x).toBeCloseTo(-6.9282, 3);
    expect(st.v.y).toBeCloseTo(-1.201, 3);
    expect(st.v.z).toBeCloseTo(5.0801, 3);
    expect(st.speed).toBeCloseTo(8.675, 3);
  });

  it("splits the acceleration into Euler + centripetal + Coriolis", () => {
    expect(st.aEuler.x).toBeCloseTo(2, 3);
    expect(st.aEuler.y).toBeCloseTo(0, 6);
    expect(st.aEuler.z).toBeCloseTo(0, 6);

    expect(st.aCentripetal.x).toBeCloseTo(2, 3);
    expect(st.aCentripetal.y).toBeCloseTo(-7.7076, 3);
    expect(st.aCentripetal.z).toBeCloseTo(-1.25, 3);

    expect(st.aCoriolis.x).toBeCloseTo(-2.0785, 3);
    expect(st.aCoriolis.y).toBeCloseTo(-0.75, 3);
    expect(st.aCoriolis.z).toBeCloseTo(1.299, 3);
  });

  it("gives the textbook acceleration", () => {
    expect(st.a.x).toBeCloseTo(1.9215, 3);
    expect(st.a.y).toBeCloseTo(-8.4576, 3);
    expect(st.a.z).toBeCloseTo(0.049, 3);
    expect(st.accelMag).toBeCloseTo(8.673, 3);
  });

  it("keeps Ω̇ = ω₁ω₂ŷ, perpendicular to Ω", () => {
    expect(st.omegaDot).toEqual({ x: 0, y: 0.4, z: 0 });
    expect(dot(st.omegaDot, st.omega)).toBeCloseTo(0, 12);
  });
});

describe("computeFiremanLadderInstant — structure", () => {
  it("drops the Coriolis term when the ladder is not extending", () => {
    const st = computeFiremanLadderInstant({ ...STATEMENT, sDot: 0 });
    expect(norm(st.aCoriolis)).toBeCloseTo(0, 12);
    expect(norm(st.vRel)).toBeCloseTo(0, 12);
    expect(st.v).toEqual(st.vTransport);
  });

  it("drops the Euler term when either rate is zero", () => {
    expect(
      norm(computeFiremanLadderInstant({ ...STATEMENT, omega1: 0 }).aEuler),
    ).toBeCloseTo(0, 12);
    expect(
      norm(computeFiremanLadderInstant({ ...STATEMENT, omega2: 0 }).aEuler),
    ).toBeCloseTo(0, 12);
  });

  it("collapses to planar polar motion when ω₁ = 0", () => {
    const st = computeFiremanLadderInstant({ ...STATEMENT, omega1: 0 });
    // Nothing leaves the ladder plane.
    expect(st.v.x).toBeCloseTo(0, 12);
    expect(st.a.x).toBeCloseTo(0, 12);
    // Radial/transverse components match a_r = s̈ − sθ̇², a_θ = sθ̈ + 2ṡθ̇.
    const u = st.u;
    const e = cross({ x: 1, y: 0, z: 0 }, u); // transverse direction in-plane
    expect(dot(st.a, u)).toBeCloseTo(
      -STATEMENT.s * STATEMENT.omega2 ** 2,
      10,
    );
    expect(dot(st.a, e)).toBeCloseTo(2 * STATEMENT.sDot * STATEMENT.omega2, 10);
  });

  it("leaves only the relative velocity at the pivot", () => {
    const st = computeFiremanLadderInstant({ ...STATEMENT, s: 0 });
    expect(norm(st.vTransport)).toBeCloseTo(0, 12);
    expect(st.speed).toBeCloseTo(STATEMENT.sDot, 12);
  });

  it("is invariant to the sign convention of the transport term", () => {
    const st = computeFiremanLadderInstant(STATEMENT);
    // Ω × r is perpendicular to both, by construction.
    expect(dot(st.vTransport, st.omega)).toBeCloseTo(0, 10);
    expect(dot(st.vTransport, st.r)).toBeCloseTo(0, 10);
  });
});

describe("sweep", () => {
  it("starts at x₀ moving forward", () => {
    expect(sweep(0, 7, 2, 4, 20)).toEqual({ value: 7, sign: 1 });
  });

  it("freezes when the rate is zero", () => {
    expect(sweep(5, 7, 0, 4, 20)).toEqual({ value: 7, sign: 0 });
  });

  it("bounces off the upper stop and reverses sign", () => {
    // From 18 at 2 m/s, the stop at 20 is reached after 1 s.
    const after = sweep(2, 18, 2, 4, 20);
    expect(after.value).toBeCloseTo(18, 10);
    expect(after.sign).toBe(-1);
  });

  it("never leaves the interval", () => {
    for (let t = 0; t < 60; t += 0.37) {
      const { value } = sweep(t, 10, 1.5, 4, 20);
      expect(value).toBeGreaterThanOrEqual(4);
      expect(value).toBeLessThanOrEqual(20);
    }
  });
});

describe("computeFiremanLadderState", () => {
  const params: FiremanLadderParams = {
    omega1: 0.8,
    omega2: 0.5,
    sDot: 1.5,
    s0: 10,
    theta20Deg: 30,
  };

  it("reproduces the statement instant at t = 0", () => {
    const st = computeFiremanLadderState(params, 0);
    expect(st.s).toBe(10);
    expect(st.theta2).toBeCloseTo(30 * DEG, 12);
    expect(st.speed).toBeCloseTo(8.675, 3);
    expect(st.accelMag).toBeCloseTo(8.673, 3);
    expect(st.azimuth).toBe(0);
  });

  it("keeps the sweep inside its stops and spins the turret", () => {
    for (let t = 0; t < 40; t += 0.41) {
      const st = computeFiremanLadderState(params, t);
      expect(st.s).toBeGreaterThanOrEqual(S_MIN);
      expect(st.s).toBeLessThanOrEqual(S_MAX);
      expect(st.theta2).toBeGreaterThanOrEqual(0);
      expect(st.theta2).toBeLessThanOrEqual(80 * DEG + 1e-12);
      expect(st.azimuth).toBeCloseTo(params.omega1 * t, 12);
    }
  });

  it("is independent of the turret heading", () => {
    // θ₁ only orients the scene; the magnitudes at t and t + a full turn of
    // the turret differ only through the sweep, so compare a case where the
    // sweep is frozen.
    const frozen = { ...params, omega2: 0, sDot: 0 };
    const a = computeFiremanLadderState(frozen, 0);
    const b = computeFiremanLadderState(frozen, 3.7);
    expect(b.speed).toBeCloseTo(a.speed, 12);
    expect(b.accelMag).toBeCloseTo(a.accelMag, 12);
  });
});
