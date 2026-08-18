"use client";

import { memo, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FunctionPlot } from "@/components/FunctionPlot";
import { withSubscripts } from "@/components/Subscript";
import { COLORS } from "@/lib/drawing";
import {
  computeCamFollowerState,
  wrapAngle,
} from "@/lib/camFollowerKinematics";
import type {
  CamFollowerExtremes,
  CamFollowerParams,
  CamFollowerState,
} from "@/types/simulator";

interface Props {
  params: CamFollowerParams;
  state: CamFollowerState;
  extremes: CamFollowerExtremes;
}

const SAMPLES = 120;

export const CamFollowerEquations = memo(function CamFollowerEquations({
  params,
  state,
  extremes,
}: Props) {
  const [open, setOpen] = useState(true);
  const { t } = useLanguage();

  const { verticalPoints, normalPoints } = useMemo(() => {
    const vertical: [number, number][] = [];
    const normal: [number, number][] = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const deg = (360 * i) / SAMPLES;
      const instant = computeCamFollowerState(params, (deg * Math.PI) / 180);
      vertical.push([deg, instant.normalVertical]);
      normal.push([deg, instant.normalMagnitude]);
    }
    return { verticalPoints: vertical, normalPoints: normal };
  }, [params]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="cam-follower-equations-content"
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <span>{t("cf.equations.heading")}</span>
        <span aria-hidden="true" className="text-gray-400">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          id="cam-follower-equations-content"
          className="flex flex-col gap-3 px-3 pb-3 text-xs text-gray-700 dark:text-gray-300"
        >
          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("cf.equations.section.statement")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {t("cf.equations.statement.text")}
            </p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("cf.equations.section.theory")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("cf.equations.theory.kinematics"))}
            </p>
            <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("cf.equations.theory.newton"))}
            </p>
            <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("cf.equations.theory.slope"))}
            </p>
            <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("cf.equations.theory.liftoff"))}
            </p>
          </div>

          <div className="font-mono">
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("cf.equations.section.formulas")}
            </p>
            <p>z = A·sen θ,   ż = A·θ̇·cos θ,   z̈ = −A·θ̇²·sen θ</p>
            <p>{withSubscripts("N_z = m·(g + z̈) = m·(g − A·θ̇²·sen θ)")}</p>
            <p>{withSubscripts("N_z,max = m·(g + A·θ̇²)   at sen θ = −1")}</p>
            <p>{withSubscripts("N_z,min = m·(g − A·θ̇²)   at sen θ = +1")}</p>
            <p>tan φ = (A/r)·cos θ,   N = N_z / cos φ</p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("cf.equations.section.reference")}
            </p>
            <p className="font-sans leading-relaxed whitespace-pre-line text-gray-500 dark:text-gray-400">
              {withSubscripts(t("cf.equations.note.reference"))}
            </p>
          </div>

          <div>
            <p className="mb-2 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("cf.equations.section.plot")}
            </p>
            <FunctionPlot
              ariaLabel={t("cf.plot.force.title")}
              xUnit="°"
              yUnit="N"
              series={[
                {
                  label: "N_z",
                  color: COLORS.normalForce,
                  points: verticalPoints,
                },
                { label: "N", color: COLORS.coriolis, points: normalPoints },
              ]}
              refLines={[
                {
                  orientation: "h",
                  value: extremes.verticalMax,
                  label: `${extremes.verticalMax.toFixed(2)} N`,
                  dashed: true,
                },
                {
                  orientation: "h",
                  value: extremes.verticalMin,
                  label: `${extremes.verticalMin.toFixed(2)} N`,
                  dashed: true,
                },
                {
                  orientation: "v",
                  value: (wrapAngle(state.theta) * 180) / Math.PI,
                  dashed: true,
                },
              ]}
            />
            <p className="mt-1 font-sans leading-relaxed text-gray-500 dark:text-gray-400">
              {withSubscripts(t("cf.equations.plot.note"))}
            </p>
          </div>
        </div>
      )}
    </div>
  );
});
