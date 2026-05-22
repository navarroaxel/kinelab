import type { BarKinematicState, BarParams } from '@/types/simulator'

// Below this |ω| we treat rotation as effectively zero and fall back to
// the uniform-linear-motion solution along a fixed bar direction.
const OMEGA_EPS = 1e-3

/**
 * Closed-form solution of r̈ = ω²·r for the radial position and velocity:
 *
 *   r(t)  = r₀·cosh(ω·t) + (ṙ₀/ω)·sinh(ω·t)
 *   ṙ(t)  = r₀·ω·sinh(ω·t) + ṙ₀·cosh(ω·t)
 *
 * For ω ≈ 0 the bar is not really rotating, and the ODE degenerates to
 * r̈ = 0 ⇒ r(t) = r₀ + ṙ₀·t (uniform motion along the bar).
 */
export function computeRadialMotion(
  t: number,
  r0: number,
  rDot0: number,
  omega: number,
): { r: number; rDot: number } {
  if (Math.abs(omega) < OMEGA_EPS) {
    return { r: r0 + rDot0 * t, rDot: rDot0 }
  }
  const ch = Math.cosh(omega * t)
  const sh = Math.sinh(omega * t)
  return {
    r:    r0 * ch + (rDot0 / omega) * sh,
    rDot: r0 * omega * sh + rDot0 * ch,
  }
}

/**
 * Full kinematic + dynamic state at time t. Mass is normalised to 1 so the
 * normal force is reported per-unit-mass.
 */
export function computeBarState(t: number, params: BarParams): BarKinematicState {
  const { omega, r0, rDot0, barLength } = params

  const { r, rDot } = computeRadialMotion(t, r0, rDot0, omega)
  const theta = omega * t

  // Particle world position (lab frame). Bar passes through the origin.
  const px = r * Math.cos(theta)
  const py = r * Math.sin(theta)

  // Polar velocity components
  const vr = rDot
  const vt = r * omega
  const v  = Math.hypot(vr, vt)

  // Polar acceleration components
  //   aᵣ = r̈ − r·ω²  = ω²r − ω²r = 0     (no radial force, smooth bar)
  //   aₒ = r·θ̈ + 2·ṙ·θ̇ = 2·ṙ·ω           (Coriolis only — θ̈ = 0)
  const ar = 0
  const ao = 2 * rDot * omega
  const N  = ao // m = 1 ⇒ N = m·aₒ = aₒ

  const isOnBar = r <= barLength
  const ejected = r > barLength

  return { t, theta, r, rDot, ar, ao, N, vr, vt, v, px, py, isOnBar, ejected }
}

/**
 * Time at which the particle reaches r = L (the end of the bar). Returns null
 * when the particle never reaches L — only possible when ṙ₀ < 0 and the
 * initial conditions don't carry it back out before any oscillation through
 * the pivot (the analytical model has no friction).
 *
 * Solved by bisection on r(t) − L because cosh/sinh don't invert cleanly.
 */
export function computeEjectionTime(params: BarParams): number | null {
  const { omega, r0, rDot0, barLength: L } = params

  if (r0 >= L) return 0

  // Special case ω ≈ 0: linear motion r = r₀ + ṙ₀·t.
  if (Math.abs(omega) < OMEGA_EPS) {
    if (rDot0 <= 0) return null
    return (L - r0) / rDot0
  }

  const f = (t: number) => computeRadialMotion(t, r0, rDot0, omega).r - L

  // Bracket: r(t) grows ≈ e^(ω·t) for large t, so doubling t finds an upper
  // bound quickly. Cap at ~60 s — well beyond anything useful at the
  // simulator's ω range.
  let lo = 0
  let hi = 0.5
  let fhi = f(hi)
  while (fhi < 0 && hi < 60) {
    hi *= 2
    fhi = f(hi)
  }
  if (fhi < 0) return null

  // Bisection
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2
    const fm = f(mid)
    if (Math.abs(fm) < 1e-4) return mid
    if (fm < 0) lo = mid
    else        hi = mid
  }
  return (lo + hi) / 2
}
