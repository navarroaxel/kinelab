"use client";

import { memo, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FunctionPlot } from "@/components/FunctionPlot";
import { withSubscripts } from "@/components/Subscript";
import { COLORS } from "@/lib/drawing";
import { unbalanceMagnification } from "@/lib/vibrationTransmissibility";
import type {
  RotatingUnbalanceDerived,
  RotatingUnbalanceParams,
} from "@/types/simulator";

interface Props {
  params: RotatingUnbalanceParams;
  derived: RotatingUnbalanceDerived;
}

const CURVE_SAMPLES = 240;
const MAX_RATIO = 3;
/** The curve is unbounded near r = 1 at low ζ; clip it to stay readable. */
const CEILING = 4;

export const RotatingUnbalanceEquations = memo(
  function RotatingUnbalanceEquations({ params, derived }: Props) {
    const [open, setOpen] = useState(true);
    const { t } = useLanguage();

    const { dampedCurve, undampedCurve } = useMemo(() => {
      const damped: [number, number][] = [];
      const undamped: [number, number][] = [];
      for (let i = 0; i <= CURVE_SAMPLES; i++) {
        const r = (MAX_RATIO * i) / CURVE_SAMPLES;
        damped.push([
          r,
          Math.min(
            derived.asymptote * unbalanceMagnification(r, params.dampingRatio),
            derived.asymptote * CEILING,
          ) * 1000,
        ]);
        undamped.push([
          r,
          Math.min(
            derived.asymptote * unbalanceMagnification(r, 0),
            derived.asymptote * CEILING,
          ) * 1000,
        ]);
      }
      return { dampedCurve: damped, undampedCurve: undamped };
    }, [derived.asymptote, params.dampingRatio]);

    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="vib1-equations-content"
          className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <span>{t("vib1.equations.heading")}</span>
          <span aria-hidden="true" className="text-gray-400">
            {open ? "▲" : "▼"}
          </span>
        </button>

        {open && (
          <div
            id="vib1-equations-content"
            className="flex flex-col gap-3 px-3 pb-3 text-xs text-gray-700 dark:text-gray-300"
          >
            <div>
              <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
                {t("vib1.equations.section.statement")}
              </p>
              <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
                {t("vib1.equations.statement.text")}
              </p>
            </div>

            <div>
              <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
                {t("vib1.equations.section.theory")}
              </p>
              <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
                {withSubscripts(t("vib1.equations.theory.growing_force"))}
              </p>
              <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
                {withSubscripts(t("vib1.equations.theory.shape"))}
              </p>
            </div>

            <div className="font-mono">
              <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
                {t("vib1.equations.section.formulas")}
              </p>
              <p>{withSubscripts("F_0 = m·e·ω²,   ω_0 = √(k/M),   r = ω/ω_0")}</p>
              <p>
                {withSubscripts(
                  "x_M = (m·e/M)·r² / √[(1 − r²)² + (2ζr)²]",
                )}
              </p>
              <p>{withSubscripts("r → ∞  ⟹  x_M → m·e/M")}</p>
            </div>

            <div>
              <p className="mb-2 font-sans text-xs text-gray-500 dark:text-gray-400">
                {t("vib1.equations.section.plot")}
              </p>
              <FunctionPlot
                ariaLabel={t("vib1.plot.title")}
                xUnit=""
                yUnit="mm"
                series={[
                  {
                    label: `ζ = ${params.dampingRatio.toFixed(3)}`,
                    color: COLORS.coriolis,
                    points: dampedCurve,
                  },
                  {
                    label: "ζ = 0",
                    color: COLORS.acceleration,
                    points: undampedCurve,
                    dashed: true,
                  },
                ]}
                refLines={[
                  { orientation: "v", value: derived.frequencyRatio },
                  {
                    orientation: "h",
                    value: derived.asymptote * 1000,
                    dashed: true,
                    label: "m·e/M",
                  },
                ]}
              />
              <p className="mt-1 font-sans leading-relaxed text-gray-500 dark:text-gray-400">
                {withSubscripts(t("vib1.equations.plot.note"))}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  },
);
