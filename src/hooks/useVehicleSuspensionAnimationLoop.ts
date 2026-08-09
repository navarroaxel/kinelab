"use client";

import { useEffect, useRef, type MutableRefObject, type RefObject } from "react";
import {
  computeDerived,
  platformDisplacementAt,
  vehicleDisplacementAt,
} from "@/lib/vehicleSuspensionKinematics";
import { drawGrid, drawLabel, COLORS, COLORS_DARK, type ColorPalette } from "@/lib/drawing";
import type {
  VehicleSuspensionParams,
  VehicleSuspensionState,
} from "@/types/vehicle-suspension";

// px per metre for the vertical motion — small physical amplitudes (cm-scale)
// need heavy magnification to read clearly on screen.
const MOTION_SCALE = 900;

export function useVehicleSuspensionAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: VehicleSuspensionParams,
  tRef: MutableRefObject<number>,
  onMetrics: (state: VehicleSuspensionState) => void,
  paused: boolean,
  resetCount: number,
): void {
  const lastTimeRef = useRef<number | null>(null);
  const rafIdRef = useRef<number>(0);
  const lastMetricUpdate = useRef(0);

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
      const y = platformDisplacementAt(t, params, derived);
      const x = vehicleDisplacementAt(t, derived);
      render(ctx!, canvas!, y, x, currentColors());
      return { ...derived, t, y, x };
    }

    if (paused) {
      const state = frameAt(tRef.current);
      onMetrics(state);
      return;
    }

    function frame(now: number) {
      const dt =
        lastTimeRef.current !== null
          ? Math.min((now - lastTimeRef.current) / 1000, 0.05)
          : 0;
      lastTimeRef.current = now;

      tRef.current += dt;

      const state = frameAt(tRef.current);

      if (now - lastMetricUpdate.current > 66) {
        onMetrics(state);
        lastMetricUpdate.current = now;
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
  y: number,
  x: number,
  colors: ColorPalette,
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  ctx.clearRect(0, 0, W, H);
  drawGrid(ctx, W, H, 20, colors.grid);

  const midY = H * 0.55;
  const platformY = midY + y * MOTION_SCALE;
  const bodyRestY = midY - H * 0.28;
  const bodyY = bodyRestY + x * MOTION_SCALE;

  const centerX = W * 0.5;
  const halfSpan = Math.min(W * 0.22, 90);

  // Ground reference line
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.globalAlpha = 0.4;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(0, midY);
  ctx.lineTo(W, midY);
  ctx.stroke();
  ctx.restore();
  drawLabel(ctx, "y = 0", 8, midY - 6, colors.axes);

  // Test platform (base excitation)
  const platformW = halfSpan * 2.4;
  ctx.save();
  ctx.fillStyle = colors.normalForce;
  ctx.fillRect(centerX - platformW / 2, platformY, platformW, 14);
  ctx.restore();
  drawLabel(ctx, "y(t)", centerX + platformW / 2 + 8, platformY + 10, colors.normalForce);

  // Spring (left) — zigzag from platform top to body bottom
  drawSpring(
    ctx,
    centerX - halfSpan,
    platformY,
    centerX - halfSpan,
    bodyY + 26,
    colors.velocity,
  );

  // Damper (right) — cylinder + rod
  drawDamper(
    ctx,
    centerX + halfSpan,
    platformY,
    centerX + halfSpan,
    bodyY + 26,
    colors.acceleration,
  );

  // Vehicle body
  const bodyW = halfSpan * 2.6;
  const bodyH = 26;
  ctx.save();
  ctx.fillStyle = colors.point;
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.rect(centerX - bodyW / 2, bodyY, bodyW, bodyH);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // CG marker
  ctx.save();
  ctx.fillStyle = colors.center;
  ctx.beginPath();
  ctx.arc(centerX, bodyY + bodyH / 2, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  drawLabel(ctx, "x(t)  CG", centerX + bodyW / 2 + 8, bodyY + bodyH / 2 + 4, colors.point);
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

function drawDamper(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
): void {
  const cylinderTop = y1 - (y1 - y2) * 0.35;
  const cylinderBottom = y1 - (y1 - y2) * 0.75;
  const halfWidth = 6;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";

  // Rod from platform up into the cylinder
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1, cylinderTop);
  ctx.stroke();

  // Cylinder body
  ctx.beginPath();
  ctx.rect(x1 - halfWidth, cylinderTop, halfWidth * 2, cylinderBottom - cylinderTop);
  ctx.stroke();

  // Rod from cylinder up to the body
  ctx.beginPath();
  ctx.moveTo(x1, cylinderBottom);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}
