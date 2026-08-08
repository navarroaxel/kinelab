"use client";

import { memo, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FunctionPlot } from "@/components/FunctionPlot";
import { withSubscripts } from "@/components/Subscript";
import { COLORS } from "@/lib/drawing";
import { velocityAtTime, G } from "@/lib/stagedRocketKinematics";
import type {
  StagedRocketParams,
  StagedRocketState,
} from "@/types/simulator";

interface Props {
  params: StagedRocketParams;
  state: StagedRocketState;
}

const SAMPLES = 120;
const COAST_WINDOW_S = 20;

export const StagedRocketEquations = memo(function StagedRocketEquations({
  params,
  state,
}: Props) {
  const [open, setOpen] = useState(true);
  const { t } = useLanguage();

  const { singlePoints, twoStagePoints } = useMemo(() => {
    const totalBurnTwo = state.twoStage.burnTimeA + state.twoStage.burnTimeB;
    const duration =
      Math.max(state.singleStage.burnTime, totalBurnTwo) + COAST_WINDOW_S;

    const single: [number, number][] = [];
    const two: [number, number][] = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const time = (duration * i) / SAMPLES;

      const vSingle =
        time < state.singleStage.burnTime
          ? velocityAtTime(
              time,
              state.singleStage.initialMass,
              params.fuelRate,
              params.exhaustVelocity,
            )
          : state.singleStage.maxSpeed - G * (time - state.singleStage.burnTime);
      single.push([time, vSingle]);

      let vTwo: number;
      if (time < state.twoStage.burnTimeA) {
        vTwo = velocityAtTime(
          time,
          state.twoStage.initialMass,
          params.fuelRate,
          params.exhaustVelocity,
        );
      } else if (time < totalBurnTwo) {
        vTwo = velocityAtTime(
          time - state.twoStage.burnTimeA,
          state.twoStage.massAfterSeparation,
          params.fuelRate,
          params.exhaustVelocity,
          state.twoStage.speedAtSeparation,
        );
      } else {
        vTwo = state.twoStage.maxSpeed - G * (time - totalBurnTwo);
      }
      two.push([time, vTwo]);
    }
    return { singlePoints: single, twoStagePoints: two };
  }, [params, state]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="staged-rocket-equations-content"
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <span>{t("staged-rocket.equations.heading")}</span>
        <span aria-hidden="true" className="text-gray-400">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          id="staged-rocket-equations-content"
          className="flex flex-col gap-3 px-3 pb-3 text-xs text-gray-700 dark:text-gray-300"
        >
          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("staged-rocket.equations.section.statement")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {t("staged-rocket.equations.statement.text")}
            </p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("staged-rocket.equations.section.theory")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("staged-rocket.equations.theory.rocket_eq"))}
            </p>
            <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("staged-rocket.equations.theory.staging"))}
            </p>
          </div>

          <div className="font-mono">
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("staged-rocket.equations.section.formulas")}
            </p>
            <p>m(t) = {withSubscripts("m_0")} − q·t</p>
            <p>
              v(t) = {withSubscripts("v_0")} + {withSubscripts("v_rel")}·ln(
              {withSubscripts("m_0")}/m(t)) − g·t
            </p>
            <p>{withSubscripts("t_burn")} = {withSubscripts("m_fuel")}/q</p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("staged-rocket.equations.section.reference")}
            </p>
            <p className="font-sans leading-relaxed whitespace-pre-line text-gray-500 dark:text-gray-400">
              {t("staged-rocket.equations.note.reference")}
            </p>
          </div>

          <div>
            <p className="mb-2 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("staged-rocket.equations.section.plot")}
            </p>
            <FunctionPlot
              ariaLabel={t("staged-rocket.plot.vt.title")}
              xUnit="s"
              yUnit="m/s"
              series={[
                {
                  label: t("staged-rocket.legend.single"),
                  color: COLORS.rVector,
                  points: singlePoints,
                },
                {
                  label: t("staged-rocket.legend.two_stage"),
                  color: COLORS.point,
                  points: twoStagePoints,
                },
              ]}
              markers={[
                {
                  x: state.twoStage.burnTimeA,
                  y: state.twoStage.speedAtSeparation,
                  label: t("staged-rocket.canvas.separation"),
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
