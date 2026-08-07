import type { HoistParams, HoistState } from "@/types/simulator";

export const G = 9.81; // m/s²

// The counterweight rides the movable pulley: for every metre the load
// climbs, both supporting rope segments shorten by one metre each, so the
// counterweight (tied to the far end of that same rope, via the fixed
// pulley) must fall twice as fast.
export const COUNTERWEIGHT_SPEED_RATIO = 2;

export function counterweightSpeed(loadSpeed: number): number {
  return COUNTERWEIGHT_SPEED_RATIO * loadSpeed;
}

/**
 * A counterweight heavier than load/2 would overpower the movable pulley on
 * its own, driving the motor's cable in reverse (T₁ < 0) — the motor would
 * have to brake rather than drive, a regenerative mode this exercise doesn't
 * model. Clamping here keeps every reachable (loadMass, counterweightMass)
 * pair inside the regime where the motor is actually doing work.
 */
export function maxCounterweightMass(loadMass: number): number {
  return loadMass / 2;
}

/**
 * Net mechanical power the motor must supply, after the counterweight's
 * assist: the counterweight's descent releases energy that offsets part of
 * the work needed to raise the load, so the motor only makes up the
 * difference.
 *
 *   T₂ (movable pulley, 2 strands) = load·g / 2
 *   T₁ (motor's cable)             = T₂ − counterweight·g  (≥ 0, see above)
 *   P_mechanical                   = T₁ · counterweightSpeed
 */
export function mechanicalPower(
  loadMass: number,
  counterweightMass: number,
  loadSpeed: number,
  g = G,
): number {
  const clampedCounterweight = Math.min(
    counterweightMass,
    maxCounterweightMass(loadMass),
  );
  const vCounterweight = counterweightSpeed(loadSpeed);
  const tensionAtPulley = (loadMass * g) / 2;
  const tensionAtMotor = tensionAtPulley - clampedCounterweight * g;
  return tensionAtMotor * vCounterweight;
}

export function computeHoistState(params: HoistParams): HoistState {
  const mechanical = mechanicalPower(
    params.loadMass,
    params.counterweightMass,
    params.speed,
  );
  const electrical = params.wattmeterReading;

  return {
    mechanicalPower: mechanical,
    electricalPower: electrical,
    efficiency: electrical > 0 ? mechanical / electrical : 0,
    exceedsInput: mechanical > electrical,
    counterweightSpeed: counterweightSpeed(params.speed),
  };
}

/** η as a function of the wattmeter reading, holding load/counterweight/speed fixed — for the equations plot. */
export function efficiencyAtWattmeterReading(
  reading: number,
  params: HoistParams,
): number {
  if (reading <= 0) return 0;
  const mechanical = mechanicalPower(
    params.loadMass,
    params.counterweightMass,
    params.speed,
  );
  return mechanical / reading;
}
