"use client";

import { useEffect, useRef, type MutableRefObject, type RefObject } from "react";
import { computeDerived, displacementAt } from "@/lib/massReleaseKinematics";
import { drawGrid, drawLabel, COLORS, COLORS_DARK, type ColorPalette } from "@/lib/drawing";
import type { MassReleaseParams, MassReleaseState } from "@/types/simulator";

// px per metre for the vertical motion.
const MOTION_SCALE = 250;
const MAX_BOUNCE_PX = 140;

export function useMassReleaseAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: MassReleaseParams,
  tRef: MutableRefObject<number>,
  onMetrics: (state: MassReleaseState) => void,
  paused: boolean,
  resetCount: number,
): void {
  const lastTimeRef = useRef<number | null>(null);
  const rafIdRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const derived = computeDerived(params);

    function currentColors(): ColorPalette {
      return document.documentElement.classList.contains("dark")
        ? COLORS_DARK
        : COLORS;
    }

    function frameAt(t: number) {
      const displacement = displacementAt(t, derived);
      render(ctx!, canvas!, displacement, derived.slackThreshold, currentColors());
      return { ...derived, t, displacement };
    }

    if (paused) {
      const state = frameAt(tRef.current);
      onMetrics(state);
      return;
    }

    let lastMetricUpdate = 0;

    function frame(now: number) {
      const dt =
        lastTimeRef.current !== null
          ? Math.min((now - lastTimeRef.current) / 1000, 0.05)
          : 0;
      lastTimeRef.current = now;

      tRef.current += dt;

      const state = frameAt(tRef.current);

      if (now - lastMetricUpdate > 66) {
        onMetrics(state);
        lastMetricUpdate = now;
      }

      rafIdRef.current = requestAnimationFrame(frame);
    }

    rafIdRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      lastTimeRef.current = null;
    };
  }, [params, paused, resetCount]); // eslint-disable-line react-hooks/exhaustive-deps
}

function render(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  displacement: number,
  slackThreshold: number,
  colors: ColorPalette,
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  ctx.clearRect(0, 0, W, H);
  drawGrid(ctx, W, H, 20, colors.grid);

  const ceilingY = H * 0.1;
  const restY = H * 0.45;
  const bouncePx = Math.max(
    -MAX_BOUNCE_PX,
    Math.min(MAX_BOUNCE_PX, displacement * MOTION_SCALE),
  );
  const massY = restY + bouncePx;

  // Instantaneous slack: the spring's true stretch (slackThreshold +
  // displacement) has gone to zero or below — it can only pull, not push.
  const inSlack = displacement <= -slackThreshold;

  const centerX = W * 0.5;

  // Ceiling anchor
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(centerX - 40, ceilingY);
  ctx.lineTo(centerX + 40, ceilingY);
  ctx.stroke();
  ctx.restore();

  // New-equilibrium reference line
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.globalAlpha = 0.4;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(0, restY);
  ctx.lineTo(W, restY);
  ctx.stroke();
  ctx.restore();
  drawLabel(ctx, "x = 0", 12, restY - 8, colors.axes);

  drawSpring(
    ctx,
    centerX,
    ceilingY,
    centerX,
    massY - 20,
    inSlack ? colors.criticalSpeed : colors.velocity,
    inSlack,
  );

  // Mass
  const size = 44;
  ctx.save();
  ctx.fillStyle = inSlack ? colors.criticalSpeed : colors.point;
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.rect(centerX - size / 2, massY - size / 2, size, size);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  drawLabel(ctx, "x(t)", centerX + size / 2 + 20, massY, colors.point);

  if (inSlack) {
    ctx.save();
    ctx.font = "12px sans-serif";
    ctx.textAlign = "left";
    ctx.fillStyle = colors.criticalSpeed;
    ctx.fillText("spring slack", 8, H - 10);
    ctx.restore();
  }
}

function drawSpring(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  dashed: boolean,
): void {
  const coils = 10;
  const length = y2 - y1;
  const step = length / coils;
  const amplitude = 10;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  if (dashed) ctx.setLineDash([5, 4]);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  for (let i = 1; i < coils; i++) {
    const sy = y1 + i * step;
    const sx = x1 + (i % 2 === 0 ? amplitude : -amplitude);
    ctx.lineTo(sx, sy);
  }
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}
