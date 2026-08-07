import type { EscalatorParams, EscalatorState } from "@/types/simulator";

export const G = 9.81; // m/s²
const SQRT3 = Math.sqrt(3);

/** Three-phase electrical input power: P = √3 · V_line · I_line · cos φ. */
export function electricalPower(
  voltage: number,
  lineCurrent: number,
  powerFactor: number,
): number {
  return SQRT3 * voltage * lineCurrent * powerFactor;
}

/** Useful mechanical power: the work to lift `numPeople` by `height` in `liftTime`. */
export function mechanicalPower(
  numPeople: number,
  personMass: number,
  height: number,
  liftTime: number,
  g = G,
): number {
  if (liftTime <= 0) return 0;
  return (numPeople * personMass * g * height) / liftTime;
}

export function computeEscalatorState(params: EscalatorParams): EscalatorState {
  const electrical = electricalPower(
    params.voltage,
    params.lineCurrent,
    params.powerFactor,
  );
  const mechanical = mechanicalPower(
    params.numPeople,
    params.personMass,
    params.height,
    params.liftTime,
  );

  return {
    electricalPower: electrical,
    mechanicalPower: mechanical,
    efficiency: electrical > 0 ? mechanical / electrical : 0,
    climbSpeed: params.liftTime > 0 ? params.height / params.liftTime : 0,
    workOutput: params.numPeople * params.personMass * G * params.height,
  };
}

/** η as a function of passenger count, holding every other param fixed — for the equations plot. */
export function efficiencyAtPeopleCount(
  numPeople: number,
  params: EscalatorParams,
): number {
  const electrical = electricalPower(
    params.voltage,
    params.lineCurrent,
    params.powerFactor,
  );
  if (electrical <= 0) return 0;
  const mechanical = mechanicalPower(
    numPeople,
    params.personMass,
    params.height,
    params.liftTime,
  );
  return mechanical / electrical;
}
