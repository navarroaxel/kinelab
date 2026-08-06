"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CircularOrbitState } from "@/types/simulator";

interface Props {
  state: CircularOrbitState;
}

function formatPeriod(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

export const CircularOrbitMetrics = memo(function CircularOrbitMetrics({
  state,
}: Props) {
  const { t } = useLanguage();

  const cards = [
    {
      label: t("circular-orbit.metrics.v"),
      value: state.v.toFixed(1),
      unit: "m/s",
    },
    {
      label: t("circular-orbit.metrics.r"),
      value: state.r.toFixed(1),
      unit: "km",
    },
    {
      label: t("circular-orbit.metrics.h"),
      value: state.h.toFixed(1),
      unit: "km",
      danger: state.hitsSurface,
    },
    {
      label: t("circular-orbit.metrics.t"),
      value: formatPeriod(state.T),
      unit: "",
    },
    {
      label: t("circular-orbit.metrics.an"),
      value: state.aN.toFixed(3),
      unit: "m/s²",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("circular-orbit.metrics.heading")}
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`rounded-lg p-2 ${
              card.danger
                ? "border border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-950"
                : "bg-gray-50 dark:bg-gray-800"
            }`}
          >
            <div className="mb-0.5 text-[10px] leading-tight text-gray-500 dark:text-gray-400">
              {card.label}
            </div>
            <div
              className={`font-mono text-sm font-semibold ${
                card.danger
                  ? "text-rose-700 dark:text-rose-400"
                  : "text-gray-800 dark:text-gray-100"
              }`}
            >
              {card.value}
              {card.unit && (
                <span className="ml-0.5 text-xs font-normal text-gray-400">
                  {card.unit}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
