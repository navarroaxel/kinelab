// ---------------------------------------------------------------------------
// Core — Cam and roller follower (/cam-follower)
// Hibbeler 13-91 — rod AB riding on a smooth contoured cam
// ---------------------------------------------------------------------------

export interface CamFollowerParams {
  mass: number; // kg, rod AB, default 2
  radius: number; // m, cam radius at the contact point, default 0.1
  amplitude: number; // m, cam profile amplitude z = amplitude·sin θ, default 0.02
  thetaDot: number; // rad/s, cam angular velocity, default 5
  gravity: number; // m/s², default 9.81
}

export interface CamFollowerVisibility {
  showForces: boolean; // N and W arrows on the rod
  showProfile: boolean; // the unrolled cam profile ring
  showSlope: boolean; // local surface tangent and the true normal direction
  showAxes: boolean; // vertical axis + θ̇ arc
  showFrame: boolean; // bearing C and the rod's upper end B
}

/** Instantaneous state of the follower at cam angle θ. */
export interface CamFollowerState {
  theta: number; // rad, cam angle
  z: number; // m, follower height
  zDot: number; // m/s
  zDDot: number; // m/s²
  normalVertical: number; // N, vertical component of the cam force on the roller
  slope: number; // rad, local inclination of the cam surface
  normalMagnitude: number; // N, true magnitude of the (surface-normal) cam force
  contactLost: boolean; // the cam can only push — true once the vertical force would go negative
}

export interface CamFollowerExtremes {
  verticalMax: number; // N
  verticalMin: number; // N
  verticalMaxTheta: number; // rad
  verticalMinTheta: number; // rad
  normalMax: number; // N
  normalMin: number; // N
  normalMaxTheta: number; // rad
  normalMinTheta: number; // rad
}
