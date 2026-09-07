"use client";

import { memo, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FunctionPlot } from "@/components/FunctionPlot";
import { withSubscripts } from "@/components/Subscript";
import { COLORS } from "@/lib/drawing";
import {
  elementDisplacementAt,
  supportDisplacementAt,
} from "@/lib/machineElementBaseKinematics";
import { transmissibility } from "@/lib/vibrationTransmissibility";
import type {
  MachineElementBaseDerived,
  MachineElementBaseParams,
} from "@/types/simulator";

interface Props {
  params: MachineElementBaseParams;
  derived: MachineElementBaseDerived;
}

const TIME_SAMPLES = 300;
const CURVE_SAMPLES = 240;
const MAX_RATIO = 3;
/** T is unbounded near r = 1 at low ζ; clip it to stay readable. */
const CEILING = 4;

export const MachineElementBaseEquations = memo(
  function MachineElementBaseEquations({ params, derived }: Props) {
    const [open, setOpen] = useState(true);
    const { t } = useLanguage();

    const { supportPoints, elementPoints } = useMemo(() => {
      const period = (2 * Math.PI) / params.supportOmega;
      const duration = 2 * period;
      const support: [number, number][] = [];
      const element: [number, number][] = [];
      for (let i = 0; i <= TIME_SAMPLES; i++) {
        const time = (duration * i) / TIME_SAMPLES;
        support.push([
          time * 1000,
          supportDisplacementAt(time, params) * 1000,
        ]);
        element.push([
          time * 1000,
          elementDisplacementAt(time, params, derived) * 1000,
        ]);
      }
      return { supportPoints: support, elementPoints: element };
    }, [params, derived]);

    const { dampedCurve, undampedCurve } = useMemo(() => {
      const damped: [number, number][] = [];
      const undamped: [number, number][] = [];
      for (let i = 0; i <= CURVE_SAMPLES; i++) {
        const r = (MAX_RATIO * i) / CURVE_SAMPLES;
        damped.push([
          r,
          Math.min(transmissibility(r, derived.dampingRatio), CEILING),
        ]);
        undamped.push([r, Math.min(transmissibility(r, 0), CEILING)]);
      }
      return { dampedCurve: damped, undampedCurve: undamped };
    }, [derived.dampingRatio]);

    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="vib4-equations-content"
          className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <span>{t("vib4.equations.heading")}</span>
          <span aria-hidden="true" className="text-gray-400">
            {open ? "▲" : "▼"}
          </span>
        </button>

        {open && (
          <div
            id="vib4-equations-content"
            className="flex flex-col gap-3 px-3 pb-3 text-xs text-gray-700 dark:text-gray-300"
          >
            <div>
              <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
                {t("vib4.equations.section.statement")}
              </p>
              <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
                {t("vib4.equations.statement.text")}
              </p>
            </div>

            <div>
              <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
                {t("vib4.equations.section.theory")}
              </p>
              <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
                {withSubscripts(t("vib4.equations.theory.damping_helps"))}
              </p>
            </div>

            <div className="font-mono">
              <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
                {t("vib4.equations.section.formulas")}
              </p>
              <p>{withSubscripts("k = springCount·k_1,   ω_0 = √(k/M),   ζ = c/(2√(kM))")}</p>
              <p>{withSubscripts("r = ω/ω_0,   T = X_M/y_M = √[1+(2ζr)²] / D")}</p>
              <p>{withSubscripts("X_M (c = 0) = y_M / |1 − r²|")}</p>
            </div>

            <div>
              <p className="mb-2 font-sans text-xs text-gray-500 dark:text-gray-400">
                {t("vib4.equations.section.response")}
              </p>
              <FunctionPlot
                ariaLabel={t("vib4.plot.response.title")}
                xUnit="ms"
                yUnit="mm"
                series={[
                  { label: "S(t)", color: COLORS.normalForce, points: supportPoints },
                  { label: "x(t)", color: COLORS.point, points: elementPoints },
                ]}
              />
              <p className="mt-1 font-sans leading-relaxed text-gray-500 dark:text-gray-400">
                {withSubscripts(t("vib4.equations.response.note"))}
              </p>
            </div>

            <div>
              <p className="mb-2 font-sans text-xs text-gray-500 dark:text-gray-400">
                {t("vib4.equations.section.plot")}
              </p>
              <FunctionPlot
                ariaLabel={t("vib4.plot.transmissibility.title")}
                xUnit=""
                series={[
                  {
                    label: `ζ = ${derived.dampingRatio.toFixed(2)}`,
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
                  {
                    orientation: "v",
                    value: Math.SQRT2,
                    dashed: true,
                    label: "r = √2",
                  },
                  { orientation: "v", value: derived.frequencyRatio },
                  { orientation: "h", value: 1, dashed: true },
                ]}
              />
              <p className="mt-1 font-sans leading-relaxed text-gray-500 dark:text-gray-400">
                {withSubscripts(t("vib4.equations.plot.note"))}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  },
);
