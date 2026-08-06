"use client";

import { memo, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FunctionPlot } from "@/components/FunctionPlot";
import { COLORS } from "@/lib/drawing";
import { velocityAtTime } from "@/lib/stoppingDistanceKinematics";
import type { StoppingDistanceCase } from "@/types/simulator";

interface Props {
  cases: StoppingDistanceCase[];
  reactionTime: number;
}

const SERIES_COLORS = [
  COLORS.rVector,
  COLORS.velocity,
  COLORS.acceleration,
] as const;

const SAMPLES = 100;

export const StoppingDistanceEquations = memo(
  function StoppingDistanceEquations({ cases, reactionTime }: Props) {
    const [open, setOpen] = useState(true);
    const { t } = useLanguage();

    const { series, shadedAreas } = useMemo(() => {
      const s = cases.map((c, i) => {
        const points: [number, number][] = [];
        for (let k = 0; k <= SAMPLES; k++) {
          const time = (c.tTotal * k) / SAMPLES;
          points.push([time, velocityAtTime(c, time)]);
        }
        // Ensure the reaction→braking kink is represented exactly.
        points.push([reactionTime, c.v0]);
        points.sort((a, b) => a[0] - b[0]);
        return {
          label: `${c.speedKmh} km/h`,
          color: SERIES_COLORS[i % SERIES_COLORS.length],
          points,
        };
      });
      const areas = cases.map((c, i) => ({
        seriesIndex: i,
        x0: 0,
        x1: c.tTotal,
      }));
      return { series: s, shadedAreas: areas };
    }, [cases, reactionTime]);

    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="stopping-distance-equations-content"
          className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <span>{t("stopping-distance.equations.heading")}</span>
          <span aria-hidden="true" className="text-gray-400">
            {open ? "▲" : "▼"}
          </span>
        </button>

        {open && (
          <div
            id="stopping-distance-equations-content"
            className="flex flex-col gap-3 px-3 pb-3 text-xs text-gray-700 dark:text-gray-300"
          >
            <div>
              <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
                {t("stopping-distance.equations.section.statement")}
              </p>
              <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
                {t("stopping-distance.equations.statement.text")}
              </p>
            </div>

            <div className="font-mono">
              <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
                {t("stopping-distance.equations.section.formulas")}
              </p>
              <p>d₁ = v₀·t_r (rectangle)</p>
              <p>t_f = v₀/a, a = decel × g</p>
              <p>d₂ = v₀² / (2·a) (triangle)</p>
              <p>D = d₁ + d₂</p>
            </div>

            <div>
              <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
                {t("stopping-distance.equations.section.reference")}
              </p>
              <p className="font-sans leading-relaxed text-gray-500 dark:text-gray-400">
                {t("stopping-distance.equations.note.reference")}
              </p>
            </div>

            <div>
              <p className="mb-2 font-sans text-xs text-gray-500 dark:text-gray-400">
                {t("stopping-distance.equations.section.plot")}
              </p>
              <FunctionPlot
                ariaLabel={t("stopping-distance.plot.vt.title")}
                xUnit="s"
                yUnit="m/s"
                series={series}
                shadedAreas={shadedAreas}
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
