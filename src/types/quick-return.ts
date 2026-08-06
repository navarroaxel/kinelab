// ---------------------------------------------------------------------------
// Quick-return mechanism simulator (/quick-return)
// ---------------------------------------------------------------------------

export interface QuickReturnParams {
  omega: number; // crank angular velocity (rad/s); constant
  r: number; // crank length AB (world units)
  L1: number; // vertical distance O → horizontal slot (world units)
  L2: number; // vertical distance O → crank center A (world units); must be > r
}

export interface QuickReturnVisibility {
  showVelocity: boolean; // velocity arrow at P
  showAcceleration: boolean; // acceleration arrow at P
  showTrace: boolean; // tool position trace
  showGuides: boolean; // dashed crank circle and slot guides
}

export interface QuickReturnState {
  phi: number; // crank angle (rad), measured from downward vertical at A
  xO: number;
  yO: number; // fixed pivot O = (0, 0)
  xA: number;
  yA: number; // crank center A = (0, L2)
  xB: number;
  yB: number; // crank pin B
  xP: number;
  yP: number; // tool slider P on the horizontal slot
  xD: number;
  yD: number; // reference point D = (0, L1)
  xQ: number;
  yQ: number; // far end of bar OQ (extended beyond P for drawing)
  x: number; // tool position along slot (= xP)
  v: number; // tool velocity dx/dt
  a: number; // tool acceleration d²x/dt²
}
