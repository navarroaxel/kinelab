import type {
  HelicopterLiftParams,
  HelicopterLiftState,
} from "@/types/simulator";

export const G = 32.2; // ft/s², imperial gravitational acceleration

/** Cross-sectional area of the wake column, π/4 · d². */
export function wakeArea(diameter: number): number {
  return (Math.PI / 4) * diameter * diameter;
}

/**
 * Mass flow rate of air through the wake, ρ/g · A · v — the weight density
 * ρ is divided by g to convert it to mass density (slug/ft³) before
 * multiplying by the volumetric flow rate A·v.
 */
export function massFlowRate(
  airDensity: number,
  area: number,
  exhaustVelocity: number,
  g = G,
): number {
  return (airDensity / g) * area * exhaustVelocity;
}

/**
 * Steady-flow momentum equation: the rotor accelerates air from rest (far
 * above) to `exhaustVelocity` downward through the wake. The reaction thrust
 * on the helicopter equals the rate of change of momentum imparted to the
 * air, ṁ·v.
 */
export function thrustForce(mdot: number, exhaustVelocity: number): number {
  return mdot * exhaustVelocity;
}

export function computeHelicopterLiftState(
  params: HelicopterLiftParams,
): HelicopterLiftState {
  const area = wakeArea(params.wakeDiameter);
  const mdot = massFlowRate(params.airDensity, area, params.exhaustVelocity);
  const thrust = thrustForce(mdot, params.exhaustVelocity);

  return {
    wakeArea: area,
    massFlowRate: mdot,
    thrust,
    maxLoad: thrust - params.heliWeight,
  };
}

/** maxLoad as a function of exhaust velocity alone, other params fixed — for the equations plot. */
export function maxLoadAtExhaustVelocity(
  exhaustVelocity: number,
  params: HelicopterLiftParams,
): number {
  const area = wakeArea(params.wakeDiameter);
  const mdot = massFlowRate(params.airDensity, area, exhaustVelocity);
  return thrustForce(mdot, exhaustVelocity) - params.heliWeight;
}
