"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import { msToKmh } from "@/lib/bankedCurveKinematics";
import type { BankedCurveLimits, BankedCurveState } from "@/types/simulator";

interface Props {
  state: BankedCurveState;
  limits: BankedCurveLimits;
  mu: number;
}

export const BankedCurveMetrics = memo(function BankedCurveMetrics({
  state,
  limits,
  mu,
}: Props) {
  const { t } = useLanguage();

  const live = [
    {
      id: "speed",
      label: t("bc.metrics.speed"),
      value: state.speed.toFixed(2),
      unit: "m/s",
    },
    {
      id: "speed_kmh",
      label: t("bc.metrics.speed_kmh"),
      value: msToKmh(state.speed).toFixed(1),
      unit: "km/h",
    },
    {
      id: "normal",
      label: t("bc.metrics.normal"),
      value: (state.normal / 1000).toFixed(2),
      unit: "kN",
    },
    {
      id: "friction",
      label: t("bc.metrics.friction"),
      value: (state.friction / 1000).toFixed(2),
      unit: "kN",
    },
    {
      id: "mu_required",
      label: withSubscripts(t("bc.metrics.mu_required")),
      value: state.muRequired.toFixed(3),
      unit: `/ ${mu.toFixed(2)}`,
    },
    {
      id: "net",
      label: withSubscripts(t("bc.metrics.net")),
      value: (state.netForce / 1000).toFixed(2),
      unit: "kN",
    },
  ];

  const answers = [
    {
      id: "min",
      label: withSubscripts(t("bc.metrics.min")),
      value: limits.minSpeed.toFixed(2),
      hint: `${msToKmh(limits.minSpeed).toFixed(0)} km/h`,
    },
    {
      id: "max",
      label: withSubscripts(t("bc.metrics.max")),
      value: limits.maxSpeed === null ? "∞" : limits.maxSpeed.toFixed(2),
      hint:
        limits.maxSpeed === null
          ? t("bc.metrics.unbounded")
          : `${msToKmh(limits.maxSpeed).toFixed(0)} km/h`,
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("bc.metrics.heading")}
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {live.map((card) => (
          <div
            key={card.id}
            className={`rounded-lg p-2 ${
              card.id === "mu_required" && state.slipping
                ? "bg-red-50 dark:bg-red-950/40"
                : "bg-gray-50 dark:bg-gray-800"
            }`}
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
        {t("bc.metrics.answer_heading")}
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
              <span className="ml-0.5 text-xs font-normal text-gray-400">
                m/s
              </span>
            </div>
            <div className="mt-0.5 font-mono text-[10px] text-gray-400">
              {card.hint}
            </div>
          </div>
        ))}
      </div>

      {state.slipping && (
        <p className="mt-2 rounded-lg bg-red-50 p-2 text-[10px] leading-tight text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {state.slipsUphill
            ? t("bc.metrics.slip_up")
            : t("bc.metrics.slip_down")}
        </p>
      )}
    </div>
  );
});
