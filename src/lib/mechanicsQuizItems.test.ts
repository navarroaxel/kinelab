import { describe, expect, it } from "vitest";
import {
  MECHANICS_QUIZ_ITEMS,
  initialMechanicsQuizAnswers,
  isMechanicsQuizFullyAnswered,
  scoreMechanicsQuiz,
} from "./mechanicsQuizItems";
import { translations } from "./i18n";

describe("MECHANICS_QUIZ_ITEMS", () => {
  it("has 36 statements, numbered 01..36", () => {
    expect(MECHANICS_QUIZ_ITEMS).toHaveLength(36);
    expect(MECHANICS_QUIZ_ITEMS.map((item) => item.id)).toEqual(
      Array.from({ length: 36 }, (_, i) => String(i + 1).padStart(2, "0")),
    );
  });

  it("has a translation for every statement and justification key, in both languages", () => {
    for (const item of MECHANICS_QUIZ_ITEMS) {
      expect(translations.en[item.statementKey]).toBeTruthy();
      expect(translations.es[item.statementKey]).toBeTruthy();
      expect(translations.en[item.justificationKey]).toBeTruthy();
      expect(translations.es[item.justificationKey]).toBeTruthy();
    }
  });

  it("has a mix of true and false correct answers", () => {
    const trueCount = MECHANICS_QUIZ_ITEMS.filter(
      (item) => item.correctAnswer,
    ).length;
    expect(trueCount).toBeGreaterThan(0);
    expect(trueCount).toBeLessThan(MECHANICS_QUIZ_ITEMS.length);
  });
});

describe("initialMechanicsQuizAnswers", () => {
  it("starts every item unanswered", () => {
    const answers = initialMechanicsQuizAnswers();
    expect(Object.keys(answers)).toHaveLength(MECHANICS_QUIZ_ITEMS.length);
    expect(Object.values(answers).every((v) => v === null)).toBe(true);
  });
});

describe("isMechanicsQuizFullyAnswered", () => {
  it("is false when any item is unanswered", () => {
    const answers = initialMechanicsQuizAnswers();
    answers["01"] = true;
    expect(isMechanicsQuizFullyAnswered(answers)).toBe(false);
  });

  it("is true once every item has a boolean answer", () => {
    const answers = initialMechanicsQuizAnswers();
    for (const item of MECHANICS_QUIZ_ITEMS) answers[item.id] = true;
    expect(isMechanicsQuizFullyAnswered(answers)).toBe(true);
  });
});

describe("scoreMechanicsQuiz", () => {
  it("scores 0 when every item is unanswered", () => {
    expect(scoreMechanicsQuiz(initialMechanicsQuizAnswers())).toBe(0);
  });

  it("scores full marks when every answer matches the key", () => {
    const answers = initialMechanicsQuizAnswers();
    for (const item of MECHANICS_QUIZ_ITEMS) {
      answers[item.id] = item.correctAnswer;
    }
    expect(scoreMechanicsQuiz(answers)).toBe(MECHANICS_QUIZ_ITEMS.length);
  });

  it("only credits answers that match the correct answer", () => {
    const answers = initialMechanicsQuizAnswers();
    for (const item of MECHANICS_QUIZ_ITEMS) {
      answers[item.id] = !item.correctAnswer;
    }
    expect(scoreMechanicsQuiz(answers)).toBe(0);
  });

  it("counts a single correct answer among wrong ones", () => {
    const answers = initialMechanicsQuizAnswers();
    for (const item of MECHANICS_QUIZ_ITEMS) {
      answers[item.id] = !item.correctAnswer;
    }
    answers["01"] = true; // "01" is correct; flips it back to right
    expect(scoreMechanicsQuiz(answers)).toBe(1);
  });
});
