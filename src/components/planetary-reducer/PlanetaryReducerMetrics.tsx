"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import type { PlanetaryReducerState } from "@/types/simulator";

interface Props {
  state: PlanetaryReducerState;
}

const toDeg = (rad: number) => (rad * 180) / Math.PI;
const wrapDeg = (rad: number) => {
  const deg = toDeg(rad) % 360;
  return deg < 0 ? deg + 360 : deg;
};

export const PlanetaryReducerMetrics = memo(function PlanetaryReducerMetrics({
  state,
}: Props) {
  const { t } = useLanguage();

  const live = [
    {
      id: "sun_angle",
      label: t("pr.metrics.sun_angle"),
      value: wrapDeg(state.sunAngle).toFixed(0),
      unit: "°",
    },
    {
      id: "carrier_angle",
      label: t("pr.metrics.carrier_angle"),
      value: wrapDeg(state.carrierAngle).toFixed(0),
      unit: "°",
    },
    {
      id: "planet_spin",
      label: t("pr.metrics.planet_spin"),
      value: wrapDeg(state.planetSpin).toFixed(0),
      unit: "°",
    },
    {
      id: "ring_radius",
      label: withSubscripts(t("pr.metrics.ring_radius")),
      value: (state.ringRadius * 100).toFixed(1),
      unit: "cm",
    },
  ];

  const sense = (value: number) =>
    value === 0
      ? ""
      : value > 0
        ? t("pr.metrics.ccw")
        : t("pr.metrics.cw");

  const answers = [
    {
      id: "v_j",
      label: withSubscripts(t("pr.metrics.v_j")),
      value: Math.abs(state.vJ).toFixed(2),
      unit: "m/s",
      hint: "",
    },
    {
      id: "v_o",
      label: withSubscripts(t("pr.metrics.v_o")),
      value: Math.abs(state.vO).toFixed(2),
      unit: "m/s",
      hint: "",
    },
    {
      id: "omega_planet",
      label: withSubscripts(t("pr.metrics.omega_planet")),
      value: Math.abs(state.rpmPlanet).toFixed(0),
      unit: "rpm",
      hint: sense(state.omegaPlanet),
    },
    {
      id: "omega_carrier",
      label: withSubscripts(t("pr.metrics.omega_carrier")),
      value: Math.abs(state.rpmCarrier).toFixed(0),
      unit: "rpm",
      hint: sense(state.omegaCarrier),
    },
    {
      id: "ratio",
      label: t("pr.metrics.ratio"),
      value: `1/${(1 / state.ratio).toFixed(2).replace(/\.?0+$/, "")}`,
      unit: "",
      hint: "",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("pr.metrics.heading")}
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
        {t("pr.metrics.answer_heading")}
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
