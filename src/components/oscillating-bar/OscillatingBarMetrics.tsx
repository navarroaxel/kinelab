"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import { toDegrees } from "@/lib/oscillatingBarKinematics";
import type { OscillatingBarState } from "@/types/simulator";

interface Props {
  state: OscillatingBarState;
}

const wrapDeg = (rad: number) => {
  const deg = toDegrees(rad) % 360;
  return deg < 0 ? deg + 360 : deg;
};

export const OscillatingBarMetrics = memo(function OscillatingBarMetrics({
  state,
}: Props) {
  const { t } = useLanguage();

  const live = [
    {
      id: "phi",
      label: t("ob.metrics.phi"),
      value: wrapDeg(state.crankAngle).toFixed(1),
      unit: "°",
    },
    {
      id: "theta",
      label: t("ob.metrics.theta"),
      value: toDegrees(state.barAngle).toFixed(2),
      unit: "°",
    },
    {
      id: "reach",
      label: t("ob.metrics.reach"),
      value: state.reach.toFixed(3),
      unit: "m",
    },
    {
      id: "reach_rate",
      label: t("ob.metrics.reach_rate"),
      value: state.reachRate.toFixed(3),
      unit: "m/s",
    },
    {
      id: "pin_speed",
      label: withSubscripts(t("ob.metrics.pin_speed")),
      value: state.pinSpeed.toFixed(2),
      unit: "m/s",
    },
    {
      id: "pin_accel",
      label: withSubscripts(t("ob.metrics.pin_accel")),
      value: state.pinAccel.toFixed(2),
      unit: "m/s²",
    },
  ];

  const sense = (value: number, positiveKey: string, negativeKey: string) =>
    value === 0
      ? ""
      : value > 0
        ? t(positiveKey as "ob.metrics.ccw")
        : t(negativeKey as "ob.metrics.cw");

  const answers = [
    {
      id: "bar_omega",
      label: withSubscripts(t("ob.metrics.bar_omega")),
      value: Math.abs(state.barOmega).toFixed(3),
      unit: "rad/s",
      hint: sense(state.barOmega, "ob.metrics.ccw", "ob.metrics.cw"),
    },
    {
      id: "bar_alpha",
      label: withSubscripts(t("ob.metrics.bar_alpha")),
      value: Math.abs(state.barAlpha).toFixed(2),
      unit: "rad/s²",
      hint: sense(state.barAlpha, "ob.metrics.ccw", "ob.metrics.cw"),
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("ob.metrics.heading")}
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
        {t("ob.metrics.answer_heading")}
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
