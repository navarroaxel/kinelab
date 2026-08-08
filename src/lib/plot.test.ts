import { describe, expect, it } from "vitest";

import type { PlotSeries } from "./plot";
import {
  formatTick,
  interpolateY,
  makeInverseScale,
  makeScale,
  niceStep,
  padDomain,
  seriesExtent,
  ticksFor,
} from "./plot";

const series = (points: [number, number][]): PlotSeries => ({
  label: "s",
  color: "#000",
  points,
});

describe("seriesExtent", () => {
  it("spans every point of every series", () => {
    const e = seriesExtent([
      series([
        [0, 1],
        [5, 9],
      ]),
      series([
        [-2, 4],
        [3, -7],
      ]),
    ]);
    expect(e).toEqual({ x: { min: -2, max: 5 }, y: { min: -7, max: 9 } });
  });

  it("falls back to a unit box when there are no points", () => {
    expect(seriesExtent([])).toEqual({
      x: { min: 0, max: 1 },
      y: { min: 0, max: 1 },
    });
    expect(seriesExtent([series([])])).toEqual({
      x: { min: 0, max: 1 },
      y: { min: 0, max: 1 },
    });
  });

  it("widens a degenerate axis so the scale never divides by zero", () => {
    const e = seriesExtent([
      series([
        [3, 7],
        [3, 7],
      ]),
    ]);
    expect(e.x).toEqual({ min: 2, max: 4 });
    expect(e.y).toEqual({ min: 6, max: 8 });
  });

  it("widens only the degenerate axis", () => {
    const e = seriesExtent([
      series([
        [0, 5],
        [10, 5],
      ]),
    ]);
    expect(e.x).toEqual({ min: 0, max: 10 });
    expect(e.y).toEqual({ min: 4, max: 6 });
  });
});

describe("padDomain", () => {
  it("adds the given fraction of the span to each side", () => {
    expect(padDomain({ min: 0, max: 10 }, 0.1)).toEqual({ min: -1, max: 11 });
  });

  it("defaults to 8%", () => {
    const d = padDomain({ min: 0, max: 100 });
    expect(d.min).toBeCloseTo(-8, 12);
    expect(d.max).toBeCloseTo(108, 12);
  });

  it("leaves a zero-span domain untouched", () => {
    expect(padDomain({ min: 5, max: 5 })).toEqual({ min: 5, max: 5 });
  });
});

describe("niceStep", () => {
  it("snaps to 1/2/5 × 10^n", () => {
    expect(niceStep(10, 5)).toBe(2);
    expect(niceStep(100, 5)).toBe(20);
    expect(niceStep(1, 5)).toBeCloseTo(0.2, 12);
    expect(niceStep(60, 6)).toBe(10);
    expect(niceStep(45, 6)).toBeCloseTo(10, 12); // raw 7.5 → rounds up to 10
  });

  it("returns 1 for a non-positive span", () => {
    expect(niceStep(0, 6)).toBe(1);
    expect(niceStep(-5, 6)).toBe(1);
  });

  it("always yields a positive step", () => {
    for (const span of [1e-6, 0.3, 7, 1234, 9.9e7]) {
      expect(niceStep(span, 6)).toBeGreaterThan(0);
    }
  });
});

describe("ticksFor", () => {
  it("covers the domain with evenly spaced, in-range ticks", () => {
    const ticks = ticksFor({ min: 0, max: 10 }, 5);
    expect(ticks).toEqual([0, 2, 4, 6, 8, 10]);
  });

  it("keeps every tick inside the domain", () => {
    for (const d of [
      { min: -3.2, max: 7.9 },
      { min: 0.001, max: 0.009 },
      { min: -500, max: -100 },
    ]) {
      const ticks = ticksFor(d);
      expect(ticks.length).toBeGreaterThan(1);
      for (const t of ticks) {
        expect(t).toBeGreaterThanOrEqual(d.min - 1e-9);
        expect(t).toBeLessThanOrEqual(d.max + 1e-9);
      }
      const step = ticks[1] - ticks[0];
      for (let i = 1; i < ticks.length; i++) {
        expect(ticks[i] - ticks[i - 1]).toBeCloseTo(step, 9);
      }
    }
  });

  it("produces roughly the requested number of ticks", () => {
    const ticks = ticksFor({ min: 0, max: 97 }, 6);
    expect(ticks.length).toBeGreaterThanOrEqual(4);
    expect(ticks.length).toBeLessThanOrEqual(10);
  });
});

describe("makeScale / makeInverseScale", () => {
  it("maps the domain endpoints onto the pixel endpoints", () => {
    const scale = makeScale({ min: 0, max: 10 }, 100, 300);
    expect(scale(0)).toBe(100);
    expect(scale(10)).toBe(300);
    expect(scale(5)).toBe(200);
  });

  it("supports an inverted pixel range (canvas Y grows downward)", () => {
    const scale = makeScale({ min: 0, max: 10 }, 300, 100);
    expect(scale(0)).toBe(300);
    expect(scale(10)).toBe(100);
  });

  it("round-trips through the inverse", () => {
    const domain = { min: -4, max: 12 };
    const scale = makeScale(domain, 20, 480);
    const inverse = makeInverseScale(domain, 20, 480);
    for (const v of [-4, 0, 3.7, 12]) {
      expect(inverse(scale(v))).toBeCloseTo(v, 9);
    }
  });

  it("does not divide by zero on a degenerate domain or pixel range", () => {
    expect(Number.isFinite(makeScale({ min: 3, max: 3 }, 0, 100)(3))).toBe(
      true,
    );
    expect(
      Number.isFinite(makeInverseScale({ min: 0, max: 1 }, 50, 50)(50)),
    ).toBe(true);
  });
});

describe("interpolateY", () => {
  const points: [number, number][] = [
    [0, 0],
    [1, 10],
    [3, 30],
  ];

  it("interpolates between the surrounding points", () => {
    expect(interpolateY(points, 0.5)).toBeCloseTo(5, 12);
    expect(interpolateY(points, 2)).toBeCloseTo(20, 12);
  });

  it("returns the exact value at a knot", () => {
    expect(interpolateY(points, 0)).toBe(0);
    expect(interpolateY(points, 1)).toBe(10);
    expect(interpolateY(points, 3)).toBe(30);
  });

  it("clamps outside the range", () => {
    expect(interpolateY(points, -10)).toBe(0);
    expect(interpolateY(points, 99)).toBe(30);
  });

  it("returns null for an empty series", () => {
    expect(interpolateY([], 1)).toBeNull();
  });

  it("survives duplicated x values", () => {
    expect(
      interpolateY(
        [
          [0, 0],
          [1, 5],
          [1, 9],
          [2, 12],
        ],
        1,
      ),
    ).toBe(5);
  });
});

describe("formatTick", () => {
  it("prints ordinary magnitudes plainly, rounded to 3 decimals", () => {
    expect(formatTick(0)).toBe("0");
    expect(formatTick(1)).toBe("1");
    expect(formatTick(-2.5)).toBe("-2.5");
    expect(formatTick(1.23456)).toBe("1.235");
  });

  it("switches to exponential for very small and very large values", () => {
    expect(formatTick(0.001)).toBe("1.0e-3");
    expect(formatTick(1e6)).toBe("1.0e+6");
    expect(formatTick(-1e6)).toBe("-1.0e+6");
  });

  it("keeps 0 plain rather than exponential", () => {
    expect(formatTick(0)).toBe("0");
    expect(formatTick(-0)).toBe("0");
  });
});
