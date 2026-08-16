import type {
  ForcedVibrationParams,
  ForcedVibrationProperties,
  ForcedVibrationState,
} from "@/types/simulator";

// ---------------------------------------------------------------------------
// A mass on a spring and a dashpot, driven by a harmonic force:
//
//   m·ẍ + c·ẋ + k·x = F₀·cos(ω·t)
//
// The whole exercise lives in three derived numbers:
//
//   ωn = √(k/m)          the natural frequency, all the system's own doing
//   ζ  = c / (2√(k·m))   how much damping, as a fraction of critical
//   r  = ω / ωn          how hard the forcing pushes against that
//
// The steady state is a sinusoid at the *forcing* frequency, never at ωn:
//
//   X = δ_st / √[(1 − r²)² + (2ζr)²]        with δ_st = F₀/k
//
// δ_st is what the force would deflect the spring if applied slowly, so the
// square root is a pure magnification factor — it says how much worse (or
// better) the dynamics make things than a static push of the same size.
// At r = 1 with no damping it blows up; away from r = 1 the damping barely
// matters, which is why the c = 0 answer is not far off the c = 500 one.
//
// The free response is the homogeneous solution, and it is the *only* place
// ωn shows up in the motion. Underdamped it rings at ωd = ωn√(1−ζ²) inside a
// decaying e^(−ζ·ωn·t) envelope; that transient is what dies away and leaves
// the steady state behind.
// ---------------------------------------------------------------------------

export function computeProperties(
  params: ForcedVibrationParams,
): ForcedVibrationProperties {
  const { mass, stiffness, damping, forceAmplitude, forcingOmega } = params;

  const naturalOmega = Math.sqrt(stiffness / mass);
  const criticalDamping = 2 * Math.sqrt(stiffness * mass);
  const dampingRatio = damping / criticalDamping;
  const frequencyRatio = forcingOmega / naturalOmega;
  const staticDeflection = forceAmplitude / stiffness;

  const r = frequencyRatio;
  const detuning = 1 - r * r;
  const dissipation = 2 * dampingRatio * r;
  const denominator = Math.sqrt(
    detuning * detuning + dissipation * dissipation,
  );

  const magnification = denominator === 0 ? Infinity : 1 / denominator;
  const undampedAmplitude =
    detuning === 0 ? Infinity : staticDeflection / Math.abs(detuning);

  // atan2 keeps the phase in [0, π): it passes through 90° at resonance and
  // tends to 180° well above it, where the mass moves against the force.
  const steadyPhase = Math.atan2(dissipation, detuning);

  const regime =
    dampingRatio === 0
      ? ("undamped" as const)
      : dampingRatio < 1
        ? ("underdamped" as const)
        : dampingRatio === 1
          ? ("critical" as const)
          : ("overdamped" as const);

  const dampedOmega =
    dampingRatio < 1
      ? naturalOmega * Math.sqrt(1 - dampingRatio * dampingRatio)
      : 0;

  return {
    naturalOmega,
    naturalHz: naturalOmega / (2 * Math.PI),
    criticalDamping,
    dampingRatio,
    frequencyRatio,
    staticDeflection,
    magnification,
    steadyAmplitude: staticDeflection * magnification,
    undampedAmplitude,
    steadyPhase,
    dampedOmega,
    decayRate: dampingRatio * naturalOmega,
    logDecrement:
      dampingRatio > 0 && dampingRatio < 1
        ? (2 * Math.PI * dampingRatio) /
          Math.sqrt(1 - dampingRatio * dampingRatio)
        : 0,
    regime,
  };
}

/** Magnification factor X/δ_st at an arbitrary frequency ratio. */
export function magnificationAt(r: number, dampingRatio: number): number {
  const detuning = 1 - r * r;
  const dissipation = 2 * dampingRatio * r;
  const denominator = Math.sqrt(
    detuning * detuning + dissipation * dissipation,
  );
  return denominator === 0 ? Infinity : 1 / denominator;
}

