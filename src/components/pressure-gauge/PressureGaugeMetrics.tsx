"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import type { PressureGaugeDerived } from "@/types/simulator";

interface Props {
  derived: PressureGaugeDerived;
}

export const PressureGaugeMetrics = memo(function PressureGaugeMetrics({
  derived,
}: Props) {
  const { t } = useLanguage();

  const cards = [
    {
      id: "omega",
      label: "ω",
      value: derived.omega.toFixed(3),
      unit: "rad/s",
    },
    {
      id: "rMax",
      label: withSubscripts("r_max"),
      value: derived.rMax.toFixed(4),
      unit: "",
    },
    {
      id: "maxMass",
      label: withSubscripts("M_max"),
      value: (derived.maxMass * 1000).toFixed(1),
      unit: "g",
    },
    {
      id: "requiredOmegaN",
      label: withSubscripts("ω_0"),
      value: derived.requiredNaturalFrequency.toFixed(2),
      unit: "rad/s",
    },
    {
      id: "ratio",
      label: "ω₀/ω",
      value: derived.frequencyRatioRequired.toFixed(2),
      unit: "",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("vib5.metrics.heading")}
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
      <p className="mt-2 rounded-lg bg-blue-50 px-2 py-1.5 text-[11px] text-blue-700 dark:bg-blue-950 dark:text-blue-300">
        {t("vib5.metrics.design_rule")}
      </p>
    </div>
  );
});
