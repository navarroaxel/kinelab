import { add, cross, norm, scale, vec } from "@/lib/vec3";
import { composeRotations } from "@/lib/rotationComposition";
import { sweep } from "@/lib/sweep";
import type {
  FiremanLadderParams,
  FiremanLadderState,
  Vec3,
} from "@/types/simulator";

export { sweep } from "@/lib/sweep";

// ---------------------------------------------------------------------------
// CCR N°14 — Fireman's ladder (3D relative motion)
//
// Body frame rigidly attached to the turret, origin at the pivot A:
//   x̂ — horizontal elevation axis, perpendicular to the ladder plane
//   ŷ — horizontal, inside the ladder plane
//   ẑ — vertical, up
//
// The ladder elevates about x̂ at ω₂ and the whole turret rotates about ẑ at
// ω₁, so the frame's total angular velocity is Ω = ω₂x̂ + ω₁ẑ. Both rates are
// constant in magnitude, but x̂ itself is dragged around ẑ by ω₁, which is the
// only reason Ω̇ is non-zero: Ω̇ = ω₂·(ω₁ẑ × x̂) = ω₁ω₂ŷ. That term is easy to
// drop by hand and it is what makes this a genuinely 3D exercise.
//
// Relative to the frame, B only slides along the ladder at constant ṡ, so
// v_rel = ṡû and a_rel = 0.
// ---------------------------------------------------------------------------

/** Elevation stops for the animated sweep (deg). */
export const THETA2_MIN_DEG = 0;
export const THETA2_MAX_DEG = 80;

/** Extension stops for the animated sweep (m). */
export const S_MIN = 4;
export const S_MAX = 20;

// --- kinematics -------------------------------------------------------------

/** Ladder direction for an elevation θ₂ measured from the horizontal. */
export function ladderUnit(theta2: number): Vec3 {
  return vec(0, Math.cos(theta2), Math.sin(theta2));
}

export interface FiremanLadderInstant {
  s: number; // m
  theta2: number; // rad
  omega1: number; // rad/s
  omega2: number; // rad/s (signed)
  sDot: number; // m/s (signed)
}

/**
 * Full velocity/acceleration decomposition of the ladder tip B, expressed in
 * the turret body frame. Independent of the turret heading θ₁ — rotating the
 * whole scene about ẑ cannot change any magnitude.
 */
export function computeFiremanLadderInstant(
  i: FiremanLadderInstant,
): Omit<FiremanLadderState, "azimuth"> {
  const u = ladderUnit(i.theta2);
  const r = scale(u, i.s);

  // Ω = ω₂x̂ + ω₁ẑ: the turret (about ẑ) is the outer rotation, the ladder's
  // own elevation (about x̂, carried by the turret) is the inner one.
  const { omega, gamma: omegaDot } = composeRotations([
    { axis: vec(0, 0, 1), rate: i.omega1 },
    { axis: vec(1, 0, 0), rate: i.omega2 },
  ]);

  const vTransport = cross(omega, r);
  const vRel = scale(u, i.sDot);
  const v = add(vTransport, vRel);

  const aEuler = cross(omegaDot, r);
  const aCentripetal = cross(omega, vTransport);
  const aCoriolis = scale(cross(omega, vRel), 2);
  // a_rel = 0 — the extension speed is constant and û is fixed in the frame.
  const a = add(add(aEuler, aCentripetal), aCoriolis);

  return {
    s: i.s,
    theta2: i.theta2,
    omega2Signed: i.omega2,
    sDotSigned: i.sDot,
    u,
    r,
    omega,
    omegaDot,
    vTransport,
    vRel,
    v,
    aEuler,
    aCentripetal,
    aCoriolis,
    a,
    speed: norm(v),
    accelMag: norm(a),
  };
}

const DEG = Math.PI / 180;

/**
 * State of the whole simulator at elapsed time `t`. At t = 0 the ladder sits
 * exactly at the statement configuration (s₀, θ₂₀); from there both the
 * elevation and the extension sweep between their stops so the animation keeps
 * showing non-zero Coriolis and Euler terms indefinitely.
 */
export function computeFiremanLadderState(
  params: FiremanLadderParams,
  t: number,
): FiremanLadderState {
  const elevation = sweep(
    t,
    params.theta20Deg * DEG,
    params.omega2,
    THETA2_MIN_DEG * DEG,
    THETA2_MAX_DEG * DEG,
  );
  const extension = sweep(t, params.s0, params.sDot, S_MIN, S_MAX);

  return {
    ...computeFiremanLadderInstant({
      s: extension.value,
      theta2: elevation.value,
      omega1: params.omega1,
      omega2: params.omega2 * elevation.sign,
      sDot: params.sDot * extension.sign,
    }),
    azimuth: params.omega1 * t,
  };
}
