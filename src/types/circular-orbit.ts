// ---------------------------------------------------------------------------
// CPM 9 — Satellite in circular orbit (/particle-kinematics/circular-orbit)
// ---------------------------------------------------------------------------

export interface CircularOrbitParams {
  vKmh: number; // orbital speed, km/h, range [15000, 40000], default 24000
  R: number; // planet radius, km, default 6372 (Earth)
  g: number; // surface gravity, m/s², default 9.806
}

export interface CircularOrbitVisibility {
  showVelocity: boolean; // tangent velocity vector
  showNormalAccel: boolean; // centripetal acceleration vector, points at the centre
  showDimensions: boolean; // r and h dimension lines
  showTrace: boolean; // orbit trail (redundant with the orbit circle, but shows progress)
}

export interface CircularOrbitState {
  v: number; // orbital speed, m/s
  r: number; // orbital radius, km
  h: number; // altitude above the surface, km
  T: number; // orbital period, s
  aN: number; // normal (centripetal) acceleration, m/s²
  hitsSurface: boolean; // r ≤ R — the requested speed can't sustain an orbit above the surface
}
