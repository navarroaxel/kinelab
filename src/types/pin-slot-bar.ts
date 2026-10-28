// ---------------------------------------------------------------------------
// RB 8 — Pin sliding in a slotted bar (/rigid-body-kinematics/pin-slot-bar)
// CCR N°16 — Cinemática del Cuerpo Rígido (UTN FRBA)
// ---------------------------------------------------------------------------

export interface Vec2 {
  x: number;
  y: number;
}

export interface PinSlotBarParams {
  pivotOx: number; // cm, O's x — C sits at the origin, default 40
  pivotOy: number; // cm, O's y, default 20
  armLength: number; // cm, L = CA — fixed length of the pin-carrying arm, default 20
  omegaBO: number; // rad/s, signed constant angular velocity of the slotted bar BO about O (negative = clockwise), default -2
  phi0Deg: number; // deg, angle of O→A (the slot direction) at t = 0 — the statement instant, default -135
}

export interface PinSlotBarVisibility {
  showVelocity: boolean; // v_A at the pin
  showVelocityParts: boolean; // v_arr (transport) and v_rel (sliding)
  showAccel: boolean; // a_A at the pin
  showAccelParts: boolean; // a_arr, a_cor and a_rel
  showAngles: boolean; // φ (slot) and θ (arm) arcs
  showTrace: boolean; // path traced by A
}

/** The mechanism at one slot angle φ. */
export interface PinSlotBarState {
  phi: number; // rad, angle of the slotted bar BO (the driven member)
  theta: number; // rad, angle of the pin-carrying arm AC, measured at C
  r: number; // cm, reach — distance from O to the pin along the slot
  rDot: number; // cm/s, ṙ — sliding rate along the slot
  rDDot: number; // cm/s², r̈
  ax: number; // cm, pin position (C is the origin)
  ay: number;
  omegaAC: number; // rad/s, angular velocity of AC, CCW positive
  alphaAC: number; // rad/s², angular acceleration of AC, CCW positive
  vArr: Vec2; // cm/s, transport velocity Ω×r
  vRel: Vec2; // cm/s, relative (sliding) velocity ṙê_r
  vA: Vec2; // cm/s, total velocity of the pin
  aArr: Vec2; // cm/s², transport acceleration (pure centripetal here — α_BO = 0)
  aCor: Vec2; // cm/s², Coriolis acceleration 2Ω×v_rel
  aRel: Vec2; // cm/s², relative acceleration r̈ê_r
  aA: Vec2; // cm/s², total acceleration of the pin
  speed: number; // cm/s, |v_A|
  accelMag: number; // cm/s², |a_A|
}

/** Swing limits of the mechanism — φ oscillates, it does not turn all the way around. */
export interface PinSlotBarLimits {
  phiMin: number; // rad
  phiMax: number; // rad
}
