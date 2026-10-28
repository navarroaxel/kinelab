import { sweep } from "@/lib/sweep";
import {
  accelerationAt,
  add2,
  instantCenter,
  norm2,
  perp2,
  scale2,
  solveLinear2,
  sub2,
  velocityAt,
} from "@/lib/planarRigidBody";
import type {
  FourBarLimits,
  FourBarParams,
  FourBarState,
  Vec2,
} from "@/types/simulator";

// ---------------------------------------------------------------------------
// CCR N°10 — Four-bar linkage. Crank CD turns at a known constant ω_CD about
// the fixed pin D (the origin); coupler BC links it to rocker AB, which pivots
// about the fixed pin A. ω_BC and ω_AB are the unknowns.
//
// Geometry. B is one end of two rigid links, so it lies on the circle of
// radius |BC| about C and on the circle of radius |AB| about A — a circle–
// circle intersection, algebra rather than an ODE. Two intersections exist;
// the statement's (B to the left of C, above the line CA) is the one kept, so
// the branch is continuous over the whole swing.
//
// Velocity. B belongs to both bodies:
//
//   v_B = v_C + ω_BC ẑ×(B−C) = ω_AB ẑ×(B−A)
//
// two scalar equations in ω_BC, ω_AB. The same trick one derivative later
// gives γ_BC, γ_AB. Both systems are singular at a toggle (C, B, A collinear),
// which is exactly where the crank hits a stop — see `fourBarLimits`.
//
// The statement does not give |AB|. It is inferred as 1.2 m from the figure
// (AB·sin 30° = 0.6 m, so A sits at floor level with D); A is placed so that
// at the statement instant AB makes 30° with the horizontal for any |AB|.
// ---------------------------------------------------------------------------

const DEG = Math.PI / 180;
const TWO_PI = Math.PI * 2;

/** Statement instant: B at (−0.6, 0.6) with AB rising 30° toward it from A. */
const ROCKER_ANGLE = 30 * DEG;
/** Inset from the exact toggle so ω_BC, ω_AB stay finite at the stops. */
const STOP_MARGIN = 0.5 * DEG;
const SCAN_STEP = 0.5 * DEG;

/** The fixed pin A. B at the statement instant is (−|BC|, |CD|) with C = (0, |CD|). */
export function fourBarPivotA(params: FourBarParams): Vec2 {
  const B0: Vec2 = { x: -params.couplerLen, y: params.crankLen };
  return {
    x: B0.x - params.rockerLen * Math.cos(ROCKER_ANGLE),
    y: B0.y - params.rockerLen * Math.sin(ROCKER_ANGLE),
  };
}

function crankPoint(alpha: number, params: FourBarParams): Vec2 {
  return {
    x: params.crankLen * Math.cos(alpha),
    y: params.crankLen * Math.sin(alpha),
  };
}

/** Joint B for crank angle α, or null if the links cannot reach each other. */
function solveB(alpha: number, params: FourBarParams): Vec2 | null {
  const A = fourBarPivotA(params);
  const C = crankPoint(alpha, params);
  const d = sub2(C, A);
  const dist = norm2(d);
  if (dist === 0) return null;
  const { couplerLen: lBC, rockerLen: lAB } = params;
  const a = (lAB * lAB - lBC * lBC + dist * dist) / (2 * dist);
  const h2 = lAB * lAB - a * a;
  if (h2 < 0) return null;
  const dHat = scale2(d, 1 / dist);
  // h ≥ 0 puts B on the side where cross(C−A, B−A) > 0 — the statement's branch.
  return add2(add2(A, scale2(dHat, a)), scale2(perp2(dHat), Math.sqrt(h2)));
}

/**
 * The crank's stops: the nearest angles on either side of α₀ where the links
 * stop reaching each other. A crank that can clear every angle returns null.
 */
