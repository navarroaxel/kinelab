"use client";

import {
  useRef,
  useEffect,
  type RefObject,
  type MutableRefObject,
} from "react";
import {
  computeAllCases,
  positionAtTime,
} from "@/lib/stoppingDistanceKinematics";
import {
  drawGrid,
  drawLabel,
  COLORS,
  COLORS_DARK,
  type ColorPalette,
} from "@/lib/drawing";
import type {
  StoppingDistanceParams,
  StoppingDistanceState,
  StoppingDistanceVisibility,
} from "@/types/simulator";

const PAUSE_AFTER_STOP = 1; // seconds to hold the final frame before looping
const LANE_COLORS = ["rVector", "velocity", "acceleration"] as const;

export function useStoppingDistanceAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: StoppingDistanceParams,
  visibility: StoppingDistanceVisibility,
  tRef: MutableRefObject<number>,
  onMetrics: (state: StoppingDistanceState) => void,
  paused: boolean,
  resetCount: number,
): void {
  const lastTimeRef = useRef<number | null>(null);
  const rafIdRef = useRef<number>(0);
  const lastMetricUpdate = useRef(0);
  const tracesRef = useRef<number[][]>([[], [], []]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cases = computeAllCases(params);
    const maxD =
      Math.max(...cases.map((c) => c.D), params.obstacleDistance) * 1.1;
    const loopDuration =
      Math.max(...cases.map((c) => c.tTotal)) + PAUSE_AFTER_STOP;

    if (paused) {
      const colors: ColorPalette = document.documentElement.classList.contains(
        "dark",
      )
        ? COLORS_DARK
        : COLORS;
      render(
        ctx,
        canvas,
        cases,
        tRef.current,
        maxD,
        params,
        visibility,
        tracesRef.current,
        colors,
      );
      onMetrics({ cases, t: tRef.current });
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
        tRef.current += dt;
        if (tRef.current > loopDuration) {
          tRef.current = 0;
          tracesRef.current = [[], [], []];
        }
      }

      if (visibility.showTrace) {
        cases.forEach((c, i) => {
          tracesRef.current[i].push(positionAtTime(c, tRef.current));
          if (tracesRef.current[i].length > 500) tracesRef.current[i].shift();
        });
      }

      render(
        ctx!,
        canvas!,
        cases,
        tRef.current,
        maxD,
        params,
        visibility,
        tracesRef.current,
        colors,
      );

      if (now - lastMetricUpdate.current > 66) {
        onMetrics({ cases, t: tRef.current });
        lastMetricUpdate.current = now;
      }

      rafIdRef.current = requestAnimationFrame(frame);
    }

    tracesRef.current = [[], [], []];
    rafIdRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      lastTimeRef.current = null;
    };
  }, [params, visibility, paused, resetCount]); // eslint-disable-line react-hooks/exhaustive-deps
}

const MARGIN_X = 16;
const MARGIN_RIGHT = 60;

function render(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  cases: ReturnType<typeof computeAllCases>,
  t: number,
  maxD: number,
  params: StoppingDistanceParams,
  visibility: StoppingDistanceVisibility,
  traces: number[][],
  colors: ColorPalette,
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  ctx.clearRect(0, 0, W, H);
  drawGrid(ctx, W, H, 24, colors.grid);

  const usableW = W - MARGIN_X - MARGIN_RIGHT;
  const toPx = (meters: number) => MARGIN_X + (meters / maxD) * usableW;

  const laneH = H / (cases.length + 1);

  // Ruler ticks every 10 m
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.fillStyle = colors.axes;
  ctx.font = "10px ui-sans-serif, system-ui, sans-serif";
  ctx.textAlign = "center";
  const step = maxD > 150 ? 20 : 10;
  ctx.beginPath();
  for (let m = 0; m <= maxD; m += step) {
    const x = toPx(m);
    ctx.moveTo(x, H - 14);
    ctx.lineTo(x, H - 6);
  }
  ctx.stroke();
  for (let m = 0; m <= maxD; m += step) {
    ctx.fillText(`${m}`, toPx(m), H - 2);
  }
  ctx.restore();

  // Obstacle marker
  if (visibility.showObstacleMarker) {
    const ox = toPx(params.obstacleDistance);
    ctx.save();
    ctx.strokeStyle = colors.point;
    ctx.setLineDash([5, 4]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ox, 8);
    ctx.lineTo(ox, H - 20);
    ctx.stroke();
    ctx.restore();
    drawLabel(ctx, "obstacle", ox + 4, 10, colors.axes);
  }

  cases.forEach((c, i) => {
    const y = laneH * (i + 1);
    const color = colors[LANE_COLORS[i]];
    const x = toPx(positionAtTime(c, t));

    if (visibility.showTrace && traces[i].length > 1) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = 3;
      ctx.beginPath();
      traces[i].forEach((pos, j) => {
        const px = toPx(pos);
        if (j === 0) ctx.moveTo(px, y);
        else ctx.lineTo(px, y);
      });
      ctx.stroke();
      ctx.restore();
    }

    const stopped = t >= c.tTotal;
    const failing = c.exceedsObstacle && x >= toPx(params.obstacleDistance) - 1;

    ctx.save();
    ctx.fillStyle = failing ? colors.point : color;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Left-aligned (not drawLabel's centered anchor) so all three car labels
    // share the same left edge regardless of string length.
    ctx.save();
    ctx.font = "12px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;
    ctx.fillText(
      `${c.speedKmh} km/h${stopped ? " ■" : ""}`,
      MARGIN_X + 30,
      y - 16,
    );
    ctx.restore();
  });
}
