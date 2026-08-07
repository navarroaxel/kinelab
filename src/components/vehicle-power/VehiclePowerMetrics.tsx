"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import type { VehiclePowerState } from "@/types/simulator";

interface Props {
  state: VehiclePowerState;
}

export const VehiclePowerMetrics = memo(function VehiclePowerMetrics({
  state,
}: Props) {
  const { t } = useLanguage();

  const cards = [
    {
      id: "a",
      label: t("vehicle-power.metrics.a"),
      value: state.a.toFixed(2),
      unit: "N",
    },
    {
      id: "b",
      label: t("vehicle-power.metrics.b"),
      value: state.b.toFixed(3),
      unit: "N·s²/m²",
    },
    {
      id: "p_flat",
      label: withSubscripts(t("vehicle-power.metrics.p_flat")),
      value: (state.targetPowerFlat / 1000).toFixed(2),
      unit: "kW",
    },
    {
      id: "p_slope",
      label: withSubscripts(t("vehicle-power.metrics.p_slope")),
      value: (state.targetPowerSlope / 1000).toFixed(2),
      unit: "kW",
    },
    {
      id: "grade_force",
      label: t("vehicle-power.metrics.grade_force"),
      value: state.gradeForce.toFixed(1),
      unit: "N",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("vehicle-power.metrics.heading")}
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
