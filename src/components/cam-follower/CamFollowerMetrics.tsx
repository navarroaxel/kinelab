"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import { wrapAngle } from "@/lib/camFollowerKinematics";
import type { CamFollowerExtremes, CamFollowerState } from "@/types/simulator";

interface Props {
  state: CamFollowerState;
  extremes: CamFollowerExtremes;
}

const deg = (rad: number) => ((wrapAngle(rad) * 180) / Math.PI).toFixed(0);

export const CamFollowerMetrics = memo(function CamFollowerMetrics({
  state,
  extremes,
}: Props) {
  const { t } = useLanguage();

  const live = [
    { id: "theta", label: t("cf.metrics.theta"), value: deg(state.theta), unit: "°" },
    {
      id: "z",
      label: t("cf.metrics.z"),
      value: (state.z * 1000).toFixed(1),
      unit: "mm",
    },
    {
      id: "z_dot",
      label: t("cf.metrics.z_dot"),
      value: state.zDot.toFixed(3),
      unit: "m/s",
    },
    {
      id: "z_ddot",
      label: t("cf.metrics.z_ddot"),
      value: state.zDDot.toFixed(3),
      unit: "m/s²",
    },
    {
      id: "normal",
      label: withSubscripts(t("cf.metrics.normal")),
      value: state.normalVertical.toFixed(2),
      unit: "N",
    },
    {
      id: "slope",
      label: t("cf.metrics.slope"),
      value: ((state.slope * 180) / Math.PI).toFixed(1),
      unit: "°",
    },
  ];

  const answers = [
    {
      id: "max",
      label: withSubscripts(t("cf.metrics.max")),
      value: extremes.verticalMax.toFixed(2),
      hint: `θ = ${deg(extremes.verticalMaxTheta)}°`,
    },
    {
      id: "min",
      label: withSubscripts(t("cf.metrics.min")),
      value: extremes.verticalMin.toFixed(2),
      hint: `θ = ${deg(extremes.verticalMinTheta)}°`,
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("cf.metrics.heading")}
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {live.map((card) => (
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

      <h3 className="mt-3 mb-2 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
        {t("cf.metrics.answer_heading")}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {answers.map((card) => (
          <div
            key={card.id}
            className="rounded-lg bg-blue-50 p-2 dark:bg-blue-950/40"
          >
            <div className="mb-0.5 text-[10px] leading-tight text-blue-700 dark:text-blue-300">
              {card.label}
            </div>
            <div className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-100">
              {card.value}
              <span className="ml-0.5 text-xs font-normal text-gray-400">N</span>
            </div>
            <div className="mt-0.5 font-mono text-[10px] text-gray-400">
              {card.hint}
            </div>
          </div>
        ))}
      </div>

      {state.contactLost && (
        <p className="mt-2 rounded-lg bg-red-50 p-2 text-[10px] leading-tight text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {t("cf.metrics.contact_lost")}
        </p>
      )}
    </div>
  );
});
