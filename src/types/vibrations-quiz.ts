// ---------------------------------------------------------------------------
// Mechanical vibrations True/False quiz (/vibrations-quiz)
// ---------------------------------------------------------------------------

import type { TranslationKey } from "@/lib/i18n";

export interface VibrationsQuizItem {
  id: string; // "a".."f"
  statementKey: TranslationKey;
  correctAnswer: boolean; // true = "Verdadero", false = "Falso"
  justificationKey: TranslationKey;
}

// null = unanswered
export type VibrationsQuizAnswers = Record<string, boolean | null>;
