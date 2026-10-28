import type { Vec2 } from "./pin-slot-bar";

// ---------------------------------------------------------------------------
// RB 7 — Planetary reducer (/rigid-body-kinematics/planetary-reducer)
// CCR N°15 — Cinemática del Cuerpo Rígido (UTN FRBA)
// ---------------------------------------------------------------------------

export interface PlanetaryReducerParams {
  sunRadius: number; // m, r_A, default 0.2
  planetRadius: number; // m, r — B, C and D are identical, default 0.2
  rpmSun: number; // rpm, signed angular velocity of the sun A (CCW positive), default 1200
}

export interface PlanetaryReducerVisibility {
  showVelocity: boolean; // v_J and v_O
  showCenter: boolean; // the planet's instantaneous centre, on the fixed ring
  showCarrier: boolean; // the carrier arm through the planet centres
  showMarks: boolean; // rim marks so the spin of each body is visible
}

/** Everything the exercise asks, closed form — the whole mechanism is a single constant-speed state. */
export interface PlanetaryReducerResult {
  ringRadius: number; // m, r_E = r_A + 2r — derived, not in the statement
  omegaSun: number; // rad/s, signed
  vJ: number; // m/s, speed of the sun–planet contact point (signed along the sun's tangent)
  vO: number; // m/s, speed of the planet centre
  omegaPlanet: number; // rad/s, absolute, signed (opposite to the sun)
  omegaCarrier: number; // rad/s, signed (same sense as the sun)
  rpmPlanet: number;
  rpmCarrier: number;
  ratio: number; // ω_carrier / ω_sun = r_A / (r_A + r_E)
}

/** Geometry and velocities at one time, for drawing. Angles in rad, CCW from +x. */
export interface PlanetaryReducerState extends PlanetaryReducerResult {
  sunAngle: number;
  carrierAngle: number;
  planetSpin: number; // absolute rotation of each planet about its own centre
  centers: Vec2[]; // m, the three planet centres
  contactSun: Vec2[]; // m, J for each planet
  contactRing: Vec2[]; // m, each planet's instantaneous centre, on the ring
  vJVec: Vec2[]; // m/s
  vOVec: Vec2[]; // m/s
}
