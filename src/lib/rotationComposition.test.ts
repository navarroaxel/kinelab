import { describe, expect, it } from "vitest";
import { vec } from "@/lib/vec3";
import { composeRotations } from "./rotationComposition";

describe("composeRotations", () => {
  it("returns zero for no stages", () => {
    const { omega, gamma } = composeRotations([]);
    expect(omega).toEqual(vec(0, 0, 0));
    expect(gamma).toEqual(vec(0, 0, 0));
  });

  it("a single rotation about a fixed axis has zero γ", () => {
    const { omega, gamma } = composeRotations([
      { axis: vec(0, 0, 1), rate: 3 },
    ]);
    expect(omega).toEqual(vec(0, 0, 3));
    expect(gamma).toEqual(vec(0, 0, 0));
  });

  it("matches the fireman's ladder's Ω = ω₂x̂ + ω₁ẑ, γ = ω₁ω₂ŷ (CCR N°14)", () => {
    const omega1 = 0.8;
    const omega2 = 0.5;
    const { omega, gamma } = composeRotations([
      { axis: vec(0, 0, 1), rate: omega1 },
      { axis: vec(1, 0, 0), rate: omega2 },
    ]);
    expect(omega.x).toBeCloseTo(omega2, 10);
    expect(omega.y).toBeCloseTo(0, 10);
    expect(omega.z).toBeCloseTo(omega1, 10);
    expect(gamma.x).toBeCloseTo(0, 10);
    expect(gamma.y).toBeCloseTo(omega1 * omega2, 10);
    expect(gamma.z).toBeCloseTo(0, 10);
  });

  it("stacks more than two stages, each carried by everything before it", () => {
    // Three rotations about mutually orthogonal axes, each fixed in the
    // frame produced by the ones before it: ẑ (outer), then x̂ (carried by
    // ẑ), then ŷ (carried by both). Worked by hand:
    //   Ω₀ = 0
    //   stage ẑ, rate 2: Ω = (0,0,2)
    //   stage x̂, rate 3: γ += 3·(Ω₀×x̂) = 3·(0,2,0) = (0,6,0); Ω = (3,0,2)
    //   stage ŷ, rate 5: γ += 5·(Ω₁×ŷ) = 5·(-2,0,3) = (-10,0,15); Ω = (3,5,2)
    const { omega, gamma } = composeRotations([
      { axis: vec(0, 0, 1), rate: 2 },
      { axis: vec(1, 0, 0), rate: 3 },
      { axis: vec(0, 1, 0), rate: 5 },
    ]);
    expect(omega).toEqual(vec(3, 5, 2));
    expect(gamma).toEqual(vec(-10, 6, 15));
  });
});
