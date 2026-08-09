"use client";

import { useCallback, useMemo, useState } from "react";
import type { VibrationsQuizAnswers } from "@/types/simulator";
import {
  VIBRATIONS_QUIZ_ITEMS,
  initialVibrationsQuizAnswers,
  isVibrationsQuizFullyAnswered,
  scoreVibrationsQuiz,
} from "@/lib/vibrationsQuizItems";

export function useVibrationsQuiz() {
  const [answers, setAnswers] = useState<VibrationsQuizAnswers>(
    initialVibrationsQuizAnswers,
  );
  const [submitted, setSubmitted] = useState(false);

  const setAnswer = useCallback((id: string, value: boolean) => {
    setSubmitted(false);
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }, []);

  const allAnswered = useMemo(
    () => isVibrationsQuizFullyAnswered(answers),
    [answers],
  );

  const submit = useCallback(() => {
    setSubmitted(true);
  }, []);

  const retry = useCallback(() => {
    setAnswers(initialVibrationsQuizAnswers());
    setSubmitted(false);
  }, []);

  const score = useMemo(() => scoreVibrationsQuiz(answers), [answers]);

  return {
    items: VIBRATIONS_QUIZ_ITEMS,
    answers,
    setAnswer,
    allAnswered,
    submitted,
    submit,
    retry,
    score,
  };
}
