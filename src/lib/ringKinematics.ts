import type { RingKinematicState, RingParams } from "@/types/simulator";

/**
 * One 4th-order Runge–Kutta step on the state [θ, θ̇] for the smooth vertical
 * ring with equation of motion θ̈ = −(g/R)·sin θ.
 */
export function rk4Step(
  theta: number,
  thetaDot: number,
  dt: number,
  g: number,
  R: number,
): { theta: number; thetaDot: number } {
  const f = (th: number, thd: number) => ({
    dth: thd,
    dthd: -(g / R) * Math.sin(th),
  });

  const k1 = f(theta, thetaDot);
  const k2 = f(theta + (k1.dth * dt) / 2, thetaDot + (k1.dthd * dt) / 2);
  const k3 = f(theta + (k2.dth * dt) / 2, thetaDot + (k2.dthd * dt) / 2);
  const k4 = f(theta + k3.dth * dt, thetaDot + k3.dthd * dt);

  return {
    theta: theta + (dt / 6) * (k1.dth + 2 * k2.dth + 2 * k3.dth + k4.dth),
    thetaDot:
      thetaDot + (dt / 6) * (k1.dthd + 2 * k2.dthd + 2 * k3.dthd + k4.dthd),
  };
}

/**
 * Derives the full kinematic + dynamic state from (θ, θ̇). Mass is normalised
 * to 1 so energies are reported per-unit-mass and N is per-unit-mass too.
 */
export function computeRingState(
  theta: number,
  thetaDot: number,
  params: RingParams,
): RingKinematicState {
  const { radius: R, gravity: g } = params;

  const v = R * Math.abs(thetaDot);
  const N = g * Math.cos(theta) + R * thetaDot ** 2;
  const h = R * (1 - Math.cos(theta));
  const KE = 0.5 * v ** 2;
  const PE = g * h;
  const px = R * Math.sin(theta);
  const py = -R * Math.cos(theta); // world Y up: bottom of the ring is at y = −R

  return { theta, thetaDot, v, N, h, KE, PE, px, py, hasContact: N >= 0 };
}

/** Minimum speed at the bottom required to maintain contact through the top. */
export function computeVMin(g: number, R: number): number {
  return Math.sqrt(5 * g * R);
}

/** Maps initial bottom speed v₀ to initial θ̇. Positive ⇒ CCW. */
export function speedToThetaDot(v0: number, R: number): number {
  return R > 0 ? v0 / R : 0;
}

/**
 * Classifies the motion regime from the initial bottom speed.
 *   E_total/m = ½·v₀²
 *   PE at top = 2gR
 *   v_min²    = 5gR
 */
export function classifyMotion(
  v0: number,
  g: number,
  R: number,
): "oscillation" | "critical" | "full_loop" {
  const vMinSq = 5 * g * R;
  const v0Sq = v0 * v0;
  const tol = 1e-3 * vMinSq;
  if (v0Sq < vMinSq - tol) return "oscillation";
  if (v0Sq > vMinSq + tol) return "full_loop";
  return "critical";
}
