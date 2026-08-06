import type {
  ParabolicTrackParams,
  ParabolicTrackState,
} from "@/types/simulator";

export function computeParabolicTrackState(
  params: ParabolicTrackParams,
): ParabolicTrackState {
  const { coeff, xA: x, v, vDot } = params;

  const y = coeff * x * x;
  const slope = 2 * coeff * x; // y'
  const curvature2nd = 2 * coeff; // y'' (constant)

  const Rc = Math.pow(1 + slope * slope, 1.5) / Math.abs(curvature2nd);
  const at = vDot;
  const an = (v * v) / Rc;
  const a = Math.sqrt(at * at + an * an);
  const betaDeg = (Math.atan2(an, at) * 180) / Math.PI;

  // Inward normal (toward the concave side — the parabola opens upward, so
  // the osculating circle's centre always lies above the curve).
  const norm = Math.sqrt(1 + slope * slope);
  const nx = -slope / norm;
  const ny = 1 / norm;

  if (process.env.NODE_ENV === "development") {
    // Cross-check Rc via a finite-difference curvature estimate.
    const h = 1e-3;
    const yAt = (xx: number) => coeff * xx * xx;
    const yP = (yAt(x + h) - yAt(x - h)) / (2 * h);
    const yPP = (yAt(x + h) - 2 * yAt(x) + yAt(x - h)) / (h * h);
    const RcNumeric = Math.pow(1 + yP * yP, 1.5) / Math.abs(yPP);
    const rel = Math.abs(RcNumeric - Rc) / Rc;
    if (rel > 1e-3) {
      console.warn(
        `[parabolicTrack] Rc mismatch: analytic=${Rc.toFixed(4)} numeric=${RcNumeric.toFixed(4)}`,
      );
    }
  }

  return {
    x,
    y,
    slope,
    curvature2nd,
    Rc,
    at,
    an,
    a,
    betaDeg,
    centerX: x + Rc * nx,
    centerY: y + Rc * ny,
  };
}

/** Unit tangent in the direction of motion — the skater travels toward the vertex (x = 0). */
export function motionTangent(
  x: number,
  slope: number,
): { tx: number; ty: number } {
  const norm = Math.sqrt(1 + slope * slope);
  const sign = x > 0 ? -1 : x < 0 ? 1 : 0;
  return { tx: (sign * 1) / norm, ty: (sign * slope) / norm };
}
