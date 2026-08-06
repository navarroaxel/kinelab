import type { TranslationKey } from "@/lib/i18n";

// Single source of truth for cross-app navigation: SimulatorNav, the
// particle-kinematics section index, and ExerciseNav all read from here.
// Adding a simulator should only ever touch this file plus its own slice.

export type SimulatorGroup = "core" | "particle-kinematics";

export interface SimulatorEntry {
  id: string; // "pin-slot"
  href: string; // "/particle-kinematics/pin-slot"
  navKey: TranslationKey; // short label used in the flat top nav (core group only)
  titleKey: TranslationKey; // exercise/simulator title
  summaryKey?: TranslationKey; // one-line statement, shown on the section index card
  group: SimulatorGroup;
  cpm?: number; // exercise number, drives ordering inside the section
  preset?: string; // e.g. "cpm4" — appended as ?preset=
}

export const SIMULATORS: SimulatorEntry[] = [
  // Core simulators — flat tabs in the top nav
  {
    id: "polar",
    href: "/",
    navKey: "nav.polar",
    titleKey: "nav.polar",
    group: "core",
  },
  {
    id: "ring",
    href: "/ring",
    navKey: "nav.ring",
    titleKey: "nav.ring",
    group: "core",
  },
  {
    id: "quick-return",
    href: "/quick-return",
    navKey: "nav.quick_return",
    titleKey: "nav.quick_return",
    group: "core",
  },
  {
    id: "kepler",
    href: "/kepler",
    navKey: "nav.kepler",
    titleKey: "nav.kepler",
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
];

export const coreSimulators = () =>
  SIMULATORS.filter((s) => s.group === "core");

export const cpmExercises = () =>
  SIMULATORS.filter((s) => s.group === "particle-kinematics").sort(
    (a, b) => a.cpm! - b.cpm!,
  );

export function findByHref(href: string): SimulatorEntry | undefined {
  return SIMULATORS.find((s) => s.href === href);
}
