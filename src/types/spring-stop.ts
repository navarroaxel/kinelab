// ---------------------------------------------------------------------------
// PD 8 — Spring-stopped package on an incline (/particle-dynamics/spring-stop)
// ---------------------------------------------------------------------------

export interface SpringStopParams {
  packageMass: number; // kg, default 70
  inclineAngle: number; // deg, default 20
  frictionCoefficient: number; // μ, dynamic friction between package and incline, default 0.20
  distanceToSpring: number; // m, "10 m from the spring", default 10
  speedAtDistance: number; // m/s, package speed at distanceToSpring, default 6
  springConstant: number; // N/m, default 29430 (30 kgf/cm)
  precompression: number; // m, spring's initial compression before contact, default 0.10
}

export interface SpringStopVisibility {
  showPackage: boolean; // the sliding package + spring
  showEnergyBar: boolean; // KE / work-done stacked bar
}

export interface SpringStopState {
  springForceAtPrecompression: number; // N, F0 = k·precompression
  additionalDeformation: number; // m, δ — how much further the spring compresses
  maxSpringForce: number; // N, F0 + k·δ, the peak force on the package
  valid: boolean; // the quadratic has a physically sensible positive root
}
