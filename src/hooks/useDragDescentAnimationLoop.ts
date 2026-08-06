"use client";

import {
  useRef,
  useEffect,
  type RefObject,
  type MutableRefObject,
} from "react";
import {
  computeDragDescentState,
  positionAtTime,
} from "@/lib/dragDescentKinematics";
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
  DragDescentParams,
  DragDescentState,
  DragDescentVisibility,
} from "@/types/simulator";

// The physical time constant (1/k) is typically ~100 s — far too slow to be
// watchable in real time, so the animation runs faster than the physics.
const SIM_SPEED = 4;

export function useDragDescentAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: DragDescentParams,
  visibility: DragDescentVisibility,
  tRef: MutableRefObject<number>,
  onMetrics: (state: DragDescentState) => void,
  paused: boolean,
  resetCount: number,
): void {
  const lastTimeRef = useRef<number | null>(null);
  const rafIdRef = useRef<number>(0);
  const lastMetricUpdate = useRef(0);
  const traceRef = useRef<number[]>([]); // fractional x-positions in [0, 1]

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const xAtTMax = Math.max(positionAtTime(params, params.tMax), 1e-6);

    if (paused) {
      const colors: ColorPalette = document.documentElement.classList.contains(
        "dark",
      )
        ? COLORS_DARK
        : COLORS;
      const state = computeDragDescentState(params, tRef.current);
      render(ctx, canvas, state, xAtTMax, visibility, traceRef.current, colors);
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
        tRef.current += dt * SIM_SPEED;
        if (tRef.current > params.tMax) {
          tRef.current = 0;
          traceRef.current = [];
        }
      }

      const state = computeDragDescentState(params, tRef.current);

      if (visibility.showTrace) {
        traceRef.current.push(state.x / xAtTMax);
        if (traceRef.current.length > 800) traceRef.current.shift();
      } else {
        traceRef.current = [];
      }

      render(
        ctx!,
        canvas!,
        state,
        xAtTMax,
        visibility,
        traceRef.current,
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
  }, [params, visibility, paused, resetCount]); // eslint-disable-line react-hooks/exhaustive-deps
}

const MARGIN_X = 40;
const GROUND_TOP = 0.25; // ground line spans from 25% to 80% of canvas height
const GROUND_BOTTOM = 0.8;

function groundPoint(fraction: number, W: number, H: number) {
  const x = MARGIN_X + fraction * (W - 2 * MARGIN_X);
  const y = H * GROUND_TOP + fraction * H * (GROUND_BOTTOM - GROUND_TOP);
  return { x, y };
}

function render(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  state: DragDescentState,
  xAtTMax: number,
  visibility: DragDescentVisibility,
  trace: number[],
  colors: ColorPalette,
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  ctx.clearRect(0, 0, W, H);
  drawGrid(ctx, W, H, 24, colors.grid);

  const fraction = Math.min(state.x / xAtTMax, 1);
  const start = groundPoint(0, W, H);
  const end = groundPoint(1, W, H);
  const p = groundPoint(fraction, W, H);

  // Slope (decorative — the exercise is a straight-line drag problem, not a
  // literal incline with height-dependent gravity)
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
  ctx.restore();

  // Path trace
  if (visibility.showTrace && trace.length > 1) {
    ctx.save();
    ctx.strokeStyle = colors.velocity;
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    trace.forEach((f, i) => {
      const pt = groundPoint(Math.min(f, 1), W, H);
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();
    ctx.restore();
  }

  const slopeAngle = Math.atan2(end.y - start.y, end.x - start.x);
  const dirX = Math.cos(slopeAngle);
  const dirY = Math.sin(slopeAngle);

  // Velocity arrow — grows toward v_max
  if (visibility.showVelocityArrow) {
    const vLen = state.v * 4.5;
    drawArrow(
      ctx,
      p.x,
      p.y - 18,
      p.x + dirX * vLen,
      p.y - 18 + dirY * vLen,
      colors.velocity,
      2,
    );
    drawLabel(ctx, "v", p.x + dirX * vLen + 8, p.y - 26, colors.velocity);
  }

  // Drag arrow — opposes motion, grows as v²
  if (visibility.showDragArrow) {
    const dragLen = Math.min(state.v * state.v * 0.5, 60);
    drawArrow(
      ctx,
      p.x,
      p.y + 18,
      p.x - dirX * dragLen,
      p.y + 18 - dirY * dragLen,
      colors.normalAccel,
      2,
    );
    drawLabel(
      ctx,
      "F_drag",
      p.x - dirX * dragLen - 10,
      p.y + 30,
      colors.normalAccel,
    );
  }

  // Cyclist marker
  drawDot(ctx, p.x, p.y, 7, colors.point);
  drawLabel(ctx, "P", p.x + 10, p.y - 6, colors.point);
}
