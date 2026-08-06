"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { MotionGraphsState } from "@/types/simulator";

interface Props {
  state: MotionGraphsState;
}

export const MotionGraphsMetrics = memo(function MotionGraphsMetrics({
  state,
}: Props) {
  const { t } = useLanguage();

  const cards = [
    {
      label: t("motion-graphs.metrics.t"),
      value: state.t.toFixed(1),
      unit: "s",
    },
    {
      label: t("motion-graphs.metrics.v"),
      value: state.v.toFixed(1),
      unit: "m/s",
    },
    {
      label: t("motion-graphs.metrics.a"),
      value: state.a.toFixed(2),
      unit: "m/s²",
    },
    {
      label: t("motion-graphs.metrics.x"),
      value: state.x.toFixed(1),
      unit: "m",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("motion-graphs.metrics.heading")}
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg bg-gray-50 p-2 dark:bg-gray-800"
          >
            <div className="mb-0.5 text-[10px] leading-tight text-gray-500 dark:text-gray-400">
              {card.label}
            </div>
            <div className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-100">
              {card.value}
              <span className="ml-0.5 text-xs font-normal text-gray-400">
                {card.unit}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-baseline justify-between text-[10px] text-gray-500 dark:text-gray-400">
        <span>{t("motion-graphs.metrics.xfinal")}</span>
        <span className="font-mono text-gray-700 dark:text-gray-200">
          {state.xFinal.toFixed(1)} m
        </span>
      </div>
    </div>
  );
});
