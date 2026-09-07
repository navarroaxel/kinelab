import type {
  RotatingUnbalanceDerived,
  RotatingUnbalanceParams,
} from "@/types/simulator";
import { unbalanceMagnification } from "@/lib/vibrationTransmissibility";

// ---------------------------------------------------------------------------
// A motor of mass M sits on springCount identical springs and shakes because
// its own rotor carries an unbalance m at radius e. Unlike a constant-force
// drive, the exciting force itself grows with speed — F₀ = m·e·ω² — so the
// response is the *unbalance* magnification factor r²/D rather than the
// plain 1/D magnification, and it starts at zero (not 1) and flattens to the
// asymptote m·e/M as r → ∞.
// ---------------------------------------------------------------------------

export function computeDerived(
  params: RotatingUnbalanceParams,
): RotatingUnbalanceDerived {
  const {
    motorMass: M,
    springCount,
    springStiffness,
    unbalanceMass: m,
    eccentricity: e,
    rpm,
    dampingRatio: zeta,
  } = params;

  if (
    M <= 0 ||
    springCount <= 0 ||
    springStiffness <= 0 ||
    m <= 0 ||
    e <= 0 ||
    rpm < 0 ||
    zeta < 0
  ) {
    throw new RangeError(
      "motorMass, springCount, springStiffness, unbalanceMass, and eccentricity must be positive, and rpm/dampingRatio must be non-negative",
    );
  }

  const stiffness = springCount * springStiffness;
  const naturalFrequency = Math.sqrt(stiffness / M);
  const omega = (rpm * 2 * Math.PI) / 60;
  const frequencyRatio = omega / naturalFrequency;

  const forceAmplitude = m * e * omega * omega;
  const staticEquivalent = forceAmplitude / stiffness;
  const asymptote = (m * e) / M;

  const amplitude = asymptote * unbalanceMagnification(frequencyRatio, zeta);
  const phase = Math.atan2(
    2 * zeta * frequencyRatio,
    1 - frequencyRatio * frequencyRatio,
  );

  // The unbalance-response curve r²/D only has an interior maximum while
  // ζ < 1/√2; beyond that it climbs monotonically to the asymptote instead.
  const hasPeak = zeta < Math.SQRT1_2;
  const peakR = hasPeak ? 1 / Math.sqrt(1 - 2 * zeta * zeta) : null;
  const peakValue =
    peakR !== null ? asymptote * unbalanceMagnification(peakR, zeta) : null;

  const nearResonance = Math.abs(frequencyRatio - 1) < 0.1;

  return {
    stiffness,
    naturalFrequency,
    omega,
    frequencyRatio,
    forceAmplitude,
    staticEquivalent,
    asymptote,
    amplitude,
    phase,
    peakR,
    peakValue,
    nearResonance,
  };
}

/** Steady-state motor displacement x(t), lagging the unbalance by φ. */
export function displacementAt(
  t: number,
  derived: RotatingUnbalanceDerived,
): number {
  return derived.amplitude * Math.sin(derived.omega * t - derived.phase);
}

/** The rotor's own angle ω·t, mod 2π — independent of r or ζ. */
export function rotorAngleAt(
  t: number,
  derived: RotatingUnbalanceDerived,
): number {
  const twoPi = 2 * Math.PI;
  return (derived.omega * t) % twoPi;
}
