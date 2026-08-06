"use client";

import { memo, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FunctionPlot } from "@/components/FunctionPlot";
import { COLORS } from "@/lib/drawing";
import { altitudeAtSpeed } from "@/lib/circularOrbitKinematics";
import type {
  CircularOrbitParams,
  CircularOrbitState,
} from "@/types/simulator";

interface Props {
  params: CircularOrbitParams;
  state: CircularOrbitState;
}

const SAMPLES = 150;
const V_MIN_KMH = 15000;
const V_MAX_KMH = 40000;

export const CircularOrbitEquations = memo(function CircularOrbitEquations({
  params,
  state,
}: Props) {
  const [open, setOpen] = useState(true);
  const { t } = useLanguage();

  const hvPoints = useMemo(() => {
    const points: [number, number][] = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const vKmh = V_MIN_KMH + ((V_MAX_KMH - V_MIN_KMH) * i) / SAMPLES;
      points.push([vKmh, altitudeAtSpeed(vKmh, params.R, params.g)]);
    }
    return points;
  }, [params.R, params.g]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="circular-orbit-equations-content"
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <span>{t("circular-orbit.equations.heading")}</span>
        <span aria-hidden="true" className="text-gray-400">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          id="circular-orbit-equations-content"
          className="flex flex-col gap-3 px-3 pb-3 text-xs text-gray-700 dark:text-gray-300"
        >
          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("circular-orbit.equations.section.statement")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {t("circular-orbit.equations.statement.text")}
            </p>
          </div>

          <div className="font-mono">
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("circular-orbit.equations.section.formulas")}
            </p>
            <p>aₙ = v²/r = g·(R/r)² ⟹ r = g·R² / v²</p>
            <p>h = r − R</p>
            <p>T = 2π·r / v</p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("circular-orbit.equations.section.reference")}
            </p>
            <p className="font-sans leading-relaxed text-gray-500 dark:text-gray-400">
              {t("circular-orbit.equations.note.reference")}
            </p>
            <p className="mt-1 font-sans leading-relaxed text-gray-500 dark:text-gray-400">
              {t("circular-orbit.equations.note.mu")}
            </p>
          </div>

          <div>
            <p className="mb-2 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("circular-orbit.equations.section.plot")}
            </p>
            <FunctionPlot
              ariaLabel={t("circular-orbit.plot.hv.title")}
              xUnit="km/h"
              yUnit="km"
              series={[
                { label: "h(v)", color: COLORS.rVector, points: hvPoints },
              ]}
              markers={[
                { x: params.vKmh, y: state.h, label: `${params.vKmh} km/h` },
              ]}
              refLines={[
                { orientation: "h", value: 0, label: "surface", dashed: true },
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
