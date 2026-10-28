import { sweep } from "@/lib/sweep";
import type {
  PinSlotBarLimits,
  PinSlotBarParams,
  PinSlotBarState,
  Vec2,
} from "@/types/simulator";

// ---------------------------------------------------------------------------
// CCR N°16 — Pin sliding in a slotted bar. The planar twin of
// `/oscillating-bar`, with the driven/driving roles swapped:
//
//   • Bar BO is a slotted arm pivoting at fixed O, turning at a known
//     constant ω (φ is the true, independent time variable).
//   • Bar AC is a rigid arm of fixed length L = CA pivoting at the other
//     fixed point C; its tip A is the pin, which must always sit on BO's
//     slot line. ω_AC and its rate are the unknowns — the mirror image of
//     `/oscillating-bar`, where the constant-ω member carries the pin and
//     the *other* bar carries the slot.
//
// Coordinates: C at the origin, O at (pivotOx, pivotOy). At each instant the
// pin A is the intersection of "the line through O at angle φ" with "the
// circle of radius L about C" — algebra, not an ODE. Differentiating that
// constraint through the slot's own rotating frame (basis ê_r, ê_θ) gives ṙ
// and ω_AC from one vector equation, then r̈ and α_AC from a second:
//
//   v_A = ω_BO·r·ê_θ + ṙ·ê_r              (transport + relative)
//       = ω_AC·L·ê_θ,C                     (pure rotation of AC about C)
//
//   a_A = (r̈ − ω_BO²·r)·ê_r + 2·ω_BO·ṙ·ê_θ   (α_BO = 0 — ω_BO is constant)
//       = α_AC·L·ê_θ,C − ω_AC²·L·Â            (pure rotation of AC about C)
//
// where Â is the unit vector along CA and ê_θ,C = ẑ×Â. Both are linear
// systems in the two unknowns, solved by projecting onto {ê_r, ê_θ}.
// ---------------------------------------------------------------------------

const dot2 = (a: Vec2, b: Vec2): number => a.x * b.x + a.y * b.y;
const perp = (a: Vec2): Vec2 => ({ x: -a.y, y: a.x }); // ẑ × a, for a planar a

/** Half-width, about π, of the slot angle's valid domain (radians). */
function phiHalfWidth(params: PinSlotBarParams): number {
  const d2 = params.pivotOx ** 2 + params.pivotOy ** 2;
  const k = Math.sqrt(
    Math.max(1 - (params.armLength * params.armLength) / d2, 0),
  );
  return Math.acos(Math.min(Math.max(k, -1), 1));
}

/**
 * The slot angle's swing limits — like `/oscillating-bar`'s BC, the mechanism
 * oscillates rather than turning all the way around, because O sits farther
 * from C than the arm is long.
 */
export function pinSlotBarLimits(params: PinSlotBarParams): PinSlotBarLimits {
  const beta = Math.atan2(params.pivotOy, params.pivotOx);
  const halfWidth = phiHalfWidth(params);
  return { phiMin: beta + Math.PI - halfWidth, phiMax: beta + Math.PI + halfWidth };
}

/** Reach r = |O→A| for the slot at angle φ — the near branch (matches the statement's configuration). */
function reachAt(phi: number, params: PinSlotBarParams): number {
  const { pivotOx: Ox, pivotOy: Oy, armLength: L } = params;
  const er: Vec2 = { x: Math.cos(phi), y: Math.sin(phi) };
  const OdotEr = Ox * er.x + Oy * er.y;
  const d2 = Ox * Ox + Oy * Oy;
  const disc = Math.max(OdotEr * OdotEr - (d2 - L * L), 0);
  return -OdotEr - Math.sqrt(disc);
}

