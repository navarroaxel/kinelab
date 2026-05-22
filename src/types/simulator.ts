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
