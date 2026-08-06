import type { MotionVertex } from "@/types/simulator";

export interface MotionSegment {
  t0: number;
  t1: number;
  v0: number;
  v1: number;
  a: number; // (v1 − v0) / (t1 − t0), constant within the segment
  x0: number; // cumulative x at t0
}

/** Splits the vertex polyline into segments, each carrying its constant a and its starting cumulative x. */
export function segmentsFromVertices(
  vertices: MotionVertex[],
): MotionSegment[] {
  const segments: MotionSegment[] = [];
  let x = 0;
  for (let i = 0; i < vertices.length - 1; i++) {
    const { t: t0, v: v0 } = vertices[i];
    const { t: t1, v: v1 } = vertices[i + 1];
    const dt = t1 - t0;
    const a = dt !== 0 ? (v1 - v0) / dt : 0;
    segments.push({ t0, t1, v0, v1, a, x0: x });

    // Δx = v0·Δt + ½·a·Δt² (exact for a piecewise-linear v)
    const dx = v0 * dt + 0.5 * a * dt * dt;

    if (process.env.NODE_ENV === "development") {
      // Cross-check via the average-velocity form Δx = (v0+v1)/2 · Δt —
      // algebraically identical but computed through an independent path.
      const dxAvg = ((v0 + v1) / 2) * dt;
      const rel = Math.abs(dxAvg - dx) / Math.max(Math.abs(dx), 1e-9);
      if (rel > 1e-6 && Math.abs(dx) > 1e-6) {
        console.warn(
          `[motionGraphs] segment Δx mismatch: formula=${dx.toFixed(6)} avg=${dxAvg.toFixed(6)} (rel=${rel.toExponential(2)})`,
        );
      }
    }

    x += dx;
  }
  return segments;
}

function findSegment(
  segments: MotionSegment[],
  t: number,
): MotionSegment | null {
  if (segments.length === 0) return null;
  for (const seg of segments) {
    if (t <= seg.t1) return seg;
  }
  return segments[segments.length - 1];
}

export function velocityAtTime(segments: MotionSegment[], t: number): number {
  const seg = findSegment(segments, t);
  if (!seg) return 0;
  const clamped = Math.min(Math.max(t, seg.t0), seg.t1);
  return seg.v0 + seg.a * (clamped - seg.t0);
}

export function accelerationAtTime(
  segments: MotionSegment[],
  t: number,
): number {
  const seg = findSegment(segments, t);
  return seg ? seg.a : 0;
}

export function positionAtTime(segments: MotionSegment[], t: number): number {
  const seg = findSegment(segments, t);
  if (!seg) return 0;
  const tau = Math.min(Math.max(t, seg.t0), seg.t1) - seg.t0;
  return seg.x0 + seg.v0 * tau + 0.5 * seg.a * tau * tau;
}

export function finalPosition(segments: MotionSegment[]): number {
  if (segments.length === 0) return 0;
  const last = segments[segments.length - 1];
  return positionAtTime(segments, last.t1);
}

export interface MotionExtremum {
  t: number;
  x: number;
}

/** Zero crossings of v(t) — points where x(t) has a local extremum. */
export function zeroCrossings(segments: MotionSegment[]): MotionExtremum[] {
  const out: MotionExtremum[] = [];
  for (const seg of segments) {
    if (seg.a === 0) continue; // constant v never crosses zero mid-segment
    const tau = -seg.v0 / seg.a;
    if (tau > 1e-9 && tau < seg.t1 - seg.t0 - 1e-9) {
      const t = seg.t0 + tau;
      out.push({ t, x: positionAtTime(segments, t) });
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// TP reference presets
// ---------------------------------------------------------------------------

export const MOTION_GRAPHS_PRESETS: Record<string, MotionVertex[]> = {
  case1: [
    { t: 0, v: 40 },
    { t: 10, v: 40 },
    { t: 30, v: 60 },
    { t: 60, v: 60 },
  ],
  case2: [
    { t: 0, v: 0 },
    { t: 20, v: 100 },
    { t: 30, v: 100 },
    { t: 40, v: 0 },
    { t: 60, v: 0 },
  ],
  case3: [
    { t: 0, v: 40 },
    { t: 10, v: 40 },
    { t: 40, v: -60 },
    { t: 60, v: -60 },
  ],
  case4: [
    { t: 0, v: 50 },
    { t: 20, v: -50 },
    { t: 30, v: -50 },
    { t: 50, v: 50 },
    { t: 60, v: 50 },
  ],
};
