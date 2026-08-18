"use client";

import { memo, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FunctionPlot } from "@/components/FunctionPlot";
import { withSubscripts } from "@/components/Subscript";
import { COLORS } from "@/lib/drawing";
import { maxLoadAtExhaustVelocity } from "@/lib/helicopterLiftKinematics";
import type {
  HelicopterLiftParams,
  HelicopterLiftState,
} from "@/types/simulator";

interface Props {
  params: HelicopterLiftParams;
  state: HelicopterLiftState;
}

const V_MAX = 140;
const V_STEP = 2;

export const HelicopterLiftEquations = memo(function HelicopterLiftEquations({
  params,
  state,
}: Props) {
  const [open, setOpen] = useState(true);
  const { t } = useLanguage();

  const loadPoints = useMemo(() => {
    const points: [number, number][] = [];
    for (let v = 0; v <= V_MAX; v += V_STEP) {
      points.push([v, maxLoadAtExhaustVelocity(v, params)]);
    }
    return points;
  }, [params]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="helicopter-lift-equations-content"
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <span>{t("hl.equations.heading")}</span>
        <span aria-hidden="true" className="text-gray-400">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          id="helicopter-lift-equations-content"
          className="flex flex-col gap-3 px-3 pb-3 text-xs text-gray-700 dark:text-gray-300"
        >
          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("hl.equations.section.statement")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {t("hl.equations.statement.text")}
            </p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("hl.equations.section.theory")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("hl.equations.theory.steady_flow"))}
            </p>
            <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("hl.equations.theory.density"))}
            </p>
          </div>

          <div className="font-mono">
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("hl.equations.section.formulas")}
            </p>
            <p>A = (π/4)·d²</p>
            <p>ṁ = (γ/g)·A·v</p>
            <p>T = ṁ·v</p>
            <p>{withSubscripts("L_max = T − W")}</p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("hl.equations.section.reference")}
            </p>
            <p className="font-sans leading-relaxed whitespace-pre-line text-gray-500 dark:text-gray-400">
              {withSubscripts(t("hl.equations.note.reference"))}
            </p>
          </div>

          <div>
            <p className="mb-2 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("hl.equations.section.plot")}
            </p>
            <FunctionPlot
              ariaLabel={t("hl.plot.load_v.title")}
              xUnit="ft/s"
              yUnit="lb"
              series={[
                {
                  label: "Lₘₐₓ(v)",
                  color: COLORS.rVector,
                  points: loadPoints,
                },
              ]}
              markers={[
                {
                  x: params.exhaustVelocity,
                  y: state.maxLoad,
                  label: `v = ${params.exhaustVelocity}`,
                },
              ]}
            />
          </div>

          <p className="mt-1 border-t border-gray-100 pt-2 font-sans text-xs leading-relaxed text-gray-500 dark:border-gray-800 dark:text-gray-400">
            {t("hl.equations.note.units")}
          </p>
        </div>
      )}
    </div>
  );
});
