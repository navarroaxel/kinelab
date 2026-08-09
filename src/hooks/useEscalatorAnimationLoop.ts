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
  drawDot,
  COLORS,
  COLORS_DARK,
  type ColorPalette,
} from "@/lib/drawing";
import type {
  EscalatorParams,
  EscalatorState,
  EscalatorVisibility,
} from "@/types/simulator";

// The belt scrolls at a fixed screen speed for legibility — the real climb
// speed (height / liftTime) is typically well under 0.3 m/s and would be
// almost imperceptible if mapped 1:1 to canvas pixels.
const BELT_SPEED_PX_S = 36;
const STEP_SPACING = 22;
const MAX_RIDERS = 10;

export function useEscalatorAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: EscalatorParams,
  state: EscalatorState,
  visibility: EscalatorVisibility,
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
      render(ctx, canvas, params, state, visibility, phaseRef.current, colors, {
        pElec: "Pₑ",
        pMech: "Pₘ",
        motor: "M",
      });
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
        phaseRef.current += BELT_SPEED_PX_S * dt;
      }

      render(
        ctx!,
        canvas!,
        params,
        state,
        visibility,
        phaseRef.current,
        colors,
        {
          pElec: "Pₑ",
          pMech: "Pₘ",
          motor: "M",
        },
      );

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
  params: EscalatorParams,
  state: EscalatorState,
  visibility: EscalatorVisibility,
  phase: number,
  colors: ColorPalette,
  labels: { pElec: string; pMech: string; motor: string },
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  ctx.clearRect(0, 0, W, H);

  const bottom = { x: W * 0.18, y: H * 0.85 };
  const top = { x: W * 0.78, y: H * 0.15 };
  const dx = top.x - bottom.x;
  const dy = top.y - bottom.y;
  const length = Math.hypot(dx, dy);
  const ux = dx / length; // unit vector along the incline
  const uy = dy / length;
  const nx = -uy; // unit normal (for step ticks and rider offset)
  const ny = ux;

  // Landings
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(bottom.x - 24, bottom.y);
  ctx.lineTo(bottom.x + 12, bottom.y);
  ctx.moveTo(top.x - 12, top.y);
  ctx.lineTo(top.x + 24, top.y);
  ctx.stroke();
  ctx.restore();

  // Belt (the incline itself)
  ctx.save();
  ctx.strokeStyle = colors.trajectory;
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(bottom.x, bottom.y);
  ctx.lineTo(top.x, top.y);
  ctx.stroke();
  ctx.restore();

  // Steps: scrolling tick marks moving from bottom to top
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 2;
  const offset = phase % STEP_SPACING;
  for (let d = offset; d < length; d += STEP_SPACING) {
    const px = bottom.x + ux * d;
    const py = bottom.y + uy * d;
    ctx.beginPath();
    ctx.moveTo(px - nx * 7, py - ny * 7);
    ctx.lineTo(px + nx * 7, py + ny * 7);
    ctx.stroke();
  }
  ctx.restore();

  // Riders: a handful of dots scaled to numPeople, cycling up the belt
  if (visibility.showPassengers) {
    const riderCount = Math.max(
      1,
      Math.min(MAX_RIDERS, Math.round(params.numPeople / 3)),
    );
    const spacing = length / riderCount;
    for (let i = 0; i < riderCount; i++) {
      const d = (phase * 0.6 + i * spacing) % length;
      const px = bottom.x + ux * d - nx * 9;
      const py = bottom.y + uy * d - ny * 9;
      drawDot(ctx, px, py, 4, colors.point);
    }
  }

  // Power flow: electrical input into the motor, mechanical output to the belt
  if (visibility.showPowerFlow) {
    const motor = { x: bottom.x + 10, y: bottom.y + 26 };
    ctx.save();
    ctx.fillStyle = colors.center;
    ctx.beginPath();
    ctx.roundRect(motor.x - 16, motor.y - 12, 32, 24, 4);
    ctx.fill();
    ctx.restore();
    drawLabel(ctx, labels.motor, motor.x, motor.y, "#fff");

    drawArrow(
      ctx,
      motor.x - 46,
      motor.y,
      motor.x - 18,
      motor.y,
      colors.acceleration,
      2,
    );
    drawLabel(
      ctx,
      `${labels.pElec} ${(state.electricalPower / 1000).toFixed(2)} kW`,
      motor.x - 46,
      motor.y - 14,
      colors.acceleration,
    );

    const mechEnd = {
      x: motor.x + ux * 40,
      y: motor.y + uy * 40 - 12,
    };
    drawArrow(ctx, motor.x + 16, motor.y - 6, mechEnd.x, mechEnd.y, colors.normalAccel, 2);
    drawLabel(
      ctx,
      `${labels.pMech} ${(state.mechanicalPower / 1000).toFixed(2)} kW`,
      mechEnd.x + 34,
      mechEnd.y - 6,
      colors.normalAccel,
    );
  }

  // Efficiency badge near the top landing
  ctx.save();
  ctx.font = "bold 14px ui-sans-serif, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = colors.point;
  ctx.fillText(`η ≈ ${(state.efficiency * 100).toFixed(1)}%`, top.x, top.y - 20);
  ctx.restore();
}
