import type { StagedRocketParams, StagedRocketState } from "@/types/simulator";

export const G = 9.81; // m/s²

export function burnTime(fuelMass: number, fuelRate: number): number {
  return fuelRate > 0 ? fuelMass / fuelRate : 0;
}

/** Mass remaining at time t, burning fuel at a constant rate from m0. */
export function massAtTime(t: number, m0: number, fuelRate: number): number {
  return m0 - fuelRate * t;
}

/**
 * The rocket equation with gravity: m·dv/dt = q·v_rel − m·g (thrust minus
 * weight), integrated with m(t) = m0 − q·t:
 *
 *   v(t) = v0 + v_rel·ln(m0/m(t)) − g·t
 *
 * v0 carries over the speed already gained before this burn started — the
 * key to why staging helps: burn 2 starts from v0 = v_sep, not from zero.
 */
export function velocityAtTime(
  t: number,
  m0: number,
  fuelRate: number,
  exhaustVelocity: number,
  v0 = 0,
  g = G,
): number {
  const m = massAtTime(t, m0, fuelRate);
  return v0 + exhaustVelocity * Math.log(m0 / m) - g * t;
}

export function computeSingleStage(
  params: StagedRocketParams,
): StagedRocketState["singleStage"] {
  const initialMass = params.payloadMass + params.singleStageMass;
  const burnoutMass = initialMass - params.singleStageFuelMass;
  const time = burnTime(params.singleStageFuelMass, params.fuelRate);
  const maxSpeed = velocityAtTime(
    time,
    initialMass,
    params.fuelRate,
    params.exhaustVelocity,
  );
  return { initialMass, burnoutMass, burnTime: time, maxSpeed };
}

export function computeTwoStage(
  params: StagedRocketParams,
): StagedRocketState["twoStage"] {
  const stageDryMass = params.twoStageMassEach - params.twoStageFuelMassEach;
  const initialMass = params.payloadMass + 2 * params.twoStageMassEach;

  const burnTimeA = burnTime(params.twoStageFuelMassEach, params.fuelRate);
  const massBeforeSeparation = initialMass - params.twoStageFuelMassEach;
  const speedAtSeparation = velocityAtTime(
    burnTimeA,
    initialMass,
    params.fuelRate,
    params.exhaustVelocity,
  );

  const massAfterSeparation = massBeforeSeparation - stageDryMass;
  const burnTimeB = burnTime(params.twoStageFuelMassEach, params.fuelRate);
  const burnoutMassB = massAfterSeparation - params.twoStageFuelMassEach;
  const maxSpeed = velocityAtTime(
    burnTimeB,
    massAfterSeparation,
    params.fuelRate,
    params.exhaustVelocity,
    speedAtSeparation,
  );

  return {
    stageDryMass,
    initialMass,
    massBeforeSeparation,
    burnTimeA,
    speedAtSeparation,
    massAfterSeparation,
    burnoutMassB,
    burnTimeB,
    maxSpeed,
  };
}

export function computeStagedRocketState(
  params: StagedRocketParams,
): StagedRocketState {
  const singleStage = computeSingleStage(params);
  const twoStage = computeTwoStage(params);
  return {
    singleStage,
    twoStage,
    speedGain: twoStage.maxSpeed - singleStage.maxSpeed,
  };
}
