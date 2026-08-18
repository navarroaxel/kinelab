"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import { norm } from "@/lib/vec3";
import type { FiremanLadderState, Vec3 } from "@/types/simulator";

interface Props {
  state: FiremanLadderState;
}

const triple = (v: Vec3) =>
  `${v.x.toFixed(2)}; ${v.y.toFixed(2)}; ${v.z.toFixed(2)}`;

export const FiremanLadderMetrics = memo(function FiremanLadderMetrics({
  state,
}: Props) {
  const { t } = useLanguage();

  const cards = [
    { id: "s", label: t("fl.metrics.s"), value: state.s.toFixed(2), unit: "m" },
    {
      id: "theta2",
      label: t("fl.metrics.theta2"),
      value: ((state.theta2 * 180) / Math.PI).toFixed(1),
      unit: "°",
    },
    {
      id: "speed",
      label: t("fl.metrics.speed"),
      value: state.speed.toFixed(3),
      unit: "m/s",
    },
    {
      id: "accel",
      label: t("fl.metrics.accel"),
      value: state.accelMag.toFixed(3),
      unit: "m/s²",
    },
    {
      id: "a_euler",
      label: t("fl.metrics.a_euler"),
      value: norm(state.aEuler).toFixed(3),
      unit: "m/s²",
    },
    {
      id: "a_centripetal",
      label: t("fl.metrics.a_centripetal"),
      value: norm(state.aCentripetal).toFixed(3),
      unit: "m/s²",
    },
    {
      id: "a_coriolis",
      label: withSubscripts(t("fl.metrics.a_coriolis")),
      value: norm(state.aCoriolis).toFixed(3),
      unit: "m/s²",
    },
  ];

  const vectors = [
    {
      id: "v_components",
      label: t("fl.metrics.v_components"),
      value: triple(state.v),
      unit: "m/s",
    },
    {
      id: "a_components",
      label: t("fl.metrics.a_components"),
      value: triple(state.a),
      unit: "m/s²",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("fl.metrics.heading")}
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {cards.map((card) => (
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
      <div className="mt-2 flex flex-col gap-2">
        {vectors.map((row) => (
          <div
            key={row.id}
            className="rounded-lg bg-gray-50 p-2 dark:bg-gray-800"
          >
            <div className="mb-0.5 text-[10px] leading-tight text-gray-500 dark:text-gray-400">
              {row.label}
            </div>
            <div className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-100">
              {row.value}
              <span className="ml-1 text-xs font-normal text-gray-400">
                {row.unit}
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[10px] leading-tight text-gray-400">
        {t("fl.metrics.frame_note")}
      </p>
    </div>
  );
});
