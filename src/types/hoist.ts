// ---------------------------------------------------------------------------
// PD 11 — Hoist motor efficiency (/particle-dynamics/hoist)
// ---------------------------------------------------------------------------

export interface HoistParams {
  loadMass: number; // kg, load being lifted, default 300
  counterweightMass: number; // kg, counterweight descending via the movable pulley, default 100
  speed: number; // m/s, load's constant lifting speed, default 2 (counterweight moves at 2× this)
  wattmeterReading: number; // W, motor's total electrical input as read on wattmeter B, default 2200
}

export interface HoistVisibility {
  showLoad: boolean; // the cable, counterweight and rising load
  showPowerFlow: boolean; // P_elec in / P_mech out arrows at the motor
}

export interface HoistState {
  mechanicalPower: number; // W, net power the motor supplies after the counterweight's assist
  electricalPower: number; // W, total electrical input = wattmeterReading
  efficiency: number; // mechanicalPower / electricalPower
  exceedsInput: boolean; // mechanicalPower > electricalPower — physically impossible with these inputs
  counterweightSpeed: number; // m/s, derived: 2 × speed (movable-pulley kinematic constraint)
}
