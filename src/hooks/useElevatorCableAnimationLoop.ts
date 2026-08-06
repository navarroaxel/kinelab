"use client";

import {
  useRef,
  useEffect,
  type RefObject,
  type MutableRefObject,
} from "react";
import { computeElevatorCableState } from "@/lib/elevatorCableKinematics";
import {
  drawGrid,
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

const MARGIN_TOP = 40;
const PX_PER_M = (params: ElevatorCableParams, H: number) =>
  Math.min(60, ((H - MARGIN_TOP - 40) / Math.max(params.b, 1)) * 0.6);

function render(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  params: ElevatorCableParams,
  state: ElevatorCableState,
  visibility: ElevatorCableVisibility,
  trace: number[],
  drumAngle: number,
  colors: ColorPalette,
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  ctx.clearRect(0, 0, W, H);
  drawGrid(ctx, W, H, 24, colors.grid);

  const scale = PX_PER_M(params, H);
  const ax = W * 0.3;
  const ay = MARGIN_TOP;
  const railX = ax + params.b * scale;

  // Rail (vertical guide for the car)
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(railX, ay);
  ctx.lineTo(railX, H - 20);
  ctx.stroke();
  ctx.restore();

  const carY = ay + state.x * scale;

  // Trace
  if (visibility.showTrace && trace.length > 1) {
    ctx.save();
    ctx.strokeStyle = colors.velocity;
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 3;
    ctx.beginPath();
    trace.forEach((x, i) => {
      const y = ay + x * scale;
      if (i === 0) ctx.moveTo(railX, y);
      else ctx.lineTo(railX, y);
    });
    ctx.stroke();
    ctx.restore();
  }

  // Cable A -> car
  ctx.save();
  ctx.strokeStyle = colors.normalForce;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(railX, carY);
  ctx.stroke();
  ctx.restore();
  drawLabel(ctx, "A", ax - 14, ay, colors.center);
  drawLabel(ctx, "B", railX + 14, carY, colors.point);

  // Drum C near A
  if (visibility.showDrum) {
    ctx.save();
    ctx.strokeStyle = colors.acceleration;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ax, ay - 26, 14, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(ax, ay - 26);
    ctx.lineTo(
      ax + 14 * Math.cos(drumAngle),
      ay - 26 + 14 * Math.sin(drumAngle),
    );
    ctx.stroke();
    ctx.restore();
    drawLabel(ctx, "C", ax, ay - 46, colors.acceleration);
  }

  // Car (elevator box)
  ctx.save();
  ctx.fillStyle = colors.point;
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1.5;
  ctx.fillRect(railX - 14, carY - 10, 28, 20);
  ctx.strokeRect(railX - 14, carY - 10, 28, 20);
  ctx.restore();

  drawDot(ctx, ax, ay, 4, colors.center);

  if (state.singular || !isFinite(state.xDot)) {
    ctx.save();
    ctx.fillStyle = colors.point;
    ctx.font = "bold 12px ui-sans-serif, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("ẋ → ∞ (cable horizontal)", W / 2, H - 12);
    ctx.restore();
  }
}
