// ---------------------------------------------------------------------------
// PK 5 — Motion graph builder (/particle-kinematics/motion-graphs)
// ---------------------------------------------------------------------------

export interface MotionVertex {
  t: number; // time (s), strictly increasing across the vertex array
  v: number; // velocity at this vertex (m/s)
}

export interface MotionGraphsParams {
  vertices: MotionVertex[]; // defines the piecewise-linear v(t); x₀ = 0
  snapToGrid: boolean; // snap dragged vertices to a 5 s / 10 m/s grid
}

export interface MotionGraphsVisibility {
  showAcceleration: boolean; // a(t) panel
  showPosition: boolean; // x(t) panel
  showMarkers: boolean; // zero-crossing (extrema of x) markers
}

export interface MotionGraphsState {
  t: number; // scrub time (s)
  v: number; // v(t) at the scrub time
  a: number; // a(t) at the scrub time (piecewise constant)
  x: number; // x(t) at the scrub time
  xFinal: number; // x at the last vertex
}
