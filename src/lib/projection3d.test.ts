import { describe, expect, it } from "vitest";

import { arcPoints, depth, horizontalCircle, project } from "./projection3d";
import { norm, sub, vec } from "./vec3";
import type { View3D } from "./projection3d";

const view: View3D = { cam: { az: 0, el: 0 }, k: 10, cx: 100, cy: 200 };

describe("project", () => {
  it("puts the origin at the view centre", () => {
    expect(project(vec(0, 0, 0), view)).toEqual({ x: 100, y: 200 });
  });

  it("maps height to screen-up at zero elevation", () => {
    expect(project(vec(0, 0, 3), view)).toEqual({ x: 100, y: 170 });
  });

  it("looks down the +x axis at az = 0, so +y goes right", () => {
    expect(project(vec(0, 2, 0), view)).toEqual({ x: 120, y: 200 });
    // Depth only — no screen displacement.
    expect(project(vec(5, 0, 0), view)).toEqual({ x: 100, y: 200 });
  });

  it("is linear, so a vector can be drawn by projecting both endpoints", () => {
    const a = vec(1, 2, 3);
    const b = vec(-2, 0.5, 4);
    const tilted: View3D = { ...view, cam: { az: 0.7, el: 0.4 } };
    const pa = project(a, tilted);
    const pb = project(b, tilted);
    const pSum = project(vec(a.x + b.x, a.y + b.y, a.z + b.z), tilted);
    expect(pSum.x).toBeCloseTo(pa.x + pb.x - tilted.cx, 9);
    expect(pSum.y).toBeCloseTo(pa.y + pb.y - tilted.cy, 9);
  });

  it("collapses to a plan view at 90° elevation", () => {
    const top: View3D = { ...view, cam: { az: 0, el: Math.PI / 2 } };
    // Height no longer displaces anything...
    expect(project(vec(0, 0, 7), top).y).toBeCloseTo(200, 9);
    // ...and +x now reads as screen-down.
    expect(project(vec(3, 0, 0), top).y).toBeCloseTo(230, 9);
  });
});

describe("depth", () => {
  it("grows away from the camera", () => {
    const cam = { az: 0, el: 0 };
    expect(depth(vec(5, 0, 0), cam)).toBeCloseTo(5, 9);
    expect(depth(vec(-5, 0, 0), cam)).toBeCloseTo(-5, 9);
  });

  it("counts height as depth when looking straight down", () => {
    expect(depth(vec(0, 0, 4), { az: 0, el: Math.PI / 2 })).toBeCloseTo(4, 9);
  });
});

describe("arcPoints", () => {
  it("returns steps + 1 samples on the circle of the given radius", () => {
    const pts = arcPoints(
      vec(0, 0, 1),
      vec(1, 0, 0),
      vec(0, 1, 0),
      2,
      0,
      Math.PI,
      8,
    );
    expect(pts).toHaveLength(9);
    for (const p of pts) {
      expect(norm(sub(p, vec(0, 0, 1)))).toBeCloseTo(2, 9);
      expect(p.z).toBeCloseTo(1, 9);
    }
  });

  it("starts on u1 and sweeps toward u2", () => {
    const pts = arcPoints(
      vec(0, 0, 0),
      vec(1, 0, 0),
      vec(0, 1, 0),
      1,
      0,
      Math.PI / 2,
      2,
    );
    expect(pts[0].x).toBeCloseTo(1, 9);
    expect(pts[2].y).toBeCloseTo(1, 9);
  });
});

describe("horizontalCircle", () => {
  it("closes on itself at the requested height", () => {
    const pts = horizontalCircle(-1.5, 3, 12);
    expect(pts[0].x).toBeCloseTo(pts[pts.length - 1].x, 9);
    expect(pts[0].y).toBeCloseTo(pts[pts.length - 1].y, 9);
    expect(pts.every((p) => p.z === -1.5)).toBe(true);
  });
});
