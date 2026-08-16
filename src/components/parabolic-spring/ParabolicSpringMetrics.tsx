"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import type { ParabolicSpringState } from "@/types/simulator";

interface Props {
  state: ParabolicSpringState;
}

export const ParabolicSpringMetrics = memo(function ParabolicSpringMetrics({
  state,
}: Props) {
  const { t } = useLanguage();

  const live = [
    { id: "x", label: t("ps.metrics.x"), value: state.x.toFixed(3), unit: "m" },
    { id: "y", label: t("ps.metrics.y"), value: state.y.toFixed(3), unit: "m" },
    {
      id: "speed",
      label: t("ps.metrics.speed"),
      value: state.speed.toFixed(3),
      unit: "m/s",
    },
    {
      id: "incline",
      label: t("ps.metrics.incline"),
      value: state.inclineDeg.toFixed(1),
      unit: "°",
    },
    {
      id: "rho",
      label: t("ps.metrics.rho"),
      value: state.radiusOfCurvature.toFixed(3),
      unit: "m",
    },
    {
      id: "spring",
      label: withSubscripts(t("ps.metrics.spring")),
      value: state.springForce.toFixed(2),
      unit: "N",
    },
  ];

  const answers = [
    {
      id: "normal",
      label: t("ps.metrics.normal"),
      value: state.normal.toFixed(2),
      unit: "N",
    },
    {
      id: "tangential",
      label: withSubscripts(t("ps.metrics.tangential")),
      value: state.tangentialAccel.toFixed(2),
      unit: "m/s²",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("ps.metrics.heading")}
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
        {t("ps.metrics.answer_heading")}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {answers.map((card) => (
          <div
            key={card.id}
            className={`rounded-lg p-2 ${
              card.id === "normal" && state.contactLost
                ? "bg-red-50 dark:bg-red-950/40"
                : "bg-blue-50 dark:bg-blue-950/40"
            }`}
          >
            <div className="mb-0.5 text-[10px] leading-tight text-blue-700 dark:text-blue-300">
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

      {state.contactLost && (
        <p className="mt-2 rounded-lg bg-red-50 p-2 text-[10px] leading-tight text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {t("ps.metrics.contact_lost")}
        </p>
      )}
    </div>
  );
});
