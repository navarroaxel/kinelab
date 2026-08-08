import { describe, expect, it } from "vitest";

import type { CableBlocksParams } from "@/types/simulator";

import {
  computeCableBlocksState,
  meetingTime,
  sA,
  sB,
  vA,
  vB,
} from "./cableBlocksKinematics";

const params: CableBlocksParams = { aD: 5, cCoeff: 3, d0: 3, runsA: 2 };

describe("block B (constant acceleration)", () => {
  it("follows s = ½·a·t² and v = a·t", () => {
    expect(sB(2, params)).toBeCloseTo(0.5 * 5 * 4, 12);
    expect(vB(2, params)).toBeCloseTo(10, 12);
  });

  it("starts from rest at the origin", () => {
    expect(sB(0, params)).toBe(0);
    expect(vB(0, params)).toBe(0);
  });

  it("has v_B as the exact derivative of s_B", () => {
    const h = 1e-5;
    const t = 1.3;
    const fd = (sB(t + h, params) - sB(t - h, params)) / (2 * h);
    expect(fd).toBeCloseTo(vB(t, params), 6);
  });
});

describe("block A (a_C = cCoeff·t², shared over runsA runs)", () => {
  it("follows the twice-integrated form s = c/(runs·12)·t⁴", () => {
    expect(sA(2, params)).toBeCloseTo((3 / 2 / 12) * 16, 12);
    expect(vA(2, params)).toBeCloseTo((3 / 2 / 3) * 8, 12);
  });

  it("has v_A as the exact derivative of s_A", () => {
    const h = 1e-5;
    const t = 1.7;
    const fd = (sA(t + h, params) - sA(t - h, params)) / (2 * h);
    expect(fd).toBeCloseTo(vA(t, params), 5);
  });

  it("halves A's motion when the number of cable runs doubles", () => {
    const doubled = { ...params, runsA: 4 };
    expect(sA(2, doubled)).toBeCloseTo(sA(2, params) / 2, 12);
    expect(vA(2, doubled)).toBeCloseTo(vA(2, params) / 2, 12);
  });
});

describe("meetingTime", () => {
  it("is the root of s_A(t) + s_B(t) = d0", () => {
    const t = meetingTime(params);
    expect(sA(t, params) + sB(t, params)).toBeCloseTo(params.d0, 9);
  });

  it("brackets the root — the gap is still open just before and closed just after", () => {
    const t = meetingTime(params);
    expect(sA(t - 0.01, params) + sB(t - 0.01, params)).toBeLessThan(params.d0);
    expect(sA(t + 0.01, params) + sB(t + 0.01, params)).toBeGreaterThan(
      params.d0,
    );
  });

  it("grows with the initial gap", () => {
    expect(meetingTime({ ...params, d0: 12 })).toBeGreaterThan(
      meetingTime(params),
    );
  });
});

describe("computeCableBlocksState", () => {
  it("reports the shrinking gap and a rightward/leftward sign convention", () => {
    const s = computeCableBlocksState(params, 0.4);
    expect(s.t).toBe(0.4);
    expect(s.d).toBeCloseTo(params.d0 - s.sA - s.sB, 12);
    expect(s.d).toBeGreaterThan(0);
    expect(s.vA).toBeGreaterThan(0);
    expect(s.vB).toBeLessThan(0); // B travels leftward
    expect(s.met).toBe(false);
  });

  it("closes the gap exactly at the meeting time", () => {
    const tMeet = meetingTime(params);
    const s = computeCableBlocksState(params, tMeet);
    expect(s.d).toBeCloseTo(0, 9);
    expect(s.met).toBe(true);
  });

  it("freezes the blocks after they meet", () => {
    const tMeet = meetingTime(params);
    const at = computeCableBlocksState(params, tMeet);
    const after = computeCableBlocksState(params, tMeet + 5);
    expect(after.sA).toBeCloseTo(at.sA, 12);
    expect(after.sB).toBeCloseTo(at.sB, 12);
    expect(after.vA).toBeCloseTo(at.vA, 12);
    expect(after.vB).toBeCloseTo(at.vB, 12);
    expect(after.t).toBe(tMeet + 5); // raw time still advances
    expect(after.met).toBe(true);
  });

  it("starts with the full gap at rest", () => {
    const s = computeCableBlocksState(params, 0);
    expect(s.d).toBeCloseTo(params.d0, 12);
    expect(s.vA).toBe(0);
    expect(s.vB).toBeCloseTo(0, 12);
  });
});
