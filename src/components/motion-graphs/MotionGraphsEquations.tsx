"use client";

import { memo, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FunctionPlot } from "@/components/FunctionPlot";
import { COLORS } from "@/lib/drawing";
import {
  positionAtTime,
  zeroCrossings,
  type MotionSegment,
} from "@/lib/motionGraphsKinematics";
import type { MotionGraphsVisibility } from "@/types/simulator";

interface Props {
  segments: MotionSegment[];
  tEnd: number;
  visibility: MotionGraphsVisibility;
}

const SAMPLES = 200;

export const MotionGraphsEquations = memo(function MotionGraphsEquations({
  segments,
  tEnd,
  visibility,
}: Props) {
  const [open, setOpen] = useState(true);
  const { t } = useLanguage();

  const { atPoints, xtPoints, markers } = useMemo(() => {
    const at: [number, number][] = [];
    for (const seg of segments) {
      at.push([seg.t0, seg.a]);
      at.push([seg.t1, seg.a]);
    }
    const xt: [number, number][] = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const time = (tEnd * i) / SAMPLES;
      xt.push([time, positionAtTime(segments, time)]);
    }
    const extrema = zeroCrossings(segments).map((e) => ({
      x: e.t,
      y: e.x,
      label: `t=${e.t.toFixed(1)}`,
    }));
    return { atPoints: at, xtPoints: xt, markers: extrema };
  }, [segments, tEnd]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="motion-graphs-equations-content"
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <span>{t("motion-graphs.equations.heading")}</span>
        <span aria-hidden="true" className="text-gray-400">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          id="motion-graphs-equations-content"
          className="flex flex-col gap-3 px-3 pb-3 text-xs text-gray-700 dark:text-gray-300"
        >
          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("motion-graphs.equations.section.statement")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {t("motion-graphs.equations.statement.text")}
            </p>
          </div>

          <div className="font-mono">
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("motion-graphs.equations.section.formulas")}
            </p>
            <p>a = (v₁ − v₀) / (t₁ − t₀) (constant per segment)</p>
            <p>x(t) = x(t₀) + v₀·τ + ½·a·τ², τ = t − t₀</p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("motion-graphs.equations.section.reference")}
            </p>
            <p className="font-sans leading-relaxed text-gray-500 dark:text-gray-400">
              {t("motion-graphs.equations.note.reference")}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("motion-graphs.equations.section.plots")}
            </p>

            {visibility.showAcceleration && (
              <FunctionPlot
                ariaLabel={t("motion-graphs.plot.at.title")}
                xUnit="s"
                yUnit="m/s²"
                series={[
                  {
                    label: "a(t)",
                    color: COLORS.acceleration,
                    points: atPoints,
                  },
                ]}
              />
            )}

            {visibility.showPosition && (
              <FunctionPlot
                ariaLabel={t("motion-graphs.plot.xt.title")}
                xUnit="s"
                yUnit="m"
                series={[
                  { label: "x(t)", color: COLORS.rVector, points: xtPoints },
                ]}
                markers={visibility.showMarkers ? markers : undefined}
              />
            )}
          </div>

          <p className="mt-1 border-t border-gray-100 pt-2 font-sans text-xs leading-relaxed text-gray-500 dark:border-gray-800 dark:text-gray-400">
            {t("units.note")}
          </p>
        </div>
      )}
    </div>
  );
});
