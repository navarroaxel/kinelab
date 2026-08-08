import type {
  ViscousImpactParams,
  ViscousImpactState,
} from "@/types/simulator";

/**
 * A viscous drag F = −kv gives ma = mv·dv/dx = −kv, so dv/dx = −k/m is
 * CONSTANT — the speed decays linearly with distance, not with time.
 * Two speed readings a known distance apart pin down that constant directly.
 */
export function decelRate(
  entrySpeed: number,
  exitSpeed: number,
  plateThickness: number,
): number {
  return plateThickness > 0 ? (entrySpeed - exitSpeed) / plateThickness : 0;
}

export function dragConstant(bulletMass: number, decel: number): number {
  return bulletMass * decel;
}

/** v(x) = entrySpeed − decelRate·x, clamped at zero (the bullet has stopped). */
export function velocityAtDepth(
  x: number,
  entrySpeed: number,
  decel: number,
): number {
  return Math.max(entrySpeed - decel * x, 0);
}

/** Depth at which v(x) reaches zero — how far the bullet penetrates a thick block. */
export function penetrationDepth(entrySpeed: number, decel: number): number {
  return decel > 0 ? entrySpeed / decel : Infinity;
}

/**
 * Position over time: dv/dx = −decel and v = dx/dt combine into
 * dx/dt = entrySpeed − decel·x, a linear ODE with a clean closed form —
 * the bullet approaches penetrationDepth exponentially, same shape as the
 * parachutist's approach to terminal velocity (PD 2).
 */
export function positionAtTime(
  t: number,
  entrySpeed: number,
  decel: number,
): number {
  const depth = penetrationDepth(entrySpeed, decel);
  return decel > 0 ? depth * (1 - Math.exp(-decel * t)) : entrySpeed * t;
}

export function velocityAtTime(
  t: number,
  entrySpeed: number,
  decel: number,
): number {
  return entrySpeed * Math.exp(-decel * t);
}

export function computeViscousImpactState(
  params: ViscousImpactParams,
): ViscousImpactState {
  const valid = params.entrySpeed > params.exitSpeed;
  const decel = valid
    ? decelRate(params.entrySpeed, params.exitSpeed, params.plateThickness)
    : 0;

  return {
    decelRate: decel,
    dragConstant: dragConstant(params.bulletMass, decel),
    penetrationDepth: valid
      ? penetrationDepth(params.entrySpeed, decel)
      : Infinity,
    valid,
  };
}
