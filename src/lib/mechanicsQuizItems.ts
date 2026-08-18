import type {
  MechanicsQuizAnswers,
  MechanicsQuizItem,
} from "@/types/simulator";

// Object keys "01".."36" would be reordered by JS (canonical integer-like
// keys sort numerically first), so the answer key is a plain ordered array.
const ANSWER_KEY: boolean[] = [
  true, // 01
  false, // 02
  true, // 03
  true, // 04
  true, // 05
  false, // 06
  true, // 07
  true, // 08
  true, // 09
  false, // 10
  true, // 11
  true, // 12
  true, // 13
  true, // 14
  true, // 15
  false, // 16
  true, // 17
  true, // 18
  true, // 19
  false, // 20
  true, // 21
  true, // 22
  false, // 23
  true, // 24
  true, // 25
  true, // 26
  false, // 27
  true, // 28
  true, // 29
  false, // 30
  true, // 31
  false, // 32
  true, // 33
  false, // 34
  true, // 35
  false, // 36
];

export const MECHANICS_QUIZ_ITEMS: MechanicsQuizItem[] = ANSWER_KEY.map(
  (correctAnswer, index) => {
    const id = String(index + 1).padStart(2, "0");
    return {
      id,
      statementKey: `mq.q.${id}` as MechanicsQuizItem["statementKey"],
      correctAnswer,
      justificationKey: `mq.j.${id}` as MechanicsQuizItem["justificationKey"],
    };
  },
);

export function initialMechanicsQuizAnswers(): MechanicsQuizAnswers {
  return Object.fromEntries(
    MECHANICS_QUIZ_ITEMS.map((item) => [item.id, null]),
  );
}

export function isMechanicsQuizFullyAnswered(
  answers: MechanicsQuizAnswers,
): boolean {
  return MECHANICS_QUIZ_ITEMS.every((item) => answers[item.id] !== null);
}

export function scoreMechanicsQuiz(answers: MechanicsQuizAnswers): number {
  return MECHANICS_QUIZ_ITEMS.reduce(
    (acc, item) => acc + (answers[item.id] === item.correctAnswer ? 1 : 0),
    0,
  );
}
