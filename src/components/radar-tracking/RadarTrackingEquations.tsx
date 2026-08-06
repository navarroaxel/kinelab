"use client";

import { memo, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FunctionPlot } from "@/components/FunctionPlot";
import { withSubscripts } from "@/components/Subscript";
import { COLORS } from "@/lib/drawing";
import { computeRadarTrackingState } from "@/lib/radarTrackingKinematics";
import type { RadarTrackingParams } from "@/types/simulator";

interface Props {
  params: RadarTrackingParams;
  loopDuration: number;
}

const SAMPLES = 120;

export const RadarTrackingEquations = memo(function RadarTrackingEquations({
  params,
  loopDuration,
}: Props) {
  const [open, setOpen] = useState(true);
  const { t } = useLanguage();

  const { rPoints, thetaPoints, rDotPoints, thetaDotPoints } = useMemo(() => {
    const r: [number, number][] = [];
    const th: [number, number][] = [];
    const rd: [number, number][] = [];
    const thd: [number, number][] = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const time = (loopDuration * i) / SAMPLES;
      const s = computeRadarTrackingState(params, time);
      r.push([time, s.r]);
      th.push([time, s.thetaDeg]);
      rd.push([time, s.rDot]);
      thd.push([time, s.thetaDot]);
    }
    return { rPoints: r, thetaPoints: th, rDotPoints: rd, thetaDotPoints: thd };
  }, [params, loopDuration]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="radar-tracking-equations-content"
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <span>{t("radar-tracking.equations.heading")}</span>
        <span aria-hidden="true" className="text-gray-400">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          id="radar-tracking-equations-content"
          className="flex flex-col gap-3 px-3 pb-3 text-xs text-gray-700 dark:text-gray-300"
        >
          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("radar-tracking.equations.section.statement")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {t("radar-tracking.equations.statement.text")}
            </p>
          </div>

          <div className="font-mono">
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("radar-tracking.equations.section.formulas")}
            </p>
            <p>r = √(x² + y²), θ = atan2(y, x)</p>
            <p>ê_r = (cos θ, sin θ), ê_θ = (−sin θ, cos θ)</p>
            <p>ṙ = v⃗ · ê_r, r·θ̇ = v⃗ · ê_θ</p>
            <p>
              {withSubscripts("a_r")} = a⃗ · ê_r, {withSubscripts("a_θ")} = a⃗ ·
              ê_θ
            </p>
            <p>r̈ = {withSubscripts("a_r")} + r·θ̇²</p>
            <p>θ̈ = ({withSubscripts("a_θ")} − 2·ṙ·θ̇) / r</p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("radar-tracking.equations.section.reference")}
            </p>
            <p className="font-sans leading-relaxed text-gray-500 dark:text-gray-400">
              {t("radar-tracking.equations.note.reference")}
            </p>
            <p className="mt-1 font-sans leading-relaxed text-gray-500 dark:text-gray-400">
              {t("radar-tracking.equations.note.sign")}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("radar-tracking.equations.section.plots")}
            </p>
            <FunctionPlot
              ariaLabel={t("radar-tracking.plot.r.title")}
              xUnit="s"
              yUnit="m"
              series={[
                { label: "r(t)", color: COLORS.rVector, points: rPoints },
              ]}
            />
            <FunctionPlot
              ariaLabel={t("radar-tracking.plot.theta.title")}
              xUnit="s"
              yUnit="°"
              series={[
                {
                  label: "θ(t)",
                  color: COLORS.acceleration,
                  points: thetaPoints,
                },
              ]}
            />
            <FunctionPlot
              ariaLabel={t("radar-tracking.plot.rdot.title")}
              xUnit="s"
              yUnit="m/s"
              series={[
                {
                  label: "ṙ(t)",
                  color: COLORS.radialVelocity,
                  points: rDotPoints,
                },
              ]}
            />
            <FunctionPlot
              ariaLabel={t("radar-tracking.plot.thetadot.title")}
              xUnit="s"
              yUnit="rad/s"
              series={[
                {
                  label: "θ̇(t)",
                  color: COLORS.transverseVelocity,
                  points: thetaDotPoints,
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
