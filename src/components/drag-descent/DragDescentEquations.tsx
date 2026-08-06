"use client";

import { memo, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FunctionPlot } from "@/components/FunctionPlot";
import { COLORS } from "@/lib/drawing";
import {
  vMaxOf,
  kOf,
  timeToHalfVMax,
  velocityAtTime,
  positionAtTime,
  asymptoteAtTime,
} from "@/lib/dragDescentKinematics";
import type { DragDescentParams } from "@/types/simulator";

interface Props {
  params: DragDescentParams;
}

const SAMPLES = 150;

export const DragDescentEquations = memo(function DragDescentEquations({
  params,
}: Props) {
  const [open, setOpen] = useState(true);
  const { t } = useLanguage();

  const vMax = vMaxOf(params);
  const k = kOf(params);
  const tHalf = timeToHalfVMax(params);

  const { vtPoints, xtPoints, vxPoints, tangentPoints, asymptotePoints } =
    useMemo(() => {
      const vt: [number, number][] = [];
      const xt: [number, number][] = [];
      const vx: [number, number][] = [];
      for (let i = 0; i <= SAMPLES; i++) {
        const time = (params.tMax * i) / SAMPLES;
        const v = velocityAtTime(params, time);
        const x = positionAtTime(params, time);
        vt.push([time, v]);
        xt.push([time, x]);
        vx.push([x, v]);
      }
      const tangentEnd = Math.min(params.tMax, tHalf * 2);
      const tangent: [number, number][] = [
        [0, 0],
        [tangentEnd, params.A * tangentEnd],
      ];
      const asymptote: [number, number][] = [
        [0, asymptoteAtTime(params, 0)],
        [params.tMax, asymptoteAtTime(params, params.tMax)],
      ];
      return {
        vtPoints: vt,
        xtPoints: xt,
        vxPoints: vx,
        tangentPoints: tangent,
        asymptotePoints: asymptote,
      };
    }, [params, tHalf]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="drag-descent-equations-content"
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <span>{t("drag-descent.equations.heading")}</span>
        <span aria-hidden="true" className="text-gray-400">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          id="drag-descent-equations-content"
          className="flex flex-col gap-3 px-3 pb-3 text-xs text-gray-700 dark:text-gray-300"
        >
          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("drag-descent.equations.section.statement")}
            </p>
            <p className="font-sans leading-relaxed text-gray-600 dark:text-gray-400">
              {t("drag-descent.equations.statement.text")}
            </p>
          </div>

          <div className="font-mono">
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("drag-descent.equations.section.closed_form")}
            </p>
            <p>vₘₐₓ = √(A/B), k = B·vₘₐₓ</p>
            <p>v(t) = vₘₐₓ · tanh(k·t)</p>
            <p>x(t) = (1/B) · ln[cosh(k·t)]</p>
            <p>v(x) = vₘₐₓ · √(1 − e^(−2·B·x))</p>
            <p>t½ = artanh(0.5) / k</p>
          </div>

          <div>
            <p className="mb-0.5 font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("drag-descent.equations.section.reference")}
            </p>
            <p className="font-mono">
              vₘₐₓ = {vMax.toFixed(2)} m/s, k = {k.toFixed(6)} s⁻¹, t½ ={" "}
              {tHalf.toFixed(2)} s
            </p>
            <p className="font-sans leading-relaxed text-gray-500 dark:text-gray-400">
              {t("drag-descent.equations.note.reference")}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-sans text-xs text-gray-500 dark:text-gray-400">
              {t("drag-descent.equations.section.plots")}
            </p>

            <FunctionPlot
              ariaLabel={t("drag-descent.plot.vt.title")}
              xUnit="s"
              yUnit="m/s"
              series={[
                { label: "v(t)", color: COLORS.velocity, points: vtPoints },
                {
                  label: "A·t",
                  color: COLORS.axes,
                  points: tangentPoints,
                  dashed: true,
                },
              ]}
              refLines={[
                { orientation: "h", value: vMax, label: "vₘₐₓ", dashed: true },
              ]}
              markers={[{ x: tHalf, y: vMax / 2, label: "t½" }]}
            />

            <FunctionPlot
              ariaLabel={t("drag-descent.plot.xt.title")}
              xUnit="s"
              yUnit="m"
              series={[
                { label: "x(t)", color: COLORS.rVector, points: xtPoints },
                {
                  label: "vₘₐₓ·t − ln2/B",
                  color: COLORS.axes,
                  points: asymptotePoints,
                  dashed: true,
                },
              ]}
              markers={[
                { x: tHalf, y: positionAtTime(params, tHalf), label: "t½" },
              ]}
            />

            <FunctionPlot
              ariaLabel={t("drag-descent.plot.vx.title")}
              xUnit="m"
              yUnit="m/s"
              series={[
                {
                  label: "v(x)",
                  color: COLORS.transverseVelocity,
                  points: vxPoints,
                },
              ]}
              refLines={[
                { orientation: "h", value: vMax, label: "vₘₐₓ", dashed: true },
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
