// ---------------------------------------------------------------------------
// PD 10 — Vehicle resistance and power (/particle-dynamics/vehicle-power)
// ---------------------------------------------------------------------------

export interface VehiclePowerParams {
  vehicleMass: number; // kg, default 1600
  calibSpeed1Kmh: number; // km/h, first calibration point, default 50
  calibPower1: number; // kW, power delivered to the wheels at calibSpeed1, default 6
  calibSpeed2Kmh: number; // km/h, second calibration point, default 60
  calibPower2: number; // kW, power delivered to the wheels at calibSpeed2, default 10
  targetSpeedKmh: number; // km/h, speed to predict flat-road power at, default 90
  slopeSpeedKmh: number; // km/h, speed to predict graded-road power at, default 60
  gradeDeg: number; // deg, road grade for the slope prediction, default 5
}

export interface VehiclePowerVisibility {
  showForces: boolean; // drag/rolling-resistance and drive-force arrows
  showGradeForce: boolean; // weight component along the slope
}

export interface VehiclePowerState {
  a: number; // N, fitted rolling-resistance coefficient (constant term)
  b: number; // N·s²/m², fitted aerodynamic-drag coefficient (quadratic term)
  targetPowerFlat: number; // W, power at targetSpeedKmh on a flat road
  targetPowerSlope: number; // W, power at slopeSpeedKmh on a gradeDeg incline
  gradeForce: number; // N, weight component along the slope (mg·sinθ)
  invalidCalibration: boolean; // calibSpeed1Kmh ≈ calibSpeed2Kmh — the 2×2 fit is singular, a/b above are meaningless
}
