"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import type { HoistState } from "@/types/simulator";

interface Props {
  state: HoistState;
}

export const HoistMetrics = memo(function HoistMetrics({ state }: Props) {
  const { t } = useLanguage();

  const cards = [
    {
      id: "p_elec",
      label: "Pₑ",
      value: (state.electricalPower / 1000).toFixed(2),
      unit: "kW",
    },
    {
      id: "p_mech",
      label: "Pₘ",
      value: (state.mechanicalPower / 1000).toFixed(2),
      unit: "kW",
    },
    {
      id: "efficiency",
      label: t("hoist.metrics.efficiency"),
      value: (state.efficiency * 100).toFixed(1),
      unit: "%",
    },
    {
      id: "counterweight_speed",
      label: withSubscripts(t("hoist.metrics.counterweight_speed")),
      value: state.counterweightSpeed.toFixed(1),
      unit: "m/s",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("hoist.metrics.heading")}
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
