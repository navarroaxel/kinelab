"use client";

import {
  useRef,
  useEffect,
  type RefObject,
  type MutableRefObject,
} from "react";
import { computeCableBlocksState } from "@/lib/cableBlocksKinematics";
import {
  drawGrid,
  drawArrow,
  drawLabel,
  COLORS,
  COLORS_DARK,
  type ColorPalette,
} from "@/lib/drawing";
import type {
  CableBlocksParams,
  CableBlocksState,
  CableBlocksVisibility,
} from "@/types/simulator";

const SIM_SPEED = 0.5; // slows the ~1 s physical meeting time to a watchable pace
const PAUSE_AFTER_MEET = 1.5;
const MARGIN_X = 50;

export function useCableBlocksAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: CableBlocksParams,
  visibility: CableBlocksVisibility,
  tRef: MutableRefObject<number>,
  onMetrics: (state: CableBlocksState) => void,
  paused: boolean,
  resetCount: number,
): void {
  const lastTimeRef = useRef<number | null>(null);
  const rafIdRef = useRef<number>(0);
  const lastMetricUpdate = useRef(0);
  const tracesRef = useRef<{ a: number[]; b: number[] }>({ a: [], b: [] });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const state0 = computeCableBlocksState(params, 0);
    const loopDuration =
      state0.tMeet * SIM_SPEED > 0 ? state0.tMeet + PAUSE_AFTER_MEET : 10;

    if (paused) {
      const colors: ColorPalette = document.documentElement.classList.contains(
        "dark",
      )
        ? COLORS_DARK
        : COLORS;
      const state = computeCableBlocksState(params, tRef.current);
      render(ctx, canvas, params, state, visibility, tracesRef.current, colors);
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
        if (tRef.current > loopDuration) {
          tRef.current = 0;
          tracesRef.current = { a: [], b: [] };
        }
      }

      const state = computeCableBlocksState(params, tRef.current);

      if (visibility.showTrace) {
        tracesRef.current.a.push(state.sA);
        tracesRef.current.b.push(state.d + state.sA);
        if (tracesRef.current.a.length > 400) {
          tracesRef.current.a.shift();
          tracesRef.current.b.shift();
        }
      } else {
        tracesRef.current = { a: [], b: [] };
      }

      render(
        ctx!,
        canvas!,
        params,
        state,
        visibility,
        tracesRef.current,
        colors,
      );

      if (now - lastMetricUpdate.current > 66) {
        onMetrics(state);
        lastMetricUpdate.current = now;
      }

      rafIdRef.current = requestAnimationFrame(frame);
    }

    tracesRef.current = { a: [], b: [] };
    rafIdRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      lastTimeRef.current = null;
    };
  }, [params, visibility, paused, resetCount]); // eslint-disable-line react-hooks/exhaustive-deps
}

function render(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  params: CableBlocksParams,
  state: CableBlocksState,
  visibility: CableBlocksVisibility,
  traces: { a: number[]; b: number[] },
  colors: ColorPalette,
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  ctx.clearRect(0, 0, W, H);
  drawGrid(ctx, W, H, 24, colors.grid);

  const usableW = W - 2 * MARGIN_X;
  const toPx = (meters: number) => MARGIN_X + (meters / params.d0) * usableW;
  const y = H / 2;

  const xA = toPx(state.sA);
  const xB = toPx(state.d + state.sA); // block B's current position

  // Track line
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(MARGIN_X, y);
  ctx.lineTo(W - MARGIN_X, y);
  ctx.stroke();
  ctx.restore();

  // Traces
  if (visibility.showTrace) {
    const drawTrace = (arr: number[], color: string) => {
      if (arr.length < 2) return;
      ctx.save();
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = 3;
      ctx.beginPath();
      arr.forEach((m, i) => {
        const px = toPx(m);
        if (i === 0) ctx.moveTo(px, y);
        else ctx.lineTo(px, y);
      });
      ctx.stroke();
      ctx.restore();
    };
    drawTrace(traces.a, colors.rVector);
    drawTrace(traces.b, colors.velocity);
  }

  // Gap dimension
  ctx.save();
  ctx.strokeStyle = colors.point;
  ctx.setLineDash([4, 4]);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(xA, y - 30);
  ctx.lineTo(xB, y - 30);
  ctx.stroke();
  ctx.restore();
  drawLabel(
    ctx,
    `d = ${state.d.toFixed(2)} m`,
    (xA + xB) / 2,
    y - 40,
    colors.point,
  );

  // Blocks
  const drawBlock = (x: number, color: string, label: string) => {
    ctx.save();
    ctx.fillStyle = color;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.5;
    ctx.fillRect(x - 12, y - 12, 24, 24);
    ctx.strokeRect(x - 12, y - 12, 24, 24);
    ctx.restore();
    drawLabel(ctx, label, x, y + 26, color);
  };
  drawBlock(xA, colors.rVector, "A");
  drawBlock(xB, colors.velocity, "B");

  // Velocity arrows
  if (visibility.showVelocity) {
    const vScale = 4;
    drawArrow(ctx, xA, y, xA + state.vA * vScale, y, colors.rVector, 2);
    drawArrow(ctx, xB, y, xB + state.vB * vScale, y, colors.velocity, 2);
  }

  if (state.met) {
    ctx.save();
    ctx.fillStyle = colors.point;
    ctx.font = "bold 12px ui-sans-serif, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`met at t = ${state.tMeet.toFixed(4)} s`, W / 2, H - 14);
    ctx.restore();
  }
}
