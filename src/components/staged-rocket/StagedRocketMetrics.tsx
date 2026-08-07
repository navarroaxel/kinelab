"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { StagedRocketState } from "@/types/simulator";

interface Props {
  state: StagedRocketState;
}

export const StagedRocketMetrics = memo(function StagedRocketMetrics({
  state,
}: Props) {
  const { t } = useLanguage();

  const cards = [
    {
      id: "v_single",
      label: t("staged-rocket.metrics.v_single"),
      value: state.singleStage.maxSpeed.toFixed(0),
      unit: "m/s",
    },
    {
      id: "v_sep",
      label: t("staged-rocket.metrics.v_sep"),
      value: state.twoStage.speedAtSeparation.toFixed(0),
      unit: "m/s",
    },
    {
      id: "v_two",
      label: t("staged-rocket.metrics.v_two"),
      value: state.twoStage.maxSpeed.toFixed(0),
      unit: "m/s",
    },
    {
      id: "gain",
      label: t("staged-rocket.metrics.gain"),
      value: state.speedGain.toFixed(0),
      unit: "m/s",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("staged-rocket.metrics.heading")}
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
