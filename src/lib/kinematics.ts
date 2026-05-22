import type { KinematicState, SimulatorParams } from '@/types/simulator'

/**
 * Computes the full kinematic state of the point for a given phi.
 * All inputs and outputs are in world units (px) and radians unless noted.
 * Circle center is fixed at world origin (0, 0).
 */
export function computeKinematics(
  phi: number,
  params: SimulatorParams
): KinematicState {
  const { poleX, poleY, angularVelocity, circleRadius: R } = params
  const omega = (angularVelocity * Math.PI) / 180 // deg/s → rad/s

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

  // Cartesian acceleration (centripetal, toward center)
  const ax = -R * omega ** 2 * Math.cos(phi)
  const ay = -R * omega ** 2 * Math.sin(phi)

  // Polar acceleration components
  const ar     =  ax * Math.cos(theta) + ay * Math.sin(theta)
  const aTheta = -ax * Math.sin(theta) + ay * Math.cos(theta)

  return { phi, r, theta, rDot, rThetaDot, ar, aTheta, vx, vy, ptx, pty }
}
