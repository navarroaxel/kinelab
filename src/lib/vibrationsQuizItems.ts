import type {
  VibrationsQuizAnswers,
  VibrationsQuizItem,
} from "@/types/simulator";

export const VIBRATIONS_QUIZ_ITEMS: VibrationsQuizItem[] = [
  {
    id: "a",
    statementKey: "vq.q.a",
    correctAnswer: false,
    justificationKey: "vq.j.a",
  },
  {
    id: "b",
    statementKey: "vq.q.b",
    correctAnswer: true,
    justificationKey: "vq.j.b",
  },
  {
    id: "c",
    statementKey: "vq.q.c",
    correctAnswer: true,
    justificationKey: "vq.j.c",
  },
  {
    id: "d",
    statementKey: "vq.q.d",
    correctAnswer: false,
    justificationKey: "vq.j.d",
  },
  {
    id: "e",
    statementKey: "vq.q.e",
    correctAnswer: true,
    justificationKey: "vq.j.e",
  },
  {
    id: "f",
    statementKey: "vq.q.f",
    correctAnswer: false,
    justificationKey: "vq.j.f",
  },
  {
    id: "g",
    statementKey: "vq.q.g",
    correctAnswer: false,
    justificationKey: "vq.j.g",
  },
  {
    id: "h",
    statementKey: "vq.q.h",
    correctAnswer: false,
    justificationKey: "vq.j.h",
  },
  {
    id: "i",
    statementKey: "vq.q.i",
    correctAnswer: true,
    justificationKey: "vq.j.i",
  },
  {
    id: "j",
    statementKey: "vq.q.j",
    correctAnswer: true,
    justificationKey: "vq.j.j",
  },
  {
    id: "k",
    statementKey: "vq.q.k",
    correctAnswer: false,
    justificationKey: "vq.j.k",
  },
  {
    id: "l",
    statementKey: "vq.q.l",
    correctAnswer: true,
    justificationKey: "vq.j.l",
  },
];

export function initialVibrationsQuizAnswers(): VibrationsQuizAnswers {
  return Object.fromEntries(
    VIBRATIONS_QUIZ_ITEMS.map((item) => [item.id, null]),
  );
}

export function isVibrationsQuizFullyAnswered(
  answers: VibrationsQuizAnswers,
): boolean {
  return VIBRATIONS_QUIZ_ITEMS.every((item) => answers[item.id] !== null);
}

export function scoreVibrationsQuiz(answers: VibrationsQuizAnswers): number {
  return VIBRATIONS_QUIZ_ITEMS.reduce(
    (acc, item) => acc + (answers[item.id] === item.correctAnswer ? 1 : 0),
    0,
  );
}
