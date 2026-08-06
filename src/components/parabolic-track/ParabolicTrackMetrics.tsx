"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import type { ParabolicTrackState } from "@/types/simulator";

interface Props {
  state: ParabolicTrackState;
}

export const ParabolicTrackMetrics = memo(function ParabolicTrackMetrics({
  state,
}: Props) {
  const { t } = useLanguage();

  const cards = [
    {
      label: withSubscripts(t("parabolic-track.metrics.rc")),
      value: state.Rc.toFixed(2),
      unit: "m",
    },
    {
      label: withSubscripts(t("parabolic-track.metrics.at")),
      value: state.at.toFixed(2),
      unit: "m/s²",
    },
    {
      label: withSubscripts(t("parabolic-track.metrics.an")),
      value: state.an.toFixed(3),
      unit: "m/s²",
    },
    {
      label: t("parabolic-track.metrics.a"),
      value: state.a.toFixed(3),
      unit: "m/s²",
    },
    {
      label: t("parabolic-track.metrics.beta"),
      value: state.betaDeg.toFixed(1),
      unit: "°",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("parabolic-track.metrics.heading")}
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
