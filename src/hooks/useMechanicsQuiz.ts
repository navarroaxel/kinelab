"use client";

import { useCallback, useMemo, useState } from "react";
import type { MechanicsQuizAnswers } from "@/types/simulator";
import {
  MECHANICS_QUIZ_ITEMS,
  initialMechanicsQuizAnswers,
  isMechanicsQuizFullyAnswered,
  scoreMechanicsQuiz,
} from "@/lib/mechanicsQuizItems";

export function useMechanicsQuiz() {
  const [answers, setAnswers] = useState<MechanicsQuizAnswers>(
    initialMechanicsQuizAnswers,
  );
  const [submitted, setSubmitted] = useState(false);

  const setAnswer = useCallback((id: string, value: boolean) => {
    setSubmitted(false);
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }, []);

  const allAnswered = useMemo(
    () => isMechanicsQuizFullyAnswered(answers),
    [answers],
  );

  const submit = useCallback(() => {
    setSubmitted(true);
  }, []);

  const retry = useCallback(() => {
    setAnswers(initialMechanicsQuizAnswers());
    setSubmitted(false);
  }, []);

  const score = useMemo(() => scoreMechanicsQuiz(answers), [answers]);

  return {
    items: MECHANICS_QUIZ_ITEMS,
    answers,
    setAnswer,
    allAnswered,
    submitted,
    submit,
    retry,
    score,
  };
}
