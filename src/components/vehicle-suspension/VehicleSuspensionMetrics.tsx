"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import type { VehicleSuspensionState } from "@/types/simulator";

interface Props {
  state: VehicleSuspensionState;
}

export const VehicleSuspensionMetrics = memo(function VehicleSuspensionMetrics({
  state,
}: Props) {
  const { t } = useLanguage();

  const cards = [
    {
      id: "kEq",
      label: withSubscripts(t("vs.metrics.kEq")),
      value: state.equivalentStiffness.toFixed(0),
      unit: "N/m",
    },
    {
      id: "cEq",
      label: withSubscripts(t("vs.metrics.cEq")),
      value: state.equivalentDamping.toFixed(0),
      unit: "N·s/m",
    },
    {
      id: "omegaN",
      label: withSubscripts(t("vs.metrics.omegaN")),
      value: state.naturalFrequency.toFixed(3),
      unit: "rad/s",
    },
    {
      id: "zeta",
      label: t("vs.metrics.zeta"),
      value: state.dampingRatio.toFixed(3),
      unit: "",
    },
    {
      id: "TR",
      label: t("vs.metrics.TR"),
      value: state.transmissibility.toFixed(3),
      unit: "",
    },
    {
      id: "X0",
      label: withSubscripts(t("vs.metrics.X0")),
      value: (state.responseAmplitude * 100).toFixed(2),
      unit: "cm",
    },
    {
      id: "y",
      label: "y(t)",
      value: (state.y * 100).toFixed(2),
      unit: "cm",
    },
    {
      id: "x",
      label: "x(t)",
      value: (state.x * 100).toFixed(2),
      unit: "cm",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("vs.metrics.heading")}
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {cards.map((card) => (
          <div key={card.id} className="rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
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
