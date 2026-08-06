"use client";

import { useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motionTangent } from "@/lib/parabolicTrackKinematics";
import {
  drawGrid,
  drawArrow,
  drawLabel,
  drawDot,
  COLORS,
  COLORS_DARK,
  type ColorPalette,
} from "@/lib/drawing";
import type {
  ParabolicTrackParams,
  ParabolicTrackState,
  ParabolicTrackVisibility,
} from "@/types/simulator";

interface Props {
  params: ParabolicTrackParams;
  state: ParabolicTrackState;
  visibility: ParabolicTrackVisibility;
}

const WORLD_HALF_EXTENT = 130; // meters, generous enough for Rc at the slider extremes

export function ParabolicTrackCanvas({ params, state, visibility }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useLanguage();

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.width / dpr;
    const H = canvas.height / dpr;
    const isDark = matchMedia("(prefers-color-scheme: dark)").matches;
    const colors: ColorPalette = isDark ? COLORS_DARK : COLORS;

    const scale = (Math.min(W, H) * 0.42) / WORLD_HALF_EXTENT;
    const originX = W / 2;
    const originY = H * 0.78;
    const toScreen = (wx: number, wy: number) => ({
      x: originX + wx * scale,
      y: originY - wy * scale,
    });

    ctx.clearRect(0, 0, W, H);
    drawGrid(ctx, W, H, 24, colors.grid);

    // Parabola
    ctx.save();
    ctx.strokeStyle = colors.axes;
    ctx.lineWidth = 2;
    ctx.beginPath();
    const xMax = WORLD_HALF_EXTENT * 0.9;
    for (let wx = -xMax; wx <= xMax; wx += 1) {
      const wy = params.coeff * wx * wx;
      const p = toScreen(wx, wy);
      if (wx === -xMax) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
    ctx.restore();

    const skater = toScreen(state.x, state.y);
    const center = toScreen(state.centerX, state.centerY);

    // Osculating circle
    if (visibility.showOsculatingCircle) {
      ctx.save();
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = colors.trajectory;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(center.x, center.y, state.Rc * scale, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(skater.x, skater.y);
      ctx.lineTo(center.x, center.y);
      ctx.stroke();
      ctx.restore();
      drawDot(ctx, center.x, center.y, 3, colors.center);
      drawLabel(
        ctx,
        "R_c",
        (skater.x + center.x) / 2,
        (skater.y + center.y) / 2 - 8,
        colors.axes,
      );
    }

    const { tx, ty } = motionTangent(state.x, state.slope);
    const norm = Math.sqrt(1 + state.slope * state.slope);
    const nx = -state.slope / norm;
    const ny = 1 / norm;

    // Direction vector in screen pixels: (dx, dy) is a world-space unit
    // vector, pixelLen is the arrow's on-screen length (already scaled by
    // the caller) — unrelated to the world→screen `scale` used for position.
    const screenVec = (dx: number, dy: number, pixelLen: number) => ({
      x: dx * pixelLen,
      y: -dy * pixelLen,
    });

    const VEL_SCALE = 3; // px per m/s
    const ACC_SCALE = 6; // px per m/s²

    if (visibility.showVelocity) {
      const d = screenVec(tx, ty, params.v * VEL_SCALE);
      drawArrow(
        ctx,
        skater.x,
        skater.y,
        skater.x + d.x,
        skater.y + d.y,
        colors.velocity,
        2,
      );
      drawLabel(
        ctx,
        "v",
        skater.x + d.x + 8,
        skater.y + d.y - 6,
        colors.velocity,
      );
    }

    if (visibility.showAcceleration) {
      const atVec = screenVec(tx, ty, state.at * ACC_SCALE);
      const anVec = screenVec(nx, ny, state.an * ACC_SCALE);
      const atTip = { x: skater.x + atVec.x, y: skater.y + atVec.y };
      const anTip = { x: skater.x + anVec.x, y: skater.y + anVec.y };
      const aTip = {
        x: skater.x + atVec.x + anVec.x,
        y: skater.y + atVec.y + anVec.y,
      };

      if (visibility.showParallelogram) {
        ctx.save();
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = colors.axes;
        ctx.globalAlpha = 0.5;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(atTip.x, atTip.y);
        ctx.lineTo(aTip.x, aTip.y);
        ctx.moveTo(anTip.x, anTip.y);
        ctx.lineTo(aTip.x, aTip.y);
        ctx.stroke();
        ctx.restore();
      }

      drawArrow(
        ctx,
        skater.x,
        skater.y,
        atTip.x,
        atTip.y,
        colors.acceleration,
        2,
      );
      drawLabel(ctx, "a_t", atTip.x + 6, atTip.y - 6, colors.acceleration);
      drawArrow(
        ctx,
        skater.x,
        skater.y,
        anTip.x,
        anTip.y,
        colors.normalAccel,
        2,
      );
      drawLabel(ctx, "a_n", anTip.x + 6, anTip.y - 6, colors.normalAccel);
      drawArrow(ctx, skater.x, skater.y, aTip.x, aTip.y, colors.point, 2.5);
      drawLabel(ctx, "a", aTip.x + 8, aTip.y - 8, colors.point);
    }

    drawDot(ctx, skater.x, skater.y, 6, colors.point);
    drawLabel(ctx, "A", skater.x + 10, skater.y - 10, colors.point);
  }, [params, state, visibility]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
    render();
  }, [render]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const dpr = window.devicePixelRatio || 1;
        const { width, height } = entry.contentRect;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
        render();
      }
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [render]);

  useEffect(() => {
    render();
  }, [render]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      style={{ width: "100%", aspectRatio: "16 / 9" }}
      className="rounded-xl border border-gray-200 dark:border-gray-700"
      aria-label={t("parabolic-track.page.canvas_aria")}
    />
  );
}
