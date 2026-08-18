import { describe, expect, it } from "vitest";

import {
  appliedForce,
  computeProperties,
  computeState,
  magnificationAt,
  responseSamples,
  rk4Step,
} from "./forcedVibrationKinematics";
import type { ForcedVibrationParams } from "@/types/simulator";

// The statement: m = 10 kg, k = 100 kN/m, c = 500 N·s/m, F = 1000·cos(120t) N.
const STATEMENT: ForcedVibrationParams = {
  mass: 10,
  stiffness: 100000,
  damping: 500,
  forceAmplitude: 1000,
  forcingOmega: 120,
  initialDisplacement: 0,
  initialVelocity: 0,
  forceEnabled: true,
  slowMotion: 0.05,
};

const UNDAMPED = { ...STATEMENT, damping: 0 };

describe("system properties", () => {
  const p = computeProperties(STATEMENT);

  it("has ωn = 100 rad/s", () => {
    expect(p.naturalOmega).toBeCloseTo(100, 12);
    expect(p.naturalHz).toBeCloseTo(15.915, 3);
  });

  it("puts critical damping at 2000 N·s/m, so ζ = 0.25", () => {
    expect(p.criticalDamping).toBeCloseTo(2000, 12);
    expect(p.dampingRatio).toBeCloseTo(0.25, 12);
    expect(p.regime).toBe("underdamped");
  });

  it("is driven above resonance, r = 1.2", () => {
    expect(p.frequencyRatio).toBeCloseTo(1.2, 12);
  });

  it("has a static deflection of 10 mm", () => {
    expect(p.staticDeflection).toBeCloseTo(0.01, 12);
  });
});

describe("the answers", () => {
  it("gives a steady amplitude of 13.44 mm with c = 500", () => {
    const p = computeProperties(STATEMENT);
    // 1/√[(1−1.44)² + (2·0.25·1.2)²] = 1/√0.5536
    expect(p.magnification).toBeCloseTo(1 / Math.sqrt(0.5536), 9);
    expect(p.steadyAmplitude).toBeCloseTo(0.01344, 6);
  });

  it("gives 22.73 mm with c = 0", () => {
    const p = computeProperties(UNDAMPED);
    expect(p.steadyAmplitude).toBeCloseTo(0.01 / 0.44, 9);
    expect(p.steadyAmplitude).toBeCloseTo(0.022727, 6);
    expect(p.undampedAmplitude).toBeCloseTo(p.steadyAmplitude, 12);
  });

  it("keeps the undamped amplitude larger — damping helps here", () => {
    const damped = computeProperties(STATEMENT);
    expect(damped.undampedAmplitude).toBeGreaterThan(damped.steadyAmplitude);
  });

  it("lags by 126.25°, past resonance", () => {
    const p = computeProperties(STATEMENT);
    expect((p.steadyPhase * 180) / Math.PI).toBeCloseTo(126.25, 1);
  });

  it("rings at ωd = 96.82 rad/s inside an e^(−25t) envelope", () => {
    const p = computeProperties(STATEMENT);
    expect(p.dampedOmega).toBeCloseTo(100 * Math.sqrt(0.9375), 9);
    expect(p.dampedOmega).toBeCloseTo(96.825, 3);
    expect(p.decayRate).toBeCloseTo(25, 12);
    expect(p.logDecrement).toBeCloseTo(1.6223, 4);
  });

  it("rings at ωn with no decay at all when c = 0", () => {
    const p = computeProperties(UNDAMPED);
    expect(p.dampedOmega).toBeCloseTo(p.naturalOmega, 12);
    expect(p.decayRate).toBe(0);
    expect(p.logDecrement).toBe(0);
    expect(p.regime).toBe("undamped");
  });
});

describe("magnificationAt", () => {
  it("is 1 at zero frequency — a static push", () => {
    expect(magnificationAt(0, 0.25)).toBeCloseTo(1, 12);
    expect(magnificationAt(0, 0)).toBeCloseTo(1, 12);
  });

  it("blows up at resonance without damping, and is 1/(2ζ) with it", () => {
    expect(magnificationAt(1, 0)).toBe(Infinity);
    expect(magnificationAt(1, 0.25)).toBeCloseTo(2, 9);
  });

  it("dies away well above resonance, whatever the damping", () => {
    expect(magnificationAt(5, 0)).toBeLessThan(0.05);
    expect(magnificationAt(5, 0.25)).toBeLessThan(0.1);
  });

  it("peaks slightly below r = 1 for light damping", () => {
    // The peak sits at r = √(1−2ζ²) = 0.9354 for ζ = 0.25.
    const peak = Math.sqrt(1 - 2 * 0.25 * 0.25);
    expect(magnificationAt(peak, 0.25)).toBeGreaterThan(
      magnificationAt(1, 0.25),
    );
    expect(peak).toBeCloseTo(0.9354, 4);
  });
});

