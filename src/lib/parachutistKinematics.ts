import type { ParachutistParams, ParachutistState } from "@/types/simulator";

export const G = 9.81; // m/s²

/**
 * m·dv/dt = mg − βv ⇒ v(t) = v_t + (v0 − v_t)·e^(−t/τ), where v_t = mg/β
 * (terminal speed) and τ = m/β (time constant). Whatever v0 is, v(t)
 * converges to v_t exponentially — it never grows without bound.
 */
export function terminalSpeed(mass: number, beta: number, g = G): number {
  return beta > 0 ? (mass * g) / beta : Infinity;
}

export function timeConstant(mass: number, beta: number): number {
  return beta > 0 ? mass / beta : Infinity;
}

export function velocityAtTime(
  t: number,
  v0: number,
  vt: number,
  tau: number,
): number {
  return vt + (v0 - vt) * Math.exp(-t / tau);
}

/** z(t) = ∫₀ᵗ v dt' — closed form for the distance fallen. */
export function positionAtTime(
  t: number,
  v0: number,
  vt: number,
  tau: number,
): number {
  return vt * t + (v0 - vt) * tau * (1 - Math.exp(-t / tau));
}

export function computeParachutistState(
  params: ParachutistParams,
): ParachutistState {
  const vt = terminalSpeed(params.mass, params.beta);
  return {
    terminalSpeed: vt,
    timeConstant: timeConstant(params.mass, params.beta),
    approachesLimit: true,
  };
}
