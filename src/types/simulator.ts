export interface SimulatorParams {
  poleX: number               // pole X position in world units, range [-120, 120]
  poleY: number               // pole Y position in world units, range [-120, 120]
  angularVelocity: number     // degrees per second, range [-200, 200]
  angularAcceleration: number // degrees per second squared, range [-100, 100]
  circleRadius: number        // trajectory radius in world units, range [40, 140]
}

export interface VisibilityState {
  showVelocity: boolean
  showCartesian: boolean
  showRVector: boolean
  showAcceleration: boolean
  showNormalAccel: boolean
  showTrace: boolean
}

export interface KinematicState {
  phi: number          // current angle of the point on the circle (rad)
  r: number            // magnitude of the pole→point vector
  theta: number        // angle of the pole→point vector (rad)
  omega: number        // live angular velocity (deg/s)
  at: number           // signed tangential acceleration magnitude (R·α, u/s²)
  rDot: number         // time derivative of r (radial velocity)
  rThetaDot: number    // transverse velocity component
  ar: number           // radial polar acceleration
  aTheta: number       // transverse polar acceleration
  vx: number           // Cartesian velocity X
  vy: number           // Cartesian velocity Y
  ptx: number          // point world X
  pty: number          // point world Y
}

// ---------------------------------------------------------------------------
// Vertical ring simulator (/ring)
// ---------------------------------------------------------------------------

export interface RingParams {
  radius: number          // ring radius R in world units, range [60, 130]
  gravity: number         // g in world units/s², range [50, 400], default 200
  initialSpeed: number    // v₀ at the bottom in world units/s, range [0, 600]
}

export interface RingVisibility {
  showWeight: boolean       // weight vector mg
  showNormal: boolean       // normal force vector N
  showVelocity: boolean     // velocity tangent vector
  showEnergyBar: boolean    // KE/PE stacked bar
  showTrace: boolean        // particle trail
  showCriticalMark: boolean // highlight the v_min threshold
}

export interface RingKinematicState {
  theta: number       // current angle from bottom (rad), CCW positive
  thetaDot: number    // angular velocity (rad/s)
  v: number           // speed = R·|θ̇|
  N: number           // normal force magnitude (negative ⇒ lost contact)
  h: number           // height above bottom = R·(1 − cos θ)
  KE: number          // kinetic energy = ½·v²        (mass normalised to 1)
  PE: number          // potential energy = g·h        (mass normalised to 1)
  px: number          // particle world X
  py: number          // particle world Y
  hasContact: boolean // N ≥ 0
}

export interface RingSample {
  t: number    // elapsed simulation time (s)
  KE: number   // kinetic energy at t (per unit mass)
  PE: number   // potential energy at t (per unit mass)
}

// ---------------------------------------------------------------------------
// Rotating bar simulator (/bar)
// ---------------------------------------------------------------------------

export interface BarParams {
  omega: number       // bar angular velocity ω in rad/s, range [0.5, 5]
  r0: number          // initial radial position r₀ in world units, range [10, 80]
  rDot0: number       // initial radial velocity ṙ₀ in world units/s, range [-100, 100]
  barLength: number   // bar half-length L in world units, range [80, 160]
  mass: number        // normalised mass m, fixed at 1 (display only)
}

export interface BarVisibility {
  showRadialAcc: boolean          // aᵣ vector (= 0 — illustrates the constraint)
  showCoriolisAcc: boolean        // aₒ = 2ṙω vector
  showNormalForce: boolean        // N = 2mṙω (transverse, applied by the bar)
  showVelocityComponents: boolean // ṙ·eᵣ and rω·eₒ vectors
  showTrace: boolean              // particle trail in lab frame
  showRotatingFrame: boolean      // ghost bar history over the last half-revolution
}

export interface BarKinematicState {
  t: number          // elapsed time (s)
  theta: number      // current bar angle (rad)
  r: number          // current radial position
  rDot: number       // current radial velocity ṙ
  ar: number         // radial polar acceleration = r̈ − r·ω² (≈ 0 by construction)
  ao: number         // transverse polar acceleration = 2·ṙ·ω (Coriolis)
  N: number          // normal force from bar = m·ao  (m = 1)
  vr: number         // radial velocity component = ṙ
  vt: number         // transverse velocity component = r·ω
  v: number          // total speed = √(ṙ² + r²ω²)
  px: number         // particle world X
  py: number         // particle world Y
  isOnBar: boolean   // r ≤ barLength
  ejected: boolean   // r > barLength
}
