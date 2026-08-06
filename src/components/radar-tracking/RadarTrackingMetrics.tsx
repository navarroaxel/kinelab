"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { RadarTrackingState } from "@/types/simulator";

interface Props {
  state: RadarTrackingState;
}

export const RadarTrackingMetrics = memo(function RadarTrackingMetrics({
  state,
}: Props) {
  const { t } = useLanguage();

  const cards = [
    {
      label: t("radar-tracking.metrics.r"),
      value: state.r.toFixed(1),
      unit: "m",
    },
    {
      label: t("radar-tracking.metrics.theta"),
      value: state.thetaDeg.toFixed(2),
      unit: "°",
    },
    {
      label: t("radar-tracking.metrics.rdot"),
      value: state.rDot.toFixed(2),
      unit: "m/s",
    },
    {
      label: t("radar-tracking.metrics.thetadot"),
      value: state.thetaDot.toFixed(4),
      unit: "rad/s",
    },
    {
      label: t("radar-tracking.metrics.rddot"),
      value: state.rDDot.toFixed(3),
      unit: "m/s²",
    },
    {
      label: t("radar-tracking.metrics.thetaddot"),
      value: state.thetaDDot.toFixed(5),
      unit: "rad/s²",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("radar-tracking.metrics.heading")}
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {cards.map((card, i) => (
          <div key={i} className="rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
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
