"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import type { MachineElementBaseState } from "@/types/simulator";

interface Props {
  state: MachineElementBaseState;
}

const fmtMm = (metres: number) =>
  Number.isFinite(metres) ? (metres * 1000).toFixed(2) : "∞";

export const MachineElementBaseMetrics = memo(function MachineElementBaseMetrics({
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
      id: "zeta",
      label: "ζ",
      value: state.dampingRatio.toFixed(3),
      unit: "",
    },
    {
      id: "r",
      label: "r = ω/ω₀",
      value: state.frequencyRatio.toFixed(3),
      unit: "",
    },
    {
      id: "T",
      label: "T = X_M/y_M",
      value: state.transmissibility.toFixed(3),
      unit: "",
    },
    {
      id: "xM",
      label: withSubscripts("X_M"),
      value: fmtMm(state.amplitude),
      unit: "mm",
    },
    {
      id: "undamped",
      label: withSubscripts("X_M (c = 0)"),
      value: fmtMm(state.undampedAmplitude),
      unit: "mm",
    },
    {
      id: "phaseLag",
      label: "δ",
      value: ((state.phaseLag * 180) / Math.PI).toFixed(1),
      unit: "°",
    },
    {
      id: "S",
      label: "S(t)",
      value: (state.supportDisplacement * 1000).toFixed(2),
      unit: "mm",
    },
    {
      id: "x",
      label: "x(t)",
      value: (state.elementDisplacement * 1000).toFixed(2),
      unit: "mm",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("vib4.metrics.heading")}
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
      {state.isSingularResonance && (
        <p className="mt-2 rounded-lg bg-red-50 px-2 py-1.5 text-[11px] text-red-700 dark:bg-red-950 dark:text-red-300">
          {t("vib4.metrics.singular_resonance")}
        </p>
      )}
    </div>
  );
});
