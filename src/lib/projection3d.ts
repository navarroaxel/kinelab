import { add, scale, vec } from "@/lib/vec3";
import { drawArrow, drawLabelWithSubscript } from "@/lib/drawing";
import type { Camera3D, Vec3 } from "@/types/simulator";

// ---------------------------------------------------------------------------
// A hand-rolled orthographic (axonometric) projection plus the drawing helpers
// that go with it. Shared by the 3D simulators — everything else in the app is
// planar and uses the per-simulator worldToScreen* transforms in drawing.ts.
//
// There is no perspective divide and no z-buffer: depth() exists only so that
// solid shapes can painter-order their own faces.
// ---------------------------------------------------------------------------

export interface View3D {
  cam: Camera3D;
  k: number; // px per world unit
  cx: number; // screen centre
  cy: number;
}

export interface Screen2D {
  x: number;
  y: number;
}

export function project(p: Vec3, view: View3D): Screen2D {
  const ca = Math.cos(view.cam.az);
  const sa = Math.sin(view.cam.az);
  const ce = Math.cos(view.cam.el);
  const se = Math.sin(view.cam.el);
  const right = -p.x * sa + p.y * ca;
  const inward = p.x * ca + p.y * sa;
  const up = p.z * ce - inward * se;
  return { x: view.cx + view.k * right, y: view.cy - view.k * up };
}

/** Camera-space depth — larger is further from the viewer. */
export function depth(p: Vec3, cam: Camera3D): number {
  const inward = p.x * Math.cos(cam.az) + p.y * Math.sin(cam.az);
  return inward * Math.cos(cam.el) + p.z * Math.sin(cam.el);
}

/** Samples a circular arc lying in the plane spanned by u1 and u2. */
export function arcPoints(
  center: Vec3,
  u1: Vec3,
  u2: Vec3,
  radius: number,
  from: number,
  to: number,
  steps = 24,
): Vec3[] {
  const points: Vec3[] = [];
  for (let i = 0; i <= steps; i++) {
    const angle = from + ((to - from) * i) / steps;
    points.push(
      add(
        center,
        add(
          scale(u1, radius * Math.cos(angle)),
          scale(u2, radius * Math.sin(angle)),
        ),
      ),
    );
  }
  return points;
}

/** Horizontal circle of the given radius at height z. */
export const horizontalCircle = (
  z: number,
  radius: number,
  steps = 48,
): Vec3[] =>
  arcPoints(
    vec(0, 0, z),
    vec(1, 0, 0),
    vec(0, 1, 0),
    radius,
    0,
    Math.PI * 2,
    steps,
  );

// --- canvas helpers ---------------------------------------------------------

function trace(
  ctx: CanvasRenderingContext2D,
  points: Vec3[],
  view: View3D,
): void {
  ctx.beginPath();
  points.forEach((p, i) => {
    const s = project(p, view);
    if (i === 0) ctx.moveTo(s.x, s.y);
    else ctx.lineTo(s.x, s.y);
  });
}

export function strokePolyline3D(
  ctx: CanvasRenderingContext2D,
  points: Vec3[],
  view: View3D,
  color: string,
  width: number,
  dash: number[] = [],
): void {
  if (points.length < 2) return;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dash);
  trace(ctx, points, view);
  ctx.stroke();
  ctx.restore();
}

export function fillPolygon3D(
  ctx: CanvasRenderingContext2D,
  points: Vec3[],
  view: View3D,
  fill: string,
  stroke?: string,
  strokeWidth = 1,
): void {
  if (points.length < 3) return;
  ctx.save();
  trace(ctx, points, view);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }
  ctx.restore();
}

/** Draws a 3D vector anchored at `origin`, scaled into world units. */
export function drawVector3D(
  ctx: CanvasRenderingContext2D,
  origin: Vec3,
  v: Vec3,
  factor: number,
  view: View3D,
  color: string,
  label: string,
): void {
  const tip = add(origin, scale(v, factor));
  const a = project(origin, view);
  const b = project(tip, view);
  if (Math.hypot(b.x - a.x, b.y - a.y) < 1) return;
  drawArrow(ctx, a.x, a.y, b.x, b.y, color, 2.2, 9);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  drawLabelWithSubscript(
    ctx,
    label,
    b.x + (dx / len) * 14,
    b.y + (dy / len) * 12,
    color,
  );
}

// corner index = x + 2y + 4z, matching the winding of BOX_FACES below.
const BOX_FACES: [number, number, number, number][] = [
  [0, 1, 3, 2], // z = min
  [4, 5, 7, 6], // z = max
  [0, 1, 5, 4], // y = min
  [2, 3, 7, 6], // y = max
  [0, 2, 6, 4], // x = min
  [1, 3, 7, 5], // x = max
];

/**
 * Painter-ordered box with arbitrary orientation: `axes` are the three
 * (unit) edge directions and `half` the half-extent along each of them.
 */
export function drawOrientedBox3D(
  ctx: CanvasRenderingContext2D,
  center: Vec3,
  axes: [Vec3, Vec3, Vec3],
  half: [number, number, number],
  view: View3D,
  fill: string,
  stroke: string,
): void {
  const corners: Vec3[] = [];
  for (const sz of [-1, 1]) {
    for (const sy of [-1, 1]) {
      for (const sx of [-1, 1]) {
        corners.push(
          add(
            center,
            add(
              scale(axes[0], sx * half[0]),
              add(scale(axes[1], sy * half[1]), scale(axes[2], sz * half[2])),
            ),
          ),
        );
      }
    }
  }
  paintBox(ctx, corners, view, fill, stroke);
}

/** Painter-ordered axis-aligned box. */
export function drawBox3D(
  ctx: CanvasRenderingContext2D,
  min: Vec3,
  max: Vec3,
  view: View3D,
  fill: string,
  stroke: string,
): void {
  const corners: Vec3[] = [];
  for (const z of [min.z, max.z]) {
    for (const y of [min.y, max.y]) {
      for (const x of [min.x, max.x]) corners.push(vec(x, y, z));
    }
  }
  paintBox(ctx, corners, view, fill, stroke);
}

function paintBox(
  ctx: CanvasRenderingContext2D,
  corners: Vec3[],
  view: View3D,
  fill: string,
  stroke: string,
): void {
  const faces = BOX_FACES.map((idx) => ({
    idx,
    d: idx.reduce((sum, i) => sum + depth(corners[i], view.cam), 0) / 4,
  })).sort((a, b) => b.d - a.d);

  for (const face of faces) {
    fillPolygon3D(
      ctx,
      face.idx.map((i) => corners[i]),
      view,
      fill,
      stroke,
    );
  }
}
