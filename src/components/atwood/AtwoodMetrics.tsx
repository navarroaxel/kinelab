"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import type { AtwoodState } from "@/types/simulator";

interface Props {
  state: AtwoodState;
}

export const AtwoodMetrics = memo(function AtwoodMetrics({ state }: Props) {
  const { t } = useLanguage();

  const cards = [
    {
      id: "acceleration",
      label: t("atwood.metrics.acceleration"),
      value: state.acceleration.toFixed(3),
      unit: "m/s²",
    },
    {
      id: "tension1",
      label: withSubscripts(t("atwood.metrics.tension1")),
      value: state.tension1.toFixed(1),
      unit: "N",
    },
    {
      id: "tension2",
      label: withSubscripts(t("atwood.metrics.tension2")),
      value: state.tension2.toFixed(1),
      unit: "N",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("atwood.metrics.heading")}
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {cards.map((card) => (
          <div
            key={card.id}
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
    </div>
  );
});
