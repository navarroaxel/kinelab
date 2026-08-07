"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import type { SpringStopState } from "@/types/simulator";

interface Props {
  state: SpringStopState;
}

export const SpringStopMetrics = memo(function SpringStopMetrics({
  state,
}: Props) {
  const { t } = useLanguage();

  const cards = [
    {
      id: "precompression_force",
      label: withSubscripts(t("spring-stop.metrics.precompression_force")),
      value: state.springForceAtPrecompression.toFixed(0),
      unit: "N",
    },
    {
      id: "deformation",
      label: t("spring-stop.metrics.deformation"),
      value: (state.additionalDeformation * 100).toFixed(1),
      unit: "cm",
    },
    {
      id: "max_force",
      label: t("spring-stop.metrics.max_force"),
      value: state.maxSpringForce.toFixed(0),
      unit: "N",
    },
    {
      id: "valid",
      label: t("spring-stop.metrics.valid"),
      value: state.valid ? "✓" : "✗",
      unit: "",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("spring-stop.metrics.heading")}
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
