"use client";

import { memo, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FunctionPlot } from "@/components/FunctionPlot";
import { withSubscripts } from "@/components/Subscript";
import { COLORS } from "@/lib/drawing";
import { flatPowerAtKmh } from "@/lib/vehiclePowerKinematics";
import type { VehiclePowerParams, VehiclePowerState } from "@/types/simulator";

interface Props {
  params: VehiclePowerParams;
  state: VehiclePowerState;
}

const SAMPLES = 120;

export const VehiclePowerEquations = memo(function VehiclePowerEquations({
  params,
  state,
}: Props) {
  const [open, setOpen] = useState(true);
  const { t } = useLanguage();

  const powerPoints = useMemo(() => {
    const maxKmh =
      Math.max(
        params.targetSpeedKmh,
        params.calibSpeed1Kmh,
        params.calibSpeed2Kmh,
      ) * 1.2;
    const points: [number, number][] = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const kmh = (maxKmh * i) / SAMPLES;
      points.push([kmh, flatPowerAtKmh(kmh, params) / 1000]);
    }
    return points;
  }, [params]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="vehicle-power-equations-content"
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <span>{t("vehicle-power.equations.heading")}</span>
        <span aria-hidden="true" className="text-gray-400">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          id="vehicle-power-equations-content"
          className="flex flex-col gap-3 px-3 pb-3 text-xs text-gray-700 dark:text-gray-300"
        >
          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("vehicle-power.equations.section.statement")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {t("vehicle-power.equations.statement.text")}
            </p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("vehicle-power.equations.section.theory")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("vehicle-power.equations.theory.calibration"))}
            </p>
            <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("vehicle-power.equations.theory.grade"))}
            </p>
          </div>

          <div className="font-mono">
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("vehicle-power.equations.section.formulas")}
            </p>
            <p>F(v) = a + b·v²</p>
            <p>P(v) = F(v)·v = a·v + b·v³</p>
            <p>
              {withSubscripts(t("vehicle-power.symbol.slope"))}(v) = P(v) + m·g·sin θ·v
            </p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("vehicle-power.equations.section.reference")}
            </p>
            <p className="font-sans leading-relaxed whitespace-pre-line text-gray-500 dark:text-gray-400">
              {t("vehicle-power.equations.note.reference")}
            </p>
          </div>

          <div>
            <p className="mb-2 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("vehicle-power.equations.section.plot")}
            </p>
            <FunctionPlot
              ariaLabel={t("vehicle-power.plot.pv.title")}
              xUnit="km/h"
              yUnit="kW"
              series={[
                {
                  label: "P(v)",
                  color: COLORS.rVector,
                  points: powerPoints,
                },
              ]}
              markers={[
                {
                  x: params.calibSpeed1Kmh,
                  y: params.calibPower1,
                  label: `${params.calibSpeed1Kmh} km/h`,
                },
                {
                  x: params.calibSpeed2Kmh,
                  y: params.calibPower2,
                  label: `${params.calibSpeed2Kmh} km/h`,
                },
                {
                  x: params.targetSpeedKmh,
                  y: state.targetPowerFlat / 1000,
                  label: `${params.targetSpeedKmh} km/h`,
                },
              ]}
            />
          </div>

          <p className="mt-1 border-t border-gray-100 pt-2 font-sans text-xs leading-relaxed text-gray-500 dark:border-gray-800 dark:text-gray-400">
            {t("units.note")}
          </p>
        </div>
      )}
    </div>
  );
});
