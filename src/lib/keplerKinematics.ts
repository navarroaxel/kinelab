// Pure orbital mechanics — no React, no DOM
// Units: km (distance), km/s (velocity), s (time)

export const MU_MARS = 42_999.27; // GM of Mars, km³/s²  [v_c² × r_A = 2.771² × 5600]
export const R_MARS = 3_400; // Mars surface radius, km

// Default mission: exercise 12 — Mars return vehicle
export const R_A = 5_600; // km  (altitude 2 200 km + R_MARS)
export const R_B = 103_400; // km  (altitude 100 000 km + R_MARS)
export const R_C = 4_400; // km  (altitude 1 000 km + R_MARS)

export const DEFAULT_DV_A = 1.046; // km/s
export const DEFAULT_DV_B = 0.022; // km/s  (= 22.0 m/s)
export const DEFAULT_DV_C = 0.66; // km/s  (= 660 m/s)

export interface OrbitData {
  a: number; // semi-major axis (km); negative for hyperbola
  e: number; // eccentricity
  b: number; // semi-minor axis (km); for hyperbola: semi-conjugate axis
  h: number; // specific angular momentum (km²/s)
  T: number; // orbital period (s); 0 for hyperbola
  p: number; // semi-latus rectum = a(1 − e²); positive for all conics
}

export interface MissionData {
  vCirc: number; // speed on initial circular orbit (km/s)
  orbit0: OrbitData; // circular orbit at r_A
  vAplus: number; // speed after burn at A (km/s)
  orbit1: OrbitData; // transfer ellipse: periapsis r_A, apoapsis r_B
  vB1: number; // speed at B on orbit 1 (km/s)
  vB2: number; // speed at B entering orbit 2 (km/s)
  orbit2: OrbitData; // transfer ellipse: periapsis r_C, apoapsis r_B
  vCbefore: number; // speed at C before final burn (km/s)
  vFinal: number; // speed after final burn at C (km/s)
  hyperbola: OrbitData; // escape hyperbola from C
  nuMax: number; // asymptotic true anomaly of hyperbola (rad)
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function computeEllipse(rPeri: number, rApo: number): OrbitData {
  const a = (rPeri + rApo) / 2;
  const e = rApo > rPeri ? (rApo - rPeri) / (rApo + rPeri) : 0;
  const p = a * (1 - e * e);
  const h = Math.sqrt(MU_MARS * Math.max(p, 0));
  const b = a * Math.sqrt(Math.max(0, 1 - e * e));
  const T = 2 * Math.PI * Math.sqrt((a * a * a) / MU_MARS);
  return { a, e, b, h, T, p };
}

function computeHyperbola(rPeri: number, vPeri: number): OrbitData {
  const h = rPeri * vPeri;
  const vInf2 = Math.max(vPeri * vPeri - (2 * MU_MARS) / rPeri, 0);
  const a = vInf2 > 0 ? -MU_MARS / vInf2 : -1e9; // negative
  const p = (h * h) / MU_MARS;
  const eSq = 1 - p / a; // a < 0, p > 0 → −p/a > 0 → eSq > 1
  const e = Math.sqrt(Math.max(1, eSq));
  const b = Math.abs(a) * Math.sqrt(Math.max(0, e * e - 1));
  return { a, e, b, h, T: 0, p };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Compute all mission orbital parameters from the three delta-v manoeuvres.
 * Uses angular-momentum chains (exact) for the numerical answer and ideal
 * ellipse shapes (r_p, r_a from problem statement) for visualisation.
 */
export function computeMission(
  dvA: number,
  dvB: number,
  dvC: number,
): MissionData {
  const vCirc = Math.sqrt(MU_MARS / R_A);
  const orbit0 = computeEllipse(R_A, R_A); // circular

  // Orbit 1: periapsis A, apoapsis B
  const vAplus = vCirc + dvA;
  const orbit1 = computeEllipse(R_A, R_B);
  const h1 = R_A * vAplus; // angular momentum (exact)
  const vB1 = h1 / R_B;

  // Orbit 2: periapsis C, apoapsis B
  const vB2 = Math.max(vB1 - dvB, 0);
  const orbit2 = computeEllipse(R_C, R_B);
  const h2 = R_B * vB2; // angular momentum (exact)
  const vCbefore = h2 / R_C;

  // Escape hyperbola from C
  const vFinal = vCbefore + dvC;
  const hyperbola = computeHyperbola(R_C, vFinal);
  const nuMax =
    hyperbola.e > 1 ? Math.acos(Math.max(-1, -1 / hyperbola.e)) : Math.PI * 0.9;

  return {
    vCirc,
    orbit0,
    vAplus,
    orbit1,
    vB1,
    vB2,
    orbit2,
    vCbefore,
    vFinal,
    hyperbola,
    nuMax,
  };
}

/** World position (km) at true anomaly ν. Periapsis is always on the +x axis. */
export function orbitPosition(
  orbit: OrbitData,
  nu: number,
): { x: number; y: number } {
  const r = orbit.p / (1 + orbit.e * Math.cos(nu));
  return { x: r * Math.cos(nu), y: r * Math.sin(nu) };
}

/** Orbital radius (km) at true anomaly ν. */
export function orbitRadius(orbit: OrbitData, nu: number): number {
  return orbit.p / (1 + orbit.e * Math.cos(nu));
}

/** Speed (km/s) at radius r via vis-viva: v² = μ(2/r − 1/a). */
export function orbitSpeed(orbit: OrbitData, r: number): number {
  return Math.sqrt(Math.max(0, MU_MARS * (2 / r - 1 / orbit.a)));
}

/** Rate of change of true anomaly (rad/s) — implements Kepler's 2nd law. */
export function nuDot(orbit: OrbitData, r: number): number {
  return orbit.h / (r * r);
}

/** Velocity vector (km/s) in world coords at true anomaly ν. */
export function orbitVelocity(
  orbit: OrbitData,
  nu: number,
): { vx: number; vy: number } {
  const mh = MU_MARS / orbit.h;
  return { vx: -mh * Math.sin(nu), vy: mh * (orbit.e + Math.cos(nu)) };
}
