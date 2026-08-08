import { describe, expect, it } from "vitest";

import {
  DEFAULT_DV_A,
  DEFAULT_DV_B,
  DEFAULT_DV_C,
  MU_MARS,
  R_A,
  R_B,
  R_C,
  computeMission,
  nuDot,
  orbitPosition,
  orbitRadius,
  orbitSpeed,
  orbitVelocity,
} from "./keplerKinematics";

const mission = computeMission(DEFAULT_DV_A, DEFAULT_DV_B, DEFAULT_DV_C);

describe("computeMission — initial circular orbit", () => {
  it("has the circular speed √(μ/r_A)", () => {
    expect(mission.vCirc).toBeCloseTo(Math.sqrt(MU_MARS / R_A), 9);
    expect(mission.vCirc).toBeCloseTo(2.771, 3);
  });

  it("describes orbit0 as a circle of radius r_A", () => {
    const { orbit0 } = mission;
    expect(orbit0.e).toBe(0);
    expect(orbit0.a).toBe(R_A);
    expect(orbit0.b).toBeCloseTo(R_A, 9);
    expect(orbit0.p).toBeCloseTo(R_A, 9);
    expect(orbitRadius(orbit0, 0)).toBeCloseTo(R_A, 9);
    expect(orbitRadius(orbit0, 2)).toBeCloseTo(R_A, 9);
  });
});

describe("computeMission — transfer ellipses", () => {
  it("adds Δv_A to the circular speed at A", () => {
    expect(mission.vAplus).toBeCloseTo(mission.vCirc + DEFAULT_DV_A, 12);
  });

  it("shapes orbit1 with periapsis r_A and apoapsis r_B", () => {
    const { orbit1 } = mission;
    expect(orbit1.a).toBeCloseTo((R_A + R_B) / 2, 9);
    expect(orbit1.e).toBeCloseTo((R_B - R_A) / (R_B + R_A), 12);
    expect(orbitRadius(orbit1, 0)).toBeCloseTo(R_A, 6);
    expect(orbitRadius(orbit1, Math.PI)).toBeCloseTo(R_B, 6);
  });

  it("conserves angular momentum from A to B on orbit 1", () => {
    expect(R_A * mission.vAplus).toBeCloseTo(R_B * mission.vB1, 9);
    expect(mission.vB1).toBeLessThan(mission.vAplus); // slower at apoapsis
  });

  it("slows down at B by Δv_B and conserves h from B to C on orbit 2", () => {
    expect(mission.vB2).toBeCloseTo(mission.vB1 - DEFAULT_DV_B, 12);
    expect(R_B * mission.vB2).toBeCloseTo(R_C * mission.vCbefore, 9);
    expect(mission.vCbefore).toBeGreaterThan(mission.vB2);
  });

  it("shapes orbit2 with periapsis r_C and apoapsis r_B, tighter than orbit1", () => {
    const { orbit1, orbit2 } = mission;
    expect(orbit2.a).toBeCloseTo((R_C + R_B) / 2, 9);
    expect(orbit2.a).toBeLessThan(orbit1.a);
    expect(orbit2.T).toBeLessThan(orbit1.T);
  });

  it("uses Kepler's third law for the periods", () => {
    for (const orbit of [mission.orbit0, mission.orbit1, mission.orbit2]) {
      expect(orbit.T).toBeCloseTo(
        2 * Math.PI * Math.sqrt(orbit.a ** 3 / MU_MARS),
        6,
      );
    }
  });

  it("never lets Δv_B drive the speed at B negative", () => {
    const overshoot = computeMission(DEFAULT_DV_A, 100, DEFAULT_DV_C);
    expect(overshoot.vB2).toBe(0);
  });
});

