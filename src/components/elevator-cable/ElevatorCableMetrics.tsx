"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ElevatorCableState } from "@/types/simulator";

interface Props {
  state: ElevatorCableState;
}

function formatMaybeInfinite(v: number, digits: number): string {
  return isFinite(v) ? v.toFixed(digits) : v > 0 ? "→ ∞" : "→ −∞";
}

export const ElevatorCableMetrics = memo(function ElevatorCableMetrics({
  state,
}: Props) {
  const { t } = useLanguage();

  const cards = [
    {
      label: t("elevator-cable.metrics.t"),
      value: state.t.toFixed(2),
      unit: "s",
    },
    {
      label: t("elevator-cable.metrics.x"),
      value: state.x.toFixed(3),
      unit: "m",
    },
    {
      label: t("elevator-cable.metrics.xdot"),
      value: formatMaybeInfinite(state.xDot, 3),
      unit: isFinite(state.xDot) ? "m/s" : "",
      danger: state.singular,
    },
    {
      label: t("elevator-cable.metrics.xddot"),
      value: formatMaybeInfinite(state.xDDot, 4),
      unit: isFinite(state.xDDot) ? "m/s²" : "",
      danger: state.singular,
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("elevator-cable.metrics.heading")}
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
      {state.singular && (
        <p className="mt-2 text-[10px] leading-relaxed text-rose-600 dark:text-rose-400">
          {t("elevator-cable.controls.warn.singular")}
        </p>
      )}
    </div>
  );
});
