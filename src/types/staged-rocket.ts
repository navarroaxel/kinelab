// ---------------------------------------------------------------------------
// PD 14 — Staged rocket launch (/particle-dynamics/staged-rocket)
// ---------------------------------------------------------------------------

export interface StagedRocketParams {
  payloadMass: number; // kg, default 540
  singleStageMass: number; // kg, total mass of the single-stage rocket (incl. fuel), default 19000
  singleStageFuelMass: number; // kg, default 17800
  twoStageMassEach: number; // kg, total mass of EACH of the two stages (incl. fuel), default 9500
  twoStageFuelMassEach: number; // kg, default 8900
  fuelRate: number; // kg/s, propellant mass flow, default 225
  exhaustVelocity: number; // m/s, exhaust speed relative to the rocket, default 3600
}

export interface StagedRocketVisibility {
  showSingleStage: boolean;
  showTwoStage: boolean;
}

export interface SingleStageResult {
  initialMass: number; // kg, payload + rocket
  burnoutMass: number; // kg, initialMass − fuel
  burnTime: number; // s
  maxSpeed: number; // m/s, reached exactly at burnout — free flight only decelerates afterward
}

export interface TwoStageResult {
  stageDryMass: number; // kg, each stage's structure once its own fuel is spent
  initialMass: number; // kg, payload + both stages
  massBeforeSeparation: number; // kg, initialMass − stage A's fuel
  burnTimeA: number; // s
  speedAtSeparation: number; // m/s, speed when stage A's spent casing is jettisoned
  massAfterSeparation: number; // kg, massBeforeSeparation − stageDryMass
  burnoutMassB: number; // kg, massAfterSeparation − stage B's fuel
  burnTimeB: number; // s
  maxSpeed: number; // m/s, reached at stage B's burnout
}

export interface StagedRocketState {
  singleStage: SingleStageResult;
  twoStage: TwoStageResult;
  speedGain: number; // m/s, twoStage.maxSpeed − singleStage.maxSpeed
}