describe("regimes", () => {
  it("names each one by the damping ratio", () => {
    expect(computeProperties({ ...STATEMENT, damping: 0 }).regime).toBe(
      "undamped",
    );
    expect(computeProperties({ ...STATEMENT, damping: 2000 }).regime).toBe(
      "critical",
    );
    expect(computeProperties({ ...STATEMENT, damping: 3000 }).regime).toBe(
      "overdamped",
    );
  });

  it("stops oscillating at or past critical damping", () => {
    expect(computeProperties({ ...STATEMENT, damping: 2000 }).dampedOmega).toBe(
      0,
    );
    expect(computeProperties({ ...STATEMENT, damping: 5000 }).dampedOmega).toBe(
      0,
    );
  });
});

describe("appliedForce", () => {
  it("follows F₀·cos(ωt) and switches off cleanly", () => {
    expect(appliedForce(0, STATEMENT)).toBeCloseTo(1000, 9);
    expect(appliedForce(Math.PI / 120, STATEMENT)).toBeCloseTo(-1000, 9);
    expect(appliedForce(0, { ...STATEMENT, forceEnabled: false })).toBe(0);
  });
});

describe("the integrated response", () => {
  it("settles onto the closed-form steady amplitude", () => {
    const p = computeProperties(STATEMENT);
    // Well past 4/decayRate = 0.16 s the transient is gone.
    const samples = responseSamples(STATEMENT, 1.2, 4000);
    const tail = samples.filter(([t]) => t > 0.6).map(([, x]) => Math.abs(x));
    expect(Math.max(...tail)).toBeCloseTo(p.steadyAmplitude, 4);
  });

  it("reaches the larger amplitude with the damper removed", () => {
    const p = computeProperties(UNDAMPED);
    // No transient at all if it starts on the steady state.
    const started = {
      ...UNDAMPED,
      initialDisplacement: -p.steadyAmplitude,
      initialVelocity: 0,
    };
    const samples = responseSamples(started, 0.5, 4000);
    const peak = Math.max(...samples.map(([, x]) => Math.abs(x)));
    expect(peak).toBeCloseTo(p.steadyAmplitude, 5);
  });

  it("decays as e^(−ζωn·t) in free vibration", () => {
    const free = {
      ...STATEMENT,
      forceEnabled: false,
      initialDisplacement: 0.02,
      initialVelocity: 0,
    };
    const p = computeProperties(free);
    const samples = responseSamples(free, 0.25, 4000);
    // The envelope after one damped period should be down by the log decrement.
    const period = (2 * Math.PI) / p.dampedOmega;
    const atPeriod = samples.find(([t]) => t >= period)![1];
    expect(atPeriod / 0.02).toBeCloseTo(Math.exp(-p.logDecrement), 2);
  });

  it("conserves energy in free undamped vibration", () => {
    const free = {
      ...UNDAMPED,
      forceEnabled: false,
      initialDisplacement: 0.02,
      initialVelocity: 0,
    };
    let motion = { x: 0.02, v: 0 };
    const energy = (s: { x: number; v: number }) =>
      0.5 * free.stiffness * s.x * s.x + 0.5 * free.mass * s.v * s.v;
    const initial = energy(motion);
    for (let i = 0; i < 20000; i++) {
      motion = rk4Step(motion, i * 1e-5, free, 1e-5);
    }
    expect(Math.abs(energy(motion) - initial) / initial).toBeLessThan(1e-8);
  });

  it("grows without bound at undamped resonance", () => {
    const resonant = { ...UNDAMPED, forcingOmega: 100 };
    const samples = responseSamples(resonant, 1, 2000);
    const early = Math.max(
      ...samples.filter(([t]) => t < 0.2).map(([, x]) => Math.abs(x)),
    );
    const late = Math.max(
      ...samples.filter(([t]) => t > 0.8).map(([, x]) => Math.abs(x)),
    );
    expect(late).toBeGreaterThan(3 * early);
  });
});

describe("computeState", () => {
  it("reports the three forces consistently with m·ẍ", () => {
    const motion = { x: 0.005, v: 0.4 };
    const s = computeState(STATEMENT, 0.01, motion);
    expect(s.springForce).toBeCloseTo(-500, 9);
    expect(s.damperForce).toBeCloseTo(-200, 9);
    expect(STATEMENT.mass * s.acceleration).toBeCloseTo(
      s.appliedForce + s.springForce + s.damperForce,
      9,
    );
  });
});
