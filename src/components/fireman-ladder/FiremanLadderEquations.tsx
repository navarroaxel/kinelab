"use client";

import { memo, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FunctionPlot } from "@/components/FunctionPlot";
import { withSubscripts } from "@/components/Subscript";
import { COLORS } from "@/lib/drawing";
import {
  S_MAX,
  S_MIN,
  computeFiremanLadderInstant,
} from "@/lib/firemanLadderKinematics";
import type { FiremanLadderParams, FiremanLadderState } from "@/types/simulator";

interface Props {
  params: FiremanLadderParams;
  state: FiremanLadderState;
}

const SAMPLES = 60;

export const FiremanLadderEquations = memo(function FiremanLadderEquations({
  params,
  state,
}: Props) {
  const [open, setOpen] = useState(true);
  const { t } = useLanguage();

  const { speedPoints, accelPoints } = useMemo(() => {
    const speed: [number, number][] = [];
    const accel: [number, number][] = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const s = S_MIN + ((S_MAX - S_MIN) * i) / SAMPLES;
      const instant = computeFiremanLadderInstant({
        s,
        theta2: state.theta2,
        omega1: params.omega1,
        omega2: state.omega2Signed,
        sDot: state.sDotSigned,
      });
      speed.push([s, instant.speed]);
      accel.push([s, instant.accelMag]);
    }
    return { speedPoints: speed, accelPoints: accel };
  }, [params.omega1, state.theta2, state.omega2Signed, state.sDotSigned]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="fireman-ladder-equations-content"
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <span>{t("fl.equations.heading")}</span>
        <span aria-hidden="true" className="text-gray-400">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          id="fireman-ladder-equations-content"
          className="flex flex-col gap-3 px-3 pb-3 text-xs text-gray-700 dark:text-gray-300"
        >
          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("fl.equations.section.statement")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {t("fl.equations.statement.text")}
            </p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("fl.equations.section.theory")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("fl.equations.theory.frame"))}
            </p>
            <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("fl.equations.theory.omega_dot"))}
            </p>
            <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("fl.equations.theory.terms"))}
            </p>
          </div>

          <div className="font-mono">
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("fl.equations.section.formulas")}
            </p>
            <p>û = (0; cos θ₂; sin θ₂),   r = s·û</p>
            <p>Ω = ω₂x̂ + ω₁ẑ,   Ω̇ = ω₁ω₂ŷ</p>
            <p>{withSubscripts("v = Ω×r + v_rel,   v_rel = ṡ·û")}</p>
            <p>{withSubscripts("a = Ω̇×r + Ω×(Ω×r) + 2Ω×v_rel + a_rel")}</p>
            <p>{withSubscripts("a_rel = 0   (ṡ constant, û fixed in the frame)")}</p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("fl.equations.section.reference")}
            </p>
            <p className="font-sans leading-relaxed whitespace-pre-line text-gray-500 dark:text-gray-400">
              {withSubscripts(t("fl.equations.note.reference"))}
            </p>
          </div>

          <div>
            <p className="mb-2 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("fl.equations.section.plot")}
            </p>
            <FunctionPlot
              ariaLabel={t("fl.plot.magnitudes.title")}
              xUnit="m"
              yUnit="SI"
              series={[
                { label: "|v|", color: COLORS.velocity, points: speedPoints },
                {
                  label: "|a|",
                  color: COLORS.acceleration,
                  points: accelPoints,
                },
              ]}
              refLines={[
                {
                  orientation: "v",
                  value: state.s,
                  label: "s",
                  dashed: true,
                },
              ]}
            />
            <p className="mt-1 font-sans leading-relaxed text-gray-500 dark:text-gray-400">
              {t("fl.equations.plot.note")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
});
