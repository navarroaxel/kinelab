"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ViscousImpactState } from "@/types/simulator";

interface Props {
  state: ViscousImpactState;
}

export const ViscousImpactMetrics = memo(function ViscousImpactMetrics({
  state,
}: Props) {
  const { t } = useLanguage();

  const cards = [
    {
      id: "decel",
      label: t("viscous-impact.metrics.decel"),
      value: state.decelRate.toFixed(0),
      unit: "1/s",
    },
    {
      id: "k",
      label: t("viscous-impact.metrics.k"),
      value: state.dragConstant.toFixed(1),
      unit: "N·s/m",
    },
    {
      id: "penetration",
      label: t("viscous-impact.metrics.penetration"),
      value: (state.penetrationDepth * 1000).toFixed(1),
      unit: "mm",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("viscous-impact.metrics.heading")}
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
      {!state.valid && (
        <p className="mt-2 text-[10px] leading-relaxed text-rose-600 dark:text-rose-400">
          {t("viscous-impact.metrics.warn.invalid")}
        </p>
      )}
    </div>
  );
});
