"use client";

import { memo, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FunctionPlot } from "@/components/FunctionPlot";
import { withSubscripts } from "@/components/Subscript";
import { COLORS } from "@/lib/drawing";
import { efficiencyAtPeopleCount } from "@/lib/escalatorKinematics";
import type { EscalatorParams, EscalatorState } from "@/types/simulator";

interface Props {
  params: EscalatorParams;
  state: EscalatorState;
}

const N_MAX = 40;

export const EscalatorEquations = memo(function EscalatorEquations({
  params,
  state,
}: Props) {
  const [open, setOpen] = useState(true);
  const { t } = useLanguage();

  const etaPoints = useMemo(() => {
    const points: [number, number][] = [];
    for (let n = 0; n <= N_MAX; n++) {
      points.push([n, efficiencyAtPeopleCount(n, params) * 100]);
    }
    return points;
  }, [params]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="escalator-equations-content"
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <span>{t("escalator.equations.heading")}</span>
        <span aria-hidden="true" className="text-gray-400">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          id="escalator-equations-content"
          className="flex flex-col gap-3 px-3 pb-3 text-xs text-gray-700 dark:text-gray-300"
        >
          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("escalator.equations.section.statement")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {t("escalator.equations.statement.text")}
            </p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("escalator.equations.section.theory")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("escalator.equations.theory.three_phase"))}
            </p>
            <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("escalator.equations.theory.mechanical"))}
            </p>
            <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("escalator.equations.theory.losses"))}
            </p>
          </div>

          <div className="font-mono">
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("escalator.equations.section.formulas")}
            </p>
            <p>Pₑ = √3 · V · I · cos φ</p>
            <p>Pₘ = (n · m · g · h) / t</p>
            <p>η = Pₘ / Pₑ</p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("escalator.equations.section.reference")}
            </p>
            <p className="font-sans leading-relaxed whitespace-pre-line text-gray-500 dark:text-gray-400">
              {withSubscripts(t("escalator.equations.note.reference"))}
            </p>
          </div>

          <div>
            <p className="mb-2 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("escalator.equations.section.plot")}
            </p>
            <FunctionPlot
              ariaLabel={t("escalator.plot.eta_n.title")}
              xUnit="people"
              yUnit="%"
              series={[
                {
                  label: "η(n)",
                  color: COLORS.rVector,
                  points: etaPoints,
                },
              ]}
              markers={[
                {
                  x: params.numPeople,
                  y: state.efficiency * 100,
                  label: `n = ${params.numPeople}`,
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
