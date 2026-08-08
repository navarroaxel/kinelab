// ---------------------------------------------------------------------------
// PD 7 — Elevator and counterweight power (/particle-dynamics/elevator-counterweight)
// ---------------------------------------------------------------------------

export interface ElevatorCounterweightParams {
  elevatorMass: number; // kg, default 3000
  counterweightMass: number; // kg, default 1000
  elevatorVelocity: number; // m/s, signed — positive = moving up, default −3 (descending)
  elevatorAcceleration: number; // m/s², signed, along the velocity's own axis, default 0
}

export interface ElevatorCounterweightVisibility {
  showCars: boolean; // elevator + counterweight + motor
}

export interface ElevatorCounterweightState {
  motorPower: number; // W, signed — positive = motor drives, negative = motor brakes
  isBraking: boolean; // motorPower < 0 — gravity alone would over-accelerate the system
}
