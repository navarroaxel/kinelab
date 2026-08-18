// ---------------------------------------------------------------------------
// Shared 3D scene primitives — used by the axonometric simulators
// (/fireman-ladder, /cam-follower).
// ---------------------------------------------------------------------------

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

/** Orbit camera for the axonometric view — azimuth and elevation, in radians. */
export interface Camera3D {
  az: number;
  el: number;
}
