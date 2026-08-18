"use client";

import { memo, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FunctionPlot } from "@/components/FunctionPlot";
import { withSubscripts } from "@/components/Subscript";
import { COLORS } from "@/lib/drawing";
import { speedAtTime } from "@/lib/jetClimbKinematics";
import type { JetClimbSample, JetClimbState } from "@/types/simulator";

interface Props {
  state: JetClimbState;
  metrics: JetClimbSample;
}

const T_MAX = 90;
const T_STEP = 1;

export const JetClimbEquations = memo(function JetClimbEquations({
  state,
  metrics,
}: Props) {
  const [open, setOpen] = useState(true);
  const { t } = useLanguage();

  const speedPoints = useMemo(() => {
    const points: [number, number][] = [];
    for (let time = 0; time <= T_MAX; time += T_STEP) {
      points.push([time, speedAtTime(time, state) * 3.6]);
    }
    return points;
  }, [state]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="jet-climb-equations-content"
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <span>{t("jc.equations.heading")}</span>
        <span aria-hidden="true" className="text-gray-400">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          id="jet-climb-equations-content"
          className="flex flex-col gap-3 px-3 pb-3 text-xs text-gray-700 dark:text-gray-300"
        >
          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("jc.equations.section.statement")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {t("jc.equations.statement.text")}
            </p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("jc.equations.section.theory")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("jc.equations.theory.thrust"))}
            </p>
            <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("jc.equations.theory.climb"))}
            </p>
            <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("jc.equations.theory.level"))}
            </p>
          </div>

          <div className="font-mono">
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("jc.equations.section.formulas")}
            </p>
            <p>{withSubscripts("T = ṁ·v_rel")}</p>
            <p>{withSubscripts("D = k·v²,  k = (T − m·g·sen θ) / v_0²")}</p>
            <p>{withSubscripts("a_0 = g·sen θ")}</p>
            <p>{withSubscripts("v_max = √(T/k)")}</p>
            <p>{withSubscripts("v(t) = v_max·tanh(λt + atanh(v_0/v_max))")}</p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("jc.equations.section.reference")}
            </p>
            <p className="font-sans leading-relaxed whitespace-pre-line text-gray-500 dark:text-gray-400">
              {withSubscripts(t("jc.equations.note.reference"))}
            </p>
          </div>

          <div>
            <p className="mb-2 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("jc.equations.section.plot")}
            </p>
            <FunctionPlot
              ariaLabel={t("jc.plot.speed_t.title")}
              xUnit="s"
              yUnit="km/h"
              series={[
                {
                  label: "v(t)",
                  color: COLORS.rVector,
                  points: speedPoints,
                },
              ]}
              markers={[
                {
                  x: metrics.t,
                  y: metrics.v * 3.6,
                  label: `t = ${metrics.t.toFixed(0)} s`,
                },
              ]}
            />
          </div>

          <p className="mt-1 border-t border-gray-100 pt-2 font-sans text-xs leading-relaxed text-gray-500 dark:border-gray-800 dark:text-gray-400">
            {t("jc.equations.note.units")}
          </p>
        </div>
      )}
    </div>
  );
});
