"use client";

import {
  useRef,
  useEffect,
  type RefObject,
  type MutableRefObject,
} from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  drawArrow,
  drawLabel,
  COLORS,
  COLORS_DARK,
  type ColorPalette,
} from "@/lib/drawing";
import {
  trackHeight,
  speedSquaredAt,
  normalForceAt,
} from "@/lib/parabolicBowlKinematics";
import type {
  ParabolicBowlParams,
  ParabolicBowlState,
  ParabolicBowlVisibility,
} from "@/types/simulator";

// The true motion along a parabola isn't simple harmonic (unlike a small-
// amplitude pendulum) — solving it exactly needs a numerical integrator.
// The sphere here instead sweeps back and forth on a fixed period; the
// PACING is stylized, but N(x) and v(x) at any instant are the exact
// energy/curvature formulas for wherever the sphere currently is.
const OSCILLATION_PERIOD_S = 6;

export function useParabolicBowlAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: ParabolicBowlParams,
  state: ParabolicBowlState,
  visibility: ParabolicBowlVisibility,
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
        exceeds: translateRef.current("parabolic-bowl.canvas.exceeds"),
        ok: translateRef.current("parabolic-bowl.canvas.ok"),
      };
    }

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
        phaseRef.current = (phaseRef.current + dt) % OSCILLATION_PERIOD_S;
      }

      render(
        ctx!,
        canvas!,
        params,
        state,
        visibility,
        phaseRef.current,
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
  params: ParabolicBowlParams,
  state: ParabolicBowlState,
  visibility: ParabolicBowlVisibility,
  phase: number,
  colors: ColorPalette,
  labels: { exceeds: string; ok: string },
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  ctx.clearRect(0, 0, W, H);

  const marginX = W * 0.1;
  const trackW = W - 2 * marginX;
  const vertexY = H * 0.78;
  const supportY = H * 0.3;

  const toPx = (x: number) => W / 2 + (x / params.span) * trackW;
  const toPy = (y: number) =>
    vertexY - (y / params.sag) * (vertexY - supportY);

  // Track (parabolic profile)
  ctx.save();
  ctx.strokeStyle = colors.trajectory;
  ctx.lineWidth = 3;
  ctx.beginPath();
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const x = -params.span / 2 + (params.span * i) / steps;
    const y = trackHeight(x, params.sag, params.span);
    const px = toPx(x);
    const py = toPy(y);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.restore();

  // Supports
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(toPx(-params.span / 2), supportY);
  ctx.lineTo(toPx(-params.span / 2), supportY + 14);
  ctx.moveTo(toPx(params.span / 2), supportY);
  ctx.lineTo(toPx(params.span / 2), supportY + 14);
  ctx.stroke();
  ctx.restore();
  drawLabel(ctx, "A", toPx(-params.span / 2), supportY - 12, colors.axes);

  if (visibility.showSphere) {
    const x = -(params.span / 2) * Math.cos((2 * Math.PI * phase) / OSCILLATION_PERIOD_S);
    const y = trackHeight(x, params.sag, params.span);
    const px = toPx(x);
    const py = toPy(y);
    const v2 = speedSquaredAt(x, params.sag, params.span);
    const n = normalForceAt(x, params.sphereMass, params.sag, params.span);

    ctx.save();
    ctx.fillStyle = colors.point;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(px, py - 8, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    drawLabel(ctx, `v ≈ ${Math.sqrt(v2).toFixed(2)} m/s`, px, py - 34, colors.velocity);

    if (visibility.showNormalForce) {
      drawArrow(ctx, px, py - 8, px, py - 8 - Math.min(n * 1.5, 40), colors.normalAccel, 2);
      drawLabel(ctx, `N ≈ ${n.toFixed(1)} N`, px + 42, py - 24, colors.normalAccel);
    }
  }

  // Design-check badge
  ctx.save();
  ctx.font = "bold 13px ui-sans-serif, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = state.exceedsLimit ? colors.point : colors.velocity;
  const badge = state.exceedsLimit
    ? `${labels.exceeds} (${state.bottomAccelerationInGs.toFixed(2)}g > ${params.gLimit}g)`
    : `${labels.ok} (${state.bottomAccelerationInGs.toFixed(2)}g ≤ ${params.gLimit}g)`;
  ctx.fillText(badge, W / 2, H * 0.08);
  ctx.restore();
}
