import type {
  CamFollowerExtremes,
  CamFollowerParams,
  CamFollowerState,
} from "@/types/simulator";

// ---------------------------------------------------------------------------
// Hibbeler 13-91 — rod AB rides on a smooth contoured cam.
//
// The cam turns at a constant θ̇; its surface height at the follower is
// z = A·sin θ. The bearing C keeps the rod vertical, so the rod's whole motion
// is that single z(t) — differentiate the profile twice through the chain rule
// and Newton's second law along the vertical does the rest:
//
//   ż  =  A·θ̇·cos θ
//   z̈  = −A·θ̇²·sin θ            (θ̇ constant, so the θ̈ term drops out)
//   N_z − m·g = m·z̈   →   N_z = m·(g + z̈) = m·(g − A·θ̇²·sin θ)
//
// N_z is a *vertical component*, which is the answer the textbook quotes. The
// force the cam actually applies is normal to its surface, tilted by the local
// slope φ, with tan φ = dz/(r dθ) = (A/r)·cos θ; its magnitude is N_z / cos φ
// and the leftover horizontal component is carried by the bearing.
//
// The cam can only push, never pull: once N_z would go negative the roller
// leaves the surface and this model stops describing the motion.
// ---------------------------------------------------------------------------

/** Cam surface height at cam angle θ. */
export const camHeight = (theta: number, amplitude: number): number =>
  amplitude * Math.sin(theta);

/** Local inclination of the cam surface, seen by the follower. */
export const camSlope = (
  theta: number,
  amplitude: number,
  radius: number,
): number => Math.atan2(amplitude * Math.cos(theta), Math.max(radius, 1e-9));

export function computeCamFollowerState(
  params: CamFollowerParams,
  theta: number,
): CamFollowerState {
  const { amplitude, radius, thetaDot, mass, gravity } = params;

  const z = camHeight(theta, amplitude);
  const zDot = amplitude * thetaDot * Math.cos(theta);
  const zDDot = -amplitude * thetaDot * thetaDot * Math.sin(theta);

  const normalVertical = mass * (gravity + zDDot);
  const slope = camSlope(theta, amplitude, radius);

  return {
    theta,
    z,
    zDot,
    zDDot,
    normalVertical,
    slope,
    normalMagnitude: normalVertical / Math.cos(slope),
    contactLost: normalVertical < 0,
  };
}

const SCAN_STEPS = 720; // half-degree resolution over a full revolution

/**
 * Largest and smallest cam force over one revolution.
 *
 * The vertical component's extremes are closed-form (sin θ = ∓1), but the true
 * normal magnitude carries the 1/cos φ factor, whose own extremes sit at
 * cos θ = 0 — the opposite phase. For the textbook's numbers the slope factor
 * is negligible there and both answers agree exactly; crank the amplitude up
 * and they separate, so this scans rather than assuming.
 */
export function camFollowerExtremes(
  params: CamFollowerParams,
): CamFollowerExtremes {
  let verticalMax = -Infinity;
  let verticalMin = Infinity;
  let normalMax = -Infinity;
  let normalMin = Infinity;
  let verticalMaxTheta = 0;
  let verticalMinTheta = 0;
  let normalMaxTheta = 0;
  let normalMinTheta = 0;

  for (let i = 0; i < SCAN_STEPS; i++) {
    const theta = (2 * Math.PI * i) / SCAN_STEPS;
    const { normalVertical, normalMagnitude } = computeCamFollowerState(
      params,
      theta,
    );
    if (normalVertical > verticalMax) {
      verticalMax = normalVertical;
      verticalMaxTheta = theta;
    }
    if (normalVertical < verticalMin) {
      verticalMin = normalVertical;
      verticalMinTheta = theta;
    }
    if (normalMagnitude > normalMax) {
      normalMax = normalMagnitude;
      normalMaxTheta = theta;
    }
    if (normalMagnitude < normalMin) {
      normalMin = normalMagnitude;
      normalMinTheta = theta;
    }
  }

  return {
    verticalMax,
    verticalMin,
    verticalMaxTheta,
    verticalMinTheta,
    normalMax,
    normalMin,
    normalMaxTheta,
    normalMinTheta,
  };
}

/** Wraps an angle into [0, 2π). */
export const wrapAngle = (theta: number): number => {
  const twoPi = 2 * Math.PI;
  return ((theta % twoPi) + twoPi) % twoPi;
};
