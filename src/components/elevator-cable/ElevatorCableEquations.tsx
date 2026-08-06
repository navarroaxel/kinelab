"use client";

import { memo, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FunctionPlot } from "@/components/FunctionPlot";
import { COLORS } from "@/lib/drawing";
import {
  positionAtTime,
  velocityAtTime,
  accelerationAtTime,
  timeAtPosition,
} from "@/lib/elevatorCableKinematics";
import type { ElevatorCableParams } from "@/types/simulator";

interface Props {
  params: ElevatorCableParams;
  loopDuration: number;
}

const SAMPLES = 150;

export const ElevatorCableEquations = memo(function ElevatorCableEquations({
  params,
  loopDuration,
}: Props) {
  const [open, setOpen] = useState(true);
  const { t } = useLanguage();

  const { xPoints, xDotPoints, xDDotPoints, asymptotePoints } = useMemo(() => {
    const t0 = timeAtPosition(params.x0, params);
    const xP: [number, number][] = [];
    const xdP: [number, number][] = [];
    const xddP: [number, number][] = [];
    // Skip tau = 0 when x0 = 0 (t0 = 0) — the singular point itself.
    const tauStart = t0 < 1e-9 ? loopDuration * 0.002 : 0;
    for (let i = 0; i <= SAMPLES; i++) {
      const tau = tauStart + ((loopDuration - tauStart) * i) / SAMPLES;
      const time = t0 + tau;
      xP.push([tau, positionAtTime(time, params)]);
      xdP.push([tau, velocityAtTime(time, params)]);
      xddP.push([tau, accelerationAtTime(time, params)]);
    }
    const asymptote: [number, number][] = [
      [tauStart, params.v0],
      [loopDuration, params.v0],
    ];
    return {
      xPoints: xP,
      xDotPoints: xdP,
      xDDotPoints: xddP,
      asymptotePoints: asymptote,
    };
  }, [params, loopDuration]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="elevator-cable-equations-content"
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <span>{t("elevator-cable.equations.heading")}</span>
        <span aria-hidden="true" className="text-gray-400">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          id="elevator-cable-equations-content"
          className="flex flex-col gap-3 px-3 pb-3 text-xs text-gray-700 dark:text-gray-300"
        >
          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("elevator-cable.equations.section.statement")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {t("elevator-cable.equations.statement.text")}
            </p>
          </div>

          <div className="font-mono">
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("elevator-cable.equations.section.formulas")}
            </p>
            <p>L(t) = √(b² + x²) = b + v₀t</p>
            <p>x(t) = √(v₀²t² + 2·b·v₀·t)</p>
            <p>ẋ(t) = v₀·(v₀t + b) / x(t)</p>
            <p>ẍ(t) = −b²·v₀² / x(t)³</p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("elevator-cable.equations.section.singularity")}
            </p>
            <p className="font-sans leading-relaxed text-gray-500 dark:text-gray-400">
              {t("elevator-cable.equations.note.singularity")}
            </p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("elevator-cable.equations.section.reference")}
            </p>
            <p className="font-sans leading-relaxed text-gray-500 dark:text-gray-400">
              {t("elevator-cable.equations.note.reference")}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("elevator-cable.equations.section.plots")}
            </p>
            <FunctionPlot
              ariaLabel={t("elevator-cable.plot.x.title")}
              xUnit="s"
              yUnit="m"
              series={[
                { label: "x(t)", color: COLORS.rVector, points: xPoints },
              ]}
            />
            <FunctionPlot
              ariaLabel={t("elevator-cable.plot.xdot.title")}
              xUnit="s"
              yUnit="m/s"
              series={[
                { label: "ẋ(t)", color: COLORS.velocity, points: xDotPoints },
                {
                  label: "v₀ asymptote",
                  color: COLORS.axes,
                  points: asymptotePoints,
                  dashed: true,
                },
              ]}
            />
            <FunctionPlot
              ariaLabel={t("elevator-cable.plot.xddot.title")}
              xUnit="s"
              yUnit="m/s²"
              series={[
                {
                  label: "ẍ(t)",
                  color: COLORS.acceleration,
                  points: xDDotPoints,
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
