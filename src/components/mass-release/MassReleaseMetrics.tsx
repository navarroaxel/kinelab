"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import type { MassReleaseState } from "@/types/simulator";

interface Props {
  state: MassReleaseState;
}

const fmt = (v: number | null, digits: number) =>
  v === null ? "—" : Number.isFinite(v) ? v.toFixed(digits) : "∞";

export const MassReleaseMetrics = memo(function MassReleaseMetrics({
  state,
}: Props) {
  const { t } = useLanguage();

  const regimeLabel = t(`vib6.regime.${state.regime}`);

  const cards = [
    {
      id: "x0",
      label: withSubscripts("x_0"),
      value: (state.x0 * 100).toFixed(2),
      unit: "cm",
    },
    {
      id: "omegaN",
      label: withSubscripts("ω_0"),
      value: state.naturalFrequency.toFixed(3),
      unit: "rad/s",
    },
    {
      id: "zeta",
      label: "ζ",
      value: state.dampingRatio.toFixed(3),
      unit: "",
    },
    {
      id: "regime",
      label: t("vib6.metrics.regime"),
      value: regimeLabel,
      unit: "",
    },
    ...(state.regime === "undamped" || state.regime === "underdamped"
      ? [
          {
            id: "omegaD",
            label: withSubscripts("ω_d"),
            value: fmt(state.dampedOmega, 3),
            unit: "rad/s",
          },
        ]
      : [
          {
            id: "s1",
            label: withSubscripts("s_1"),
            value: fmt(state.s1, 3),
            unit: "1/s",
          },
          {
            id: "s2",
            label: withSubscripts("s_2"),
            value: fmt(state.s2, 3),
            unit: "1/s",
          },
        ]),
    {
      id: "tau",
      label: withSubscripts("τ_slow"),
      value: fmt(state.tauSlow, 3),
      unit: "s",
    },
    {
      id: "settling",
      label: t("vib6.metrics.settling_time"),
      value: fmt(state.settlingTime, 2),
      unit: "s",
    },
    ...(state.regime === "undamped"
      ? [
          { id: "T", label: "T", value: fmt(state.period, 4), unit: "s" },
          { id: "f", label: "f", value: fmt(state.frequency, 4), unit: "Hz" },
          {
            id: "vMax",
            label: withSubscripts("v_max"),
            value: fmt(state.vMax, 3),
            unit: "m/s",
          },
          {
            id: "aMax",
            label: withSubscripts("a_max"),
            value: fmt(state.aMax, 3),
            unit: "m/s²",
          },
        ]
      : []),
    {
      id: "x",
      label: "x(t)",
      value: (state.displacement * 100).toFixed(2),
      unit: "cm",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("vib6.metrics.heading")}
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
      {state.slack && (
        <p className="mt-2 rounded-lg bg-amber-50 px-2 py-1.5 text-[11px] text-amber-700 dark:bg-amber-950 dark:text-amber-300">
          {t("vib6.metrics.slack_warning")}
        </p>
      )}
    </div>
  );
});
