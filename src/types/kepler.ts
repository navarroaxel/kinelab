// ---------------------------------------------------------------------------
// Kepler / orbital mechanics simulator (/kepler)
// ---------------------------------------------------------------------------

export interface KeplerParams {
  dvA: number; // Δv at A, km/s, default 1.046
  dvB: number; // Δv at B (speed reduction), km/s, default 0.022
  dvC: number; // Δv at C, km/s, default 0.660
  animSpeed: number; // simulation seconds per wall second, default 5000
}

export interface KeplerVisibility {
  showVelocity: boolean; // velocity arrow on spacecraft
  showOrbits: boolean; // faint orbit ellipses
  showAreaSweep: boolean; // swept area (Kepler 2nd law)
  showTrace: boolean; // spacecraft trail
}

export interface KeplerMetrics {
  phase: number; // 0 = circular, 1 = orbit1, 2 = orbit2, 3 = escape
  altitudeKm: number; // altitude above Mars surface (km)
  speedKms: number; // current orbital speed (km/s)
  vFinalKms: number; // final speed after C burn (km/s)
  orbit1THr: number; // transfer orbit 1 period (hours)
  orbit2THr: number; // transfer orbit 2 period (hours)
  h1Kms: number; // specific angular momentum h₁ (km²/s)
  h2Kms: number; // specific angular momentum h₂ (km²/s)
}
