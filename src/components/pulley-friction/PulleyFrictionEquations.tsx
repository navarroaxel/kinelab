"use client";

import { memo, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FunctionPlot } from "@/components/FunctionPlot";
import { withSubscripts } from "@/components/Subscript";
import { COLORS } from "@/lib/drawing";
import { appliedForce } from "@/lib/pulleyFrictionKinematics";
import type { PulleyFrictionParams, PulleyFrictionState } from "@/types/simulator";

interface Props {
  params: PulleyFrictionParams;
  state: PulleyFrictionState;
}

const THETA_MAX_DEG = 60;

export const PulleyFrictionEquations = memo(function PulleyFrictionEquations({
  params,
  state,
}: Props) {
  const [open, setOpen] = useState(true);
  const { t } = useLanguage();

  const forcePoints = useMemo(() => {
    const points: [number, number][] = [];
    for (let theta = 0; theta <= THETA_MAX_DEG; theta += 0.5) {
      points.push([theta, appliedForce(theta, params)]);
    }
    return points;
  }, [params]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="pulley-friction-equations-content"
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <span>{t("pulley-friction.equations.heading")}</span>
        <span aria-hidden="true" className="text-gray-400">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          id="pulley-friction-equations-content"
          className="flex flex-col gap-3 px-3 pb-3 text-xs text-gray-700 dark:text-gray-300"
        >
          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("pulley-friction.equations.section.statement")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {t("pulley-friction.equations.statement.text")}
            </p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("pulley-friction.equations.section.theory")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("pulley-friction.equations.theory.tension"))}
            </p>
            <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("pulley-friction.equations.theory.applied_force"))}
            </p>
            <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("pulley-friction.equations.theory.optimal"))}
            </p>
            <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("pulley-friction.equations.theory.velocity_ratio"))}
            </p>
          </div>

          <div className="font-mono">
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("pulley-friction.equations.section.formulas")}
            </p>
            <p>T = weightB · (sin α + μ·cos α)</p>
            <p>
              {withSubscripts(t("pulley-friction.symbol.applied_force"))} =
              (μ·weightA + T) / (cos θ + μ·sin θ)
            </p>
            <p>
              {withSubscripts(t("pulley-friction.symbol.optimal_angle"))} =
              arctan(μ)
            </p>
            <p>
              {withSubscripts(t("pulley-friction.symbol.minimum_force"))} =
              (μ·weightA + T) / √(1+μ²)
            </p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("pulley-friction.equations.section.reference")}
            </p>
            <p className="font-sans leading-relaxed whitespace-pre-line text-gray-500 dark:text-gray-400">
              {withSubscripts(t("pulley-friction.equations.note.reference"))}
            </p>
          </div>

          <div>
            <FunctionPlot
              ariaLabel="F(θ)"
              xUnit="deg"
              yUnit="N"
              series={[
                {
                  label: "F(θ)",
                  color: COLORS.rVector,
                  points: forcePoints,
                },
              ]}
              markers={[
                {
                  x: params.pullAngle,
                  y: state.appliedForce,
                  label: `θ = ${params.pullAngle}°`,
                },
                {
                  x: state.optimalAngle,
                  y: state.minimumForce,
                  label: `θ_opt`,
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
