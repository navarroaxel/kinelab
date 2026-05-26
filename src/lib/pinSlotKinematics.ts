export interface PinSlotParams {
  r: number   // slot radius (world units)
  d: number   // O-A center-to-center distance (world units)
  v0: number  // pin speed on the slot (world units/s), constant
}

export interface PinSlotState {
  phi: number    // pin angle on the slot at center A (rad)
  bx: number    // pin B world X
  by: number    // pin B world Y
  rho: number   // |OB|
  theta: number // bar OC angle from positive X axis (rad)
  vr: number    // radial velocity component along bar (positive = away from O)
  vPerp: number // transverse velocity component (positive = CCW)
  omega: number // bar angular velocity (rad/s)
  gamma: number // bar angular acceleration (rad/s²)
}

/** Constant angular rate of the pin on the slot: Φ̇ = V0 / r */
export function pinOmega(params: PinSlotParams): number {
  return params.v0 / params.r
}

/**
 * Closed-form kinematics — no integration needed.
 * All derived quantities are analytic functions of phi.
 *
 * Reference frame: O at origin, A = (d, 0).
 *   Bx = d + r·cos(Φ),  By = r·sin(Φ)
 *   ρ  = |OB| = √(d² + r² + 2·d·r·cos Φ)
 *   θ  = atan2(r·sin Φ, d + r·cos Φ)   (bar angle at O)
 *   Vr = ρ̇  = −(d·V0·sin Φ) / ρ
 *   ω  = θ̇  = V0·(r + d·cos Φ) / ρ²
 *   γ  = θ̈  = Vr·(Ω − 2ω) / ρ
 *             = (−r·d·Ω²·sin Φ − 2·ρ·Vr·ω) / ρ²   (expanded form)
 *   V⊥ = ρ·ω  (transverse component, perpendicular to bar)
 *
 * Invariant: Vr² + V⊥² = V0² (speed is constant).
 */
export function computePinSlotState(params: PinSlotParams, phi: number): PinSlotState {
  const { r, d, v0 } = params
  const Omega = v0 / r

  const bx = d + r * Math.cos(phi)
  const by = r * Math.sin(phi)
  const rho = Math.sqrt(d * d + r * r + 2 * d * r * Math.cos(phi))
  const theta = Math.atan2(r * Math.sin(phi), d + r * Math.cos(phi))

  const vr    = -(d * v0 * Math.sin(phi)) / rho
  const omega = v0 * (r + d * Math.cos(phi)) / (rho * rho)
  const vPerp = rho * omega
  const gamma = vr * (Omega - 2 * omega) / rho

  if (process.env.NODE_ENV === 'development') {
    const speedSq = vr * vr + vPerp * vPerp
    const expected = v0 * v0
    if (Math.abs(speedSq - expected) > 1e-6 * expected + 1e-10) {
      console.warn(`[pinSlot] speed invariant violated: |v|²=${speedSq.toFixed(6)} ≠ V0²=${expected}`)
    }
  }

  return { phi, bx, by, rho, theta, vr, vPerp, omega, gamma }
}
