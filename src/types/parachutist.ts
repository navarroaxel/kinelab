// ---------------------------------------------------------------------------
// PD 2 — Parachutist with linear drag (/particle-dynamics/parachutist)
// ---------------------------------------------------------------------------

export interface ParachutistParams {
  mass: number; // kg, default 80
  beta: number; // N·s/m, linear drag coefficient, default 100
  initialSpeed: number; // m/s, speed at t = 0, default 20
}

export interface ParachutistVisibility {
  showParachutist: boolean; // the falling figure + trail
  showTerminalLine: boolean; // dashed v_t reference on the plot
}

export interface ParachutistState {
  terminalSpeed: number; // m/s, v_t = m·g/β — the speed v(t) approaches as t → ∞
  timeConstant: number; // s, τ = m/β — how fast the approach happens
  approachesLimit: boolean; // always true for this linear model — v(t) never grows without bound
}
