"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import type { VibrationIsolationDerived } from "@/types/simulator";

interface Props {
  derived: VibrationIsolationDerived;
}

const fmt = (v: number | null, digits: number) =>
  v === null ? "—" : v.toFixed(digits);

export const VibrationIsolationMetrics = memo(function VibrationIsolationMetrics({
  derived,
}: Props) {
  const { t } = useLanguage();

  const cards = [
    {
      id: "omegaN",
      label: withSubscripts("ω_0"),
      value: derived.naturalFrequency.toFixed(2),
      unit: "rad/s",
    },
    {
      id: "peak",
      label: withSubscripts("T_peak"),
      value: Number.isFinite(derived.peakTransmissibility)
        ? derived.peakTransmissibility.toFixed(2)
        : "∞",
      unit: "",
    },
    {
      id: "r",
      label: "r",
      value: fmt(derived.frequencyRatio, 3),
      unit: "",
    },
    {
      id: "omega",
      label: "ω",
      value: fmt(derived.omega, 1),
      unit: "rad/s",
    },
    {
      id: "rpm",
      label: "n",
      value: fmt(derived.rpm, 0),
      unit: "rpm",
    },
    {
      id: "check",
      label: "T(r)",
      value: fmt(derived.transmissibilityCheck, 3),
      unit: "",
    },
    {
      id: "undampedR",
      label: "r (ζ = 0)",
      value: derived.undampedR.toFixed(3),
      unit: "",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("vib3.metrics.heading")}
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
      {derived.status === "reachable_everywhere" && (
        <p className="mt-2 rounded-lg bg-emerald-50 px-2 py-1.5 text-[11px] text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          {t("vib3.metrics.reachable_everywhere")}
        </p>
      )}
      {derived.status === "unattainable" && (
        <p className="mt-2 rounded-lg bg-amber-50 px-2 py-1.5 text-[11px] text-amber-700 dark:bg-amber-950 dark:text-amber-300">
          {t("vib3.metrics.unattainable")}
        </p>
      )}
    </div>
  );
});
