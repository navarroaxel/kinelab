import type { JetClimbParams, JetClimbState } from "@/types/simulator";

export const G = 9.81; // m/s²

/** Steady-flow thrust: the engines expel their intake air at v_rel relative to the aircraft. */
export function thrustForce(
  massFlowRate: number,
  exhaustVelocity: number,
): number {
  return massFlowRate * exhaustVelocity;
}

export function computeJetClimbState(params: JetClimbParams): JetClimbState {
  const mass = params.massMg * 1000;
  const angle = (params.climbAngleDeg * Math.PI) / 180;
  const v0 = params.climbSpeedKmh / 3.6;
  const thrust = thrustForce(params.massFlowRate, params.exhaustVelocity);

  // During the climb, speed is constant: thrust balances drag plus the
  // weight component along the flight path, T = D₀ + m·g·sin θ. That fixes
  // the drag coefficient k in D = k·v², since D₀ = k·v₀².
  const weightAlongPath = mass * G * Math.sin(angle);
  const drag0 = thrust - weightAlongPath;
  const dragCoeff = drag0 / (v0 * v0);

  // The instant the pilot levels off, drag hasn't changed (speed hasn't
  // changed yet) but gravity no longer has a component along the path, so
  // the net force jumps to T − D₀ = weightAlongPath.
  const initialAccel = weightAlongPath / mass;

  // Terminal speed: m·dv/dt = T − k·v² = 0.
  const vMax = Math.sqrt(thrust / dragCoeff);

  // m·dv/dt = T − k·v² is a·(1 − (v/v_max)²) with a = T/m, whose solution
  // is v(t) = v_max·tanh(λt + c₀), λ = √(a·k/m) = √(T·k)/m.
  const timeConstant = Math.sqrt(thrust * dragCoeff) / mass;

  return {
    thrust,
    v0,
    weightAlongPath,
    drag0,
    dragCoeff,
    initialAccel,
    vMax,
    timeConstant,
  };
}

/**
 * Closed-form horizontal speed at time t after leveling off (t = 0 at the
 * moment the pilot switches to horizontal flight, v(0) = v₀).
 */
export function speedAtTime(t: number, state: JetClimbState): number {
  const { v0, vMax, timeConstant } = state;
  const c0 = Math.atanh(Math.min(Math.max(v0 / vMax, -1), 1));
  return vMax * Math.tanh(timeConstant * t + c0);
}

/** Instantaneous horizontal acceleration at time t, from Newton's second law directly. */
export function accelAtTime(
  t: number,
  state: JetClimbState,
  mass: number,
): number {
  const v = speedAtTime(t, state);
  return (state.thrust - state.dragCoeff * v * v) / mass;
}
