"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import type { CableBlocksState } from "@/types/simulator";

interface Props {
  state: CableBlocksState;
}

export const CableBlocksMetrics = memo(function CableBlocksMetrics({
  state,
}: Props) {
  const { t } = useLanguage();

  const cards = [
    {
      label: t("cable-blocks.metrics.t"),
      value: state.t.toFixed(3),
      unit: "s",
    },
    {
      label: withSubscripts(t("cable-blocks.metrics.sa")),
      value: state.sA.toFixed(3),
      unit: "m",
    },
    {
      label: withSubscripts(t("cable-blocks.metrics.sb")),
      value: state.sB.toFixed(3),
      unit: "m",
    },
    {
      label: withSubscripts(t("cable-blocks.metrics.va")),
      value: state.vA.toFixed(3),
      unit: "m/s",
    },
    {
      label: withSubscripts(t("cable-blocks.metrics.vb")),
      value: state.vB.toFixed(3),
      unit: "m/s",
    },
    {
      label: t("cable-blocks.metrics.d"),
      value: state.d.toFixed(3),
      unit: "m",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("cable-blocks.metrics.heading")}
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
      <div className="mt-3 flex items-baseline justify-between text-[10px] text-gray-500 dark:text-gray-400">
        <span>{withSubscripts(t("cable-blocks.metrics.tmeet"))}</span>
        <span className="font-mono text-gray-700 dark:text-gray-200">
          {state.tMeet.toFixed(4)} s
        </span>
      </div>
    </div>
  );
});
