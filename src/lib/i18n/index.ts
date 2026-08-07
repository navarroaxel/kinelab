import { common } from "./common";
import { polar } from "./polar";
import { ring } from "./ring";
import { pinSlot } from "./pin-slot";
import { quickReturn } from "./quick-return";
import { kepler } from "./kepler";
import { pkSection } from "./pk/section";
import { pkExercisesI18n } from "./pk/exercises";
import { dragDescent } from "./pk/drag-descent";
import { motionGraphs } from "./pk/motion-graphs";
import { stoppingDistance } from "./pk/stopping-distance";
import { circularOrbit } from "./pk/circular-orbit";
import { parabolicTrack } from "./pk/parabolic-track";
import { cableBlocks } from "./pk/cable-blocks";
import { radarTracking } from "./pk/radar-tracking";
import { elevatorCable } from "./pk/elevator-cable";
import { pdSection } from "./pd/section";
import { pdExercisesI18n } from "./pd/exercises";
import { escalator } from "./pd/escalator";
import { hoist } from "./pd/hoist";

export type Language = "en" | "es";

export const LANGUAGES: Language[] = ["en", "es"];

export const translations = {
  en: {
    ...common.en,
    ...polar.en,
    ...ring.en,
    ...pinSlot.en,
    ...quickReturn.en,
    ...kepler.en,
    ...pkSection.en,
    ...pkExercisesI18n.en,
    ...dragDescent.en,
    ...motionGraphs.en,
    ...stoppingDistance.en,
    ...circularOrbit.en,
    ...parabolicTrack.en,
    ...cableBlocks.en,
    ...radarTracking.en,
    ...elevatorCable.en,
    ...pdSection.en,
    ...pdExercisesI18n.en,
    ...escalator.en,
    ...hoist.en,
  },
  es: {
    ...common.es,
    ...polar.es,
    ...ring.es,
    ...pinSlot.es,
    ...quickReturn.es,
    ...kepler.es,
    ...pkSection.es,
    ...pkExercisesI18n.es,
    ...dragDescent.es,
    ...motionGraphs.es,
    ...stoppingDistance.es,
    ...circularOrbit.es,
    ...parabolicTrack.es,
    ...cableBlocks.es,
    ...radarTracking.es,
    ...elevatorCable.es,
    ...pdSection.es,
    ...pdExercisesI18n.es,
    ...escalator.es,
    ...hoist.es,
  },
} as const;

export type TranslationKey = keyof (typeof translations)["en"];

export function detectBrowserLanguage(): Language {
  if (typeof navigator === "undefined") return "en";
  return navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
}
