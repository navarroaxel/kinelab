"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { DragDescentState } from "@/types/simulator";

interface Props {
  state: DragDescentState;
}

export const DragDescentMetrics = memo(function DragDescentMetrics({
  state,
}: Props) {
  const { t } = useLanguage();

  const cards = [
    {
      label: t("drag-descent.metrics.t"),
      value: state.t.toFixed(1),
      unit: "s",
    },
    {
      label: t("drag-descent.metrics.v"),
      value: state.v.toFixed(2),
      unit: "m/s",
    },
    {
      label: t("drag-descent.metrics.x"),
      value: state.x.toFixed(1),
      unit: "m",
    },
    {
      label: t("drag-descent.metrics.a"),
      value: state.a.toFixed(4),
      unit: "m/s²",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("drag-descent.metrics.heading")}
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
      <div className="mt-3 text-[10px] text-gray-500 dark:text-gray-400">
        <div className="mb-1 flex items-baseline justify-between">
          <span>{t("drag-descent.metrics.vmax_pct")}</span>
          <span className="font-mono text-gray-700 dark:text-gray-200">
            {state.vOverVmaxPct.toFixed(1)}%
          </span>
        </div>
        <div className="relative h-1.5 overflow-hidden rounded bg-gray-100 dark:bg-gray-800">
          <div
            className="absolute inset-y-0 left-0 bg-blue-400 dark:bg-blue-500"
            style={{ width: `${Math.min(state.vOverVmaxPct, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
});
