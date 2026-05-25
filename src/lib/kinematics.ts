import type { KinematicState, SimulatorParams } from '@/types/simulator'

/**
 * Computes the full kinematic state of the point for a given phi and ω.
 * All inputs and outputs are in world units (px) and radians unless noted.
 * ω is passed in deg/s (the live value driven by α each frame).
 * Circle center is fixed at world origin (0, 0).
 */
export function computeKinematics(
  phi: number,
  angularVelocity: number,
  params: SimulatorParams
): KinematicState {
  const { poleX, poleY, angularAcceleration, circleRadius: R } = params
  const omega = (angularVelocity * Math.PI) / 180     // deg/s → rad/s
  const alpha = (angularAcceleration * Math.PI) / 180 // deg/s² → rad/s²

  // Point position (world coords, Y up)
  const ptx = R * Math.cos(phi)
  const pty = R * Math.sin(phi)

  // Pole → point vector
  const dx = ptx - poleX
  const dy = pty - poleY
  const r = Math.hypot(dx, dy)
  const theta = Math.atan2(dy, dx)

  // Cartesian velocity
  const vx = -R * omega * Math.sin(phi)
  const vy =  R * omega * Math.cos(phi)

  // Polar velocity components
  const rDot      =  vx * Math.cos(theta) + vy * Math.sin(theta)
  const rThetaDot = -vx * Math.sin(theta) + vy * Math.cos(theta)

  // Cartesian acceleration: centripetal (toward center) + tangential (∥ v)
  const ax = -R * omega ** 2 * Math.cos(phi) - R * alpha * Math.sin(phi)
  const ay = -R * omega ** 2 * Math.sin(phi) + R * alpha * Math.cos(phi)

  // Polar acceleration components
  const ar     =  ax * Math.cos(theta) + ay * Math.sin(theta)
  const aTheta = -ax * Math.sin(theta) + ay * Math.cos(theta)

  // Tangential acceleration magnitude (signed along v direction)
  const at = R * alpha

  // Normal (centripetal) acceleration magnitude — always ≥ 0, direction is P → O
  const aN = R * omega ** 2

  return { phi, r, theta, omega: angularVelocity, at, rDot, rThetaDot, ar, aTheta, vx, vy, ax, ay, aN, ptx, pty }
}
