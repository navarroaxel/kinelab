import { describe, expect, it } from "vitest";
import {
  VIBRATIONS_QUIZ_ITEMS,
  initialVibrationsQuizAnswers,
  isVibrationsQuizFullyAnswered,
  scoreVibrationsQuiz,
} from "./vibrationsQuizItems";
import { translations } from "./i18n";

describe("VIBRATIONS_QUIZ_ITEMS", () => {
  it("has exactly the twelve lettered statements a–l", () => {
    expect(VIBRATIONS_QUIZ_ITEMS.map((item) => item.id)).toEqual([
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
    ]);
  });

  it("has a translation for every statement and justification key, in both languages", () => {
    for (const item of VIBRATIONS_QUIZ_ITEMS) {
      expect(translations.en[item.statementKey]).toBeTruthy();
      expect(translations.es[item.statementKey]).toBeTruthy();
      expect(translations.en[item.justificationKey]).toBeTruthy();
      expect(translations.es[item.justificationKey]).toBeTruthy();
    }
  });

  it("matches the known correct answers", () => {
    const expected: Record<string, boolean> = {
      a: false,
      b: true,
      c: true,
      d: false,
      e: true,
      f: false,
      g: false,
      h: false,
      i: true,
      j: true,
      k: false,
      l: true,
    };
    for (const item of VIBRATIONS_QUIZ_ITEMS) {
      expect(item.correctAnswer).toBe(expected[item.id]);
    }
  });
});

describe("initialVibrationsQuizAnswers", () => {
  it("starts every item unanswered", () => {
    const answers = initialVibrationsQuizAnswers();
    expect(Object.keys(answers)).toHaveLength(VIBRATIONS_QUIZ_ITEMS.length);
    expect(Object.values(answers).every((v) => v === null)).toBe(true);
  });
});

describe("isVibrationsQuizFullyAnswered", () => {
  it("is false when any item is unanswered", () => {
    const answers = initialVibrationsQuizAnswers();
    answers.a = true;
    expect(isVibrationsQuizFullyAnswered(answers)).toBe(false);
  });

  it("is true once every item has a boolean answer", () => {
    const answers = initialVibrationsQuizAnswers();
    for (const item of VIBRATIONS_QUIZ_ITEMS) answers[item.id] = true;
    expect(isVibrationsQuizFullyAnswered(answers)).toBe(true);
  });
});

describe("scoreVibrationsQuiz", () => {
  it("scores 0 when every item is unanswered", () => {
    expect(scoreVibrationsQuiz(initialVibrationsQuizAnswers())).toBe(0);
  });

  it("scores full marks when every answer matches the key", () => {
    const answers = initialVibrationsQuizAnswers();
    for (const item of VIBRATIONS_QUIZ_ITEMS) {
      answers[item.id] = item.correctAnswer;
    }
    expect(scoreVibrationsQuiz(answers)).toBe(VIBRATIONS_QUIZ_ITEMS.length);
  });

  it("only credits answers that match the correct answer", () => {
    const answers = initialVibrationsQuizAnswers();
    // Flip every answer to the wrong value.
    for (const item of VIBRATIONS_QUIZ_ITEMS) {
      answers[item.id] = !item.correctAnswer;
    }
    expect(scoreVibrationsQuiz(answers)).toBe(0);
  });

  it("counts a single correct answer among wrong ones", () => {
    const answers = initialVibrationsQuizAnswers();
    for (const item of VIBRATIONS_QUIZ_ITEMS) {
      answers[item.id] = !item.correctAnswer;
    }
    answers.b = true; // "b" is correct; flips it back to right
    expect(scoreVibrationsQuiz(answers)).toBe(1);
  });
});
