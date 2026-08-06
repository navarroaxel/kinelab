import { common } from "./common";
import { polar } from "./polar";
import { ring } from "./ring";
import { pinSlot } from "./pin-slot";
import { quickReturn } from "./quick-return";
import { kepler } from "./kepler";
import { cpmSection } from "./cpm/section";
import { cpmExercisesI18n } from "./cpm/exercises";
import { dragDescent } from "./cpm/drag-descent";

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
    ...cpmSection.en,
    ...cpmExercisesI18n.en,
    ...dragDescent.en,
  },
  es: {
    ...common.es,
    ...polar.es,
    ...ring.es,
    ...pinSlot.es,
    ...quickReturn.es,
    ...kepler.es,
    ...cpmSection.es,
    ...cpmExercisesI18n.es,
    ...dragDescent.es,
  },
} as const;

export type TranslationKey = keyof (typeof translations)["en"];

export function detectBrowserLanguage(): Language {
  if (typeof navigator === "undefined") return "en";
  return navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
}
