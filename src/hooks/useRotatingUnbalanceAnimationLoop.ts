"use client";

import { useEffect, useRef, type MutableRefObject, type RefObject } from "react";
import {
  computeDerived,
  displacementAt,
  rotorAngleAt,
} from "@/lib/rotatingUnbalanceKinematics";
import { drawGrid, drawLabel, COLORS, COLORS_DARK, type ColorPalette } from "@/lib/drawing";
import type {
  RotatingUnbalanceParams,
  RotatingUnbalanceState,
} from "@/types/simulator";

// px per metre for the vertical motion — the true amplitude is sub-millimetre
// (0.66 mm at the statement's own operating point), invisible at true scale.
export const MOTION_SCALE = 40_000;
/** Cap the drawn bounce so a near-resonant (ζ → 0) blow-up stays on canvas. */
const MAX_BOUNCE_PX = 55;

export function useRotatingUnbalanceAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: RotatingUnbalanceParams,
  tRef: MutableRefObject<number>,
  onMetrics: (state: RotatingUnbalanceState) => void,
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
      const rotorAngle = rotorAngleAt(t, derived);
      render(ctx!, canvas!, displacement, rotorAngle, currentColors());
      return { ...derived, t, displacement, rotorAngle };
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
  rotorAngle: number,
  colors: ColorPalette,
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  ctx.clearRect(0, 0, W, H);
  drawGrid(ctx, W, H, 20, colors.grid);

  const groundY = H * 0.78;
  const restY = H * 0.4;
  // Defensive: the kinematics layer already sanitizes the singular-resonance
  // case, but never let a non-finite value reach canvas geometry regardless.
  const safeDisplacement = Number.isFinite(displacement) ? displacement : 0;
  const bouncePx = Math.max(
    -MAX_BOUNCE_PX,
    Math.min(MAX_BOUNCE_PX, safeDisplacement * MOTION_SCALE),
  );
  const bodyY = restY + bouncePx;

  const centerX = W * 0.5;
  const halfSpan = Math.min(W * 0.22, 90);

  // Ground reference line
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.globalAlpha = 0.4;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(W, groundY);
  ctx.stroke();
  ctx.restore();

  // Springs (drawn as one pair either side; the statement's 4 springs
  // collapse into an equivalent k = springCount·k1, same idiom as
  // vehicle-suspension's 4-springs-into-one).
  drawSpring(ctx, centerX - halfSpan, groundY, centerX - halfSpan, bodyY + 30, colors.velocity);
  drawSpring(ctx, centerX + halfSpan, groundY, centerX + halfSpan, bodyY + 30, colors.velocity);

  // Motor body
  const bodyW = halfSpan * 2.2;
  const bodyH = 60;
  ctx.save();
  ctx.fillStyle = colors.point;
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.rect(centerX - bodyW / 2, bodyY - bodyH / 2, bodyW, bodyH);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Rotor disc, with the unbalance mass orbiting at ω regardless of r or ζ
  const rotorRadius = 20;
  const rotorCx = centerX;
  const rotorCy = bodyY;
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(rotorCx, rotorCy, rotorRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  const unbalanceX = rotorCx + rotorRadius * 0.7 * Math.cos(rotorAngle);
  const unbalanceY = rotorCy + rotorRadius * 0.7 * Math.sin(rotorAngle);
  ctx.save();
  ctx.fillStyle = colors.center;
  ctx.beginPath();
  ctx.arc(unbalanceX, unbalanceY, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  drawLabel(ctx, "x(t)", centerX + bodyW / 2 + 8, bodyY, colors.point);

  ctx.save();
  ctx.font = "12px sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = colors.axes;
  ctx.fillText(`×${(MOTION_SCALE / 1000).toFixed(0)}k scale`, 8, H - 10);
  ctx.restore();
}

function drawSpring(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
): void {
  const coils = 6;
  const length = y1 - y2;
  const step = length / coils;
  const amplitude = 8;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  for (let i = 1; i < coils; i++) {
    const sy = y1 - i * step;
    const sx = x1 + (i % 2 === 0 ? amplitude : -amplitude);
    ctx.lineTo(sx, sy);
  }
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}
