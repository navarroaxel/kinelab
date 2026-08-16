import type {
  OscillatingBarLimits,
  OscillatingBarParams,
  OscillatingBarState,
} from "@/types/simulator";

// ---------------------------------------------------------------------------
// Bar OA of length b turns about O at a constant ω. The pin A it carries
// slides freely along bar BC, which pivots about B, a distance d away on the
// same horizontal. Find the angular velocity and acceleration of BC.
//
// Put O at the origin and B at (d, 0). Then A = b·(cos φ, sin φ) and the
// inclination θ that the figure marks at B satisfies
//
//   tan θ = b·sen φ / (d − b·cos φ)
//
// Differentiating that once and twice with respect to φ — and remembering
// φ̇ = ω is constant, so θ̈ = ω²·d²θ/dφ² with no φ̈ term — gives closed forms
// rather than anything numerical:
//
//   θ̇ = ω·b·(d·cos φ − b) / D          with D = d² + b² − 2·b·d·cos φ = r²
//   θ̈ = −ω²·b·d·(d² − b²)·sen φ / D²
//
// Two things fall out of those and are worth watching for:
//
//   • θ̇ = 0 when cos φ = b/d — the bar reaches its extreme inclination and
//     turns around. So BC does not go round: it *oscillates* between
//     ±asin(b/d), which is ±30° for the statement's d = 2b.
//   • at d = b exactly, θ̇ collapses to the constant −ω/2 and θ̈ vanishes:
//     the driven bar turns uniformly at half speed. The separation slider
//     stops just short of that, since φ = 0 is singular there.
//
// The pin also slides along BC, and that sliding is what a rotating-frame
// solution has to account for: with the frame attached to BC,
//
//   a_A = α×r + Ω×(Ω×r) + 2Ω×v_rel + a_rel
//
// where a_A is just b·ω² pointing at O. The Coriolis term 2Ω×v_rel is the
// one that gets dropped by mistake; the simulator draws all four.
// ---------------------------------------------------------------------------

/** Squared distance from B to the pin — the D that keeps showing up below. */
function reachSquared(phi: number, params: OscillatingBarParams): number {
  const { barLength: b, separation: d } = params;
  return Math.max(d * d + b * b - 2 * b * d * Math.cos(phi), 1e-12);
}

/** Inclination of BC at B, measured as the figure marks it. */
export function barAngle(phi: number, params: OscillatingBarParams): number {
  const { barLength: b, separation: d } = params;
  return Math.atan2(b * Math.sin(phi), d - b * Math.cos(phi));
}

/** Largest inclination BC can reach — it oscillates, it does not rotate. */
export function barAngleLimits(
  params: OscillatingBarParams,
): OscillatingBarLimits {
  const ratio = params.barLength / params.separation;
  const maxBarAngle = ratio >= 1 ? Math.PI / 2 : Math.asin(ratio);
  return {
    maxBarAngle,
    reachable:
      Math.abs((params.targetThetaDeg * Math.PI) / 180) <= maxBarAngle + 1e-12,
  };
}

/**
 * The crank angle that puts BC at inclination θ, taking the branch where the
 * pin is still on its way out — the configuration the figure shows.
 * Returns null when θ is beyond the mechanism's swing.
 */
export function crankAngleFor(
  theta: number,
  params: OscillatingBarParams,
): number | null {
  const { barLength: b, separation: d } = params;
  const sine = (d / b) * Math.sin(theta);
  if (Math.abs(sine) > 1) return null;
  return Math.asin(sine) - theta;
}

export function computeOscillatingBarState(
  params: OscillatingBarParams,
  phi: number,
): OscillatingBarState {
  const { barLength: b, separation: d, omega } = params;
  const cos = Math.cos(phi);
  const sin = Math.sin(phi);

  const squared = reachSquared(phi, params);
  const reach = Math.sqrt(squared);

  const thetaRate = (omega * b * (d * cos - b)) / squared;
  const thetaAccel =
    (-omega * omega * b * d * (d * d - b * b) * sin) / (squared * squared);

  // ṙ = ω·b·d·sen φ / r, and r̈ from differentiating that once more.
  const reachRate = (omega * b * d * sin) / reach;
  const reachAccel =
    (omega * omega * b * d * (cos * squared - b * d * sin * sin)) /
    (squared * reach);

  return {
    crankAngle: phi,
    barAngle: barAngle(phi, params),
    ax: b * cos,
    ay: b * sin,
    reach,
    reachRate,
    reachAccel,
    thetaRate,
    thetaAccel,
    // The ray B→A points leftward, so raising the far end C swings it
    // clockwise: the bar's CCW angular velocity is −θ̇, not +θ̇.
    barOmega: -thetaRate,
    barAlpha: -thetaAccel,
    pinSpeed: Math.abs(b * omega),
    pinAccel: b * omega * omega,
  };
}

/**
 * The four terms of the rotating-frame acceleration of the pin, expressed in
 * the frame attached to BC. They must add up to a_A = −ω²·r_{A/O}, which is
 * exactly what makes this a good check on a hand solution.
 */
export interface AccelTerms {
  euler: { x: number; y: number };
  centripetal: { x: number; y: number };
  coriolis: { x: number; y: number };
  relative: { x: number; y: number };
  total: { x: number; y: number };
}

export function accelerationTerms(
  state: OscillatingBarState,
  params: OscillatingBarParams,
): AccelTerms {
  const { separation: d } = params;
  // û along B→A, p̂ = ẑ × û.
  const ux = (state.ax - d) / state.reach;
  const uy = state.ay / state.reach;
  const px = -uy;
  const py = ux;

  const scale = (sx: number, sy: number, k: number) => ({
    x: sx * k,
    y: sy * k,
  });

  const euler = scale(px, py, state.barAlpha * state.reach);
  const centripetal = scale(
    ux,
    uy,
    -state.barOmega * state.barOmega * state.reach,
  );
  const coriolis = scale(px, py, 2 * state.barOmega * state.reachRate);
  const relative = scale(ux, uy, state.reachAccel);

  return {
    euler,
    centripetal,
    coriolis,
    relative,
    total: {
      x: euler.x + centripetal.x + coriolis.x + relative.x,
      y: euler.y + centripetal.y + coriolis.y + relative.y,
    },
  };
}

export const toDegrees = (rad: number): number => (rad * 180) / Math.PI;
