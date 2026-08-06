import type {
  RadarTrackingParams,
  RadarTrackingState,
} from "@/types/simulator";

/**
 * The aircraft's trajectory near its lowest point is modelled as a circular
 * arc of radius ρ (rhoTraj) centred directly above that point. With constant
 * tangential acceleration a_t, the speed is v(t) = v0 + a_t·t and the arc
 * angle swept from the bottom is φ(t) = (v0·t + ½·a_t·t²) / ρ — closed form,
 * no integration needed.
 */
export function speedAtTime(t: number, params: RadarTrackingParams): number {
  return params.v0 + params.at * t;
}

export function phiAtTime(t: number, params: RadarTrackingParams): number {
  return (params.v0 * t + 0.5 * params.at * t * t) / params.rhoTraj;
}

/** Time at which the swept angle reaches `phiTarget` (closed form, biquadratic-free here since linear in t after solving the quadratic). */
export function timeForPhi(
  phiTarget: number,
  params: RadarTrackingParams,
): number {
  const { v0, at, rhoTraj } = params;
  if (at === 0) return (phiTarget * rhoTraj) / v0;
  return (-v0 + Math.sqrt(v0 * v0 + 2 * at * rhoTraj * phiTarget)) / at;
}

/** Aircraft position relative to the trajectory's lowest point (world Y up). */
export function aircraftPosition(
  phi: number,
  params: RadarTrackingParams,
): { x: number; y: number } {
  return {
    x: params.rhoTraj * Math.sin(phi),
    y: params.rhoTraj * (1 - Math.cos(phi)),
  };
}

export function aircraftVelocity(
  phi: number,
  v: number,
): { vx: number; vy: number } {
  return { vx: v * Math.cos(phi), vy: v * Math.sin(phi) };
}

export function aircraftAcceleration(
  phi: number,
  v: number,
  params: RadarTrackingParams,
): { ax: number; ay: number } {
  const an = (v * v) / params.rhoTraj;
  return {
    ax: params.at * Math.cos(phi) - an * Math.sin(phi),
    ay: params.at * Math.sin(phi) + an * Math.cos(phi),
  };
}

/** θ(t) alone — used by the dev-mode finite-difference invariant. */
export function thetaAtTime(t: number, params: RadarTrackingParams): number {
  const phi = phiAtTime(t, params);
  const pos = aircraftPosition(phi, params);
  const x = pos.x - params.radarX;
  const y = pos.y - params.radarY;
  return Math.atan2(y, x);
}

export function computeRadarTrackingState(
  params: RadarTrackingParams,
  t: number,
): RadarTrackingState {
  const phi = phiAtTime(t, params);
  const v = speedAtTime(t, params);
  const pos = aircraftPosition(phi, params);
  const vel = aircraftVelocity(phi, v);
  const acc = aircraftAcceleration(phi, v, params);

  const x = pos.x - params.radarX;
  const y = pos.y - params.radarY;
  const r = Math.sqrt(x * x + y * y);
  const theta = Math.atan2(y, x);

  const er = { x: x / r, y: y / r };
  const eth = { x: -er.y, y: er.x };

  const rDot = vel.vx * er.x + vel.vy * er.y;
  const rThetaDot = vel.vx * eth.x + vel.vy * eth.y;
  const thetaDot = rThetaDot / r;

  const ar = acc.ax * er.x + acc.ay * er.y;
  const ath = acc.ax * eth.x + acc.ay * eth.y;
  const rDDot = ar + r * thetaDot * thetaDot;
  const thetaDDot = (ath - 2 * rDot * thetaDot) / r;

  if (process.env.NODE_ENV === "development") {
    const h = 1e-4;
    const thetaCentered =
      (thetaAtTime(t + h, params) - 2 * theta + thetaAtTime(t - h, params)) /
      (h * h);
    const rel =
      Math.abs(thetaCentered - thetaDDot) / Math.max(Math.abs(thetaDDot), 1e-9);
    if (rel > 1e-4 && Math.abs(thetaDDot) > 1e-6) {
      console.warn(
        `[radarTracking] θ̈ mismatch: analytic=${thetaDDot.toFixed(6)} finite-diff=${thetaCentered.toFixed(6)} (rel=${rel.toExponential(2)})`,
      );
    }
  }

  return {
    t,
    phi,
    x,
    y,
    r,
    thetaDeg: (theta * 180) / Math.PI,
    rDot,
    rThetaDot,
    thetaDot,
    rDDot,
    thetaDDot,
  };
}
