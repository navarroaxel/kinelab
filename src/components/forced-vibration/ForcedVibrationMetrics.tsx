"use client";

import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { withSubscripts } from "@/components/Subscript";
import type {
  ForcedVibrationProperties,
  ForcedVibrationState,
} from "@/types/simulator";

interface Props {
  state: ForcedVibrationState;
  properties: ForcedVibrationProperties;
  forceEnabled: boolean;
}

const mm = (metres: number) =>
  Number.isFinite(metres) ? (metres * 1000).toFixed(2) : "∞";

export const ForcedVibrationMetrics = memo(function ForcedVibrationMetrics({
  state,
  properties,
  forceEnabled,
}: Props) {
  const { t } = useLanguage();

  const system = [
    {
      id: "natural",
      label: withSubscripts(t("fv.metrics.natural")),
      value: properties.naturalOmega.toFixed(1),
      unit: "rad/s",
    },
    {
      id: "natural_hz",
      label: withSubscripts(t("fv.metrics.natural_hz")),
      value: properties.naturalHz.toFixed(2),
      unit: "Hz",
    },
    {
      id: "zeta",
      label: t("fv.metrics.zeta"),
      value: properties.dampingRatio.toFixed(3),
      unit: "",
    },
    {
      id: "ratio",
      label: t("fv.metrics.ratio"),
      value: properties.frequencyRatio.toFixed(3),
      unit: "",
    },
    {
      id: "static",
      label: withSubscripts(t("fv.metrics.static")),
      value: mm(properties.staticDeflection),
      unit: "mm",
    },
    {
      id: "damped",
      label: withSubscripts(t("fv.metrics.damped_omega")),
      value: properties.dampedOmega.toFixed(2),
      unit: "rad/s",
    },
    {
      id: "displacement",
      label: t("fv.metrics.displacement"),
      value: mm(state.displacement),
      unit: "mm",
    },
    {
      id: "force",
      label: t("fv.metrics.force"),
      value: state.appliedForce.toFixed(0),
      unit: "N",
    },
  ];

  const answers = [
    {
      id: "amplitude",
      label: withSubscripts(t("fv.metrics.amplitude")),
      value: mm(properties.steadyAmplitude),
      hint: `${t("fv.metrics.magnification")} ${
        Number.isFinite(properties.magnification)
          ? properties.magnification.toFixed(2)
          : "∞"
      }`,
    },
    {
      id: "amplitude_undamped",
      label: withSubscripts(t("fv.metrics.amplitude_undamped")),
      value: mm(properties.undampedAmplitude),
      hint: t("fv.metrics.no_damper"),
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {t("fv.metrics.heading")}
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {system.map((card) => (
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
        {t("fv.metrics.answer_heading")}
      </h3>
      {forceEnabled ? (
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
                  mm
                </span>
              </div>
              <div className="mt-0.5 text-[10px] text-gray-400">
                {card.hint}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-lg bg-blue-50 p-2 text-[10px] leading-tight text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
          {t(
            `fv.metrics.free.${properties.regime}` as "fv.metrics.free.undamped",
          )}
        </p>
      )}
    </div>
  );
});
