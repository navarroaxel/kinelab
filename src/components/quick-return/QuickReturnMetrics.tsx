"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { extremes } from "@/lib/quickReturnKinematics";
import type { QuickReturnParams, QuickReturnState } from "@/types/simulator";

interface Props {
  state: QuickReturnState;
  params: QuickReturnParams;
}

function toDeg(rad: number) {
  return (rad * 180) / Math.PI;
}

export const QuickReturnMetrics = memo(function QuickReturnMetrics({
  state,
  params,
}: Props) {
  const { t } = useLanguage();
  const { xMax, alpha, quickReturnRatio } = extremes(params);

  const vCenter0 =
    (params.omega * params.L1 * params.r) / (params.L2 - params.r);
  const vCenterPi =
    -(params.omega * params.L1 * params.r) / (params.L2 + params.r);

  const cards = [
    {
      label: t("quick-return.metrics.phi"),
      value: toDeg(state.phi).toFixed(1),
      unit: "°",
    },
    {
      label: t("quick-return.metrics.x"),
      value: state.x.toFixed(1),
      unit: "u",
    },
    {
      label: t("quick-return.metrics.v"),
      value: state.v.toFixed(2),
      unit: "u/s",
    },
    {
      label: t("quick-return.metrics.a"),
      value: state.a.toFixed(2),
      unit: "u/s²",
    },
  ];

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("quick-return.metrics.heading")}
      </h2>

      {/* Live cards */}
      <div className="grid grid-cols-2 gap-2">
        {cards.map((card) => (
          <div
            key={card.label}
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

      {/* Derived results */}
      <div className="flex flex-col gap-1.5 border-t border-gray-100 pt-2 text-[10px] dark:border-gray-800">
        <h3 className="mb-1 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
          {t("quick-return.metrics.derived_heading")}
        </h3>

        {/* Quick-return ratio — headline */}
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-2 dark:border-amber-800 dark:bg-amber-950">
          <div className="mb-0.5 text-[10px] text-amber-700 dark:text-amber-400">
            {t("quick-return.metrics.ratio_label")}
          </div>
          <div className="font-mono text-base font-bold text-amber-800 dark:text-amber-300">
            {quickReturnRatio.toFixed(3)} : 1
          </div>
          <div className="mt-0.5 text-[9px] leading-tight text-amber-600 dark:text-amber-500">
            {t("quick-return.metrics.ratio_note")}
          </div>
        </div>

        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>{t("quick-return.metrics.alpha")}</span>
          <span className="font-mono text-gray-700 dark:text-gray-300">
            {toDeg(alpha).toFixed(1)}°
          </span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>{t("quick-return.metrics.xmax")}</span>
          <span className="font-mono text-gray-700 dark:text-gray-300">
            ±{xMax.toFixed(1)} u
          </span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>{t("quick-return.metrics.v_phi0")}</span>
          <span className="font-mono text-gray-700 dark:text-gray-300">
            {vCenter0.toFixed(2)} u/s
          </span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>{t("quick-return.metrics.v_phi_pi")}</span>
          <span className="font-mono text-gray-700 dark:text-gray-300">
            {vCenterPi.toFixed(2)} u/s
          </span>
        </div>
      </div>
    </div>
  );
});
