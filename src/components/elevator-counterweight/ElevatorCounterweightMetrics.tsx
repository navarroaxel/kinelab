"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ElevatorCounterweightState } from "@/types/simulator";

interface Props {
  state: ElevatorCounterweightState;
}

export const ElevatorCounterweightMetrics = memo(
  function ElevatorCounterweightMetrics({ state }: Props) {
    const { t } = useLanguage();

    return (
      <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
        <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
          {t("elevator-counterweight.metrics.heading")}
        </h2>
        <div
          className={`rounded-lg p-3 ${
            state.isBraking
              ? "border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950"
              : "bg-gray-50 dark:bg-gray-800"
          }`}
        >
          <div className="mb-0.5 text-[10px] leading-tight text-gray-500 dark:text-gray-400">
            {t("elevator-counterweight.metrics.power")}
          </div>
          <div
            className={`font-mono text-sm font-semibold ${
              state.isBraking
                ? "text-amber-700 dark:text-amber-400"
                : "text-gray-800 dark:text-gray-100"
            }`}
          >
            {(Math.abs(state.motorPower) / 1000).toFixed(2)}
            <span className="ml-0.5 text-xs font-normal text-gray-400">kW</span>
          </div>
        </div>
        <p className="mt-2 text-[10px] leading-relaxed text-gray-500 dark:text-gray-400">
          {state.isBraking
            ? t("elevator-counterweight.metrics.note.braking")
            : t("elevator-counterweight.metrics.note.driving")}
        </p>
      </div>
    );
  },
);
