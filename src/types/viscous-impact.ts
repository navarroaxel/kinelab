// ---------------------------------------------------------------------------
// PD 1 — Bullet through a viscous plate (/particle-dynamics/viscous-impact)
// ---------------------------------------------------------------------------

export interface ViscousImpactParams {
  bulletMass: number; // kg, default 0.014 (14 g)
  entrySpeed: number; // m/s, speed just before the plate, default 500
  exitSpeed: number; // m/s, speed just after the plate, default 200
  plateThickness: number; // m, default 0.025 (25 mm)
}

export interface ViscousImpactVisibility {
  showBullet: boolean; // the moving bullet + plate/block
  showVelocityCurve: boolean; // dashed v(x) reference curve
}

export interface ViscousImpactState {
  decelRate: number; // 1/s, dv/dx = -decelRate (constant, from F = -kv)
  dragConstant: number; // N·s/m, k = bulletMass · decelRate
  penetrationDepth: number; // m, how far the bullet gets into a thick block, v(x) = 0
  valid: boolean; // entrySpeed > exitSpeed — otherwise there's no deceleration to solve for
}
