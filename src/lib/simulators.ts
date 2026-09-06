import type { TranslationKey } from "@/lib/i18n";

// Single source of truth for cross-app navigation: SimulatorNav, the
// particle-kinematics section index, and ExerciseNav all read from here.
// Adding a simulator should only ever touch this file plus its own slice.

export type SimulatorGroup =
  | "core"
  | "particle-kinematics"
  | "particle-dynamics"
  | "mechanical-vibrations";

export interface SimulatorEntry {
  id: string; // "pin-slot"
  href: string; // "/particle-kinematics/pin-slot"
  navKey: TranslationKey; // short label used in the flat top nav (core group only)
  titleKey: TranslationKey; // exercise/simulator title
  summaryKey?: TranslationKey; // one-line statement, shown on the section index card
  group: SimulatorGroup;
  pk?: number; // exercise number, drives ordering inside the particle-kinematics section
  pd?: number; // exercise number, drives ordering inside the particle-dynamics section
  vib?: number; // exercise number, drives ordering inside the mechanical-vibrations section
  preset?: string; // e.g. "pk4" — appended as ?preset=
  disabled?: boolean; // exercise not implemented yet — shown as a non-clickable stub card
}

export const SIMULATORS: SimulatorEntry[] = [
  // Core simulators — flat tabs in the top nav
  {
    id: "polar",
    href: "/polar",
    navKey: "nav.polar",
    titleKey: "nav.polar",
    summaryKey: "home.summary.polar",
    group: "core",
  },
  {
    id: "quick-return",
    href: "/quick-return",
    navKey: "nav.quick_return",
    titleKey: "nav.quick_return",
    summaryKey: "home.summary.quick_return",
    group: "core",
  },
  {
    id: "fireman-ladder",
    href: "/fireman-ladder",
    navKey: "nav.fireman_ladder",
    titleKey: "fl.title",
    summaryKey: "home.summary.fireman_ladder",
    group: "core",
  },
  {
    id: "cam-follower",
    href: "/cam-follower",
    navKey: "nav.cam_follower",
    titleKey: "cf.title",
    summaryKey: "home.summary.cam_follower",
    group: "core",
  },
  {
    id: "banked-curve",
    href: "/banked-curve",
    navKey: "nav.banked_curve",
    titleKey: "bc.title",
    summaryKey: "home.summary.banked_curve",
    group: "core",
  },
  {
    id: "parabolic-spring",
    href: "/parabolic-spring",
    navKey: "nav.parabolic_spring",
    titleKey: "ps.title",
    summaryKey: "home.summary.parabolic_spring",
    group: "core",
  },
  {
    id: "oscillating-bar",
    href: "/oscillating-bar",
    navKey: "nav.oscillating_bar",
    titleKey: "ob.title",
    summaryKey: "home.summary.oscillating_bar",
    group: "core",
  },
  {
    id: "forced-vibration",
    href: "/forced-vibration",
    navKey: "nav.forced_vibration",
    titleKey: "fv.title",
    summaryKey: "home.summary.forced_vibration",
    group: "core",
  },
  {
    id: "vibrations-quiz",
    href: "/vibrations-quiz",
    navKey: "nav.vibrations_quiz",
    titleKey: "vq.title",
    summaryKey: "home.summary.vibrations_quiz",
    group: "core",
  },
  {
    id: "mechanics-quiz",
    href: "/mechanics-quiz",
    navKey: "nav.mechanics_quiz",
    titleKey: "mq.title",
    summaryKey: "home.summary.mechanics_quiz",
    group: "core",
  },
  {
    id: "helicopter-lift",
    href: "/helicopter-lift",
    navKey: "nav.helicopter_lift",
    titleKey: "hl.title",
    summaryKey: "home.summary.helicopter_lift",
    group: "core",
  },
  {
    id: "jet-climb",
    href: "/jet-climb",
    navKey: "nav.jet_climb",
    titleKey: "jc.title",
    summaryKey: "home.summary.jet_climb",
    group: "core",
  },
  // Particle Kinematics section — TP N°1, Cinemática del Punto Material (UTN FRBA)
  {
    id: "drag-descent",
    href: "/particle-kinematics/drag-descent",
    navKey: "pk.exercises.pk1.title",
    titleKey: "pk.exercises.pk1.title",
    summaryKey: "pk.exercises.pk1.summary",
    group: "particle-kinematics",
    pk: 1,
  },
  {
    id: "stopping-distance",
    href: "/particle-kinematics/stopping-distance",
    navKey: "pk.exercises.pk2.title",
    titleKey: "pk.exercises.pk2.title",
    summaryKey: "pk.exercises.pk2.summary",
    group: "particle-kinematics",
    pk: 2,
  },
  {
    id: "parabolic-track",
    href: "/particle-kinematics/parabolic-track",
    navKey: "pk.exercises.pk3.title",
    titleKey: "pk.exercises.pk3.title",
    summaryKey: "pk.exercises.pk3.summary",
    group: "particle-kinematics",
    pk: 3,
  },
  {
    id: "pin-slot-pk4",
    href: "/particle-kinematics/pin-slot?preset=pk4",
    navKey: "pk.exercises.pk4.title",
    titleKey: "pk.exercises.pk4.title",
    summaryKey: "pk.exercises.pk4.summary",
    group: "particle-kinematics",
    pk: 4,
    preset: "pk4",
  },
  {
    id: "motion-graphs",
    href: "/particle-kinematics/motion-graphs",
    navKey: "pk.exercises.pk5.title",
    titleKey: "pk.exercises.pk5.title",
    summaryKey: "pk.exercises.pk5.summary",
    group: "particle-kinematics",
    pk: 5,
  },
  {
    id: "pin-slot",
    href: "/particle-kinematics/pin-slot",
    navKey: "pk.exercises.pk6.title",
    titleKey: "pk.exercises.pk6.title",
    summaryKey: "pk.exercises.pk6.summary",
    group: "particle-kinematics",
    pk: 6,
  },
  {
    id: "cable-blocks",
    href: "/particle-kinematics/cable-blocks",
    navKey: "pk.exercises.pk7.title",
    titleKey: "pk.exercises.pk7.title",
    summaryKey: "pk.exercises.pk7.summary",
    group: "particle-kinematics",
    pk: 7,
  },
  {
    id: "radar-tracking",
    href: "/particle-kinematics/radar-tracking",
    navKey: "pk.exercises.pk8.title",
    titleKey: "pk.exercises.pk8.title",
    summaryKey: "pk.exercises.pk8.summary",
    group: "particle-kinematics",
    pk: 8,
  },
  {
    id: "circular-orbit",
    href: "/particle-kinematics/circular-orbit",
    navKey: "pk.exercises.pk9.title",
    titleKey: "pk.exercises.pk9.title",
    summaryKey: "pk.exercises.pk9.summary",
    group: "particle-kinematics",
    pk: 9,
  },
  {
    id: "elevator-cable",
    href: "/particle-kinematics/elevator-cable",
    navKey: "pk.exercises.pk10.title",
    titleKey: "pk.exercises.pk10.title",
    summaryKey: "pk.exercises.pk10.summary",
    group: "particle-kinematics",
    pk: 10,
  },

  // Particle Dynamics section — TP N°2, Dinámica del Punto Material (UTN FRBA)
  {
    id: "viscous-impact",
    href: "/particle-dynamics/viscous-impact",
    navKey: "pd.exercises.pd1.title",
    titleKey: "pd.exercises.pd1.title",
    summaryKey: "pd.exercises.pd1.summary",
    group: "particle-dynamics",
    pd: 1,
  },
  {
    id: "parachutist",
    href: "/particle-dynamics/parachutist",
    navKey: "pd.exercises.pd2.title",
    titleKey: "pd.exercises.pd2.title",
    summaryKey: "pd.exercises.pd2.summary",
    group: "particle-dynamics",
    pd: 2,
  },
  {
    id: "ring",
    href: "/particle-dynamics/ring",
    navKey: "pd.exercises.pd3.title",
    titleKey: "pd.exercises.pd3.title",
    summaryKey: "pd.exercises.pd3.summary",
    group: "particle-dynamics",
    pd: 3,
  },
  {
    id: "atwood",
    href: "/particle-dynamics/atwood",
    navKey: "pd.exercises.pd4.title",
    titleKey: "pd.exercises.pd4.title",
    summaryKey: "pd.exercises.pd4.summary",
    group: "particle-dynamics",
    pd: 4,
  },
  {
    id: "parabolic-bowl",
    href: "/particle-dynamics/parabolic-bowl",
    navKey: "pd.exercises.pd5.title",
    titleKey: "pd.exercises.pd5.title",
    summaryKey: "pd.exercises.pd5.summary",
    group: "particle-dynamics",
    pd: 5,
  },
  {
    id: "kepler",
    href: "/particle-dynamics/kepler",
    navKey: "pd.exercises.pd6.title",
    titleKey: "pd.exercises.pd6.title",
    summaryKey: "pd.exercises.pd6.summary",
    group: "particle-dynamics",
    pd: 6,
  },
  {
    id: "elevator-counterweight",
    href: "/particle-dynamics/elevator-counterweight",
    navKey: "pd.exercises.pd7.title",
    titleKey: "pd.exercises.pd7.title",
    summaryKey: "pd.exercises.pd7.summary",
    group: "particle-dynamics",
    pd: 7,
  },
  {
    id: "spring-stop",
    href: "/particle-dynamics/spring-stop",
    navKey: "pd.exercises.pd8.title",
    titleKey: "pd.exercises.pd8.title",
    summaryKey: "pd.exercises.pd8.summary",
    group: "particle-dynamics",
    pd: 8,
  },
  {
    id: "pulley-friction",
    href: "/particle-dynamics/pulley-friction",
    navKey: "pd.exercises.pd9.title",
    titleKey: "pd.exercises.pd9.title",
    summaryKey: "pd.exercises.pd9.summary",
    group: "particle-dynamics",
    pd: 9,
  },
  {
    id: "vehicle-power",
    href: "/particle-dynamics/vehicle-power",
    navKey: "pd.exercises.pd10.title",
    titleKey: "pd.exercises.pd10.title",
    summaryKey: "pd.exercises.pd10.summary",
    group: "particle-dynamics",
    pd: 10,
  },
  {
    id: "hoist",
    href: "/particle-dynamics/hoist",
    navKey: "pd.exercises.pd11.title",
    titleKey: "pd.exercises.pd11.title",
    summaryKey: "pd.exercises.pd11.summary",
    group: "particle-dynamics",
    pd: 11,
  },
  {
    id: "escalator",
    href: "/particle-dynamics/escalator",
    navKey: "pd.exercises.pd12.title",
    titleKey: "pd.exercises.pd12.title",
    summaryKey: "pd.exercises.pd12.summary",
    group: "particle-dynamics",
    pd: 12,
  },
  {
    id: "rail-car-coupling",
    href: "/particle-dynamics/rail-car-coupling",
    navKey: "pd.exercises.pd13.title",
    titleKey: "pd.exercises.pd13.title",
    summaryKey: "pd.exercises.pd13.summary",
    group: "particle-dynamics",
    pd: 13,
  },
  {
    id: "staged-rocket",
    href: "/particle-dynamics/staged-rocket",
    navKey: "pd.exercises.pd14.title",
    titleKey: "pd.exercises.pd14.title",
    summaryKey: "pd.exercises.pd14.summary",
    group: "particle-dynamics",
    pd: 14,
  },

  // Mechanical Vibrations section — TP N°3, Vibraciones Mecánicas (UTN FRBA)
  {
    id: "rotating-unbalance",
    href: "/mechanical-vibrations",
    navKey: "vib.exercises.vib1.title",
    titleKey: "vib.exercises.vib1.title",
    summaryKey: "vib.exercises.vib1.summary",
    group: "mechanical-vibrations",
    vib: 1,
    disabled: true,
  },
  {
    id: "vehicle-suspension",
    href: "/mechanical-vibrations/vehicle-suspension",
    navKey: "vs.title",
    titleKey: "vs.title",
    summaryKey: "vib.exercises.vib2.summary",
    group: "mechanical-vibrations",
    vib: 2,
  },
  {
    id: "vibration-isolation",
    href: "/mechanical-vibrations",
    navKey: "vib.exercises.vib3.title",
    titleKey: "vib.exercises.vib3.title",
    summaryKey: "vib.exercises.vib3.summary",
    group: "mechanical-vibrations",
    vib: 3,
    disabled: true,
  },
  {
    id: "machine-element-base",
    href: "/mechanical-vibrations",
    navKey: "vib.exercises.vib4.title",
    titleKey: "vib.exercises.vib4.title",
    summaryKey: "vib.exercises.vib4.summary",
    group: "mechanical-vibrations",
    vib: 4,
    disabled: true,
  },
  {
    id: "pressure-gauge",
    href: "/mechanical-vibrations",
    navKey: "vib.exercises.vib5.title",
    titleKey: "vib.exercises.vib5.title",
    summaryKey: "vib.exercises.vib5.summary",
    group: "mechanical-vibrations",
    vib: 5,
    disabled: true,
  },
  {
    id: "mass-release",
    href: "/mechanical-vibrations",
    navKey: "vib.exercises.vib6.title",
    titleKey: "vib.exercises.vib6.title",
    summaryKey: "vib.exercises.vib6.summary",
    group: "mechanical-vibrations",
    vib: 6,
    disabled: true,
  },
  {
    id: "mass-release-damped",
    href: "/mechanical-vibrations",
    navKey: "vib.exercises.vib7.title",
    titleKey: "vib.exercises.vib7.title",
    summaryKey: "vib.exercises.vib7.summary",
    group: "mechanical-vibrations",
    vib: 7,
    disabled: true,
  },
];

export const coreSimulators = () =>
  SIMULATORS.filter((s) => s.group === "core");

export const pkExercises = () =>
  SIMULATORS.filter((s) => s.group === "particle-kinematics").sort(
    (a, b) => a.pk! - b.pk!,
  );

export const pdExercises = () =>
  SIMULATORS.filter((s) => s.group === "particle-dynamics").sort(
    (a, b) => a.pd! - b.pd!,
  );

export const vibExercises = () =>
  SIMULATORS.filter((s) => s.group === "mechanical-vibrations").sort(
    (a, b) => a.vib! - b.vib!,
  );

export function findByHref(href: string): SimulatorEntry | undefined {
  return SIMULATORS.find((s) => s.href === href);
}
