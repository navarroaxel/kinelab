"use client";

import {
  useRef,
  useEffect,
  type RefObject,
  type MutableRefObject,
} from "react";
import {
  drawArrow,
  drawLabel,
  drawLabelWithSubscript,
  COLORS,
  COLORS_DARK,
  type ColorPalette,
} from "@/lib/drawing";
import type {
  HelicopterLiftParams,
  HelicopterLiftState,
  HelicopterLiftVisibility,
} from "@/types/simulator";

// The downwash streaks scroll at a fixed screen speed for legibility — the
// real exhaust velocity (tens of ft/s) would blur past far too fast if
// mapped 1:1 to canvas pixels.
const STREAK_SPEED_PX_S = 160;
const STREAK_SPACING = 20;

export function useHelicopterLiftAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: HelicopterLiftParams,
  state: HelicopterLiftState,
  visibility: HelicopterLiftVisibility,
  phaseRef: MutableRefObject<number>,
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

    if (paused) {
      const colors: ColorPalette = document.documentElement.classList.contains(
        "dark",
      )
        ? COLORS_DARK
        : COLORS;
      render(ctx, canvas, params, state, visibility, phaseRef.current, colors);
      return;
    }

    function frame(now: number) {
      const colors: ColorPalette = document.documentElement.classList.contains(
        "dark",
      )
        ? COLORS_DARK
        : COLORS;
      const dt =
        lastTimeRef.current !== null
          ? Math.min((now - lastTimeRef.current) / 1000, 0.05)
          : 0;
      lastTimeRef.current = now;

      if (dt > 0) {
        phaseRef.current += STREAK_SPEED_PX_S * dt;
      }

      render(ctx!, canvas!, params, state, visibility, phaseRef.current, colors);

      rafIdRef.current = requestAnimationFrame(frame);
    }

    rafIdRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      lastTimeRef.current = null;
    };
  }, [params, state, visibility, paused, resetCount]); // eslint-disable-line react-hooks/exhaustive-deps
}

function render(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  params: HelicopterLiftParams,
  state: HelicopterLiftState,
  visibility: HelicopterLiftVisibility,
  phase: number,
  colors: ColorPalette,
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  ctx.clearRect(0, 0, W, H);

  const rotor = { x: W * 0.5, y: H * 0.22 };
  const wakeHalfWidth = Math.min(W * 0.32, 90);
  const wakeBottom = H * 0.92;

  // Helicopter body: a small fuselage sitting on the rotor plane
  ctx.save();
  ctx.fillStyle = colors.center;
  ctx.beginPath();
  ctx.roundRect(rotor.x - 26, rotor.y - 34, 52, 26, 6);
  ctx.fill();
  ctx.restore();

  // Rotor disk (the wake column's top edge)
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(rotor.x, rotor.y, wakeHalfWidth, 6, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Wake column outline
  ctx.save();
  ctx.strokeStyle = colors.trajectory;
  ctx.setLineDash([4, 4]);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(rotor.x - wakeHalfWidth, rotor.y);
  ctx.lineTo(rotor.x - wakeHalfWidth, wakeBottom);
  ctx.moveTo(rotor.x + wakeHalfWidth, rotor.y);
  ctx.lineTo(rotor.x + wakeHalfWidth, wakeBottom);
  ctx.stroke();
  ctx.restore();
  drawLabel(
    ctx,
    `d = ${params.wakeDiameter.toFixed(0)} ft`,
    rotor.x + wakeHalfWidth + 30,
    rotor.y,
    colors.point,
    true,
  );

  // Downwash: scrolling streaks moving from the rotor down through the wake
  if (visibility.showAirflow) {
    ctx.save();
    ctx.strokeStyle = colors.rVector;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    const columnLength = wakeBottom - rotor.y;
    const offset = phase % STREAK_SPACING;
    const xs = [-0.55, -0.2, 0.2, 0.55];
    for (const fx of xs) {
      const px = rotor.x + fx * wakeHalfWidth;
      for (let d = offset; d < columnLength; d += STREAK_SPACING) {
        const y0 = rotor.y + d;
        const y1 = Math.min(y0 + 10, wakeBottom);
        ctx.beginPath();
        ctx.moveTo(px, y0);
        ctx.lineTo(px, y1);
        ctx.stroke();
      }
    }
    ctx.restore();
    drawLabel(
      ctx,
      `v = ${params.exhaustVelocity.toFixed(0)} ft/s`,
      rotor.x,
      wakeBottom + 16,
      colors.rVector,
    );
  }

  // Force vectors at the rotor: thrust up, total weight down. Both scaled
  // by the same factor so the taller arrow always tops out 36px above its
  // base, keeping room for the max-load badge fixed just above that.
  const ARROW_MAX_PX = 36;
  if (visibility.showForces) {
    const scale = ARROW_MAX_PX / Math.max(state.thrust, params.heliWeight, 1);

    const thrustBase = rotor.y - 8;
    const thrustTip = thrustBase - state.thrust * scale;
    drawArrow(
      ctx,
      rotor.x - 64,
      thrustBase,
      rotor.x - 64,
      thrustTip,
      colors.acceleration,
      2,
    );
    drawLabel(
      ctx,
      `T ≈ ${state.thrust.toFixed(0)} lb`,
      rotor.x - 64,
      thrustTip - 8,
      colors.acceleration,
    );

    const weightBase = rotor.y - 40;
    const weightTip = weightBase + params.heliWeight * scale;
    drawArrow(
      ctx,
      rotor.x + 64,
      weightBase,
      rotor.x + 64,
      weightTip,
      colors.normalAccel,
      2,
    );
    drawLabel(
      ctx,
      `W ≈ ${params.heliWeight.toFixed(0)} lb`,
      rotor.x + 64,
      weightTip + 8,
      colors.normalAccel,
    );
  }

  // Max-load badge — fixed just above the tallest possible force arrow
  drawLabelWithSubscript(
    ctx,
    `L_max ≈ ${state.maxLoad.toFixed(0)} lb`,
    rotor.x,
    rotor.y - 8 - ARROW_MAX_PX - 20,
    state.maxLoad >= 0 ? colors.point : colors.acceleration,
  );
}
