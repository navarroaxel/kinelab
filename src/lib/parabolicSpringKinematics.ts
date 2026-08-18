import type {
  ParabolicSpringParams,
  ParabolicSpringState,
} from "@/types/simulator";

// ---------------------------------------------------------------------------
// Hibbeler 13-74 — a block sliding on a smooth parabolic path y = a − b·x²,
// tied to the y-axis by a horizontal spring. A roller guide keeps the spring
// horizontal, so its length is simply x and its stretch is x − L₀.
//
// The path is smooth, so the normal force does no work and never appears in
// the tangential equation; the two directions decouple completely:
//
//   ΣF_t = m·v̇          gives the rate at which the speed grows
//   ΣF_n = m·v²/ρ        gives the normal force, once ρ is known
//
// with the unit vectors read straight off the curve,
//
//   t̂ = (1, y′)/√(1+y′²)          n̂ = (y′, −1)/√(1+y′²)
//   ρ = (1 + y′²)^{3/2} / |y″|
//
// n̂ points toward the centre of curvature, which for this downward-opening
// parabola (y″ = −2b < 0) is always *below* the curve. The block rides on the
// convex side, so the path pushes it the other way, along −n̂ — which is why
// N enters ΣF_n with a minus sign and can go negative, meaning the block
// would fly off rather than be pulled back.
//
// Only two forces have components: the weight and the spring. Neither depends
// on the speed, so v̇ is a function of position alone.
// ---------------------------------------------------------------------------

/** Path height. */
export const pathY = (x: number, params: ParabolicSpringParams): number =>
  params.vertex - params.curvatureCoeff * x * x;

/** dy/dx. */
export const pathSlope = (x: number, params: ParabolicSpringParams): number =>
  -2 * params.curvatureCoeff * x;

/** Radius of curvature — constant numerator aside, this is what sets N. */
export function radiusOfCurvature(
  x: number,
  params: ParabolicSpringParams,
): number {
  const slope = pathSlope(x, params);
  const secondDerivative = 2 * params.curvatureCoeff;
  if (secondDerivative === 0) return Infinity;
  return Math.pow(1 + slope * slope, 1.5) / secondDerivative;
}

/** Where the path meets the ground, y = 0. */
export function pathEndX(params: ParabolicSpringParams): number {
  if (params.curvatureCoeff <= 0 || params.vertex <= 0) return Infinity;
  return Math.sqrt(params.vertex / params.curvatureCoeff);
}

/** Signed spring stretch: positive stretched (pulls the block back toward B). */
export const springStretch = (
  x: number,
  params: ParabolicSpringParams,
): number => x - params.naturalLength;

/**
 * The force the spring and gravity together apply, in Cartesian components.
 * The spring is held horizontal by the roller guide, so it only ever acts
 * along x.
 */
function appliedForce(
  x: number,
  params: ParabolicSpringParams,
): { fx: number; fy: number } {
  return {
    fx: -params.stiffness * springStretch(x, params),
    fy: -params.mass * params.gravity,
  };
}

/** Rate of increase of speed at position x — independent of the speed itself. */
export function tangentialAccel(
  x: number,
  params: ParabolicSpringParams,
): number {
  const slope = pathSlope(x, params);
  const norm = Math.sqrt(1 + slope * slope);
  const { fx, fy } = appliedForce(x, params);
  return (fx + fy * slope) / (norm * params.mass);
}

/** Normal force the path applies to the block at position x and speed v. */
export function normalForce(
  x: number,
  speed: number,
  params: ParabolicSpringParams,
): number {
  const slope = pathSlope(x, params);
  const norm = Math.sqrt(1 + slope * slope);
  const { fx, fy } = appliedForce(x, params);
  // Applied force projected onto n̂ = (y′, −1)/√(1+y′²).
  const appliedNormal = (fx * slope - fy) / norm;
  const rho = radiusOfCurvature(x, params);
  const centripetal =
    rho === Infinity ? 0 : (params.mass * speed * speed) / rho;
  return appliedNormal - centripetal;
}

export function computeParabolicSpringState(
  params: ParabolicSpringParams,
  x: number,
  speed: number,
): ParabolicSpringState {
  const slope = pathSlope(x, params);
  const rho = radiusOfCurvature(x, params);
  const stretch = springStretch(x, params);
  const normal = normalForce(x, speed, params);

  return {
    x,
    y: pathY(x, params),
    speed,
    slope,
    inclineDeg: (Math.atan(-slope) * 180) / Math.PI,
    radiusOfCurvature: rho,
    springStretch: stretch,
    springForce: Math.abs(params.stiffness * stretch),
    normal,
    tangentialAccel: tangentialAccel(x, params),
    centripetal: rho === Infinity ? 0 : (params.mass * speed * speed) / rho,
    contactLost: normal < 0,
    reachedEnd: x >= pathEndX(params),
  };
}

// --- motion along the path --------------------------------------------------

/**
 * dx/dt for a given speed along the path: the speed is measured along the arc,
 * and dx/ds = 1/√(1+y′²).
 */
function xRate(
  x: number,
  speed: number,
  params: ParabolicSpringParams,
): number {
  const slope = pathSlope(x, params);
  return speed / Math.sqrt(1 + slope * slope);
}

export interface PathState {
  x: number;
  speed: number;
}

/**
 * One RK4 step on [x, v]. The block is on a smooth curved path with a spring,
 * so v̇ varies along the way and a cruder integrator would visibly bleed
 * energy over a full descent.
 */
export function rk4Step(
  state: PathState,
  params: ParabolicSpringParams,
  dt: number,
): PathState {
  const derivative = (s: PathState) => ({
    x: xRate(s.x, s.speed, params),
    speed: tangentialAccel(s.x, params),
  });

  const k1 = derivative(state);
  const k2 = derivative({
    x: state.x + (dt / 2) * k1.x,
    speed: state.speed + (dt / 2) * k1.speed,
  });
  const k3 = derivative({
    x: state.x + (dt / 2) * k2.x,
    speed: state.speed + (dt / 2) * k2.speed,
  });
  const k4 = derivative({
    x: state.x + dt * k3.x,
    speed: state.speed + dt * k3.speed,
  });

  return {
    x: state.x + (dt / 6) * (k1.x + 2 * k2.x + 2 * k3.x + k4.x),
    speed:
      state.speed +
      (dt / 6) * (k1.speed + 2 * k2.speed + 2 * k3.speed + k4.speed),
  };
}

/**
 * Speed at position `x` for a block that passed through (x₀, v₀), from energy
 * conservation — the path is smooth, so only gravity and the spring do work.
 * Returns null where the block simply cannot reach.
 */
export function speedAt(
  x: number,
  fromX: number,
  fromSpeed: number,
  params: ParabolicSpringParams,
): number | null {
  const { mass, gravity, stiffness } = params;
  const gravityWork =
    mass * gravity * (pathY(fromX, params) - pathY(x, params));
  const springWork =
    0.5 *
    stiffness *
    (springStretch(fromX, params) ** 2 - springStretch(x, params) ** 2);
  const kinetic = 0.5 * mass * fromSpeed * fromSpeed + gravityWork + springWork;
  if (kinetic < 0) return null;
  return Math.sqrt((2 * kinetic) / mass);
}
