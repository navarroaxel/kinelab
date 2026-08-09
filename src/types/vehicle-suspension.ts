// ---------------------------------------------------------------------------
// Vehicle suspension base-excitation simulator (/vehicle-suspension)
// ---------------------------------------------------------------------------

export interface VehicleSuspensionParams {
  vehicleMass: number; // kg, mass on the suspension (excludes wheels), default 1000
  springCount: number; // number of identical springs, default 4
  staticDeflection: number; // m, deflection of each spring under the vehicle's weight, default 0.09
  damperCount: number; // number of identical dampers, default 4
  dampingPerDamper: number; // N·s/m, coefficient of each damper, default 6860 (68.6 N·s/cm)
  excitationAmplitude: number; // m, test-platform amplitude, default 0.03
  frequencyRatio: number; // r = ω/ωn, excitation-to-natural frequency ratio, default 1
}

export interface VehicleSuspensionDerived {
  springStiffness: number; // N/m, k per spring
  equivalentStiffness: number; // N/m, k_eq = springCount·k
  equivalentDamping: number; // N·s/m, c_eq = damperCount·c
  naturalFrequency: number; // rad/s, ωn = √(k_eq/m)
  dampingRatio: number; // ζ = c_eq / (2√(k_eq·m))
  excitationFrequency: number; // rad/s, ω = r·ωn
  transmissibility: number; // TR = X0/Y0
  responseAmplitude: number; // m, X0 = TR·Y0
  basePhase: number; // rad, ψ — phase of the base-motion forcing term
  responsePhase: number; // rad, φ — phase of the response relative to that forcing
  phaseLag: number; // rad, δ = φ − ψ, lag of the body behind the platform
}

export interface VehicleSuspensionState extends VehicleSuspensionDerived {
  t: number; // s, elapsed simulation time
  y: number; // m, platform (base) displacement at time t
  x: number; // m, vehicle CG displacement at time t
}