export function computePinSlotBarInstant(
  phi: number,
  omegaBO: number,
  params: PinSlotBarParams,
): PinSlotBarState {
  const { armLength: L } = params;
  const er: Vec2 = { x: Math.cos(phi), y: Math.sin(phi) };
  const etheta = perp(er);

  const r = reachAt(phi, params);
  const ax = params.pivotOx + r * er.x;
  const ay = params.pivotOy + r * er.y;
  const aHat: Vec2 = { x: ax / L, y: ay / L };
  const ethetaC = perp(aHat);

  // v_A · Â = 0 (AC is rigid, so v_A ⟂ CA) fixes ṙ from the transport term.
  const erDotA = dot2(er, aHat);
  const ethetaDotA = dot2(etheta, aHat);
  const rDot = (-omegaBO * r * ethetaDotA) / erDotA;

  const vArr: Vec2 = { x: omegaBO * r * etheta.x, y: omegaBO * r * etheta.y };
  const vRel: Vec2 = { x: rDot * er.x, y: rDot * er.y };
  const vA: Vec2 = { x: vArr.x + vRel.x, y: vArr.y + vRel.y };
  const omegaAC = dot2(vA, ethetaC) / L;

  const aArr: Vec2 = {
    x: -omegaBO * omegaBO * r * er.x,
    y: -omegaBO * omegaBO * r * er.y,
  };
  const aCor: Vec2 = {
    x: 2 * omegaBO * rDot * etheta.x,
    y: 2 * omegaBO * rDot * etheta.y,
  };

  // a_A · ê_θ = α_AC·L·(ê_θ,C·ê_θ) − ω_AC²·L·(Â·ê_θ) fixes α_AC; then a_A · ê_r
  // fixes r̈. Both are the same closing-the-loop trick as the velocity step.
  const ethetaCDotEtheta = dot2(ethetaC, etheta);
  const aHatDotEtheta = dot2(aHat, etheta);
  const alphaAC =
    (2 * omegaBO * rDot + omegaAC * omegaAC * L * aHatDotEtheta) /
    (L * ethetaCDotEtheta);

  const ethetaCDotEr = dot2(ethetaC, er);
  const aHatDotEr = dot2(aHat, er);
  const rDDot =
    omegaBO * omegaBO * r + alphaAC * L * ethetaCDotEr - omegaAC * omegaAC * L * aHatDotEr;

  const aRel: Vec2 = { x: rDDot * er.x, y: rDDot * er.y };
  const aA: Vec2 = {
    x: aArr.x + aCor.x + aRel.x,
    y: aArr.y + aCor.y + aRel.y,
  };

  return {
    phi,
    theta: Math.atan2(ay, ax),
    r,
    rDot,
    rDDot,
    ax,
    ay,
    omegaAC,
    alphaAC,
    vArr,
    vRel,
    vA,
    aArr,
    aCor,
    aRel,
    aA,
    speed: Math.hypot(vA.x, vA.y),
    accelMag: Math.hypot(aA.x, aA.y),
  };
}

const DEG = Math.PI / 180;
const TWO_PI = Math.PI * 2;

/**
 * `pinSlotBarLimits` returns φ unwrapped around β+π, which can run past ±π —
 * so a user-facing angle given in the usual (−180°, 180°] convention (like
 * the statement's −135°) has to be shifted onto the same branch before it can
 * be compared against those bounds.
 */
function normalizeToRange(angle: number, lo: number): number {
  return (((angle - lo) % TWO_PI) + TWO_PI) % TWO_PI + lo;
}

/**
 * State of the whole mechanism at elapsed time `t`. At t = 0 the slot sits
 * exactly at the statement configuration (φ₀); from there φ sweeps between
 * its geometric stops so the Coriolis term never goes to zero for long.
 */
export function computePinSlotBarState(
  params: PinSlotBarParams,
  t: number,
): PinSlotBarState {
  const limits = pinSlotBarLimits(params);
  const phi0 = normalizeToRange(params.phi0Deg * DEG, limits.phiMin);
  const { value: phi, sign } = sweep(
    t,
    phi0,
    params.omegaBO,
    limits.phiMin,
    limits.phiMax,
  );
  return computePinSlotBarInstant(phi, params.omegaBO * sign, params);
}
