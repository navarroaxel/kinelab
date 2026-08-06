"use client";

import {
  useRef,
  useEffect,
  type RefObject,
  type MutableRefObject,
} from "react";
import {
  computeElevatorCableState,
  positionAtTime,
  timeAtPosition,
} from "@/lib/elevatorCableKinematics";
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
  ElevatorCableParams,
  ElevatorCableState,
  ElevatorCableVisibility,
} from "@/types/simulator";

export function useElevatorCableAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: ElevatorCableParams,
  visibility: ElevatorCableVisibility,
  tauRef: MutableRefObject<number>,
  loopDuration: number,
  onMetrics: (state: ElevatorCableState) => void,
  paused: boolean,
  resetCount: number,
): void {
  const lastTimeRef = useRef<number | null>(null);
  const rafIdRef = useRef<number>(0);
  const lastMetricUpdate = useRef(0);
  const traceRef = useRef<number[]>([]);
  const drumAngleRef = useRef(0);

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
      const state = computeElevatorCableState(params, tauRef.current);
      render(
        ctx,
        canvas,
        params,
        state,
        visibility,
        traceRef.current,
        drumAngleRef.current,
        loopDuration,
        colors,
      );
      onMetrics(state);
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
        tauRef.current += dt;
        drumAngleRef.current += params.v0 * dt * 0.5;
        if (tauRef.current > loopDuration) {
          tauRef.current = 0;
          traceRef.current = [];
        }
      }

      const state = computeElevatorCableState(params, tauRef.current);

      if (visibility.showTrace) {
        traceRef.current.push(state.x);
        if (traceRef.current.length > 500) traceRef.current.shift();
      } else {
        traceRef.current = [];
      }

      render(
        ctx!,
        canvas!,
        params,
        state,
        visibility,
        traceRef.current,
        drumAngleRef.current,
        loopDuration,
        colors,
      );

      if (now - lastMetricUpdate.current > 66) {
        onMetrics(state);
        lastMetricUpdate.current = now;
      }

      rafIdRef.current = requestAnimationFrame(frame);
    }

    traceRef.current = [];
    rafIdRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      lastTimeRef.current = null;
    };
  }, [params, visibility, paused, resetCount, loopDuration]); // eslint-disable-line react-hooks/exhaustive-deps
}

/** Draws a double-headed dimension line with arrowheads at both ends. */
function drawDimensionLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
  drawArrow(ctx, (x1 + x2) / 2, (y1 + y2) / 2, x1, y1, color, 1, 7);
  drawArrow(ctx, (x1 + x2) / 2, (y1 + y2) / 2, x2, y2, color, 1, 7);
}

function render(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  params: ElevatorCableParams,
  state: ElevatorCableState,
  visibility: ElevatorCableVisibility,
  trace: number[],
  drumAngle: number,
  loopDuration: number,
  colors: ColorPalette,
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  ctx.clearRect(0, 0, W, H);
  drawGrid(ctx, W, H, 24, colors.grid);

  // Scale to fit both the horizontal offset b and the largest x reached
  // during the loop (B–C's vertical run is drawn at a fixed length —
  // it carries no independent physical meaning here).
  const t0 = timeAtPosition(params.x0, params);
  const xMax = Math.max(positionAtTime(t0 + loopDuration, params), params.b, 1);
  const marginTop = 56;
  const marginBottom = 40;
  const scaleH = (W * 0.62) / Math.max(params.b, 1);
  const scaleV = (H - marginTop - marginBottom) / xMax;
  const scale = Math.min(scaleH, scaleV, 60);

  const shaftX = W * 0.22;
  const shaftHalfWidth = 22;
  const topY = marginTop; // the level where x = 0 (car level with B)
  const bx = shaftX + params.b * scale;
  const by = topY;
  const carY = topY + state.x * scale;
  const cx = bx;
  const cy = Math.min(H - 30, by + 150);

  // Elevator shaft (two guide rails)
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(shaftX - shaftHalfWidth, topY - 20);
  ctx.lineTo(shaftX - shaftHalfWidth, H - 16);
  ctx.moveTo(shaftX + shaftHalfWidth, topY - 20);
  ctx.lineTo(shaftX + shaftHalfWidth, H - 16);
  ctx.stroke();
  ctx.restore();

  // Trace (car's path along the shaft)
  if (visibility.showTrace && trace.length > 1) {
    ctx.save();
    ctx.strokeStyle = colors.velocity;
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 3;
    ctx.beginPath();
    trace.forEach((x, i) => {
      const y = topY + x * scale;
      if (i === 0) ctx.moveTo(shaftX, y);
      else ctx.lineTo(shaftX, y);
    });
    ctx.stroke();
    ctx.restore();
  }

  // Dimension lines: b (horizontal, above) and x (vertical, to the left)
  ctx.save();
  ctx.setLineDash([3, 3]);
  ctx.strokeStyle = colors.axes;
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(shaftX, topY - 20);
  ctx.lineTo(shaftX, 16);
  ctx.moveTo(bx, by);
  ctx.lineTo(bx, 16);
  ctx.moveTo(shaftX - shaftHalfWidth - 14, topY);
  ctx.lineTo(14, topY);
  ctx.moveTo(shaftX - shaftHalfWidth - 14, carY);
  ctx.lineTo(14, carY);
  ctx.stroke();
  ctx.restore();

  drawDimensionLine(ctx, shaftX, 26, bx, 26, colors.axes);
  drawLabel(ctx, "b", (shaftX + bx) / 2, 14, colors.axes);

  drawDimensionLine(ctx, 26, topY, 26, carY, colors.axes);
  drawLabel(ctx, "x", 14, (topY + carY) / 2, colors.axes);

  // Cable: car -> B (diagonal) and B -> C (vertical)
  ctx.save();
  ctx.strokeStyle = colors.normalForce;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(shaftX, carY);
  ctx.lineTo(bx, by);
  ctx.lineTo(cx, cy);
  ctx.stroke();
  ctx.restore();

  // Pulley B
  ctx.save();
  ctx.strokeStyle = colors.center;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(bx, by, 10, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.restore();
  drawLabel(ctx, "B", bx + 18, by, colors.center);

  // v0 direction along the B–C run (cable feeding up toward the pulley)
  if (visibility.showVelocity) {
    const midY = (by + cy) / 2;
    drawArrow(ctx, cx, midY + 16, cx, midY - 16, colors.velocity, 2, 8);
    drawLabel(ctx, "v₀", cx + 16, midY, colors.velocity);
  }

  // Drum C
  if (visibility.showDrum) {
    ctx.save();
    ctx.strokeStyle = colors.acceleration;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + 14 * Math.cos(drumAngle), cy + 14 * Math.sin(drumAngle));
    ctx.stroke();
    ctx.restore();
    drawLabel(ctx, "C", cx - 22, cy, colors.acceleration);
  }

  // Car (elevator cabin)
  ctx.save();
  ctx.fillStyle = colors.point;
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1.5;
  ctx.fillRect(shaftX - 16, carY - 12, 32, 24);
  ctx.strokeRect(shaftX - 16, carY - 12, 32, 24);
  ctx.restore();
  drawLabel(ctx, "A", shaftX, carY + 26, colors.point);

  drawDot(ctx, shaftX, topY, 3, colors.axes);

  if (state.singular || !isFinite(state.xDot)) {
    ctx.save();
    ctx.fillStyle = colors.point;
    ctx.font = "bold 12px ui-sans-serif, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("ẋ → ∞ (cable horizontal)", W / 2, H - 10);
    ctx.restore();
  }
}
