"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import type { HelicopterLiftState } from "@/types/simulator";

interface Props {
  state: HelicopterLiftState;
}

export const HelicopterLiftMetrics = memo(function HelicopterLiftMetrics({
  state,
}: Props) {
  const { t } = useLanguage();

  const cards = [
    {
      id: "wake_area",
      label: t("hl.metrics.wake_area"),
      value: state.wakeArea.toFixed(1),
      unit: "ft²",
    },
    {
      id: "mass_flow",
      label: t("hl.metrics.mass_flow"),
      value: state.massFlowRate.toFixed(2),
      unit: "slug/s",
    },
    {
      id: "thrust",
      label: "T",
      value: state.thrust.toFixed(0),
      unit: "lb",
    },
    {
      id: "max_load",
      label: t("hl.metrics.max_load"),
      value: state.maxLoad.toFixed(0),
      unit: "lb",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("hl.metrics.heading")}
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {cards.map((card) => (
          <div
            key={card.id}
            className="rounded-lg bg-gray-50 p-2 dark:bg-gray-800"
          >
            <div className="mb-0.5 text-[10px] leading-tight text-gray-500 dark:text-gray-400">
              {withSubscripts(card.label)}
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
