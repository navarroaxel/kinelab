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

// ---------------------------------------------------------------------------
// Pin-in-circular-slot simulator (/pin-slot)
// ---------------------------------------------------------------------------

export interface PinSlotParams {
  r: number   // slot radius (world units)
  d: number   // O-A center distance (world units); must satisfy d > r
  v0: number  // pin speed on slot (world units/s), constant
}

export interface PinSlotVisibility {
  showV0: boolean      // tangent velocity vector at B
  showVr: boolean      // radial component along bar
  showVPerp: boolean   // transverse component perpendicular to bar
  showAngles: boolean  // Phi (at A) and theta (at O) arcs
  showRho: boolean     // dashed rho segment O→B
}

export interface PinSlotState {
  phi: number    // pin angle on slot at center A (rad)
  bx: number    // pin B world X
  by: number    // pin B world Y
  rho: number   // |OB|
  theta: number // bar OC angle (rad)
  vr: number    // radial velocity component along bar
  vPerp: number // transverse velocity component
  omega: number // bar angular velocity (rad/s)
  gamma: number // bar angular acceleration (rad/s²)
}

// ---------------------------------------------------------------------------
// Quick-return mechanism simulator (/quick-return)
// ---------------------------------------------------------------------------

export interface QuickReturnParams {
  omega: number  // crank angular velocity (rad/s); constant
  r: number      // crank length AB (world units)
  L1: number     // vertical distance O → horizontal slot (world units)
  L2: number     // vertical distance O → crank center A (world units); must be > r
}

export interface QuickReturnVisibility {
  showVelocity:     boolean  // velocity arrow at P
  showAcceleration: boolean  // acceleration arrow at P
  showTrace:        boolean  // tool position trace
  showGuides:       boolean  // dashed crank circle and slot guides
}

export interface QuickReturnState {
  phi: number   // crank angle (rad), measured from downward vertical at A
  xO: number; yO: number  // fixed pivot O = (0, 0)
  xA: number; yA: number  // crank center A = (0, L2)
  xB: number; yB: number  // crank pin B
  xP: number; yP: number  // tool slider P on the horizontal slot
  xD: number; yD: number  // reference point D = (0, L1)
  xQ: number; yQ: number  // far end of bar OQ (extended beyond P for drawing)
  x: number    // tool position along slot (= xP)
  v: number    // tool velocity dx/dt
  a: number    // tool acceleration d²x/dt²
}
