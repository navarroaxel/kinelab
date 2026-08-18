// ---------------------------------------------------------------------------
// Mecánica Técnica True/False quiz (/mechanics-quiz)
// ---------------------------------------------------------------------------

import type { TranslationKey } from "@/lib/i18n";

export interface MechanicsQuizItem {
  id: string; // "01".."36"
  statementKey: TranslationKey;
  correctAnswer: boolean; // true = "Verdadero", false = "Falso"
  justificationKey: TranslationKey;
}

// null = unanswered
export type MechanicsQuizAnswers = Record<string, boolean | null>;