export function fourBarLimits(params: FourBarParams): FourBarLimits | null {
  const alpha0 = params.alpha0Deg * DEG;
  if (!solveB(alpha0, params)) return null;

  const scan = (dir: 1 | -1): number | null => {
    let ok = alpha0;
    for (let s = SCAN_STEP; s <= TWO_PI; s += SCAN_STEP) {
      const alpha = alpha0 + dir * s;
      if (!solveB(alpha, params)) {
        let lo = ok;
        let hi = alpha;
        for (let i = 0; i < 50; i++) {
          const mid = (lo + hi) / 2;
          if (solveB(mid, params)) lo = mid;
          else hi = mid;
        }
        return lo;
      }
      ok = alpha;
    }
    return null;
  };

  const up = scan(1);
  const down = scan(-1);
  if (up === null || down === null) return null;
  return { alphaMin: down + STOP_MARGIN, alphaMax: up - STOP_MARGIN };
}

/** The whole linkage at crank angle α, with the crank turning at `omegaCD` (signed). */
export function computeFourBarInstant(
  alpha: number,
  omegaCD: number,
  params: FourBarParams,
): FourBarState {
  const A = fourBarPivotA(params);
  const D: Vec2 = { x: 0, y: 0 };
  const C = crankPoint(alpha, params);
  const B = solveB(alpha, params) ?? C;
  const E = scale2(add2(B, C), 0.5);

  const rCD = sub2(C, D);
  const rBC = sub2(B, C);
  const rBA = sub2(B, A);

  const vC = velocityAt({ x: 0, y: 0 }, omegaCD, rCD);

  // ω_BC ẑ×(B−C) − ω_AB ẑ×(B−A) = −v_C
  const pBC = perp2(rBC);
  const pBA = perp2(rBA);
  const w = solveLinear2(pBC.x, -pBA.x, pBC.y, -pBA.y, -vC.x, -vC.y) ?? [0, 0];
  const [omegaBC, omegaAB] = w;

  const vB = velocityAt(vC, omegaBC, rBC);
  const vE = velocityAt(vC, omegaBC, sub2(E, C));

  // α_CD = 0 (ω_CD is constant), so a_C is pure centripetal.
  const aC = accelerationAt({ x: 0, y: 0 }, omegaCD, 0, rCD).total;
  // a_C + γ_BC ẑ×r_BC − ω_BC² r_BC = γ_AB ẑ×r_BA − ω_AB² r_BA
  const rhs = sub2(
    scale2(rBA, -omegaAB * omegaAB),
    add2(aC, scale2(rBC, -omegaBC * omegaBC)),
  );
  const g = solveLinear2(pBC.x, -pBA.x, pBC.y, -pBA.y, rhs.x, rhs.y) ?? [0, 0];
  const [gammaBC, gammaAB] = g;

  const aB = accelerationAt(aC, omegaBC, gammaBC, rBC).total;
  const aE = accelerationAt(aC, omegaBC, gammaBC, sub2(E, C)).total;

  // The CIR of BC lies on the perpendicular to v_C through C and the one to
  // v_B through B (which, since B pivots about A, is the line AB itself).
  const cir = instantCenter(C, vC, B, vB);

  return {
    alpha,
    A,
    B,
    C,
    D,
    E,
    omegaCD,
    omegaBC,
    omegaAB,
    gammaBC,
    gammaAB,
    vB,
    vC,
    vE,
    aB,
    aC,
    aE,
    cir,
    speedE: norm2(vE),
    accelE: norm2(aE),
  };
}

/**
 * State at elapsed time `t`. At t = 0 the crank sits at the statement angle;
 * from there it sweeps between its stops (or turns freely if it can).
 */
export function computeFourBarState(
  params: FourBarParams,
  t: number,
): FourBarState {
  const alpha0 = params.alpha0Deg * DEG;
  const limits = fourBarLimits(params);
  if (!limits) {
    return computeFourBarInstant(
      alpha0 + params.omegaCD * t,
      params.omegaCD,
      params,
    );
  }
  const { value, sign } = sweep(
    t,
    alpha0,
    params.omegaCD,
    limits.alphaMin,
    limits.alphaMax,
  );
  return computeFourBarInstant(value, params.omegaCD * sign, params);
}
