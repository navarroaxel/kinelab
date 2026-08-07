"use client";

import {
  useRef,
  useEffect,
  type RefObject,
  type MutableRefObject,
} from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { drawArrow, drawLabel, drawLabelWithSubscript, COLORS, COLORS_DARK, type ColorPalette } from "@/lib/drawing";
import {
  velocityAtTime,
  positionAtTime,
} from "@/lib/parachutistKinematics";
import type {
  ParachutistParams,
  ParachutistState,
  ParachutistVisibility,
} from "@/types/simulator";

export function useParachutistAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: ParachutistParams,
  state: ParachutistState,
  visibility: ParachutistVisibility,
  phaseRef: MutableRefObject<number>,
  paused: boolean,
  resetCount: number,
): void {
  const { t } = useLanguage();
  const translateRef = useRef(t);
  useEffect(() => {
    translateRef.current = t;
  }, [t]);

  const lastTimeRef = useRef<number | null>(null);
  const rafIdRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function currentLabels() {
      return {
        terminal: translateRef.current("parachutist.canvas.terminal"),
      };
    }

    // A cycle long enough to clearly approach v_t (≈5τ), clamped to a
    // sane viewing range regardless of how extreme τ gets from the sliders.
    const cycleDuration = Math.min(Math.max(5 * state.timeConstant, 3), 10);

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
        phaseRef.current,
        cycleDuration,
        colors,
        currentLabels(),
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
        phaseRef.current = (phaseRef.current + dt) % cycleDuration;
      }

      render(
        ctx!,
        canvas!,
        params,
        state,
        visibility,
        phaseRef.current,
        cycleDuration,
        colors,
        currentLabels(),
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
  params: ParachutistParams,
  state: ParachutistState,
  visibility: ParachutistVisibility,
  phase: number,
  cycleDuration: number,
  colors: ColorPalette,
  labels: { terminal: string },
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  ctx.clearRect(0, 0, W, H);

  const topY = H * 0.08;
  const bottomY = H * 0.9;
  const zEnd = positionAtTime(
    cycleDuration,
    params.initialSpeed,
    state.terminalSpeed,
    state.timeConstant,
  );

  if (visibility.showParachutist) {
    const v = velocityAtTime(
      phase,
      params.initialSpeed,
      state.terminalSpeed,
      state.timeConstant,
    );
    const z = positionAtTime(
      phase,
      params.initialSpeed,
      state.terminalSpeed,
      state.timeConstant,
    );
    const y = topY + (zEnd > 0 ? (z / zEnd) * (bottomY - topY) : 0);
    const cx = W * 0.5;

    // Canopy + figure
    const canopyRadius = 30;
    const canopyY = y - 40;
    const isDark = colors === COLORS_DARK;
    ctx.save();
    ctx.strokeStyle = isDark ? "#ffffff" : colors.trajectory;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, canopyY, canopyRadius, Math.PI, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - canopyRadius, canopyY);
    ctx.lineTo(cx, y - 8);
    ctx.moveTo(cx + canopyRadius, canopyY);
    ctx.lineTo(cx, y - 8);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = colors.point;
    ctx.beginPath();
    ctx.arc(cx, y, 9, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();

    drawArrow(ctx, cx + canopyRadius + 12, y - 6, cx + canopyRadius + 12, y + 6 + Math.min(v, 30), colors.velocity, 2);
    drawLabel(ctx, `v ≈ ${v.toFixed(2)} m/s`, cx + canopyRadius + 52, y, colors.velocity);
    drawLabel(ctx, `z ≈ ${z.toFixed(1)} m`, cx - canopyRadius - 32, y, isDark ? "#ffffff" : colors.axes);
  }

  if (visibility.showTerminalLine) {
    drawLabelWithSubscript(
      ctx,
      `${labels.terminal} ≈ ${state.terminalSpeed.toFixed(2)} m/s`,
      W * 0.5,
      H * 0.04,
      colors.point,
    );
  }
}
