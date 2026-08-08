"use client";

import { memo, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FunctionPlot } from "@/components/FunctionPlot";
import { withSubscripts } from "@/components/Subscript";
import { COLORS } from "@/lib/drawing";
import { normalForceAt } from "@/lib/parabolicBowlKinematics";
import type {
  ParabolicBowlParams,
  ParabolicBowlState,
} from "@/types/simulator";

interface Props {
  params: ParabolicBowlParams;
  state: ParabolicBowlState;
}

const SAMPLES = 100;

export const ParabolicBowlEquations = memo(function ParabolicBowlEquations({
  params,
  state,
}: Props) {
  const [open, setOpen] = useState(true);
  const { t } = useLanguage();

  const nxPoints = useMemo(() => {
    const points: [number, number][] = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const x = -params.span / 2 + (params.span * i) / SAMPLES;
      points.push([
        x,
        normalForceAt(x, params.sphereMass, params.sag, params.span),
      ]);
    }
    return points;
  }, [params]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="parabolic-bowl-equations-content"
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <span>{t("parabolic-bowl.equations.heading")}</span>
        <span aria-hidden="true" className="text-gray-400">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          id="parabolic-bowl-equations-content"
          className="flex flex-col gap-3 px-3 pb-3 text-xs text-gray-700 dark:text-gray-300"
        >
          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("parabolic-bowl.equations.section.statement")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {t("parabolic-bowl.equations.statement.text")}
            </p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("parabolic-bowl.equations.section.theory")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {t("parabolic-bowl.equations.theory.energy")}
            </p>
            <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {t("parabolic-bowl.equations.theory.curvature")}
            </p>
          </div>

          <div className="font-mono">
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("parabolic-bowl.equations.section.formulas")}
            </p>
            <p>y(x) = (4H/L²)·x²,  y″ = 8H/L² (constant)</p>
            <p>v² = 2g·(H − y(x))</p>
            <p>N(x) = mg/√(1+y′²) + m·v²·y″/(1+y′²)^1.5</p>
            <p>
              {withSubscripts("a_bottom")} = 16g·H²/L² ≤ {withSubscripts("g_limit")}·g ⇒ L ≥ 4H/√
              {withSubscripts("g_limit")}
            </p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("parabolic-bowl.equations.section.reference")}
            </p>
            <p className="font-sans leading-relaxed whitespace-pre-line text-gray-500 dark:text-gray-400">
              {t("parabolic-bowl.equations.note.reference")}
            </p>
          </div>

          <div>
            <p className="mb-2 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("parabolic-bowl.equations.section.plot")}
            </p>
            <FunctionPlot
              ariaLabel={t("parabolic-bowl.plot.nx.title")}
              xUnit="m"
              yUnit="N"
              series={[
                { label: "N(x)", color: COLORS.rVector, points: nxPoints },
              ]}
              markers={[
                {
                  x: 0,
                  y: state.normalForceAtBottom,
                  label: `N(0) ≈ ${state.normalForceAtBottom.toFixed(1)} N`,
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
