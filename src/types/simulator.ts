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
  ax: number           // Cartesian acceleration X (tangential + centripetal combined)
  ay: number           // Cartesian acceleration Y
  aN: number           // |aₙ| = R·ω²  — normal/centripetal magnitude (≥ 0, points toward O)
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
