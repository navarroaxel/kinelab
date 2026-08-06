// ---------------------------------------------------------------------------
// Pin-in-circular-slot simulator (/particle-kinematics/pin-slot)
// ---------------------------------------------------------------------------

export interface PinSlotParams {
  r: number; // slot radius (world units)
  d: number; // O-A center distance (world units); must satisfy d > r
  v0: number; // pin speed on slot (world units/s), constant
}

export interface PinSlotVisibility {
  showV0: boolean; // tangent velocity vector at B
  showVr: boolean; // radial component along bar
  showVPerp: boolean; // transverse component perpendicular to bar
  showAngles: boolean; // Phi (at A) and theta (at O) arcs
  showRho: boolean; // dashed rho segment O→B
}

export interface PinSlotState {
  phi: number; // pin angle on slot at center A (rad)
  bx: number; // pin B world X
  by: number; // pin B world Y
  rho: number; // |OB|
  theta: number; // bar OC angle (rad)
  vr: number; // radial velocity component along bar
  vPerp: number; // transverse velocity component
  omega: number; // bar angular velocity (rad/s)
  gamma: number; // bar angular acceleration (rad/s²)
  singular: boolean; // true when ρ ≈ 0 (only reachable when d = r, at Φ = π) — vr/omega/vPerp/gamma are frozen at 0 rather than NaN/Infinity that frame
}
