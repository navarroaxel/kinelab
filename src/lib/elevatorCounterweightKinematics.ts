import type {
  ElevatorCounterweightParams,
  ElevatorCounterweightState,
} from "@/types/simulator";

export const G = 9.81; // m/s²

/**
 * The elevator and counterweight share one cable over a fixed pulley — the
 * motor drives the pulley itself, so it can add OR remove energy from the
 * system depending on which way gravity is already trying to push things.
 * Power balance (motor power = rate of mechanical-energy change, since the
 * cable/pulley do no net work of their own):
 *
 *   P = (mE+mW)·v·a + (mE−mW)·g·v
 *
 * where v is the elevator's signed velocity (positive = up) and a its
 * signed acceleration. The counterweight's own v and a are exactly −v, −a,
 * which is already folded into the derivation (see the equations panel).
 */
export function motorPower(
  elevatorMass: number,
  counterweightMass: number,
  velocity: number,
  acceleration: number,
  g = G,
): number {
  return (
    (elevatorMass + counterweightMass) * velocity * acceleration +
    (elevatorMass - counterweightMass) * g * velocity
  );
}

export function computeElevatorCounterweightState(
  params: ElevatorCounterweightParams,
): ElevatorCounterweightState {
  const power = motorPower(
    params.elevatorMass,
    params.counterweightMass,
    params.elevatorVelocity,
    params.elevatorAcceleration,
  );
  return {
    motorPower: power,
    isBraking: power < 0,
  };
}
