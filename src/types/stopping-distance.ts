// ---------------------------------------------------------------------------
// PK 2 — Stopping distance simulator (/particle-kinematics/stopping-distance)
// ---------------------------------------------------------------------------

export interface StoppingDistanceParams {
  speedsKmh: [number, number, number]; // three configurable launch speeds, km/h, default [40, 80, 100]
  reactionTime: number; // s, range [0, 2.5], default 0.7
  decelFactor: number; // braking deceleration as a multiple of g, range [0.2, 1.0], default 0.5
  obstacleDistance: number; // m — cases with D > this are flagged
}

export interface StoppingDistanceVisibility {
  showObstacleMarker: boolean; // dashed obstacle line + red flag on failing cases
  showTrace: boolean; // car path trail
}

export interface StoppingDistanceCase {
  speedKmh: number;
  v0: number; // m/s
  a: number; // braking deceleration magnitude, m/s²
  d1: number; // reaction-phase distance (rectangle)
  tf: number; // braking-phase duration
  d2: number; // braking-phase distance (triangle)
  D: number; // total stopping distance = d1 + d2
  tTotal: number; // reactionTime + tf
  exceedsObstacle: boolean; // D > obstacleDistance
}

export interface StoppingDistanceState {
  cases: StoppingDistanceCase[];
  t: number; // shared elapsed animation time (s)
}
