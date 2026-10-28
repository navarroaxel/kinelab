import { add, cross, scale, vec } from "@/lib/vec3";
import type { Vec3 } from "@/types/simulator";

// ---------------------------------------------------------------------------
// Composing a chain of nested, constant-rate rotations into a resultant
// angular velocity Ω and its time derivative γ = Ω̇.
//
// Each stage i rotates at a constant scalar rate about an axis that is fixed
// in the frame produced by the stages before it — so stage i's axis is itself
// carried around by the combined angular velocity of every earlier stage,
// Ω_{i-1} = Σ_{j<i} rate_j·axis_j. That is the only reason γ is ever
// non-zero: a lone rotation about a fixed axis has γ = 0, but a rotation
// whose axis is dragged around by an outer one picks up ė = Ω_{i-1} × axis.
//
// Ω = Σ rate_i·axis_i
// γ = Σ rate_i·ė_i = Σ rate_i·(Ω_{i-1} × axis_i)
//
// This is the fireman's ladder's Ω = ω₂x̂ + ω₁ẑ, γ = ω₁ω₂ŷ generalised to any
// number of stages — the same rule drives the cube's four simultaneous
// rotations (RB 2) and the disc-on-arm's three (RB 10).
// ---------------------------------------------------------------------------

export interface RotationStage {
  /** Unit axis this stage rotates about, expressed in the frame carried by every earlier stage. */
  axis: Vec3;
  /** Signed scalar angular rate about that axis (constant). */
  rate: number;
}

export interface ComposedRotation {
  omega: Vec3;
  gamma: Vec3;
}

export function composeRotations(stages: RotationStage[]): ComposedRotation {
  let omega = vec(0, 0, 0);
  let gamma = vec(0, 0, 0);
  let omegaPrior = vec(0, 0, 0);

  for (const stage of stages) {
    gamma = add(gamma, scale(cross(omegaPrior, stage.axis), stage.rate));
    omega = add(omega, scale(stage.axis, stage.rate));
    omegaPrior = add(omegaPrior, scale(stage.axis, stage.rate));
  }

  return { omega, gamma };
}
