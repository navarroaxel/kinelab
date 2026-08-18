"use client";

import { memo, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FunctionPlot } from "@/components/FunctionPlot";
import { withSubscripts } from "@/components/Subscript";
import { COLORS } from "@/lib/drawing";
import {
  computeOscillatingBarState,
  toDegrees,
} from "@/lib/oscillatingBarKinematics";
import type {
  OscillatingBarLimits,
  OscillatingBarParams,
  OscillatingBarState,
} from "@/types/simulator";

interface Props {
  params: OscillatingBarParams;
  state: OscillatingBarState;
  limits: OscillatingBarLimits;
}

const SAMPLES = 180;

export const OscillatingBarEquations = memo(function OscillatingBarEquations({
  params,
  state,
  limits,
}: Props) {
  const [open, setOpen] = useState(true);
  const { t } = useLanguage();

  const { omegaPoints, alphaPoints } = useMemo(() => {
    const omega: [number, number][] = [];
    const alpha: [number, number][] = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const deg = (360 * i) / SAMPLES;
      const s = computeOscillatingBarState(params, (deg * Math.PI) / 180);
      omega.push([deg, s.barOmega]);
      alpha.push([deg, s.barAlpha]);
    }
    return { omegaPoints: omega, alphaPoints: alpha };
  }, [params]);

  const currentPhi = (() => {
    const deg = toDegrees(state.crankAngle) % 360;
    return deg < 0 ? deg + 360 : deg;
  })();

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="oscillating-bar-equations-content"
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <span>{t("ob.equations.heading")}</span>
        <span aria-hidden="true" className="text-gray-400">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          id="oscillating-bar-equations-content"
          className="flex flex-col gap-3 px-3 pb-3 text-xs text-gray-700 dark:text-gray-300"
        >
          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("ob.equations.section.statement")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {t("ob.equations.statement.text")}
            </p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("ob.equations.section.theory")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("ob.equations.theory.loop"))}
            </p>
            <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("ob.equations.theory.swing"))}
            </p>
            <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("ob.equations.theory.frame"))}
            </p>
            <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("ob.equations.theory.sense"))}
            </p>
          </div>

          <div className="font-mono">
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("ob.equations.section.formulas")}
            </p>
            <p>tan θ = b·sen φ / (d − b·cos φ)</p>
            <p>r² = D = d² + b² − 2·b·d·cos φ</p>
            <p>θ̇ = ω·b·(d·cos φ − b) / D</p>
            <p>θ̈ = −ω²·b·d·(d² − b²)·sen φ / D²</p>
            <p>ṙ = ω·b·d·sen φ / r</p>
            <p>{withSubscripts("θ_max = arcsen(b/d)   (θ̇ = 0 there)")}</p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("ob.equations.section.reference")}
            </p>
            <p className="font-sans leading-relaxed whitespace-pre-line text-gray-500 dark:text-gray-400">
              {withSubscripts(t("ob.equations.note.reference"))}
            </p>
          </div>

          <div>
            <p className="mb-2 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("ob.equations.section.plot")}
            </p>
            <FunctionPlot
              ariaLabel={t("ob.plot.rates.title")}
              xUnit="°"
              series={[
                {
                  label: "ω_BC",
                  color: COLORS.transverseVelocity,
                  points: omegaPoints,
                },
                {
                  label: "α_BC",
                  color: COLORS.acceleration,
                  points: alphaPoints,
                },
              ]}
              refLines={[
                { orientation: "h", value: 0, dashed: true },
                { orientation: "v", value: currentPhi },
              ]}
            />
            <p className="mt-1 font-sans leading-relaxed text-gray-500 dark:text-gray-400">
              {withSubscripts(t("ob.equations.plot.note"))}{" "}
              {toDegrees(limits.maxBarAngle).toFixed(1)}°.
            </p>
          </div>
        </div>
      )}
    </div>
  );
});
