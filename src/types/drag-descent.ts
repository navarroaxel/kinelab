// ---------------------------------------------------------------------------
// CPM 1 — Cyclist with air drag simulator (/particle-kinematics/drag-descent)
// ---------------------------------------------------------------------------

export interface DragDescentParams {
  A: number; // constant driving acceleration term, m/s², range [0.02, 0.4], default 0.122
  B: number; // quadratic drag coefficient, 1/m, range [0.0001, 0.005], default 0.0007
  tMax: number; // animation horizon, s, range [60, 600]
}

export interface DragDescentVisibility {
  showVelocityArrow: boolean; // velocity arrow, grows toward the v_max asymptote
  showDragArrow: boolean; // drag arrow, grows as v²
  showTrace: boolean; // cyclist path trail
}

export interface DragDescentState {
  t: number; // elapsed time (s)
  v: number; // instantaneous speed (m/s)
  x: number; // distance travelled (m)
  a: number; // instantaneous acceleration = A − B·v² (m/s²)
  vOverVmaxPct: number; // v / v_max as a percentage
}
