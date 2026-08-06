// ---------------------------------------------------------------------------
// CPM 8 — Radar-tracked aircraft (/particle-kinematics/radar-tracking)
// ---------------------------------------------------------------------------

export interface RadarTrackingParams {
  v0: number; // aircraft speed at the lowest point, m/s, default 150
  at: number; // constant tangential acceleration, m/s², default 25
  rhoTraj: number; // trajectory's radius of curvature at the bottom, m, default 2000
  radarX: number; // radar position relative to the trajectory's lowest point, m
  radarY: number; // (draggable on the canvas), default (-800, -600)
}

export interface RadarTrackingVisibility {
  showVelocity: boolean; // v decomposed onto ê_r / ê_θ
  showAcceleration: boolean; // a decomposed onto ê_r / ê_θ
  showRadarLine: boolean; // r segment + θ dimension
  showTrace: boolean; // aircraft trail
}

export interface RadarTrackingState {
  t: number;
  phi: number; // arc angle swept from the trajectory's lowest point
  x: number; // aircraft position relative to the radar
  y: number;
  r: number; // |aircraft − radar|
  thetaDeg: number;
  rDot: number; // ṙ
  rThetaDot: number; // r·θ̇ (transverse velocity component)
  thetaDot: number; // θ̇
  rDDot: number; // r̈
  thetaDDot: number; // θ̈
}
