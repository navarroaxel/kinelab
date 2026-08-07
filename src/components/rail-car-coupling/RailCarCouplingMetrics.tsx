"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import type { RailCarCouplingState } from "@/types/simulator";

interface Props {
  state: RailCarCouplingState;
}

export const RailCarCouplingMetrics = memo(function RailCarCouplingMetrics({
  state,
}: Props) {
  const { t } = useLanguage();

  const cards = [
    {
      id: "v1",
      label: t("rail-car-coupling.metrics.v1"),
      value: (state.speed1 * 3.6).toFixed(2),
      unit: "km/h",
    },
    {
      id: "vf",
      label: withSubscripts(t("rail-car-coupling.metrics.vf")),
      value: (state.finalSpeed * 3.6).toFixed(3),
      unit: "km/h",
    },
    {
      id: "impulse",
      label: t("rail-car-coupling.metrics.impulse"),
      value: (state.impulse / 1000).toFixed(2),
      unit: "kN·s",
    },
    {
      id: "avg_force",
      label: t("rail-car-coupling.metrics.avg_force"),
      value: (state.avgForce / 1000).toFixed(2),
      unit: "kN",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("rail-car-coupling.metrics.heading")}
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
