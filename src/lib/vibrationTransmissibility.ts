// ---------------------------------------------------------------------------
// Shared closed-form response functions for a damped SDOF system, in terms
// of the frequency ratio r = ω/ωn and the damping ratio ζ = c/(2√(km)):
//
//   magnification(r, ζ)          = 1/√[(1−r²)² + (2ζr)²]
//   unbalanceMagnification(r, ζ) = r²·magnification(r, ζ)
//   transmissibility(r, ζ)       = √[1+(2ζr)²]·magnification(r, ζ)
//
// `magnification` is the response to a *constant-amplitude* force or base
// motion (Hibbeler-style forced vibration, MV 4's moving support). It starts
// at 1 (a slow, quasi-static push) and blows up at r = 1 with no damping.
//
// `unbalanceMagnification` is the response to a rotating unbalance, where the
// exciting force itself grows as ω² (F₀ = m·e·ω²): it starts at 0 and
// flattens to the asymptote 1 as r → ∞ (MV 1).
//
// `transmissibility` is both the displacement transmissibility (base
// excitation, MV 2/4) and the force transmissibility (isolation, MV 3) — the
// two coincide for a SDOF system. It is 1 at r = 0, passes through the fixed
// point (√2, 1) for every ζ, and only isolates (T < 1) beyond r = √2.
// ---------------------------------------------------------------------------

export const dampingRatioFrom = (c: number, k: number, m: number): number =>
  c / (2 * Math.sqrt(k * m));

/** 1/√[(1−r²)² + (2ζr)²] — force/base-excitation magnification factor. */
export function magnification(r: number, zeta: number): number {
  const detuning = 1 - r * r;
  const dissipation = 2 * zeta * r;
  const denominator = Math.sqrt(
    detuning * detuning + dissipation * dissipation,
  );
  return denominator === 0 ? Infinity : 1 / denominator;
}

/** r²·magnification(r, ζ) — rotating-unbalance response, normalised by m·e/M. */
export function unbalanceMagnification(r: number, zeta: number): number {
  return r * r * magnification(r, zeta);
}

/** √[1+(2ζr)²]·magnification(r, ζ) — displacement AND force transmissibility. */
export function transmissibility(r: number, zeta: number): number {
  const dissipation = 2 * zeta * r;
  return Math.sqrt(1 + dissipation * dissipation) * magnification(r, zeta);
}

/**
 * The peak of `transmissibility` and the r at which it occurs, for markers.
 * Found by setting d(T²)/d(r²) = 0, which reduces to the quadratic
 * 2ζ²u² + u − 1 = 0 in u = r²; the positive root, rationalised to avoid
 * cancellation as ζ → 0 (where the naive (−1+√(1+8ζ²))/(4ζ²) subtracts two
 * nearly-equal terms), is u_peak = 2/(1+√(1+8ζ²)) — which also folds the
 * ζ = 0 case in cleanly, giving u_peak = 1.
 */
export function transmissibilityPeak(zeta: number): {
  r: number;
  value: number;
} {
  const u = 2 / (1 + Math.sqrt(1 + 8 * zeta * zeta));
  const r = Math.sqrt(u);
  return { r, value: transmissibility(r, zeta) };
}
