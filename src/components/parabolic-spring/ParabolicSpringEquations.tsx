"use client";

import { memo, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FunctionPlot } from "@/components/FunctionPlot";
import { withSubscripts } from "@/components/Subscript";
import { COLORS } from "@/lib/drawing";
import {
  normalForce,
  pathEndX,
  speedAt,
} from "@/lib/parabolicSpringKinematics";
import type {
  ParabolicSpringParams,
  ParabolicSpringState,
} from "@/types/simulator";

interface Props {
  params: ParabolicSpringParams;
  state: ParabolicSpringState;
}

const SAMPLES = 120;

export const ParabolicSpringEquations = memo(function ParabolicSpringEquations({
  params,
  state,
}: Props) {
  const [open, setOpen] = useState(true);
  const { t } = useLanguage();

  // N along the descent the block will actually make, with the speed at
  // each x coming from energy conservation rather than being held fixed.
  const normalPoints = useMemo(() => {
    const endX = pathEndX(params);
    if (!Number.isFinite(endX)) return [];
    const points: [number, number][] = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const x = (endX * i) / SAMPLES;
      const speed = speedAt(x, params.startX, params.startSpeed, params);
      if (speed === null) continue;
      points.push([x, normalForce(x, speed, params)]);
    }
    return points;
  }, [params]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="parabolic-spring-equations-content"
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <span>{t("ps.equations.heading")}</span>
        <span aria-hidden="true" className="text-gray-400">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          id="parabolic-spring-equations-content"
          className="flex flex-col gap-3 px-3 pb-3 text-xs text-gray-700 dark:text-gray-300"
        >
          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("ps.equations.section.statement")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {t("ps.equations.statement.text")}
            </p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("ps.equations.section.theory")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("ps.equations.theory.frame"))}
            </p>
            <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("ps.equations.theory.spring"))}
            </p>
            <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("ps.equations.theory.decouple"))}
            </p>
            <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("ps.equations.theory.liftoff"))}
            </p>
          </div>

          <div className="font-mono">
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("ps.equations.section.formulas")}
            </p>
            <p>y = a − b·x², y′ = −2b·x, y″ = −2b</p>
            <p>ρ = (1 + y′²)^(3/2) / |y″|</p>
            <p>t̂ = (1, y′)/√(1+y′²), n̂ = (y′, −1)/√(1+y′²)</p>
            <p>
              {withSubscripts("F_s = k·(x − L_0)   (horizontal, toward B)")}
            </p>
            <p>{withSubscripts("ΣF_t = m·v̇")}</p>
            <p>
              {withSubscripts("ΣF_n = m·v²/ρ   →   applied·n̂ − N = m·v²/ρ")}
            </p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("ps.equations.section.reference")}
            </p>
            <p className="font-sans leading-relaxed whitespace-pre-line text-gray-500 dark:text-gray-400">
              {withSubscripts(t("ps.equations.note.reference"))}
            </p>
          </div>

          <div>
            <p className="mb-2 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("ps.equations.section.plot")}
            </p>
            <FunctionPlot
              ariaLabel={t("ps.plot.normal.title")}
              xUnit="m"
              yUnit="N"
              series={[
                {
                  label: "N(x)",
                  color: COLORS.normalForce,
                  points: normalPoints,
                },
              ]}
              refLines={[
                { orientation: "h", value: 0, dashed: true },
                { orientation: "v", value: state.x },
              ]}
            />
            <p className="mt-1 font-sans leading-relaxed text-gray-500 dark:text-gray-400">
              {withSubscripts(t("ps.equations.plot.note"))}
            </p>
          </div>
        </div>
      )}
    </div>
  );
});
