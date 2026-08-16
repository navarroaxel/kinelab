// ---------------------------------------------------------------------------
// Core — Fireman's ladder, 3D relative motion (/fireman-ladder)
// CCR N°14 — Cinemática del Cuerpo Rígido (UTN FRBA)
// ---------------------------------------------------------------------------

import type { Vec3 } from "./geometry3d";

export interface FiremanLadderParams {
  omega1: number; // rad/s, turret rotation about the vertical axis ẑ, default 0.8
  omega2: number; // rad/s, ladder elevation about the horizontal axis x̂, default 0.5
  sDot: number; // m/s, extension speed along the ladder, default 1.5
  s0: number; // m, extension at t = 0 — the statement instant, default 10
  theta20Deg: number; // deg, elevation at t = 0 — the statement instant, default 30
}

export interface FiremanLadderVisibility {
  showVelocity: boolean; // total v at B
  showVelocityParts: boolean; // Ω×r and v_rel
  showAccel: boolean; // total a at B
  showAccelParts: boolean; // Euler, centripetal and Coriolis terms
  showTrace: boolean; // 3D trail swept by B
  showAxes: boolean; // world axes x/y/z + ω arcs
  showGrid: boolean; // ground plane grid
  showTruck: boolean; // truck body + turntable
}

/** Instantaneous kinematics of the ladder tip B, in the turret body frame. */
export interface FiremanLadderState {
  s: number; // m, current extension
  theta2: number; // rad, current elevation
  omega2Signed: number; // rad/s, signed elevation rate (the sweep reverses at the stops)
  sDotSigned: number; // m/s, signed extension rate
  azimuth: number; // rad, turret heading θ₁ — affects the drawing, not the magnitudes
  u: Vec3; // ladder unit vector
  r: Vec3; // position of B
  omega: Vec3; // Ω = ω₂x̂ + ω₁ẑ
  omegaDot: Vec3; // Ω̇ = ω₁ω₂ŷ
  vTransport: Vec3; // Ω × r
  vRel: Vec3; // ṡ û
  v: Vec3; // total velocity
  aEuler: Vec3; // Ω̇ × r
  aCentripetal: Vec3; // Ω × (Ω × r)
  aCoriolis: Vec3; // 2 Ω × v_rel
  a: Vec3; // total acceleration (a_rel = 0)
  speed: number; // m/s, |v|
  accelMag: number; // m/s², |a|
}
