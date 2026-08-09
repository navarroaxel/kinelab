"use client";

import { memo, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FunctionPlot } from "@/components/FunctionPlot";
import { withSubscripts } from "@/components/Subscript";
import { COLORS } from "@/lib/drawing";
import { efficiencyAtWattmeterReading } from "@/lib/hoistKinematics";
import type { HoistParams, HoistState } from "@/types/simulator";

interface Props {
  params: HoistParams;
  state: HoistState;
}

const READING_MIN = 500;
const READING_MAX = 8000;
const SAMPLES = 100;

export const HoistEquations = memo(function HoistEquations({
  params,
  state,
}: Props) {
  const [open, setOpen] = useState(true);
  const { t } = useLanguage();

  const etaPoints = useMemo(() => {
    const points: [number, number][] = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const reading =
        READING_MIN + ((READING_MAX - READING_MIN) * i) / SAMPLES;
      points.push([reading, efficiencyAtWattmeterReading(reading, params) * 100]);
    }
    return points;
  }, [params]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="hoist-equations-content"
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <span>{t("hoist.equations.heading")}</span>
        <span aria-hidden="true" className="text-gray-400">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          id="hoist-equations-content"
          className="flex flex-col gap-3 px-3 pb-3 text-xs text-gray-700 dark:text-gray-300"
        >
          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("hoist.equations.section.statement")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {t("hoist.equations.statement.text")}
            </p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("hoist.equations.section.theory")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("hoist.equations.theory.pulley_ratio"))}
            </p>
            <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("hoist.equations.theory.counterweight"))}
            </p>
            <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("hoist.equations.theory.wattmeter"))}
            </p>
          </div>

          <div className="font-mono">
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("hoist.equations.section.formulas")}
            </p>
            <p>{withSubscripts(t("hoist.equations.formula.pulley"))}</p>
            <p>{withSubscripts(t("hoist.equations.formula.tension2"))}</p>
            <p>{withSubscripts(t("hoist.equations.formula.tension1"))}</p>
            <p>
              {withSubscripts(t("hoist.symbol.mechanical"))} = T₁ ·{" "}
              {withSubscripts("v_c")}
            </p>
            <p>
              η = {withSubscripts(t("hoist.symbol.mechanical"))} /{" "}
              {withSubscripts(t("hoist.symbol.electrical"))}
            </p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("hoist.equations.section.reference")}
            </p>
            <p className="font-sans leading-relaxed whitespace-pre-line text-gray-500 dark:text-gray-400">
              {withSubscripts(t("hoist.equations.note.reference"))}
            </p>
          </div>

          <div>
            <p className="mb-2 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("hoist.equations.section.plot")}
            </p>
            <FunctionPlot
              ariaLabel={t("hoist.plot.eta_p.title")}
              xUnit="W"
              yUnit="%"
              series={[
                {
                  label: "η(B)",
                  color: COLORS.rVector,
                  points: etaPoints,
                },
              ]}
              markers={[
                {
                  x: params.wattmeterReading,
                  y: state.efficiency * 100,
                  label: `B = ${params.wattmeterReading} W`,
                },
              ]}
              refLines={[
                { orientation: "h", value: 100, label: "η = 100%", dashed: true },
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
