"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import type { FourBarState } from "@/types/simulator";

interface Props {
  state: FourBarState;
}

const toDeg = (rad: number) => (rad * 180) / Math.PI;
const wrapDeg = (rad: number) => {
  const deg = toDeg(rad) % 360;
  return deg < 0 ? deg + 360 : deg;
};

export const FourBarMetrics = memo(function FourBarMetrics({ state }: Props) {
  const { t } = useLanguage();

  const live = [
    {
      id: "alpha",
      label: t("fb.metrics.alpha"),
      value: wrapDeg(state.alpha).toFixed(1),
      unit: "°",
    },
    {
      id: "omega_cd",
      label: withSubscripts(t("fb.metrics.omega_cd")),
      value: state.omegaCD.toFixed(2),
      unit: "rad/s",
    },
    {
      id: "speed_b",
      label: withSubscripts(t("fb.metrics.speed_b")),
      value: Math.hypot(state.vB.x, state.vB.y).toFixed(2),
      unit: "m/s",
    },
    {
      id: "accel_e",
      label: withSubscripts(t("fb.metrics.accel_e")),
      value: state.accelE.toFixed(1),
      unit: "m/s²",
    },
    {
      id: "gamma_bc",
      label: withSubscripts(t("fb.metrics.gamma_bc")),
      value: state.gammaBC.toFixed(1),
      unit: "rad/s²",
    },
    {
      id: "gamma_ab",
      label: withSubscripts(t("fb.metrics.gamma_ab")),
      value: state.gammaAB.toFixed(1),
      unit: "rad/s²",
    },
  ];

  const sense = (value: number) =>
    value === 0
      ? ""
      : value > 0
        ? t("fb.metrics.ccw")
        : t("fb.metrics.cw");

  const answers = [
    {
      id: "omega_ab",
      label: withSubscripts(t("fb.metrics.omega_ab")),
      value: Math.abs(state.omegaAB).toFixed(2),
      unit: "rad/s",
      hint: sense(state.omegaAB),
    },
    {
      id: "omega_bc",
      label: withSubscripts(t("fb.metrics.omega_bc")),
      value: Math.abs(state.omegaBC).toFixed(2),
      unit: "rad/s",
      hint: sense(state.omegaBC),
    },
    {
      id: "speed_e",
      label: withSubscripts(t("fb.metrics.speed_e")),
      value: state.speedE.toFixed(2),
      unit: "m/s",
      hint: "",
    },
    {
      id: "cir",
      label: t("fb.metrics.cir"),
      value: state.cir
        ? `(${state.cir.x.toFixed(3)}, ${state.cir.y.toFixed(3)})`
        : "—",
      unit: state.cir ? "m" : "",
      hint: state.cir ? "" : t("fb.metrics.cir_infinite"),
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("fb.metrics.heading")}
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
        {t("fb.metrics.answer_heading")}
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
