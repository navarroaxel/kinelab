"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import type { EscalatorState } from "@/types/simulator";

interface Props {
  state: EscalatorState;
}

export const EscalatorMetrics = memo(function EscalatorMetrics({
  state,
}: Props) {
  const { t } = useLanguage();

  const cards = [
    {
      id: "p_elec",
      label: withSubscripts(t("escalator.metrics.p_elec")),
      value: (state.electricalPower / 1000).toFixed(2),
      unit: "kW",
    },
    {
      id: "p_mech",
      label: withSubscripts(t("escalator.metrics.p_mech")),
      value: (state.mechanicalPower / 1000).toFixed(2),
      unit: "kW",
    },
    {
      id: "efficiency",
      label: t("escalator.metrics.efficiency"),
      value: (state.efficiency * 100).toFixed(1),
      unit: "%",
    },
    {
      id: "climb_speed",
      label: t("escalator.metrics.climb_speed"),
      value: state.climbSpeed.toFixed(3),
      unit: "m/s",
    },
    {
      id: "work",
      label: t("escalator.metrics.work"),
      value: (state.workOutput / 1000).toFixed(1),
      unit: "kJ",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("escalator.metrics.heading")}
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
