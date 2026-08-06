import type { TranslationKey } from "@/lib/i18n";

// Single source of truth for cross-app navigation: SimulatorNav, the
// particle-kinematics section index, and ExerciseNav all read from here.
// Adding a simulator should only ever touch this file plus its own slice.

export type SimulatorGroup =
  | "core"
  | "particle-kinematics"
  | "particle-dynamics";

export interface SimulatorEntry {
  id: string; // "pin-slot"
  href: string; // "/particle-kinematics/pin-slot"
  navKey: TranslationKey; // short label used in the flat top nav (core group only)
  titleKey: TranslationKey; // exercise/simulator title
  summaryKey?: TranslationKey; // one-line statement, shown on the section index card
  group: SimulatorGroup;
  cpm?: number; // exercise number, drives ordering inside the particle-kinematics section
  dpm?: number; // exercise number, drives ordering inside the particle-dynamics section
  preset?: string; // e.g. "cpm4" — appended as ?preset=
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
    id: "kepler",
    href: "/kepler",
    navKey: "nav.kepler",
    titleKey: "nav.kepler",
    summaryKey: "home.summary.kepler",
    group: "core",
  },

  // Particle Kinematics section — TP N°1, Cinemática del Punto Material (UTN FRBA)
  {
    id: "drag-descent",
    href: "/particle-kinematics/drag-descent",
    navKey: "cpm.exercises.cpm1.title",
    titleKey: "cpm.exercises.cpm1.title",
    summaryKey: "cpm.exercises.cpm1.summary",
    group: "particle-kinematics",
    cpm: 1,
  },
  {
    id: "stopping-distance",
    href: "/particle-kinematics/stopping-distance",
    navKey: "cpm.exercises.cpm2.title",
    titleKey: "cpm.exercises.cpm2.title",
    summaryKey: "cpm.exercises.cpm2.summary",
    group: "particle-kinematics",
    cpm: 2,
  },
  {
    id: "parabolic-track",
    href: "/particle-kinematics/parabolic-track",
    navKey: "cpm.exercises.cpm3.title",
    titleKey: "cpm.exercises.cpm3.title",
    summaryKey: "cpm.exercises.cpm3.summary",
    group: "particle-kinematics",
    cpm: 3,
  },
  {
    id: "pin-slot-cpm4",
    href: "/particle-kinematics/pin-slot?preset=cpm4",
    navKey: "cpm.exercises.cpm4.title",
    titleKey: "cpm.exercises.cpm4.title",
    summaryKey: "cpm.exercises.cpm4.summary",
    group: "particle-kinematics",
    cpm: 4,
    preset: "cpm4",
  },
  {
    id: "motion-graphs",
    href: "/particle-kinematics/motion-graphs",
    navKey: "cpm.exercises.cpm5.title",
    titleKey: "cpm.exercises.cpm5.title",
    summaryKey: "cpm.exercises.cpm5.summary",
    group: "particle-kinematics",
    cpm: 5,
  },
  {
    id: "pin-slot",
    href: "/particle-kinematics/pin-slot",
    navKey: "cpm.exercises.cpm6.title",
    titleKey: "cpm.exercises.cpm6.title",
    summaryKey: "cpm.exercises.cpm6.summary",
    group: "particle-kinematics",
    cpm: 6,
  },
  {
    id: "cable-blocks",
    href: "/particle-kinematics/cable-blocks",
    navKey: "cpm.exercises.cpm7.title",
    titleKey: "cpm.exercises.cpm7.title",
    summaryKey: "cpm.exercises.cpm7.summary",
    group: "particle-kinematics",
    cpm: 7,
  },
  {
    id: "radar-tracking",
    href: "/particle-kinematics/radar-tracking",
    navKey: "cpm.exercises.cpm8.title",
    titleKey: "cpm.exercises.cpm8.title",
    summaryKey: "cpm.exercises.cpm8.summary",
    group: "particle-kinematics",
    cpm: 8,
  },
  {
    id: "circular-orbit",
    href: "/particle-kinematics/circular-orbit",
    navKey: "cpm.exercises.cpm9.title",
    titleKey: "cpm.exercises.cpm9.title",
    summaryKey: "cpm.exercises.cpm9.summary",
    group: "particle-kinematics",
    cpm: 9,
  },
  {
    id: "elevator-cable",
    href: "/particle-kinematics/elevator-cable",
    navKey: "cpm.exercises.cpm10.title",
    titleKey: "cpm.exercises.cpm10.title",
    summaryKey: "cpm.exercises.cpm10.summary",
    group: "particle-kinematics",
    cpm: 10,
  },

  // Particle Dynamics section — TP N°2, Dinámica del Punto Material (UTN FRBA)
  {
    id: "dpm1",
    href: "/particle-dynamics",
    navKey: "dpm.exercises.dpm1.title",
    titleKey: "dpm.exercises.dpm1.title",
    summaryKey: "dpm.exercises.dpm1.summary",
    group: "particle-dynamics",
    dpm: 1,
    disabled: true,
  },
  {
    id: "dpm2",
    href: "/particle-dynamics",
    navKey: "dpm.exercises.dpm2.title",
    titleKey: "dpm.exercises.dpm2.title",
    summaryKey: "dpm.exercises.dpm2.summary",
    group: "particle-dynamics",
    dpm: 2,
    disabled: true,
  },
  {
    id: "ring",
    href: "/particle-dynamics/ring",
    navKey: "dpm.exercises.dpm3.title",
    titleKey: "dpm.exercises.dpm3.title",
    summaryKey: "dpm.exercises.dpm3.summary",
    group: "particle-dynamics",
    dpm: 3,
  },
  {
    id: "dpm4",
    href: "/particle-dynamics",
    navKey: "dpm.exercises.dpm4.title",
    titleKey: "dpm.exercises.dpm4.title",
    summaryKey: "dpm.exercises.dpm4.summary",
    group: "particle-dynamics",
    dpm: 4,
    disabled: true,
  },
  {
    id: "dpm5",
    href: "/particle-dynamics",
    navKey: "dpm.exercises.dpm5.title",
    titleKey: "dpm.exercises.dpm5.title",
    summaryKey: "dpm.exercises.dpm5.summary",
    group: "particle-dynamics",
    dpm: 5,
    disabled: true,
  },
  {
    id: "dpm6",
    href: "/particle-dynamics",
    navKey: "dpm.exercises.dpm6.title",
    titleKey: "dpm.exercises.dpm6.title",
    summaryKey: "dpm.exercises.dpm6.summary",
    group: "particle-dynamics",
    dpm: 6,
    disabled: true,
  },
  {
    id: "dpm7",
    href: "/particle-dynamics",
    navKey: "dpm.exercises.dpm7.title",
    titleKey: "dpm.exercises.dpm7.title",
    summaryKey: "dpm.exercises.dpm7.summary",
    group: "particle-dynamics",
    dpm: 7,
    disabled: true,
  },
  {
    id: "dpm8",
    href: "/particle-dynamics",
    navKey: "dpm.exercises.dpm8.title",
    titleKey: "dpm.exercises.dpm8.title",
    summaryKey: "dpm.exercises.dpm8.summary",
    group: "particle-dynamics",
    dpm: 8,
    disabled: true,
  },
  {
    id: "dpm9",
    href: "/particle-dynamics",
    navKey: "dpm.exercises.dpm9.title",
    titleKey: "dpm.exercises.dpm9.title",
    summaryKey: "dpm.exercises.dpm9.summary",
    group: "particle-dynamics",
    dpm: 9,
    disabled: true,
  },
  {
    id: "dpm10",
    href: "/particle-dynamics",
    navKey: "dpm.exercises.dpm10.title",
    titleKey: "dpm.exercises.dpm10.title",
    summaryKey: "dpm.exercises.dpm10.summary",
    group: "particle-dynamics",
    dpm: 10,
    disabled: true,
  },
  {
    id: "dpm11",
    href: "/particle-dynamics",
    navKey: "dpm.exercises.dpm11.title",
    titleKey: "dpm.exercises.dpm11.title",
    summaryKey: "dpm.exercises.dpm11.summary",
    group: "particle-dynamics",
    dpm: 11,
    disabled: true,
  },
  {
    id: "dpm12",
    href: "/particle-dynamics",
    navKey: "dpm.exercises.dpm12.title",
    titleKey: "dpm.exercises.dpm12.title",
    summaryKey: "dpm.exercises.dpm12.summary",
    group: "particle-dynamics",
    dpm: 12,
    disabled: true,
  },
  {
    id: "dpm13",
    href: "/particle-dynamics",
    navKey: "dpm.exercises.dpm13.title",
    titleKey: "dpm.exercises.dpm13.title",
    summaryKey: "dpm.exercises.dpm13.summary",
    group: "particle-dynamics",
    dpm: 13,
    disabled: true,
  },
  {
    id: "dpm14",
    href: "/particle-dynamics",
    navKey: "dpm.exercises.dpm14.title",
    titleKey: "dpm.exercises.dpm14.title",
    summaryKey: "dpm.exercises.dpm14.summary",
    group: "particle-dynamics",
    dpm: 14,
    disabled: true,
  },
];

export const coreSimulators = () =>
  SIMULATORS.filter((s) => s.group === "core");

export const cpmExercises = () =>
  SIMULATORS.filter((s) => s.group === "particle-kinematics").sort(
    (a, b) => a.cpm! - b.cpm!,
  );

export const dpmExercises = () =>
  SIMULATORS.filter((s) => s.group === "particle-dynamics").sort(
    (a, b) => a.dpm! - b.dpm!,
  );

export function findByHref(href: string): SimulatorEntry | undefined {
  return SIMULATORS.find((s) => s.href === href);
}