describe("computeMission — escape hyperbola", () => {
  it("escapes: e > 1 and a < 0", () => {
    expect(mission.vFinal).toBeCloseTo(mission.vCbefore + DEFAULT_DV_C, 12);
    expect(mission.hyperbola.e).toBeGreaterThan(1);
    expect(mission.hyperbola.a).toBeLessThan(0);
    expect(mission.hyperbola.T).toBe(0);
  });

  it("exceeds the escape speed at C", () => {
    expect(mission.vFinal).toBeGreaterThan(Math.sqrt((2 * MU_MARS) / R_C));
  });

  it("has an asymptotic true anomaly in (π/2, π)", () => {
    expect(mission.nuMax).toBeGreaterThan(Math.PI / 2);
    expect(mission.nuMax).toBeLessThan(Math.PI);
    expect(Math.cos(mission.nuMax)).toBeCloseTo(-1 / mission.hyperbola.e, 9);
  });

  it("degenerates to the parabolic limit when the final burn is skipped", () => {
    const weak = computeMission(DEFAULT_DV_A, DEFAULT_DV_B, 0);
    // Below escape speed: v_∞² is clamped to 0, so the conic collapses to e ≈ 1.
    expect(weak.vFinal).toBeLessThan(Math.sqrt((2 * MU_MARS) / R_C));
    expect(weak.hyperbola.e).toBeCloseTo(1, 4);
    expect(weak.hyperbola.e).toBeGreaterThanOrEqual(1);
    expect(Number.isFinite(weak.nuMax)).toBe(true);
    expect(weak.nuMax).toBeLessThanOrEqual(Math.PI);
  });

  it("starts the hyperbola at periapsis r_C", () => {
    expect(orbitRadius(mission.hyperbola, 0)).toBeCloseTo(R_C, 3);
  });
});

describe("orbit geometry helpers", () => {
  const { orbit1 } = mission;

  it("agrees between orbitPosition and orbitRadius", () => {
    for (const nu of [0, 0.9, 2.2, Math.PI]) {
      const p = orbitPosition(orbit1, nu);
      expect(Math.hypot(p.x, p.y)).toBeCloseTo(orbitRadius(orbit1, nu), 6);
    }
  });

  it("puts periapsis on the +x axis", () => {
    const p = orbitPosition(orbit1, 0);
    expect(p.x).toBeCloseTo(R_A, 6);
    expect(p.y).toBeCloseTo(0, 9);
  });

  it("matches vis-viva against the angular-momentum speed at the apsides", () => {
    // At an apsis the velocity is purely transverse, so v = h/r.
    expect(orbitSpeed(orbit1, R_A)).toBeCloseTo(orbit1.h / R_A, 6);
    expect(orbitSpeed(orbit1, R_B)).toBeCloseTo(orbit1.h / R_B, 6);
  });

  it("clamps vis-viva at zero beyond the apoapsis instead of returning NaN", () => {
    expect(orbitSpeed(orbit1, 10 * R_B)).toBe(0);
  });

  it("sweeps equal areas in equal times (Kepler's 2nd law): ½r²ν̇ = h/2", () => {
    for (const nu of [0.3, 1.5, 3.0]) {
      const r = orbitRadius(orbit1, nu);
      expect(r * r * nuDot(orbit1, r)).toBeCloseTo(orbit1.h, 6);
    }
  });

  it("moves fastest at periapsis and slowest at apoapsis", () => {
    expect(nuDot(orbit1, R_A)).toBeGreaterThan(nuDot(orbit1, R_B));
  });
});

describe("orbitVelocity", () => {
  const { orbit1 } = mission;

  it("has the magnitude vis-viva predicts", () => {
    for (const nu of [0, 0.7, 2.0, Math.PI]) {
      const { vx, vy } = orbitVelocity(orbit1, nu);
      expect(Math.hypot(vx, vy)).toBeCloseTo(
        orbitSpeed(orbit1, orbitRadius(orbit1, nu)),
        6,
      );
    }
  });

  it("is purely transverse (perpendicular to r) at the apsides", () => {
    for (const nu of [0, Math.PI]) {
      const p = orbitPosition(orbit1, nu);
      const v = orbitVelocity(orbit1, nu);
      expect(p.x * v.vx + p.y * v.vy).toBeCloseTo(0, 6);
    }
  });

  it("reproduces h = x·vy − y·vx at every true anomaly", () => {
    for (const nu of [0.4, 1.6, 2.9]) {
      const p = orbitPosition(orbit1, nu);
      const v = orbitVelocity(orbit1, nu);
      expect(p.x * v.vy - p.y * v.vx).toBeCloseTo(orbit1.h, 6);
    }
  });
});
