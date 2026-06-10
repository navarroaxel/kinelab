"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { PinSlotState } from "@/types/simulator";

interface Props {
  state: PinSlotState;
}

function toDeg(rad: number) {
  return (rad * 180) / Math.PI;
}

export const PinSlotMetrics = memo(function PinSlotMetrics({ state }: Props) {
  const { t } = useLanguage();

  const vrNearZero = Math.abs(state.vr) < 0.05;
  const gammaNearZero = Math.abs(state.gamma) < 0.001;

  const cards = [
    {
      label: t("pin-slot.metrics.phi"),
      value: toDeg(state.phi).toFixed(1),
      unit: "°",
      highlight: false,
    },
    {
      label: t("pin-slot.metrics.theta"),
      value: toDeg(state.theta).toFixed(1),
      unit: "°",
      highlight: false,
    },
    {
      label: t("pin-slot.metrics.rho"),
      value: state.rho.toFixed(2),
      unit: "u",
      highlight: false,
    },
    {
      label: t("pin-slot.metrics.vr"),
      value: state.vr.toFixed(3),
      unit: "u/s",
      highlight: vrNearZero,
    },
    {
      label: t("pin-slot.metrics.vperp"),
      value: state.vPerp.toFixed(3),
      unit: "u/s",
      highlight: false,
    },
    {
      label: t("pin-slot.metrics.omega"),
      value: state.omega.toFixed(4),
      unit: "rad/s",
      highlight: false,
    },
    {
      label: t("pin-slot.metrics.gamma"),
      value: state.gamma.toFixed(4),
      unit: "rad/s²",
      highlight: gammaNearZero,
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("pin-slot.metrics.heading")}
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`rounded-lg p-2 ${
              card.highlight
                ? "border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950"
                : "bg-gray-50 dark:bg-gray-800"
            }`}
          >
            <div className="mb-0.5 text-[10px] leading-tight text-gray-500 dark:text-gray-400">
              {card.label}
            </div>
            <div
              className={`font-mono text-sm font-semibold ${
                card.highlight
                  ? "text-amber-700 dark:text-amber-400"
                  : "text-gray-800 dark:text-gray-100"
              }`}
            >
              {card.value}
              <span className="ml-0.5 text-xs font-normal text-gray-400">
                {card.unit}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
