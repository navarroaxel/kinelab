"use client";

import { memo, useEffect, useRef, type MutableRefObject } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  COLORS,
  COLORS_DARK,
  drawArrow,
  drawDot,
  drawLabel,
  type ColorPalette,
} from "@/lib/drawing";
import type { TranslationKey } from "@/lib/i18n";
import type { KinematicState } from "@/types/simulator";

type Kind = "velocity" | "acceleration";

interface Props {
  kind: Kind;
  titleKey: TranslationKey;
  latestStateRef: MutableRefObject<KinematicState | null>;
  subscribeTick: (fn: () => void) => () => void;
}

// Smoothing for the auto-fit scale so the arrows don't twitch every frame.
function smoothScale(prev: number, target: number): number {
  if (target > prev) return target; // grow instantly to avoid overflow
  return prev * 0.97 + target * 0.03; // shrink gently
}

export const PhasorDiagram = memo(function PhasorDiagram({
  kind,
  titleKey,
  latestStateRef,
  subscribeTick,
}: Props) {
  const { t } = useLanguage();
  const title = t(titleKey);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fitRef = useRef(0); // pixels per world-unit (auto-fit, smoothed)

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

  // ResizeObserver: re-scale on layout changes
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

  // Subscribe to the shared main-loop tick — no per-phasor RAF.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isDark = matchMedia("(prefers-color-scheme: dark)").matches;
    const colors: ColorPalette = isDark ? COLORS_DARK : COLORS;
    const resultantColor = isDark ? "#D1D5DB" : "#374151"; // neutral gray for the resultant
    const aThetaColor = colors.transverseVelocity; // coral — transverse direction is coral in both phasors

    function draw() {
      const dpr = window.devicePixelRatio || 1;
      const W = canvas!.width / dpr;
      const H = canvas!.height / dpr;
      const cx = W / 2;
      const cy = H / 2;

      ctx!.clearRect(0, 0, W, H);

      // ── Axes (subtle) ───────────────────────────────────────────────────────
      ctx!.save();
      ctx!.strokeStyle = colors.axes;
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      ctx!.moveTo(0, cy);
      ctx!.lineTo(W, cy);
      ctx!.moveTo(cx, 0);
      ctx!.lineTo(cx, H);
      ctx!.stroke();
      ctx!.restore();
      drawLabel(ctx!, "x", W - 10, cy - 8, colors.axes);
      drawLabel(ctx!, "y", cx + 10, 10, colors.axes);

      const state = latestStateRef.current;
      if (!state) {
        // No frame yet — just show the axes + origin dot
        drawDot(ctx!, cx, cy, 3, colors.center);
        return;
      }

      // ── Read state ─────────────────────────────────────────────────────────
      const { phi, theta, vx, vy, ax, ay, rDot, rThetaDot, ar, aTheta } = state;

      // Polar basis (world): eᵣ = (cosθ, sinθ); eθ = (−sinθ, cosθ)
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);
      // Intrinsic tangent: along v/|v|. Falls back to CCW-tangent at φ when v≈0.
      const vMag = Math.hypot(vx, vy);
      let etx: number, ety: number;
      if (vMag > 1e-3) {
        etx = vx / vMag;
        ety = vy / vMag;
      } else {
        etx = -Math.sin(phi);
        ety = Math.cos(phi);
      }
      // Intrinsic normal: toward the circle centre O = (0,0). Perpendicular to v
      // for circular motion, so v has no normal component.
      const enx = -Math.cos(phi);
      const eny = -Math.sin(phi);

      // Intrinsic scalars come from projecting the full vector onto (eₜ, eₙ).
      // This is correct in both rotation senses (state.at = R·α uses a CCW
      // convention and disagrees with eₜ = v/|v| when ω < 0).
      const aT = ax * etx + ay * ety;
      const aNint = ax * enx + ay * eny; // equals R·ω² (≥ 0)

      // Resultant in world coords + per-kind scalars/labels/colors
      let resX: number, resY: number;
      let sT: number, sN: number, sR: number, sO: number;
      let lT: string, lN: string, lR: string, lO: string;
      let cT: string, cN: string, cR: string, cO: string;

      if (kind === "velocity") {
        resX = vx;
        resY = vy;
        sT = vMag;
        sN = 0;
        sR = rDot;
        sO = rThetaDot;
        lT = "vₜ";
        lN = "vₙ";
        lR = "vᵣ";
        lO = "vθ";
        // For velocity, the resultant IS the tangential component — drawn once
        // with the tangent color; vₙ = 0 gets a separate didactic callout.
        cT = colors.acceleration; // purple = tangent direction
        cN = colors.normalAccel; // amber  = normal direction (zero → label only)
        cR = colors.radialVelocity; // green
        cO = aThetaColor; // coral
      } else {
        resX = ax;
        resY = ay;
        sT = aT;
        sN = aNint;
        sR = ar;
        sO = aTheta;
        lT = "aₜ";
        lN = "aₙ";
        lR = "aᵣ";
        lO = "aθ";
        cT = colors.acceleration;
        cN = colors.normalAccel;
        cR = colors.radialVelocity;
        cO = aThetaColor;
      }

      // ── Auto-fit scale ─────────────────────────────────────────────────────
      // Fit the largest extent (resultant or any component magnitude) into the
      // panel, leaving a margin for arrowheads and labels.
      const margin = 36;
      const halfSize = Math.min(W, H) / 2 - margin;
      const minMag = kind === "velocity" ? 20 : 2; // floor so static states don't zoom in absurdly
      const maxMag = Math.max(
        Math.hypot(resX, resY),
        Math.abs(sT),
        Math.abs(sN),
        Math.abs(sR),
        Math.abs(sO),
        minMag,
      );
      const targetFit = halfSize / maxMag;
      fitRef.current =
        fitRef.current === 0
          ? targetFit
          : smoothScale(fitRef.current, targetFit);
      const s = fitRef.current;

      // Endpoints in screen coords (world Y flipped: cy − wY·s)
      const resEnd = { x: cx + resX * s, y: cy - resY * s };
      const tEnd = { x: cx + sT * etx * s, y: cy - sT * ety * s };
      // Normal component drawn from origin along eₙ with magnitude |sN|. For
      // velocity sN = 0 (we draw nothing). For acceleration sN ≥ 0 and points
      // toward O along eₙ.
      const nEnd = { x: cx + sN * enx * s, y: cy - sN * eny * s };
      const rEnd = { x: cx + sR * cosT * s, y: cy - sR * sinT * s };
      const oEnd = { x: cx + sO * -sinT * s, y: cy - sO * cosT * s };

      // ── Parallelogram completion (dashed) ──────────────────────────────────
      // Intrinsic basis: only meaningful when both components contribute. For
      // velocity we skip (since vₙ = 0 collapses the parallelogram to a line).
      const dashed = (
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        color: string,
      ) => {
        ctx!.save();
        ctx!.strokeStyle = color;
        ctx!.lineWidth = 1;
        ctx!.globalAlpha = 0.4;
        ctx!.setLineDash([3, 3]);
        ctx!.beginPath();
        ctx!.moveTo(x1, y1);
        ctx!.lineTo(x2, y2);
        ctx!.stroke();
        ctx!.restore();
      };

      if (kind === "acceleration") {
        // Intrinsic parallelogram: from tEnd → resEnd and nEnd → resEnd
        dashed(tEnd.x, tEnd.y, resEnd.x, resEnd.y, cN);
        dashed(nEnd.x, nEnd.y, resEnd.x, resEnd.y, cT);
      }
      // Polar parallelogram (always shown — both bases give the same resultant)
      dashed(rEnd.x, rEnd.y, resEnd.x, resEnd.y, cO);
      dashed(oEnd.x, oEnd.y, resEnd.x, resEnd.y, cR);

      // ── Resultant ──────────────────────────────────────────────────────────
      // For velocity, the resultant IS the tangential component — drawn with
      // cT below as the same arrow. For acceleration, draw a thick neutral arrow.
      if (kind === "acceleration") {
        drawArrow(ctx!, cx, cy, resEnd.x, resEnd.y, resultantColor, 2.5);
        const aMag = Math.hypot(resX, resY);
        if (aMag * s > 18) {
          drawLabel(
            ctx!,
            `a = ${aMag.toFixed(1)}`,
            resEnd.x + 10,
            resEnd.y - 10,
            resultantColor,
            true,
          );
        }
      }

      // ── Intrinsic components ───────────────────────────────────────────────
      // Tangential
      drawArrow(ctx!, cx, cy, tEnd.x, tEnd.y, cT, 2);
      if (Math.abs(sT) * s > 14) {
        drawLabel(
          ctx!,
          `${lT}=${sT.toFixed(1)}`,
          tEnd.x + 12,
          tEnd.y - 6,
          cT,
          true,
        );
      }
      // Normal — for velocity this is the "= 0" callout, for acceleration an arrow
      if (kind === "velocity") {
        drawDot(ctx!, cx, cy, 3, cN);
        drawLabel(ctx!, t("phasor.vn.zero"), cx, cy - 14, cN, true);
      } else {
        drawArrow(ctx!, cx, cy, nEnd.x, nEnd.y, cN, 2);
        if (Math.abs(sN) * s > 14) {
          drawLabel(
            ctx!,
            `${lN}=${sN.toFixed(1)}`,
            nEnd.x + 12,
            nEnd.y - 6,
            cN,
            true,
          );
        }
      }

      // ── Polar components ───────────────────────────────────────────────────
      // Radial
      drawArrow(ctx!, cx, cy, rEnd.x, rEnd.y, cR, 2);
      if (Math.abs(sR) * s > 14) {
        drawLabel(
          ctx!,
          `${lR}=${sR.toFixed(1)}`,
          rEnd.x + 12,
          rEnd.y + 8,
          cR,
          true,
        );
      }
      // Transverse / "angular"
      drawArrow(ctx!, cx, cy, oEnd.x, oEnd.y, cO, 2);
      if (Math.abs(sO) * s > 14) {
        drawLabel(
          ctx!,
          `${lO}=${sO.toFixed(1)}`,
          oEnd.x + 12,
          oEnd.y + 8,
          cO,
          true,
        );
      }

      // Origin marker drawn last so it sits on top of arrow tails
      drawDot(ctx!, cx, cy, 3, colors.center);
    }

    draw();
    return subscribeTick(draw);
  }, [kind, latestStateRef, subscribeTick, t]);

  // Mini legend below the title — shows which colors map to which basis
  const intrinsicLabel = kind === "velocity" ? "vₜ / vₙ" : "aₜ / aₙ";
  const polarLabel = kind === "velocity" ? "vᵣ / vθ" : "aᵣ / aθ";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center justify-between px-1 pb-1">
        <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          {title}
        </h3>
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", aspectRatio: "1 / 1" }}
        aria-label={title}
      />
      <div className="flex flex-wrap gap-x-3 gap-y-1 px-1 pt-1.5 text-[10px] text-gray-600 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <span className="text-gray-500 dark:text-gray-500">
            {t("phasor.basis.intrinsic")}:
          </span>
          <span
            className="inline-block h-[2px] w-2.5"
            style={{ backgroundColor: COLORS.acceleration }}
          />
          <span
            className="inline-block h-[2px] w-2.5"
            style={{ backgroundColor: COLORS.normalAccel }}
          />
          <span>{intrinsicLabel}</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="text-gray-500 dark:text-gray-500">
            {t("phasor.basis.polar")}:
          </span>
          <span
            className="inline-block h-[2px] w-2.5"
            style={{ backgroundColor: COLORS.radialVelocity }}
          />
          <span
            className="inline-block h-[2px] w-2.5"
            style={{ backgroundColor: COLORS.transverseVelocity }}
          />
          <span>{polarLabel}</span>
        </span>
      </div>
    </div>
  );
});
