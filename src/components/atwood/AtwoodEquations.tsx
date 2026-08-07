"use client";

import { memo, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FunctionPlot } from "@/components/FunctionPlot";
import { withSubscripts } from "@/components/Subscript";
import { COLORS } from "@/lib/drawing";
import { acceleration } from "@/lib/atwoodKinematics";
import type { AtwoodParams, AtwoodState } from "@/types/simulator";

interface Props {
  params: AtwoodParams;
  state: AtwoodState;
}

const I_MAX = 0.5;

export const AtwoodEquations = memo(function AtwoodEquations({
  params,
  state,
}: Props) {
  const [open, setOpen] = useState(true);
  const { t } = useLanguage();

  const accelPoints = useMemo(() => {
    const points: [number, number][] = [];
    for (let i = 0; i <= 50; i++) {
      const I = (I_MAX * i) / 50;
      points.push([I, acceleration({ ...params, pulleyMomentOfInertia: I })]);
    }
    return points;
  }, [params]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="atwood-equations-content"
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <span>{t("atwood.equations.heading")}</span>
        <span aria-hidden="true" className="text-gray-400">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          id="atwood-equations-content"
          className="flex flex-col gap-3 px-3 pb-3 text-xs text-gray-700 dark:text-gray-300"
        >
          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("atwood.equations.section.statement")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {t("atwood.equations.statement.text")}
            </p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("atwood.equations.section.theory")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("atwood.equations.theory.newton"))}
            </p>
            <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("atwood.equations.theory.work_energy"))}
            </p>
            <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("atwood.equations.theory.pulley_inertia"))}
            </p>
          </div>

          <div className="font-mono">
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("atwood.equations.section.formulas")}
            </p>
            <p>a = (m₂ − m₁)·g / (m₁ + m₂ + I/r²)</p>
            <p>{withSubscripts(t("atwood.symbol.tension1"))} = m₁·(g + a)</p>
            <p>{withSubscripts(t("atwood.symbol.tension2"))} = m₂·(g − a)</p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("atwood.equations.section.reference")}
            </p>
            <p className="font-sans leading-relaxed whitespace-pre-line text-gray-500 dark:text-gray-400">
              {withSubscripts(t("atwood.equations.note.reference"))}
            </p>
          </div>

          <div>
            <FunctionPlot
              ariaLabel="a(I)"
              xUnit="kg·m²"
              yUnit="m/s²"
              series={[
                {
                  label: "a(I)",
                  color: COLORS.rVector,
                  points: accelPoints,
                },
              ]}
              markers={[
                {
                  x: params.pulleyMomentOfInertia,
                  y: state.acceleration,
                  label: `I = ${params.pulleyMomentOfInertia} kg·m²`,
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
