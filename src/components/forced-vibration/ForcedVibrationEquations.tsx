"use client";

import { memo, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FunctionPlot } from "@/components/FunctionPlot";
import { withSubscripts } from "@/components/Subscript";
import { COLORS } from "@/lib/drawing";
import {
  magnificationAt,
  plotDuration,
  responseSamples,
} from "@/lib/forcedVibrationKinematics";
import type {
  ForcedVibrationParams,
  ForcedVibrationProperties,
} from "@/types/simulator";

interface Props {
  params: ForcedVibrationParams;
  properties: ForcedVibrationProperties;
}

const RESPONSE_SAMPLES = 400;
const CURVE_SAMPLES = 240;
const MAX_RATIO = 3;
/** The magnification curve is unbounded at resonance; clip it to stay readable. */
const MAGNIFICATION_CEILING = 6;

export const ForcedVibrationEquations = memo(function ForcedVibrationEquations({
  params,
  properties,
}: Props) {
  const [open, setOpen] = useState(true);
  const { t } = useLanguage();

  const responsePoints = useMemo(() => {
    const duration = plotDuration(properties, params);
    return responseSamples(params, duration, RESPONSE_SAMPLES).map(
      ([time, x]) => [time * 1000, x * 1000] as [number, number],
    );
  }, [params, properties]);

  const { dampedCurve, undampedCurve } = useMemo(() => {
    const damped: [number, number][] = [];
    const undamped: [number, number][] = [];
    for (let i = 0; i <= CURVE_SAMPLES; i++) {
      const r = (MAX_RATIO * i) / CURVE_SAMPLES;
      damped.push([
        r,
        Math.min(
          magnificationAt(r, properties.dampingRatio),
          MAGNIFICATION_CEILING,
        ),
      ]);
      undamped.push([
        r,
        Math.min(magnificationAt(r, 0), MAGNIFICATION_CEILING),
      ]);
    }
    return { dampedCurve: damped, undampedCurve: undamped };
  }, [properties.dampingRatio]);

  const amplitudeMm = properties.steadyAmplitude * 1000;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="forced-vibration-equations-content"
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <span>{t("fv.equations.heading")}</span>
        <span aria-hidden="true" className="text-gray-400">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          id="forced-vibration-equations-content"
          className="flex flex-col gap-3 px-3 pb-3 text-xs text-gray-700 dark:text-gray-300"
        >
          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("fv.equations.section.statement")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {t("fv.equations.statement.text")}
            </p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("fv.equations.section.theory")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("fv.equations.theory.three"))}
            </p>
            <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("fv.equations.theory.steady"))}
            </p>
            <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("fv.equations.theory.free"))}
            </p>
            <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("fv.equations.theory.damping_helps"))}
            </p>
          </div>

          <div className="font-mono">
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("fv.equations.section.formulas")}
            </p>
            <p>{withSubscripts("m·ẍ + c·ẋ + k·x = F_0·cos(ω·t)")}</p>
            <p>
              {withSubscripts("ω_n = √(k/m),   c_c = 2√(k·m),   ζ = c/c_c")}
            </p>
            <p>{withSubscripts("r = ω/ω_n,   δ_st = F_0/k")}</p>
            <p>{withSubscripts("X = δ_st / √[(1 − r²)² + (2ζr)²]")}</p>
            <p>
              {withSubscripts("ω_d = ω_n·√(1 − ζ²),   envelope e^(−ζ·ω_n·t)")}
            </p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("fv.equations.section.reference")}
            </p>
            <p className="font-sans leading-relaxed whitespace-pre-line text-gray-500 dark:text-gray-400">
              {withSubscripts(t("fv.equations.note.reference"))}
            </p>
          </div>

          <div>
            <p className="mb-2 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("fv.equations.section.response")}
            </p>
            <FunctionPlot
              ariaLabel={t("fv.plot.response.title")}
              xUnit="ms"
              yUnit="mm"
              series={[
                {
                  label: "x(t)",
                  color: COLORS.rVector,
                  points: responsePoints,
                },
              ]}
              refLines={
                params.forceEnabled && Number.isFinite(amplitudeMm)
                  ? [
                      { orientation: "h", value: amplitudeMm, dashed: true },
                      { orientation: "h", value: -amplitudeMm, dashed: true },
                    ]
                  : [{ orientation: "h", value: 0, dashed: true }]
              }
            />
            <p className="mt-1 font-sans leading-relaxed text-gray-500 dark:text-gray-400">
              {withSubscripts(t("fv.equations.response.note"))}
            </p>
          </div>

          <div>
            <p className="mb-2 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("fv.equations.section.plot")}
            </p>
            <FunctionPlot
              ariaLabel={t("fv.plot.magnification.title")}
              xUnit=""
              series={[
                {
                  label: `ζ = ${properties.dampingRatio.toFixed(2)}`,
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
                { orientation: "v", value: 1, dashed: true, label: "r = 1" },
                { orientation: "v", value: properties.frequencyRatio },
              ]}
            />
            <p className="mt-1 font-sans leading-relaxed text-gray-500 dark:text-gray-400">
              {withSubscripts(t("fv.equations.plot.note"))}
            </p>
          </div>
        </div>
      )}
    </div>
  );
});
