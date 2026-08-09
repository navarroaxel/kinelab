"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useVibrationsQuiz } from "@/hooks/useVibrationsQuiz";

export function VibrationsQuiz() {
  const { t } = useLanguage();
  const { items, answers, setAnswer, submitted, submit, retry, score } =
    useVibrationsQuiz();

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-700 dark:text-gray-300">
        {t("vq.instructions")}
      </p>

      <ol className="flex flex-col gap-3">
        {items.map((item) => {
          const answer = answers[item.id];
          const isCorrect = submitted && answer === item.correctAnswer;
          const isWrong = submitted && answer !== item.correctAnswer;

          return (
            <li
              key={item.id}
              className={`flex flex-col gap-2 rounded-lg border p-3 ${
                isCorrect
                  ? "border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/30"
                  : isWrong
                    ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
                    : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
              }`}
            >
              <span className="text-sm text-gray-900 dark:text-gray-100">
                <span className="font-semibold">{item.id}. </span>
                {t(item.statementKey)}
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAnswer(item.id, true)}
                  aria-pressed={answer === true}
                  className={`rounded-md border px-3 py-1 text-xs font-medium transition-colors ${
                    answer === true
                      ? "border-blue-400 bg-blue-100 text-blue-800 dark:border-blue-600 dark:bg-blue-900/50 dark:text-blue-200"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                >
                  {t("vq.true")}
                </button>
                <button
                  type="button"
                  onClick={() => setAnswer(item.id, false)}
                  aria-pressed={answer === false}
                  className={`rounded-md border px-3 py-1 text-xs font-medium transition-colors ${
                    answer === false
                      ? "border-blue-400 bg-blue-100 text-blue-800 dark:border-blue-600 dark:bg-blue-900/50 dark:text-blue-200"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                >
                  {t("vq.false")}
                </button>
              </div>

              {submitted && (
                <span
                  className={`text-xs ${
                    isCorrect
                      ? "text-green-700 dark:text-green-400"
                      : "text-red-700 dark:text-red-400"
                  }`}
                >
                  <span className="font-medium">
                    {isCorrect ? t("vq.correct") : t("vq.incorrect")}:
                  </span>{" "}
                  {t(item.justificationKey)}
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <div className="flex items-center gap-3">
        {submitted ? (
          <button
            type="button"
            onClick={retry}
            className="rounded-md border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {t("vq.retry")}
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            {t("vq.submit")}
          </button>
        )}

        {submitted && (
          <span className="ml-auto text-sm font-semibold text-gray-900 dark:text-gray-100">
            {t("vq.score_label")}: {score}/{items.length}
          </span>
        )}
      </div>
    </div>
  );
}
