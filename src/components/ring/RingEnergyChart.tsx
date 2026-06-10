"use client";

import { memo, useEffect, useRef, type MutableRefObject } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { COLORS, COLORS_DARK, type ColorPalette } from "@/lib/drawing";
import { PADDING, WINDOW_SECONDS } from "@/lib/strip-chart";
import type { RingParams, RingSample } from "@/types/simulator";

interface Props {
  params: RingParams;
  samplesRef: MutableRefObject<RingSample[]>;
  tRef: MutableRefObject<number>;
  subscribeTick: (fn: () => void) => () => void;
}

/**
 * Stacked-area strip chart of kinetic vs potential energy over the last
 * WINDOW_SECONDS. At each timestamp the column is split bottom-to-top:
 * amber (KE) up to the KE value, then purple (PE) up to E_total. If RK4
 * drifts, KE+PE no longer fills the rectangle and the gap is visible at top.
 */
export const RingEnergyChart = memo(function RingEnergyChart({
  params,
  samplesRef,
  tRef,
  subscribeTick,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useLanguage();

  // DPR scaling on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.getContext("2d")?.scale(dpr, dpr);
  }, []);

  // Rescale on layout changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const dpr = window.devicePixelRatio || 1;
        const { width, height } = entry.contentRect;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.getContext("2d")?.scale(dpr, dpr);
      }
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  // Subscribe to the shared RAF tick
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isDark = matchMedia("(prefers-color-scheme: dark)").matches;
    const colors: ColorPalette = isDark ? COLORS_DARK : COLORS;

    function draw() {
      const dpr = window.devicePixelRatio || 1;
      const W = canvas!.width / dpr;
      const H = canvas!.height / dpr;
      const tNow = tRef.current;
      const samples = samplesRef.current;
      const eTotal = 0.5 * params.initialSpeed ** 2;

      renderEnergyChart(ctx!, W, H, samples, tNow, eTotal, colors);
    }

    draw();
    return subscribeTick(draw);
  }, [params.initialSpeed, samplesRef, tRef, subscribeTick]);

  const eTotal = 0.5 * params.initialSpeed ** 2;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center justify-between px-1 pb-1">
        <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          {t("ring.chart.energy.title")}
        </h3>
        <div className="flex gap-3">
          <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
            <span
              className="inline-block h-2 w-3"
              style={{ backgroundColor: COLORS.energyKE }}
            />
            <span>{t("ring.energy.ke")}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
            <span
              className="inline-block h-2 w-3"
              style={{ backgroundColor: COLORS.energyPE }}
            />
            <span>{t("ring.energy.pe")}</span>
          </div>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", aspectRatio: "5 / 1" }}
        aria-label={t("ring.chart.energy.title")}
      />
      {eTotal <= 0.5 && (
        <p className="px-1 pt-1 text-[10px] text-gray-500 dark:text-gray-400">
          {t("ring.chart.energy.empty")}
        </p>
      )}
    </div>
  );
});

function renderEnergyChart(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  samples: RingSample[],
  tNow: number,
  eTotal: number,
  colors: ColorPalette,
): void {
  ctx.clearRect(0, 0, W, H);

  const p = PADDING;
  const plotW = W - p.left - p.right;
  const plotH = H - p.top - p.bottom;
  const xLeft = p.left;
  const xRight = p.left + plotW;
  const yTop = p.top;
  const yBottom = p.top + plotH;

  // Frame
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 1;
  ctx.strokeRect(xLeft, yTop, plotW, plotH);

  // Vertical 1s grid lines within the visible window
  if (eTotal > 0) {
    const tStart = tNow - WINDOW_SECONDS;
    const firstSec = Math.ceil(tStart);
    const lastSec = Math.floor(tNow);
    ctx.strokeStyle = colors.grid;
    ctx.beginPath();
    for (let s = firstSec; s <= lastSec; s++) {
      const x = xLeft + ((s - tStart) / WINDOW_SECONDS) * plotW;
      ctx.moveTo(x, yTop);
      ctx.lineTo(x, yBottom);
    }
    ctx.stroke();
  }

  // Y-axis tick labels (E_total at top, 0 at bottom)
  ctx.fillStyle = colors.axes;
  ctx.font = "10px ui-sans-serif, system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillText(eTotal > 0 ? eTotal.toFixed(0) : "—", xLeft - 4, yTop + 6);
  ctx.fillText("0", xLeft - 4, yBottom - 4);
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("u²/s²", xLeft + 2, yTop + 2);
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";
  ctx.fillText(`t = ${tNow.toFixed(1)} s`, xRight - 2, H - 2);

  if (eTotal <= 0 || samples.length < 2) return;

  const tStart = tNow - WINDOW_SECONDS;
  const xOf = (t: number) => xLeft + ((t - tStart) / WINDOW_SECONDS) * plotW;
  const yOf = (e: number) => yBottom - Math.min(e / eTotal, 1) * plotH;

  // Clip to the plot rectangle so old samples outside the window don't leak.
  ctx.save();
  ctx.beginPath();
  ctx.rect(xLeft, yTop, plotW, plotH);
  ctx.clip();

  // KE area: from the baseline up to the KE(t) curve.
  ctx.beginPath();
  ctx.moveTo(xOf(samples[0].t), yBottom);
  for (const s of samples) ctx.lineTo(xOf(s.t), yOf(s.KE));
  ctx.lineTo(xOf(samples[samples.length - 1].t), yBottom);
  ctx.closePath();
  ctx.fillStyle = colors.energyKE;
  ctx.fill();

  // PE area: from KE(t) curve up to (KE+PE)(t). If KE+PE < E_total the top
  // gap is RK4 drift made visible.
  ctx.beginPath();
  ctx.moveTo(xOf(samples[0].t), yOf(samples[0].KE));
  for (const s of samples) ctx.lineTo(xOf(s.t), yOf(s.KE));
  for (let i = samples.length - 1; i >= 0; i--) {
    const s = samples[i];
    ctx.lineTo(xOf(s.t), yOf(s.KE + s.PE));
  }
  ctx.closePath();
  ctx.fillStyle = colors.energyPE;
  ctx.fill();

  ctx.restore();
}
