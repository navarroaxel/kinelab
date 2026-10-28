"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import type { PinSlotBarState } from "@/types/simulator";

interface Props {
  state: PinSlotBarState;
}

const toDeg = (rad: number) => (rad * 180) / Math.PI;
const wrapDeg = (rad: number) => {
  const deg = toDeg(rad) % 360;
  return deg < 0 ? deg + 360 : deg;
};

export const PinSlotBarMetrics = memo(function PinSlotBarMetrics({
  state,
}: Props) {
  const { t } = useLanguage();

  const live = [
    {
      id: "phi",
      label: t("psb.metrics.phi"),
      value: wrapDeg(state.phi).toFixed(1),
      unit: "°",
    },
    {
      id: "theta",
      label: t("psb.metrics.theta"),
      value: wrapDeg(state.theta).toFixed(2),
      unit: "°",
    },
    {
      id: "r",
      label: t("psb.metrics.r"),
      value: state.r.toFixed(2),
      unit: "cm",
    },
    {
      id: "r_dot",
      label: t("psb.metrics.r_dot"),
      value: state.rDot.toFixed(1),
      unit: "cm/s",
    },
    {
      id: "speed",
      label: withSubscripts(t("psb.metrics.speed")),
      value: state.speed.toFixed(1),
      unit: "cm/s",
    },
    {
      id: "accel",
      label: withSubscripts(t("psb.metrics.accel")),
      value: state.accelMag.toFixed(1),
      unit: "cm/s²",
    },
  ];

  const sense = (value: number) =>
    value === 0
      ? ""
      : value > 0
        ? t("psb.metrics.ccw")
        : t("psb.metrics.cw");

  const answers = [
    {
      id: "omega_ac",
      label: withSubscripts(t("psb.metrics.omega_ac")),
      value: Math.abs(state.omegaAC).toFixed(2),
      unit: "rad/s",
      hint: sense(state.omegaAC),
    },
    {
      id: "alpha_ac",
      label: withSubscripts(t("psb.metrics.alpha_ac")),
      value: Math.abs(state.alphaAC).toFixed(1),
      unit: "rad/s²",
      hint: sense(state.alphaAC),
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("psb.metrics.heading")}
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
        {t("psb.metrics.answer_heading")}
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
                {card.unit}
              </span>
            </div>
            <div className="mt-0.5 text-[10px] text-gray-400">{card.hint}</div>
          </div>
        ))}
      </div>
    </div>
  );
});
