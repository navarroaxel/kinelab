import { describe, expect, it } from "vitest";

import type { MotionVertex } from "@/types/simulator";

import {
  MOTION_GRAPHS_PRESETS,
  accelerationAtTime,
  finalPosition,
  positionAtTime,
  segmentsFromVertices,
  velocityAtTime,
  zeroCrossings,
} from "./motionGraphsKinematics";

const ramp: MotionVertex[] = [
  { t: 0, v: 0 },
  { t: 10, v: 20 },
  { t: 20, v: 20 },
];

describe("segmentsFromVertices", () => {
  it("produces one segment per vertex pair with the right slope", () => {
    const segs = segmentsFromVertices(ramp);
    expect(segs).toHaveLength(2);
    expect(segs[0]).toMatchObject({
      t0: 0,
      t1: 10,
      v0: 0,
      v1: 20,
      a: 2,
      x0: 0,
    });
    expect(segs[1]).toMatchObject({ t0: 10, t1: 20, v0: 20, v1: 20, a: 0 });
  });

  it("accumulates x0 across segments", () => {
    const segs = segmentsFromVertices(ramp);
    expect(segs[1].x0).toBeCloseTo(100, 12); // ½·2·10²
  });

  it("returns no segments for fewer than two vertices", () => {
    expect(segmentsFromVertices([])).toEqual([]);
    expect(segmentsFromVertices([{ t: 0, v: 5 }])).toEqual([]);
  });

  it("treats a zero-width segment as zero acceleration rather than NaN", () => {
    const segs = segmentsFromVertices([
      { t: 0, v: 5 },
      { t: 0, v: 10 },
    ]);
    expect(segs[0].a).toBe(0);
    expect(Number.isNaN(segs[0].a)).toBe(false);
  });
});

describe("velocityAtTime / accelerationAtTime", () => {
  const segs = segmentsFromVertices(ramp);

  it("interpolates linearly within a segment", () => {
    expect(velocityAtTime(segs, 0)).toBeCloseTo(0, 12);
    expect(velocityAtTime(segs, 5)).toBeCloseTo(10, 12);
    expect(velocityAtTime(segs, 10)).toBeCloseTo(20, 12);
    expect(velocityAtTime(segs, 15)).toBeCloseTo(20, 12);
  });

  it("is piecewise constant in a", () => {
    expect(accelerationAtTime(segs, 5)).toBe(2);
    expect(accelerationAtTime(segs, 15)).toBe(0);
  });

  it("clamps outside the vertex range", () => {
    expect(velocityAtTime(segs, -5)).toBeCloseTo(0, 12);
    expect(velocityAtTime(segs, 100)).toBeCloseTo(20, 12);
  });

  it("returns zero for an empty segment list", () => {
    expect(velocityAtTime([], 3)).toBe(0);
    expect(accelerationAtTime([], 3)).toBe(0);
    expect(positionAtTime([], 3)).toBe(0);
    expect(finalPosition([])).toBe(0);
  });
});

describe("positionAtTime", () => {
  const segs = segmentsFromVertices(ramp);

  it("integrates v(t) exactly", () => {
    expect(positionAtTime(segs, 0)).toBeCloseTo(0, 12);
    expect(positionAtTime(segs, 10)).toBeCloseTo(100, 12);
    expect(positionAtTime(segs, 20)).toBeCloseTo(300, 12);
  });

  it("agrees with a fine trapezoidal integration of v(t)", () => {
    const steps = 20_000;
    const dt = 20 / steps;
    let x = 0;
    for (let i = 0; i < steps; i++) {
      x +=
        ((velocityAtTime(segs, i * dt) + velocityAtTime(segs, (i + 1) * dt)) /
          2) *
        dt;
    }
    expect(x).toBeCloseTo(finalPosition(segs), 4);
  });

  it("holds the final position past the last vertex", () => {
    expect(positionAtTime(segs, 500)).toBeCloseTo(300, 12);
    expect(finalPosition(segs)).toBeCloseTo(300, 12);
  });
});

describe("zeroCrossings", () => {
  it("finds the interior sign change of v(t)", () => {
    const segs = segmentsFromVertices([
      { t: 0, v: 10 },
      { t: 20, v: -10 },
    ]);
    const crossings = zeroCrossings(segs);
    expect(crossings).toHaveLength(1);
    expect(crossings[0].t).toBeCloseTo(10, 12);
    expect(crossings[0].x).toBeCloseTo(50, 12); // ½·10·10
  });

  it("marks a local maximum of x(t) — the crossing is the largest x", () => {
    const segs = segmentsFromVertices([
      { t: 0, v: 10 },
      { t: 20, v: -10 },
    ]);
    const { t, x } = zeroCrossings(segs)[0];
    expect(positionAtTime(segs, t - 1)).toBeLessThan(x);
    expect(positionAtTime(segs, t + 1)).toBeLessThan(x);
  });

  it("ignores constant-velocity segments and endpoint touches", () => {
    expect(zeroCrossings(segmentsFromVertices(ramp))).toEqual([]);
    // v hits zero exactly at the shared vertex, not strictly inside a segment.
    expect(
      zeroCrossings(
        segmentsFromVertices([
          { t: 0, v: 10 },
          { t: 10, v: 0 },
          { t: 20, v: 10 },
        ]),
      ),
    ).toEqual([]);
  });
});

describe("MOTION_GRAPHS_PRESETS", () => {
  it("exposes four presets with strictly increasing times", () => {
    const keys = Object.keys(MOTION_GRAPHS_PRESETS);
    expect(keys).toEqual(["case1", "case2", "case3", "case4"]);
    for (const key of keys) {
      const vs = MOTION_GRAPHS_PRESETS[key];
      expect(vs.length).toBeGreaterThan(1);
      for (let i = 1; i < vs.length; i++) {
        expect(vs[i].t).toBeGreaterThan(vs[i - 1].t);
      }
    }
  });

  it("computes the TP reference displacements", () => {
    const x = (key: string) =>
      finalPosition(segmentsFromVertices(MOTION_GRAPHS_PRESETS[key]));
    // case1: 40·10 + (40+60)/2·20 + 60·30
    expect(x("case1")).toBeCloseTo(400 + 1000 + 1800, 9);
    // case2: 100/2·20 + 100·10 + 100/2·10 + 0
    expect(x("case2")).toBeCloseTo(1000 + 1000 + 500, 9);
    // case3 reverses direction, case4 twice — both end short of case1
    expect(x("case3")).toBeLessThan(x("case1"));
    expect(x("case4")).toBeLessThan(x("case1"));
  });

  it("puts case4 back where it started (symmetric v(t) with equal areas)", () => {
    const segs = segmentsFromVertices(MOTION_GRAPHS_PRESETS.case4);
    // 50→−50 over 20 s (net 0), −50 for 10 s (−500), −50→50 over 20 s (net 0),
    // then 50 for 10 s (+500).
    expect(finalPosition(segs)).toBeCloseTo(0, 9);
  });
});
