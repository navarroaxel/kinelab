import type { Vec2 } from "@/types/simulator";

// ---------------------------------------------------------------------------
// Planar rigid-body kinematics — the shared kit behind RB 3, 4, 5 and 7.
//
// Every vector here lives in the plane, so ω and α are signed scalars along ẑ
// (counter-clockwise positive) and the cross product ω ẑ × r collapses to a
// 90° rotation of r scaled by ω. Units are whatever the caller uses — each
// exercise keeps the units of its own statement.
//
//   v_P = v_Q + ω ẑ × r_P/Q
//   a_P = a_Q + α ẑ × r_P/Q − ω² r_P/Q       (tangential + normal split)
// ---------------------------------------------------------------------------

export const add2 = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x + b.x, y: a.y + b.y });
export const sub2 = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x - b.x, y: a.y - b.y });
export const scale2 = (a: Vec2, k: number): Vec2 => ({ x: a.x * k, y: a.y * k });
export const dot2 = (a: Vec2, b: Vec2): number => a.x * b.x + a.y * b.y;
/** z-component of a × b. */
export const cross2 = (a: Vec2, b: Vec2): number => a.x * b.y - a.y * b.x;
export const norm2 = (a: Vec2): number => Math.hypot(a.x, a.y);
/** ẑ × a — a rotated +90°. */
export const perp2 = (a: Vec2): Vec2 => ({ x: -a.y, y: a.x });

/** ω ẑ × r — the velocity of a point at offset r from the axis of a body turning at ω. */
export function rotationalVelocity(omega: number, r: Vec2): Vec2 {
  return scale2(perp2(r), omega);
}

/** v_P = v_Q + ω ẑ × r_P/Q. */
export function velocityAt(vQ: Vec2, omega: number, rPQ: Vec2): Vec2 {
  return add2(vQ, rotationalVelocity(omega, rPQ));
}

export interface AccelerationSplit {
  /** α ẑ × r_P/Q — perpendicular to the offset. */
  tangential: Vec2;
  /** −ω² r_P/Q — toward the axis. */
  normal: Vec2;
  /** a_Q + tangential + normal. */
  total: Vec2;
}

/** a_P = a_Q + α ẑ × r_P/Q − ω² r_P/Q, with the two relative terms kept apart. */
export function accelerationAt(
  aQ: Vec2,
  omega: number,
  alpha: number,
  rPQ: Vec2,
): AccelerationSplit {
  const tangential = scale2(perp2(rPQ), alpha);
  const normal = scale2(rPQ, -omega * omega);
  return { tangential, normal, total: add2(aQ, add2(tangential, normal)) };
}

/**
 * ω of a rigid body from the velocities of two of its points:
 * v_P − v_Q = ω ẑ × r_P/Q  ⇒  ω = (r × Δv) / |r|².
 */
export function omegaFromTwoPoints(vP: Vec2, vQ: Vec2, rPQ: Vec2): number {
  const r2 = dot2(rPQ, rPQ);
  return r2 === 0 ? 0 : cross2(rPQ, sub2(vP, vQ)) / r2;
}

/**
 * Instantaneous centre of zero velocity from two points and the *directions*
 * of their velocities (magnitudes aren't needed): it sits on the perpendicular
 * to each velocity through its point. Returns null when the two perpendiculars
 * are parallel — the body is in pure translation and the centre is at infinity.
 */
export function instantCenter(
  p1: Vec2,
  v1: Vec2,
  p2: Vec2,
  v2: Vec2,
): Vec2 | null {
  // Perpendicular line through p_i has direction v_i (it is ⟂ to the line of
  // the velocity's normal), so the centre is p1 + s·perp(v1) with perp(v1) the
  // line direction perpendicular to v1.
  const d1 = perp2(v1);
  const d2 = perp2(v2);
  const denom = cross2(d1, d2);
  if (Math.abs(denom) < 1e-12 * (norm2(d1) * norm2(d2) || 1)) return null;
  const s = cross2(sub2(p2, p1), d2) / denom;
  return add2(p1, scale2(d1, s));
}

/** ω of a body from one point's velocity and its instantaneous centre: v = ω ẑ × (p − c). */
export function omegaFromCenter(v: Vec2, p: Vec2, c: Vec2): number {
  const r = sub2(p, c);
  const r2 = dot2(r, r);
  return r2 === 0 ? 0 : cross2(r, v) / r2;
}

/**
 * Solve [a b; c d]·[x; y] = [e; f]. Returns null when the matrix is singular
 * — for a linkage, a toggle (dead-centre) position.
 */
export function solveLinear2(
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number,
): [number, number] | null {
  const det = a * d - b * c;
  const scale = Math.max(Math.abs(a * d), Math.abs(b * c), 1e-300);
  if (Math.abs(det) < 1e-12 * scale) return null;
  return [(e * d - b * f) / det, (a * f - e * c) / det];
}
