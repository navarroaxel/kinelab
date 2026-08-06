import type { DragDescentParams, DragDescentState } from "@/types/simulator";

/** Terminal speed: a(v) = A − B·v² = 0 ⟹ v_max = √(A/B). */
export function vMaxOf(params: DragDescentParams): number {
  return Math.sqrt(params.A / params.B);
}

/** Rate constant of the tanh/cosh closed form, k = B·v_max. */
export function kOf(params: DragDescentParams): number {
  return params.B * vMaxOf(params);
}

/** v(t) = v_max · tanh(k·t). */
export function velocityAtTime(params: DragDescentParams, t: number): number {
  return vMaxOf(params) * Math.tanh(kOf(params) * t);
}

/** x(t) = (1/B) · ln[cosh(k·t)]. */
export function positionAtTime(params: DragDescentParams, t: number): number {
  return Math.log(Math.cosh(kOf(params) * t)) / params.B;
}

/** v(x) = v_max · √(1 − e^(−2·B·x)). */
export function velocityAtPosition(
  params: DragDescentParams,
  x: number,
): number {
  return (
    vMaxOf(params) * Math.sqrt(Math.max(0, 1 - Math.exp(-2 * params.B * x)))
  );
}

/** a(v) = A − B·v². */
export function accelerationAtVelocity(
  params: DragDescentParams,
  v: number,
): number {
  return params.A - params.B * v * v;
}

/** Time to reach half of v_max: t½ = artanh(0.5) / k. */
export function timeToHalfVMax(params: DragDescentParams): number {
  return Math.atanh(0.5) / kOf(params);
}

/** x(t) for large t approaches the asymptote v_max·t − ln(2)/B. */
export function asymptoteAtTime(params: DragDescentParams, t: number): number {
  return vMaxOf(params) * t - Math.log(2) / params.B;
}

export function computeDragDescentState(
  params: DragDescentParams,
  t: number,
): DragDescentState {
  const v = velocityAtTime(params, t);
  const x = positionAtTime(params, t);
  const a = accelerationAtVelocity(params, v);
  const vMax = vMaxOf(params);

  if (process.env.NODE_ENV === "development") {
    const vFromX = velocityAtPosition(params, x);
    const rel = Math.abs(vFromX - v) / Math.max(v, 1e-9);
    if (rel > 1e-6 && v > 1e-6) {
      console.warn(
        `[dragDescent] v(x(t)) invariant violated: v(x(t))=${vFromX.toFixed(6)} ≠ v(t)=${v.toFixed(6)} (rel=${rel.toExponential(2)})`,
      );
    }
  }

  return {
    t,
    v,
    x,
    a,
    vOverVmaxPct: vMax > 0 ? (v / vMax) * 100 : 0,
  };
}
