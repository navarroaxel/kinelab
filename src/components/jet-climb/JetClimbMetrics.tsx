"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import type { JetClimbSample, JetClimbState } from "@/types/simulator";

interface Props {
  state: JetClimbState;
  metrics: JetClimbSample;
}

export const JetClimbMetrics = memo(function JetClimbMetrics({
  state,
  metrics,
}: Props) {
  const { t } = useLanguage();

  const cards = [
    {
      id: "v",
      label: "v(t)",
      value: (metrics.v * 3.6).toFixed(0),
      unit: "km/h",
    },
    {
      id: "a",
      label: "a(t)",
      value: metrics.a.toFixed(2),
      unit: "m/s²",
    },
    {
      id: "a0",
      label: t("jc.metrics.a0"),
      value: state.initialAccel.toFixed(3),
      unit: "m/s²",
    },
    {
      id: "vmax",
      label: t("jc.metrics.vmax"),
      value: (state.vMax * 3.6).toFixed(0),
      unit: "km/h",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("jc.metrics.heading")}
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
