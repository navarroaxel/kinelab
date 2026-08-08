"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ParabolicBowlState } from "@/types/simulator";

interface Props {
  state: ParabolicBowlState;
}

export const ParabolicBowlMetrics = memo(function ParabolicBowlMetrics({
  state,
}: Props) {
  const { t } = useLanguage();

  const cards = [
    {
      id: "a_bottom",
      label: t("parabolic-bowl.metrics.a_bottom"),
      value: state.bottomAccelerationInGs.toFixed(2),
      unit: "g",
      danger: state.exceedsLimit,
    },
    {
      id: "n_bottom",
      label: t("parabolic-bowl.metrics.n_bottom"),
      value: state.normalForceAtBottom.toFixed(1),
      unit: "N",
    },
    {
      id: "min_span",
      label: t("parabolic-bowl.metrics.min_span"),
      value: state.minSpanForLimit.toFixed(2),
      unit: "m",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("parabolic-bowl.metrics.heading")}
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`rounded-lg p-2 ${
              card.danger
                ? "border border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-950"
                : "bg-gray-50 dark:bg-gray-800"
            }`}
          >
            <div className="mb-0.5 text-[10px] leading-tight text-gray-500 dark:text-gray-400">
              {card.label}
            </div>
            <div
              className={`font-mono text-sm font-semibold ${
                card.danger
                  ? "text-rose-700 dark:text-rose-400"
                  : "text-gray-800 dark:text-gray-100"
              }`}
            >
              {card.value}
              <span className="ml-0.5 text-xs font-normal text-gray-400">
                {card.unit}
              </span>
            </div>
          </div>
        ))}
      </div>
      {state.exceedsLimit && (
        <p className="mt-2 text-[10px] leading-relaxed text-rose-600 dark:text-rose-400">
          {t("parabolic-bowl.metrics.warn.exceeds")}
        </p>
      )}
    </div>
  );
});
