// ---------------------------------------------------------------------------
// Core — Block on a parabolic path with a horizontal spring (/parabolic-spring)
// Hibbeler 13-74
// ---------------------------------------------------------------------------

export interface ParabolicSpringParams {
  mass: number; // kg, the block, default 6
  stiffness: number; // N/m, spring constant k, default 10
  naturalLength: number; // m, unstretched spring length, default 0.5
  vertex: number; // m, the a in y = a − b·x², default 2
  curvatureCoeff: number; // m⁻¹, the b in y = a − b·x², default 0.5
  gravity: number; // m/s², default 9.81
  startX: number; // m, x at t = 0 — the statement instant, default 1
  startSpeed: number; // m/s, speed at t = 0, default 4
}

export interface ParabolicSpringVisibility {
  showWeight: boolean;
  showSpringForce: boolean;
  showNormal: boolean;
  showTangential: boolean; // the resultant along the path, m·v̇
  showFrame: boolean; // the t̂ / n̂ unit vectors at the block
  showCurvature: boolean; // the osculating circle and its centre
  showSpring: boolean; // the spring, its anchor B and the roller guide
}

/** The block's state at one point of the path. */
export interface ParabolicSpringState {
  x: number; // m
  y: number; // m
  speed: number; // m/s, signed — positive means moving in +x (descending)
  slope: number; // dy/dx
  inclineDeg: number; // deg, path inclination below the horizontal
  radiusOfCurvature: number; // m
  springStretch: number; // m, positive when stretched
  springForce: number; // N, magnitude; pulls toward B when stretched
  normal: number; // N, path on block — negative means contact would be lost
  tangentialAccel: number; // m/s², the rate of increase of speed
  centripetal: number; // N, m·v²/ρ
  contactLost: boolean;
  reachedEnd: boolean; // the path has reached the ground, y = 0
}
