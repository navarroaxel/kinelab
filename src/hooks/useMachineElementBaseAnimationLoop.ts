"use client";

import { useEffect, useRef, type MutableRefObject, type RefObject } from "react";
import {
  computeDerived,
  elementDisplacementAt,
  supportDisplacementAt,
} from "@/lib/machineElementBaseKinematics";
import { drawGrid, drawLabel, COLORS, COLORS_DARK, type ColorPalette } from "@/lib/drawing";
import type {
  MachineElementBaseParams,
  MachineElementBaseState,
} from "@/types/simulator";

// px per metre for the vertical motion — millimetre-scale amplitudes need
// heavy magnification to read clearly on screen.
const MOTION_SCALE = 900;

export function useMachineElementBaseAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: MachineElementBaseParams,
  tRef: MutableRefObject<number>,
  onMetrics: (state: MachineElementBaseState) => void,
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
      const supportDisplacement = supportDisplacementAt(t, params);
      const elementDisplacement = elementDisplacementAt(t, params, derived);
      render(
        ctx!,
        canvas!,
        supportDisplacement,
        elementDisplacement,
        currentColors(),
      );
      return { ...derived, t, supportDisplacement, elementDisplacement };
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
  supportDisplacement: number,
  elementDisplacement: number,
  colors: ColorPalette,
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  ctx.clearRect(0, 0, W, H);
  drawGrid(ctx, W, H, 20, colors.grid);

  const midY = H * 0.55;
  const supportY = midY + supportDisplacement * MOTION_SCALE;
  const elementRestY = midY - H * 0.28;
  const elementY = elementRestY + elementDisplacement * MOTION_SCALE;

  const centerX = W * 0.5;
  const halfSpan = Math.min(W * 0.22, 90);

  // Reference line
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.globalAlpha = 0.4;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(0, midY);
  ctx.lineTo(W, midY);
  ctx.stroke();
  ctx.restore();
  drawLabel(ctx, "S = 0", 12, midY - 6, colors.axes);

  // Moving support
  const supportW = halfSpan * 2.4;
  ctx.save();
  ctx.fillStyle = colors.normalForce;
  ctx.fillRect(centerX - supportW / 2, supportY, supportW, 14);
  ctx.restore();
  drawLabel(ctx, "S(t)", centerX + supportW / 2 + 10, supportY + 10, colors.normalForce);

  // Spring (left)
  drawSpring(
    ctx,
    centerX - halfSpan,
    supportY,
    centerX - halfSpan,
    elementY + 26,
    colors.velocity,
  );

  // Damper (right)
  drawDamper(
    ctx,
    centerX + halfSpan,
    supportY,
    centerX + halfSpan,
    elementY + 26,
    colors.acceleration,
  );

  // Element
  const bodyW = halfSpan * 2.6;
  const bodyH = 26;
  ctx.save();
  ctx.fillStyle = colors.point;
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.rect(centerX - bodyW / 2, elementY, bodyW, bodyH);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
  drawLabel(ctx, "x(t)", centerX + bodyW / 2 + 10, elementY + bodyH / 2, colors.point);
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

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1, cylinderTop);
  ctx.stroke();

  ctx.beginPath();
  ctx.rect(x1 - halfWidth, cylinderTop, halfWidth * 2, cylinderBottom - cylinderTop);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x1, cylinderBottom);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}
