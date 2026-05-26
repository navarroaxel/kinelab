import type { QuickReturnParams, QuickReturnState } from '@/types/simulator'

/**
 * Computes the full per-frame state of the quick-return mechanism for a given
 * crank angle φ. All formulas are from the spec (§2.3–2.4).
 *
 * Coordinate origin at the fixed pivot O.
 * A = (0, L2) is the crank centre (directly above O).
 * φ is measured from the downward vertical at A, so at φ=0: B is directly below A.
 */
export function solve(params: QuickReturnParams, phi: number): QuickReturnState {
  const { omega, r, L1, L2 } = params

  const xB = r * Math.sin(phi)
  const yB = L2 - r * Math.cos(phi)

  const xP = yB !== 0 ? (L1 * xB) / yB : 0
  const yP = L1

  // Bar OQ extended to y = L1 * 1.15 for drawing
  const yQ = L1 * 1.15
  const xQ = yB !== 0 ? (xB * yQ) / yB : 0

  const denom  = L2 - r * Math.cos(phi)
  const denom2 = denom * denom
  const denom3 = denom2 * denom

  const x = (L1 * r * Math.sin(phi)) / denom
  const v = (omega * L1 * r * (L2 * Math.cos(phi) - r)) / denom2
  const a = -(omega * omega * L1 * r * Math.sin(phi) * (L2 * L2 + r * L2 * Math.cos(phi) - 2 * r * r)) / denom3

  return {
    phi,
    xO: 0, yO: 0,
    xA: 0, yA: L2,
    xB, yB,
    xP, yP,
    xD: 0, yD: L1,
    xQ, yQ,
    x, v, a,
  }
}

/**
 * Computes derived (static) quantities: extreme positions, the quick-return
 * ratio, and the crank half-angle α = arccos(r/L2).
 */
export function extremes(params: QuickReturnParams): {
  xMax: number
  alpha: number
  quickReturnRatio: number
} {
  const { r, L1, L2 } = params
  const alpha = Math.acos(r / L2)
  const xMax  = (L1 * r) / Math.sqrt(L2 * L2 - r * r)
  const quickReturnRatio = (2 * Math.PI - 2 * alpha) / (2 * alpha)
  return { xMax, alpha, quickReturnRatio }
}

/** Returns true when the hard geometric constraint L2 > r is satisfied. */
export function validate(params: QuickReturnParams): boolean {
  return params.L2 > params.r
}
