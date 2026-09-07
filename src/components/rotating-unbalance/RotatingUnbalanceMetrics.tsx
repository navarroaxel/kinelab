"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import type { RotatingUnbalanceState } from "@/types/simulator";

interface Props {
  state: RotatingUnbalanceState;
}

const fmtMm = (metres: number) =>
  Number.isFinite(metres) ? (metres * 1000).toFixed(3) : "∞";

export const RotatingUnbalanceMetrics = memo(function RotatingUnbalanceMetrics({
  state,
}: Props) {
  const { t } = useLanguage();

  const cards = [
    {
      id: "k",
      label: "k",
      value: state.stiffness.toFixed(0),
      unit: "N/m",
    },
    {
      id: "omegaN",
      label: withSubscripts("ω_0"),
      value: state.naturalFrequency.toFixed(2),
      unit: "rad/s",
    },
    {
      id: "r",
      label: "r = ω/ω₀",
      value: state.frequencyRatio.toFixed(3),
      unit: "",
    },
    {
      id: "F0",
      label: withSubscripts("F_0"),
      value: state.forceAmplitude.toFixed(2),
      unit: "N",
    },
    {
      id: "asymptote",
      label: withSubscripts("m·e/M"),
      value: fmtMm(state.asymptote),
      unit: "mm",
    },
    {
      id: "xM",
      label: withSubscripts("x_M"),
      value: fmtMm(state.amplitude),
      unit: "mm",
    },
    {
      id: "phase",
      label: "φ",
      value: ((state.phase * 180) / Math.PI).toFixed(1),
      unit: "°",
    },
    {
      id: "x",
      label: "x(t)",
      value: fmtMm(state.displacement),
      unit: "mm",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("vib1.metrics.heading")}
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {cards.map((card) => (
          <div key={card.id} className="rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
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
      {state.nearResonance && (
        <p className="mt-2 rounded-lg bg-amber-50 px-2 py-1.5 text-[11px] text-amber-700 dark:bg-amber-950 dark:text-amber-300">
          {t("vib1.metrics.near_resonance")}
        </p>
      )}
    </div>
  );
});
