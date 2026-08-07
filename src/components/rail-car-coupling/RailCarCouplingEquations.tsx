"use client";

import { memo, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FunctionPlot } from "@/components/FunctionPlot";
import { withSubscripts } from "@/components/Subscript";
import { COLORS } from "@/lib/drawing";
import {
  speed1DuringCoupling,
  speed2DuringCoupling,
} from "@/lib/railCarCouplingKinematics";
import type {
  RailCarCouplingParams,
  RailCarCouplingState,
} from "@/types/simulator";

interface Props {
  params: RailCarCouplingParams;
  state: RailCarCouplingState;
}

const SAMPLES = 60;

export const RailCarCouplingEquations = memo(
  function RailCarCouplingEquations({ params, state }: Props) {
    const [open, setOpen] = useState(true);
    const { t } = useLanguage();

    const { v1Points, v2Points } = useMemo(() => {
      const v1: [number, number][] = [];
      const v2: [number, number][] = [];
      for (let i = 0; i <= SAMPLES; i++) {
        const time = (params.couplingTime * i) / SAMPLES;
        v1.push([
          time,
          speed1DuringCoupling(
            time,
            state.speed1,
            state.finalSpeed,
            params.couplingTime,
          ) * 3.6,
        ]);
        v2.push([
          time,
          speed2DuringCoupling(time, state.finalSpeed, params.couplingTime) *
            3.6,
        ]);
      }
      return { v1Points: v1, v2Points: v2 };
    }, [params, state]);

    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="rail-car-coupling-equations-content"
          className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <span>{t("rail-car-coupling.equations.heading")}</span>
          <span aria-hidden="true" className="text-gray-400">
            {open ? "▲" : "▼"}
          </span>
        </button>

        {open && (
          <div
            id="rail-car-coupling-equations-content"
            className="flex flex-col gap-3 px-3 pb-3 text-xs text-gray-700 dark:text-gray-300"
          >
            <div>
              <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
                {t("rail-car-coupling.equations.section.statement")}
              </p>
              <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
                {t("rail-car-coupling.equations.statement.text")}
              </p>
            </div>

            <div>
              <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
                {t("rail-car-coupling.equations.section.theory")}
              </p>
              <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
                {withSubscripts(t("rail-car-coupling.equations.theory.momentum"))}
              </p>
              <p className="mt-1.5 font-sans leading-relaxed text-gray-600 dark:text-gray-400">
                {withSubscripts(t("rail-car-coupling.equations.theory.impulse"))}
              </p>
            </div>

            <div className="font-mono">
              <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
                {t("rail-car-coupling.equations.section.formulas")}
              </p>
              <p>
                {withSubscripts(t("rail-car-coupling.symbol.final_speed"))} = m₁·v₁ / (m₁ + m₂)
              </p>
              <p>
                J = m₁·(v₁ − {withSubscripts(t("rail-car-coupling.symbol.final_speed"))}) = m₂·
                {withSubscripts(t("rail-car-coupling.symbol.final_speed"))}
              </p>
              <p>
                {withSubscripts(t("rail-car-coupling.symbol.avg_force"))} = J / Δt
              </p>
            </div>

            <div>
              <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
                {t("rail-car-coupling.equations.section.reference")}
              </p>
              <p className="font-sans leading-relaxed whitespace-pre-line text-gray-500 dark:text-gray-400">
                {withSubscripts(t("rail-car-coupling.equations.note.reference"))}
              </p>
            </div>

            <div>
              <p className="mb-2 font-sans text-xs text-gray-500 dark:text-gray-400">
                {t("rail-car-coupling.equations.section.plot")}
              </p>
              <FunctionPlot
                ariaLabel={t("rail-car-coupling.plot.vt.title")}
                xUnit="s"
                yUnit="km/h"
                series={[
                  { label: "v₁(t)", color: COLORS.rVector, points: v1Points },
                  { label: "v₂(t)", color: COLORS.point, points: v2Points },
                ]}
                refLines={[
                  {
                    orientation: "h",
                    value: state.finalSpeed * 3.6,
                    label: t("rail-car-coupling.symbol.final_speed"),
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
  },
);
