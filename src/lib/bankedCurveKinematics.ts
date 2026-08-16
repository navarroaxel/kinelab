import type {
  BankedCurveLimits,
  BankedCurveParams,
  BankedCurveState,
} from "@/types/simulator";

// ---------------------------------------------------------------------------
// Hibbeler 13-53 / 13-54 — a car rounding a banked curve at constant speed.
//
// The car travels a *horizontal* circle of radius ρ, so its acceleration is
// purely centripetal: m·v²/ρ, pointing at the centre. Two axes do the whole
// job — one horizontal toward the centre, one vertical:
//
//   N·sin θ + f·cos θ = m·v²/ρ        (horizontal, toward the centre)
//   N·cos θ − f·sin θ = m·g           (vertical, no vertical acceleration)
//
// with f measured positive *down* the slope. Solving the pair as the rotation
// it is gives the friction the road has to supply at any speed:
//
//   N = m·(g·cos θ + (v²/ρ)·sin θ)
//   f = m·((v²/ρ)·cos θ − g·sin θ)
//
// Both scale with m, so the ratio f/N — the coefficient the road must deliver
// — does not. The car's 1700 kg never enters the answer; it only sets how
// large the forces themselves are.
//
// Setting f = ±μN and solving for v gives the two limits:
//
//   v_max = √( ρ·g·(tan θ + μ) / (1 − μ·tan θ) )   friction pointing down-slope
//   v_min = √( ρ·g·(tan θ − μ) / (1 + μ·tan θ) )   friction pointing up-slope
//
// Two degenerate cases fall out of those expressions and are handled here
// rather than left to produce NaN:
//   • μ ≥ tan θ — the bank is gentle enough that friction alone holds the car
//     at rest, so there is no minimum speed.
//   • μ ≥ cot θ — the denominator of v_max vanishes: no speed is too fast.
// ---------------------------------------------------------------------------

const DEG = Math.PI / 180;

/** The speed at which the bank alone turns the car — no friction needed. */
export const idealSpeed = (
  radius: number,
  gravity: number,
  bankDeg: number,
): number => Math.sqrt(radius * gravity * Math.tan(bankDeg * DEG));

export function bankedCurveLimits(
  params: Pick<
    BankedCurveParams,
    "radius" | "gravity" | "bankDeg" | "mu"
  >,
): BankedCurveLimits {
  const { radius, gravity, bankDeg, mu } = params;
  const tan = Math.tan(bankDeg * DEG);
  const rg = radius * gravity;

  const maxDenominator = 1 - mu * tan;
  const minNumerator = tan - mu;

  return {
    idealSpeed: idealSpeed(radius, gravity, bankDeg),
    // Friction alone holds the car at rest once μ reaches tan θ.
    minSpeed:
      minNumerator <= 0 ? 0 : Math.sqrt((rg * minNumerator) / (1 + mu * tan)),
    // Past μ = cot θ the road can hold any speed at all.
    maxSpeed:
      maxDenominator <= 0
        ? null
        : Math.sqrt((rg * (tan + mu)) / maxDenominator),
  };
}

export function computeBankedCurveState(
  params: BankedCurveParams,
  azimuth = 0,
): BankedCurveState {
  const { mass, bankDeg, radius, mu, gravity, speed } = params;
  const theta = bankDeg * DEG;
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);
  const centripetal = (speed * speed) / Math.max(radius, 1e-9);

  const normal = mass * (gravity * cos + centripetal * sin);
  const friction = mass * (centripetal * cos - gravity * sin);
  const muRequired = Math.abs(friction) / Math.max(normal, 1e-9);

  return {
    speed,
    normal,
    friction,
    muRequired,
    netForce: mass * centripetal,
    slipping: muRequired > mu + 1e-12,
    // f > 0 means the road must push the car *down* the slope to keep it on
    // the circle — i.e. left alone it would climb, so it slips uphill.
    slipsUphill: friction > 0,
    azimuth,
  };
}

/**
 * The friction coefficient the road must supply at speed `v`, signed the same
 * way as `friction` above. Independent of the mass, which is what makes it the
 * right thing to plot: the safe band is simply |μ_req| ≤ μ.
 */
export function requiredMu(
  speed: number,
  params: Pick<BankedCurveParams, "radius" | "gravity" | "bankDeg">,
): number {
  const theta = params.bankDeg * DEG;
  const centripetal = (speed * speed) / Math.max(params.radius, 1e-9);
  return (
    (centripetal * Math.cos(theta) - params.gravity * Math.sin(theta)) /
    (centripetal * Math.sin(theta) + params.gravity * Math.cos(theta))
  );
}

export const msToKmh = (v: number): number => v * 3.6;
