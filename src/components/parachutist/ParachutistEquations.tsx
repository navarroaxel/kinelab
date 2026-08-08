"use client";

import { memo, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FunctionPlot } from "@/components/FunctionPlot";
import { withSubscripts } from "@/components/Subscript";
import { COLORS } from "@/lib/drawing";
import { velocityAtTime } from "@/lib/parachutistKinematics";
import type { ParachutistParams, ParachutistState } from "@/types/simulator";

interface Props {
  params: ParachutistParams;
  state: ParachutistState;
}

const SAMPLES = 100;

export const ParachutistEquations = memo(function ParachutistEquations({
  params,
  state,
}: Props) {
  const [open, setOpen] = useState(true);
  const { t } = useLanguage();

  const vtPoints = useMemo(() => {
    const duration = Math.min(Math.max(5 * state.timeConstant, 3), 10);
    const points: [number, number][] = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const time = (duration * i) / SAMPLES;
      points.push([
        time,
        velocityAtTime(
          time,
          params.initialSpeed,
          state.terminalSpeed,
          state.timeConstant,
        ),
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
        aria-controls="parachutist-equations-content"
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <span>{t("parachutist.equations.heading")}</span>
        <span aria-hidden="true" className="text-gray-400">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          id="parachutist-equations-content"
          className="flex flex-col gap-3 px-3 pb-3 text-xs text-gray-700 dark:text-gray-300"
        >
          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("parachutist.equations.section.statement")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {t("parachutist.equations.statement.text")}
            </p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("parachutist.equations.section.theory")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {withSubscripts(t("parachutist.equations.theory.text"))}
            </p>
          </div>

          <div className="font-mono">
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("parachutist.equations.section.formulas")}
            </p>
            <p>m·dv/dt = mg − β·v</p>
            <p>
              v(t) = {withSubscripts("v_t")} + ({withSubscripts("v_0")} −{" "}
              {withSubscripts("v_t")})·e^(−t/τ)
            </p>
            <p>
              z(t) = {withSubscripts("v_t")}·t + ({withSubscripts("v_0")} −{" "}
              {withSubscripts("v_t")})·τ·(1 − e^(−t/τ))
            </p>
            <p>
              {withSubscripts("v_t")} = m·g/β, τ = m/β
            </p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("parachutist.equations.section.reference")}
            </p>
            <p className="font-sans leading-relaxed whitespace-pre-line text-gray-500 dark:text-gray-400">
              {t("parachutist.equations.note.reference")}
            </p>
          </div>

          <div>
            <p className="mb-2 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("parachutist.equations.section.plot")}
            </p>
            <FunctionPlot
              ariaLabel={t("parachutist.plot.vt.title")}
              xUnit="s"
              yUnit="m/s"
              series={[
                { label: "v(t)", color: COLORS.rVector, points: vtPoints },
              ]}
              refLines={[
                {
                  orientation: "h",
                  value: state.terminalSpeed,
                  label: "v_t",
                  dashed: true,
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