/** The driving force at time t — zero when the force is switched off. */
export const appliedForce = (
  time: number,
  params: ForcedVibrationParams,
): number =>
  params.forceEnabled
    ? params.forceAmplitude * Math.cos(params.forcingOmega * time)
    : 0;

export interface MotionState {
  x: number;
  v: number;
}

function acceleration(
  state: MotionState,
  time: number,
  params: ForcedVibrationParams,
): number {
  return (
    (appliedForce(time, params) -
      params.damping * state.v -
      params.stiffness * state.x) /
    params.mass
  );
}

/**
 * One RK4 step. The closed-form solution exists, but it splits into three
 * cases by damping regime and degenerates at r = 1 with ζ = 0 — integrating
 * keeps one code path that stays right through resonance, where the whole
 * point is that the amplitude grows without bound.
 */
export function rk4Step(
  state: MotionState,
  time: number,
  params: ForcedVibrationParams,
  dt: number,
): MotionState {
  const derivative = (s: MotionState, t: number) => ({
    x: s.v,
    v: acceleration(s, t, params),
  });

  const k1 = derivative(state, time);
  const k2 = derivative(
    { x: state.x + (dt / 2) * k1.x, v: state.v + (dt / 2) * k1.v },
    time + dt / 2,
  );
  const k3 = derivative(
    { x: state.x + (dt / 2) * k2.x, v: state.v + (dt / 2) * k2.v },
    time + dt / 2,
  );
  const k4 = derivative(
    { x: state.x + dt * k3.x, v: state.v + dt * k3.v },
    time + dt,
  );

  return {
    x: state.x + (dt / 6) * (k1.x + 2 * k2.x + 2 * k3.x + k4.x),
    v: state.v + (dt / 6) * (k1.v + 2 * k2.v + 2 * k3.v + k4.v),
  };
}

export function computeState(
  params: ForcedVibrationParams,
  time: number,
  motion: MotionState,
): ForcedVibrationState {
  return {
    time,
    displacement: motion.x,
    velocity: motion.v,
    acceleration: acceleration(motion, time, params),
    appliedForce: appliedForce(time, params),
    springForce: -params.stiffness * motion.x,
    damperForce: -params.damping * motion.v,
  };
}

/**
 * The response x(t) sampled over `duration`, integrated from the parameters'
 * own initial conditions. Used for the time-history plot.
 */
export function responseSamples(
  params: ForcedVibrationParams,
  duration: number,
  count = 400,
): [number, number][] {
  const points: [number, number][] = [[0, params.initialDisplacement]];
  let motion: MotionState = {
    x: params.initialDisplacement,
    v: params.initialVelocity,
  };
  let time = 0;
  // Sub-stepped well below the natural period so the samples are the real
  // solution rather than the integrator's own artefacts.
  const substeps = 8;
  const sampleStep = duration / count;
  const h = sampleStep / substeps;

  for (let i = 1; i <= count; i++) {
    for (let s = 0; s < substeps; s++) {
      motion = rk4Step(motion, time, params, h);
      time += h;
    }
    points.push([time, motion.x]);
  }
  return points;
}

/** A sensible window for the time plot: enough to watch the transient die. */
export function plotDuration(
  properties: ForcedVibrationProperties,
  params: ForcedVibrationParams,
): number {
  const naturalPeriod = (2 * Math.PI) / Math.max(properties.naturalOmega, 1e-9);
  const forcingPeriod = params.forceEnabled
    ? (2 * Math.PI) / Math.max(params.forcingOmega, 1e-9)
    : naturalPeriod;
  const settle =
    properties.decayRate > 0 ? 4 / properties.decayRate : 12 * naturalPeriod;
  return Math.min(
    Math.max(settle, 8 * Math.max(naturalPeriod, forcingPeriod)),
    60 * naturalPeriod,
  );
}
