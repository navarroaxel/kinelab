import type { CableBlocksParams, CableBlocksState } from "@/types/simulator";

// Block B: motor D pulls a single run at constant acceleration a_D.
export function sB(t: number, params: CableBlocksParams): number {
  return 0.5 * params.aD * t * t;
}
export function vB(t: number, params: CableBlocksParams): number {
  return params.aD * t;
}

// Block A: motor C drives `runsA` cable runs with a_C(t) = cCoeff·t², so
// a_A = a_C / runsA, integrated twice from rest.
export function sA(t: number, params: CableBlocksParams): number {
  return (params.cCoeff / params.runsA / 12) * t ** 4;
}
export function vA(t: number, params: CableBlocksParams): number {
  return (params.cCoeff / params.runsA / 3) * t ** 3;
}

/**
 * Meeting time: s_A(t) + s_B(t) = d0 is biquadratic in t. Solved in closed
 * form via u = t² — no bisection.
 */
export function meetingTime(params: CableBlocksParams): number {
  const A4 = params.cCoeff / params.runsA / 12; // coefficient of t⁴
  const B2 = 0.5 * params.aD; // coefficient of t²
  const C0 = -params.d0;

  const u = (-B2 + Math.sqrt(B2 * B2 - 4 * A4 * C0)) / (2 * A4);
  const t = Math.sqrt(u);

  if (process.env.NODE_ENV === "development") {
    const residual = sA(t, params) + sB(t, params) - params.d0;
    if (Math.abs(residual) > 1e-6 * params.d0) {
      console.warn(
        `[cableBlocks] meeting-time residual too large: sA+sB−d0=${residual.toExponential(2)}`,
      );
    }
  }

  return t;
}

export function computeCableBlocksState(
  params: CableBlocksParams,
  t: number,
): CableBlocksState {
  const tMeet = meetingTime(params);
  const tClamped = Math.min(t, tMeet);
  const sAv = sA(tClamped, params);
  const sBv = sB(tClamped, params);
  return {
    t,
    sA: sAv,
    sB: sBv,
    vA: vA(tClamped, params),
    vB: -vB(tClamped, params),
    d: params.d0 - sAv - sBv,
    tMeet,
    met: t >= tMeet,
  };
}
