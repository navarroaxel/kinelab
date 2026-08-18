"use client";

import { memo, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FunctionPlot } from "@/components/FunctionPlot";
import { withSubscripts } from "@/components/Subscript";
import { COLORS } from "@/lib/drawing";
import { requiredMu } from "@/lib/bankedCurveKinematics";
import type {
  BankedCurveLimits,
  BankedCurveParams,
  BankedCurveState,
} from "@/types/simulator";

interface Props {
  params: BankedCurveParams;
  state: BankedCurveState;
  limits: BankedCurveLimits;
}

const SAMPLES = 120;
const SPEED_MAX = 45;

export const BankedCurveEquations = memo(function BankedCurveEquations({
  params,
  state,
  limits,
}: Props) {
  const [open, setOpen] = useState(true);
  const { t } = useLanguage();

  const muPoints = useMemo(() => {
    const points: [number, number][] = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const v = (SPEED_MAX * i) / SAMPLES;
      points.push([v, requiredMu(v, params)]);
    }
    return points;
  }, [params]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="banked-curve-equations-content"
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <span>{t("bc.equations.heading")}</span>
        <span aria-hidden="true" className="text-gray-400">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          id="banked-curve-equations-content"
          className="flex flex-col gap-3 px-3 pb-3 text-xs text-gray-700 dark:text-gray-300"
        >
          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("bc.equations.section.statement")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {t("bc.equations.statement.text")}
            </p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("bc.equations.section.theory")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("bc.equations.theory.axes"))}
            </p>
            <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("bc.equations.theory.mass"))}
            </p>
            <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("bc.equations.theory.limits"))}
            </p>
            <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("bc.equations.theory.degenerate"))}
            </p>
          </div>

          <div className="font-mono">
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("bc.equations.section.formulas")}
            </p>
            <p>N·sen θ + f·cos θ = m·v²/ρ</p>
            <p>N·cos θ − f·sen θ = m·g</p>
            <p>N = m·(g·cos θ + (v²/ρ)·sen θ)</p>
            <p>f = m·((v²/ρ)·cos θ − g·sen θ)</p>
            <p>{withSubscripts("v_max = √( ρ·g·(tan θ + μ) / (1 − μ·tan θ) )")}</p>
            <p>{withSubscripts("v_min = √( ρ·g·(tan θ − μ) / (1 + μ·tan θ) )")}</p>
            <p>{withSubscripts("v_ideal = √( ρ·g·tan θ )   (f = 0)")}</p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("bc.equations.section.reference")}
            </p>
            <p className="font-sans leading-relaxed whitespace-pre-line text-gray-500 dark:text-gray-400">
              {withSubscripts(t("bc.equations.note.reference"))}
            </p>
          </div>

          <div>
            <p className="mb-2 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("bc.equations.section.plot")}
            </p>
            <FunctionPlot
              ariaLabel={t("bc.plot.mu.title")}
              xUnit="m/s"
              series={[
                {
                  label: "μ_req",
                  color: COLORS.coriolis,
                  points: muPoints,
                },
              ]}
              refLines={[
                {
                  orientation: "h",
                  value: params.mu,
                  label: `+${params.mu.toFixed(2)}`,
                  dashed: true,
                },
                {
                  orientation: "h",
                  value: -params.mu,
                  label: `−${params.mu.toFixed(2)}`,
                  dashed: true,
                },
                {
                  orientation: "v",
                  value: limits.minSpeed,
                  label: "v_min",
                  dashed: true,
                },
                ...(limits.maxSpeed === null
                  ? []
                  : [
                      {
                        orientation: "v" as const,
                        value: limits.maxSpeed,
                        label: "v_max",
                        dashed: true,
                      },
                    ]),
                { orientation: "v", value: state.speed },
              ]}
            />
            <p className="mt-1 font-sans leading-relaxed text-gray-500 dark:text-gray-400">
              {withSubscripts(t("bc.equations.plot.note"))}
            </p>
          </div>
        </div>
      )}
    </div>
  );
});
