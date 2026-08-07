"use client";

import { memo, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FunctionPlot } from "@/components/FunctionPlot";
import { withSubscripts } from "@/components/Subscript";
import { COLORS } from "@/lib/drawing";
import { velocityAtDepth } from "@/lib/viscousImpactKinematics";
import type {
  ViscousImpactParams,
  ViscousImpactState,
} from "@/types/simulator";

interface Props {
  params: ViscousImpactParams;
  state: ViscousImpactState;
}

const SAMPLES = 80;

export const ViscousImpactEquations = memo(function ViscousImpactEquations({
  params,
  state,
}: Props) {
  const [open, setOpen] = useState(true);
  const { t } = useLanguage();

  const vxPoints = useMemo(() => {
    if (!state.valid) return [];
    const points: [number, number][] = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const x = (state.penetrationDepth * 1000 * i) / SAMPLES;
      points.push([
        x,
        velocityAtDepth(x / 1000, params.entrySpeed, state.decelRate),
      ]);
    }
    return points;
  }, [params, state]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="viscous-impact-equations-content"
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <span>{t("viscous-impact.equations.heading")}</span>
        <span aria-hidden="true" className="text-gray-400">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          id="viscous-impact-equations-content"
          className="flex flex-col gap-3 px-3 pb-3 text-xs text-gray-700 dark:text-gray-300"
        >
          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("viscous-impact.equations.section.statement")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {t("viscous-impact.equations.statement.text")}
            </p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("viscous-impact.equations.section.theory")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("viscous-impact.equations.theory.text"))}
            </p>
          </div>

          <div className="font-mono">
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("viscous-impact.equations.section.formulas")}
            </p>
            <p>F = −k·v ⇒ dv/dx = −k/m (constant)</p>
            <p>v(x) = {withSubscripts("v_e")} − (k/m)·x</p>
            <p>
              k/m = ({withSubscripts("v_e")} − {withSubscripts("v_s")}) / e
            </p>
            <p>
              {withSubscripts("x_max")} = {withSubscripts("v_e")} / (k/m)
            </p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("viscous-impact.equations.section.reference")}
            </p>
            <p className="font-sans leading-relaxed whitespace-pre-line text-gray-500 dark:text-gray-400">
              {t("viscous-impact.equations.note.reference")}
            </p>
          </div>

          <div>
            <p className="mb-2 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("viscous-impact.equations.section.plot")}
            </p>
            <FunctionPlot
              ariaLabel={t("viscous-impact.plot.vx.title")}
              xUnit="mm"
              yUnit="m/s"
              series={[
                { label: "v(x)", color: COLORS.rVector, points: vxPoints },
              ]}
              markers={[
                {
                  x: params.plateThickness * 1000,
                  y: params.exitSpeed,
                  label: `${(params.plateThickness * 1000).toFixed(0)} mm`,
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
