import type { Vec2 } from "./pin-slot-bar";

// ---------------------------------------------------------------------------
// RB 5 — Four-bar linkage (/rigid-body-kinematics/four-bar)
// CCR N°10 — Cinemática del Cuerpo Rígido (UTN FRBA)
// ---------------------------------------------------------------------------

export interface FourBarParams {
  omegaCD: number; // rad/s, signed constant angular velocity of the crank CD about D (CCW positive), default 6
  crankLen: number; // m, CD, default 0.6
  couplerLen: number; // m, BC, default 0.6
  rockerLen: number; // m, AB — NOT in the statement, inferred from the figure, default 1.2
  alpha0Deg: number; // deg, angle of D→C at t = 0 — the statement instant, default 90
}

export interface FourBarVisibility {
  showVelocity: boolean; // v_B, v_C and v_E
  showAccel: boolean; // a_B, a_C and a_E
  showCenter: boolean; // CIR of BC and the lines through it
  showTrace: boolean; // path swept by E
}

/** The linkage at one crank angle α. */
export interface FourBarState {
  alpha: number; // rad, angle of D→C
  A: Vec2; // m — fixed pin of AB
  B: Vec2;
  C: Vec2;
  D: Vec2; // the origin
  E: Vec2; // midpoint of BC
  omegaCD: number; // rad/s, signed (the sweep flips it at the stops)
  omegaBC: number; // rad/s, CCW positive
  omegaAB: number; // rad/s, CCW positive
  gammaBC: number; // rad/s²
  gammaAB: number; // rad/s²
  vB: Vec2; // m/s
  vC: Vec2;
  vE: Vec2;
  aB: Vec2; // m/s²
  aC: Vec2;
  aE: Vec2;
  cir: Vec2 | null; // m, instantaneous centre of BC — null when BC is in pure translation
  speedE: number; // m/s, |v_E|
  accelE: number; // m/s², |a_E|
}

/** Crank-angle stops of a non-Grashof linkage; null when the crank turns all the way around. */
export interface FourBarLimits {
  alphaMin: number; // rad
  alphaMax: number; // rad
}
