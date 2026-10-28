import { rotationalVelocity } from "@/lib/planarRigidBody";
import type {
  PlanetaryReducerParams,
  PlanetaryReducerResult,
  PlanetaryReducerState,
  Vec2,
} from "@/types/simulator";

// ---------------------------------------------------------------------------
// CCR N°15 — Planetary reducer. Sun A drives three identical planets B, C, D
// that roll without slipping on a fixed ring E; the planet centres are carried
// by an arm (the output). Everything follows from one idea: the planet's
// contact with the fixed ring has zero velocity, so it is the planet's
// instantaneous centre.
//
//   v_J = ω_A·r_A                  sun–planet contact (a point of both bodies)
//   ω_p = v_J / (2r)               J is a full diameter from the centre
//   v_O = ω_p·r = v_J / 2          planet centre — halfway between 0 and v_J
//   ω_c = v_O / (r_A + r)          the centre travels on a circle of radius r_A + r
//
// The ring's inner radius is not in the statement: planet and sun must both
// touch it, so r_E = r_A + 2r. Planets C and D only balance the load — each
// one has the same kinematics as B.
//
// Senses: the sun turns CCW, the contact J moves with it, the planet turns
// the opposite way (it rolls *inside* the ring) and the carrier follows the
// sun. All three are CCW-positive, so ω_planet < 0 when ω_A > 0.
// ---------------------------------------------------------------------------

const RPM = (2 * Math.PI) / 60;
const TWO_PI = Math.PI * 2;
const PLANET_COUNT = 3;

export function planetaryReducerResult(
  params: PlanetaryReducerParams,
): PlanetaryReducerResult {
  const { sunRadius: rA, planetRadius: r } = params;
  const omegaSun = params.rpmSun * RPM;
  const ringRadius = rA + 2 * r;

  const vJ = omegaSun * rA;
  const omegaPlanet = -vJ / (2 * r);
  const vO = Math.abs(omegaPlanet) * r;
  const omegaCarrier = omegaSun * (rA / (rA + ringRadius));

  return {
    ringRadius,
    omegaSun,
    vJ,
    vO: Math.sign(omegaSun) * vO,
    omegaPlanet,
    omegaCarrier,
    rpmPlanet: omegaPlanet / RPM,
    rpmCarrier: omegaCarrier / RPM,
    ratio: rA / (rA + ringRadius),
  };
}

const polar = (radius: number, angle: number): Vec2 => ({
  x: radius * Math.cos(angle),
  y: radius * Math.sin(angle),
});

/** The mechanism at elapsed time `t` (it runs at constant speed — no stops, no ODE). */
export function computePlanetaryReducerState(
  params: PlanetaryReducerParams,
  t: number,
): PlanetaryReducerState {
  const result = planetaryReducerResult(params);
  const { sunRadius: rA, planetRadius: r } = params;
  const { omegaSun, omegaPlanet, omegaCarrier, ringRadius } = result;

  const carrierAngle = omegaCarrier * t;
  const centers: Vec2[] = [];
  const contactSun: Vec2[] = [];
  const contactRing: Vec2[] = [];
  const vJVec: Vec2[] = [];
  const vOVec: Vec2[] = [];

  for (let i = 0; i < PLANET_COUNT; i++) {
    const phi = carrierAngle + (i * TWO_PI) / PLANET_COUNT;
    centers.push(polar(rA + r, phi));
    contactSun.push(polar(rA, phi));
    contactRing.push(polar(ringRadius, phi));
    vJVec.push(rotationalVelocity(omegaSun, polar(rA, phi)));
    vOVec.push(rotationalVelocity(omegaCarrier, polar(rA + r, phi)));
  }

  return {
    ...result,
    sunAngle: omegaSun * t,
    carrierAngle,
    // Absolute spin of the planet; the spin *relative to the carrier* is
    // ω_p − ω_c, which is what a mark on the planet's rim would show.
    planetSpin: omegaPlanet * t,
    centers,
    contactSun,
    contactRing,
    vJVec,
    vOVec,
  };
}
