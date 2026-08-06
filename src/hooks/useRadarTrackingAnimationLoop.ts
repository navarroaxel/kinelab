"use client";

import {
  useRef,
  useEffect,
  type RefObject,
  type MutableRefObject,
} from "react";
import {
  computeRadarTrackingState,
  aircraftPosition,
} from "@/lib/radarTrackingKinematics";
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
  RadarTrackingParams,
  RadarTrackingState,
  RadarTrackingVisibility,
} from "@/types/simulator";
import { PHI_MAX } from "@/hooks/useRadarTrackingSimulator";

export interface RadarScale {
  scale: number;
  originX: number;
  originY: number;
}

export function computeRadarScale(
  W: number,
  H: number,
  params: RadarTrackingParams,
): RadarScale {
  const trajMaxX = params.rhoTraj * Math.sin(PHI_MAX);
  const trajMaxY = params.rhoTraj * (1 - Math.cos(PHI_MAX));
  const halfExtent =
    Math.max(
      trajMaxX,
      Math.abs(params.radarX),
      Math.abs(params.radarY),
      trajMaxY,
    ) * 1.2;
  const scale = (Math.min(W, H) * 0.42) / Math.max(halfExtent, 1);
  return { scale, originX: W * 0.42, originY: H * 0.72 };
}

export function toScreen(
  wx: number,
  wy: number,
  s: RadarScale,
): { x: number; y: number } {
  return { x: s.originX + wx * s.scale, y: s.originY - wy * s.scale };
}

export function useRadarTrackingAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: RadarTrackingParams,
  visibility: RadarTrackingVisibility,
  tRef: MutableRefObject<number>,
  loopDuration: number,
  onMetrics: (state: RadarTrackingState) => void,
  paused: boolean,
  resetCount: number,
): void {
  const lastTimeRef = useRef<number | null>(null);
  const rafIdRef = useRef<number>(0);
  const lastMetricUpdate = useRef(0);
  const traceRef = useRef<{ x: number; y: number }[]>([]);

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
      const state = computeRadarTrackingState(params, tRef.current);
      render(ctx, canvas, params, state, visibility, traceRef.current, colors);
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
        tRef.current += dt;
        if (tRef.current > loopDuration) {
          tRef.current = 0;
          traceRef.current = [];
        }
      }

      const state = computeRadarTrackingState(params, tRef.current);

      if (visibility.showTrace) {
        traceRef.current.push({ x: state.x, y: state.y });
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

function render(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  params: RadarTrackingParams,
  state: RadarTrackingState,
  visibility: RadarTrackingVisibility,
  trace: { x: number; y: number }[],
  colors: ColorPalette,
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  ctx.clearRect(0, 0, W, H);
  drawGrid(ctx, W, H, 24, colors.grid);

  const s = computeRadarScale(W, H, params);

  // Trajectory (aircraft position relative to lowest point, offset by −radar)
  ctx.save();
  ctx.strokeStyle = colors.trajectory;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= 60; i++) {
    const phi = (PHI_MAX * i) / 60;
    const pos = aircraftPosition(phi, params);
    const p = toScreen(pos.x - params.radarX, pos.y - params.radarY, s);
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();
  ctx.restore();

  const radarScreen = toScreen(0, 0, s);
  const aircraftScreen = toScreen(state.x, state.y, s);

  // Trace
  if (visibility.showTrace && trace.length > 1) {
    ctx.save();
    ctx.strokeStyle = colors.velocity;
    ctx.globalAlpha = 0.4;
    ctx.lineWidth = 2;
    ctx.beginPath();
    trace.forEach((p, i) => {
      const sp = toScreen(p.x, p.y, s);
      if (i === 0) ctx.moveTo(sp.x, sp.y);
      else ctx.lineTo(sp.x, sp.y);
    });
    ctx.stroke();
    ctx.restore();
  }

  // r vector + θ dimension
  if (visibility.showRadarLine) {
    ctx.save();
    ctx.strokeStyle = colors.rVector;
    ctx.setLineDash([5, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(radarScreen.x, radarScreen.y);
    ctx.lineTo(aircraftScreen.x, aircraftScreen.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(radarScreen.x, radarScreen.y);
    ctx.lineTo(radarScreen.x + 60, radarScreen.y);
    ctx.stroke();
    ctx.restore();
    drawLabel(
      ctx,
      "r",
      (radarScreen.x + aircraftScreen.x) / 2,
      (radarScreen.y + aircraftScreen.y) / 2 - 8,
      colors.rVector,
    );
    drawLabel(
      ctx,
      `θ=${state.thetaDeg.toFixed(1)}°`,
      radarScreen.x + 40,
      radarScreen.y - 14,
      colors.axes,
    );
  }

  const er = { x: state.x / state.r, y: state.y / state.r };
  const eth = { x: -er.y, y: er.x };
  const vecScale = 0.35;

  if (visibility.showVelocity) {
    const vr = state.rDot;
    const vth = state.rThetaDot;
    const tipR = toScreen(
      state.x + er.x * vr * vecScale,
      state.y + er.y * vr * vecScale,
      s,
    );
    const tipTh = toScreen(
      state.x + eth.x * vth * vecScale,
      state.y + eth.y * vth * vecScale,
      s,
    );
    drawArrow(
      ctx,
      aircraftScreen.x,
      aircraftScreen.y,
      tipR.x,
      tipR.y,
      colors.radialVelocity,
      2,
    );
    drawArrow(
      ctx,
      aircraftScreen.x,
      aircraftScreen.y,
      tipTh.x,
      tipTh.y,
      colors.transverseVelocity,
      2,
    );
  }

  if (visibility.showAcceleration) {
    // Derived from a_t/a_n via ê_r/ê_θ projection already folded into rDDot/thetaDDot;
    // draw the resultant using the same projection basis for a compact, consistent view.
    const ar = state.rDDot - state.r * state.thetaDot * state.thetaDot;
    const ath = state.thetaDDot * state.r + 2 * state.rDot * state.thetaDot;
    const accScale = 6;
    const tip = toScreen(
      state.x + (er.x * ar + eth.x * ath) * accScale,
      state.y + (er.y * ar + eth.y * ath) * accScale,
      s,
    );
    drawArrow(
      ctx,
      aircraftScreen.x,
      aircraftScreen.y,
      tip.x,
      tip.y,
      colors.acceleration,
      2.5,
    );
    drawLabel(ctx, "a", tip.x + 6, tip.y - 6, colors.acceleration);
  }

  drawDot(ctx, radarScreen.x, radarScreen.y, 8, colors.normalAccel, "#fff");
  drawLabel(
    ctx,
    "radar",
    radarScreen.x,
    radarScreen.y + 20,
    colors.normalAccel,
  );

  drawDot(ctx, aircraftScreen.x, aircraftScreen.y, 6, colors.point);
  drawLabel(
    ctx,
    "aircraft",
    aircraftScreen.x,
    aircraftScreen.y - 16,
    colors.point,
  );
}
