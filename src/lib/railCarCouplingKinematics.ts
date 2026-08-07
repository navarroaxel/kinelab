import type {
  RailCarCouplingParams,
  RailCarCouplingState,
} from "@/types/simulator";

export function kmhToMs(kmh: number): number {
  return kmh / 3.6;
}

/** Conservation of momentum for a perfectly inelastic coupling: m1·v1 = (m1+m2)·v_f. */
export function finalSpeed(
  mass1: number,
  speed1: number,
  mass2: number,
): number {
  return (mass1 * speed1) / (mass1 + mass2);
}

/** Impulse-momentum: the change in momentum of either car equals the impulse exchanged. */
export function impulse(mass1: number, speed1: number, vf: number): number {
  return Math.abs(mass1 * (speed1 - vf));
}

export function avgForce(impulseNs: number, couplingTime: number): number {
  return couplingTime > 0 ? impulseNs / couplingTime : 0;
}

export function computeRailCarCouplingState(
  params: RailCarCouplingParams,
): RailCarCouplingState {
  const v1 = kmhToMs(params.speed1Kmh);
  const vf = finalSpeed(params.mass1, v1, params.mass2);
  const j = impulse(params.mass1, v1, vf);

  return {
    speed1: v1,
    finalSpeed: vf,
    impulse: j,
    avgForce: avgForce(j, params.couplingTime),
  };
}

/**
 * Velocity of car 1 (moving) during the coupling interval, assuming a
 * constant average impulsive force (linear ramp from v1 to v_f over
 * [0, couplingTime]).
 */
export function speed1DuringCoupling(
  t: number,
  v1: number,
  vf: number,
  couplingTime: number,
): number {
  if (couplingTime <= 0 || t <= 0) return v1;
  if (t >= couplingTime) return vf;
  return v1 + (vf - v1) * (t / couplingTime);
}

/** Velocity of car 2 (initially at rest) during the coupling interval. */
export function speed2DuringCoupling(
  t: number,
  vf: number,
  couplingTime: number,
): number {
  if (couplingTime <= 0 || t <= 0) return 0;
  if (t >= couplingTime) return vf;
  return vf * (t / couplingTime);
}
