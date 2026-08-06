"use client";

import {
  useRef,
  useEffect,
  type RefObject,
  type MutableRefObject,
} from "react";
import { angularVelocity } from "@/lib/circularOrbitKinematics";
import {
  drawArrow,
  drawLabel,
  drawDot,
  COLORS,
  COLORS_DARK,
  type ColorPalette,
} from "@/lib/drawing";
import type {
  CircularOrbitParams,
  CircularOrbitState,
  CircularOrbitVisibility,
} from "@/types/simulator";

// The true orbital period (often hours) is far too slow to watch — the
// animation runs at a fixed multiple of the physical angular velocity ω = v/r,
// so relative timing between parameter changes stays physically meaningful.
const SIM_SPEED = 600;
const MAX_TRACE = 400;

export function useCircularOrbitAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: CircularOrbitParams,
  state: CircularOrbitState,
  visibility: CircularOrbitVisibility,
  thetaRef: MutableRefObject<number>,
  paused: boolean,
  resetCount: number,
): void {
  const lastTimeRef = useRef<number | null>(null);
  const rafIdRef = useRef<number>(0);
  const traceRef = useRef<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const omega = angularVelocity(state.r * 1000, state.v);

    if (paused) {
      const colors: ColorPalette = document.documentElement.classList.contains(
        "dark",
      )
        ? COLORS_DARK
        : COLORS;
      render(
        ctx,
        canvas,
        params,
        state,
        visibility,
        thetaRef.current,
        traceRef.current,
        colors,
      );
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
        thetaRef.current += omega * SIM_SPEED * dt;
        thetaRef.current %= 2 * Math.PI;
      }

      if (visibility.showTrace) {
        traceRef.current.push(thetaRef.current);
        if (traceRef.current.length > MAX_TRACE) traceRef.current.shift();
      } else {
        traceRef.current = [];
      }

      render(
        ctx!,
        canvas!,
        params,
        state,
        visibility,
        thetaRef.current,
        traceRef.current,
        colors,
      );

      rafIdRef.current = requestAnimationFrame(frame);
    }

    traceRef.current = [];
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
  params: CircularOrbitParams,
  state: CircularOrbitState,
  visibility: CircularOrbitVisibility,
  theta: number,
  trace: number[],
  colors: ColorPalette,
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  ctx.clearRect(0, 0, W, H);

  const cx = W / 2;
  const cy = H / 2;
  const maxDrawR = Math.min(W, H) * 0.42;
  const scale = maxDrawR / (Math.max(state.r, params.R) * 1.05);

  const planetPx = params.R * scale;
  const orbitPx = state.r * scale;

  const point = (angle: number, radiusPx: number) => ({
    x: cx + radiusPx * Math.cos(angle),
    y: cy - radiusPx * Math.sin(angle),
  });

  // Planet
  ctx.save();
  ctx.fillStyle = colors.center;
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.arc(cx, cy, planetPx, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();

  // Orbit path
  ctx.save();
  ctx.setLineDash([5, 4]);
  ctx.strokeStyle = state.hitsSurface ? colors.point : colors.trajectory;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, orbitPx, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.restore();

  // Trace
  if (visibility.showTrace && trace.length > 1) {
    ctx.save();
    ctx.strokeStyle = colors.velocity;
    ctx.globalAlpha = 0.4;
    ctx.lineWidth = 2;
    ctx.beginPath();
    trace.forEach((angle, i) => {
      const p = point(angle, orbitPx);
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();
    ctx.restore();
  }

  const sat = point(theta, orbitPx);

  // r / h dimensions along the current radial line
  if (visibility.showDimensions) {
    const surface = point(theta, planetPx);
    ctx.save();
    ctx.strokeStyle = colors.axes;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(sat.x, sat.y);
    ctx.stroke();
    ctx.restore();
    drawLabel(
      ctx,
      "r",
      cx + (sat.x - cx) * 0.5 + 6,
      cy + (sat.y - cy) * 0.5,
      colors.axes,
    );
    drawLabel(
      ctx,
      "h",
      surface.x + (sat.x - surface.x) * 0.5 + 6,
      surface.y + (sat.y - surface.y) * 0.5,
      colors.point,
    );
  }

  // Velocity (tangent) and normal acceleration vectors
  const tangentAngle = theta + Math.PI / 2;
  if (visibility.showVelocity) {
    const vx = sat.x + Math.cos(tangentAngle) * 32;
    const vy = sat.y - Math.sin(tangentAngle) * 32;
    drawArrow(ctx, sat.x, sat.y, vx, vy, colors.velocity, 2);
    drawLabel(ctx, "v", vx + 4, vy - 4, colors.velocity);
  }
  if (visibility.showNormalAccel) {
    const dirX = (cx - sat.x) / orbitPx;
    const dirY = (cy - sat.y) / orbitPx;
    const ax = sat.x + dirX * 26;
    const ay = sat.y + dirY * 26;
    drawArrow(ctx, sat.x, sat.y, ax, ay, colors.normalAccel, 2);
    drawLabel(ctx, "aₙ", ax + 4, ay - 4, colors.normalAccel);
  }

  drawDot(ctx, sat.x, sat.y, 5, colors.point);

  if (state.hitsSurface) {
    ctx.save();
    ctx.fillStyle = colors.point;
    ctx.font = "bold 12px ui-sans-serif, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("r ≤ R — orbit not possible", cx, H - 12);
    ctx.restore();
  }
}
