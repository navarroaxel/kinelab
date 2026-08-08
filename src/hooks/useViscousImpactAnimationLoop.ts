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
import type {
  ViscousImpactParams,
  ViscousImpactState,
  ViscousImpactVisibility,
} from "@/types/simulator";

// The real deceleration (~12 000 /s by default) finishes the whole event in
// well under a millisecond — the animation instead sweeps a fixed visual
// duration, reaching ~99.8% of the true penetration depth by the end of the
// loop. Only the *pacing* is artistic; the depth and speed shown at any
// point are the exact v(x) values for the given params.
const VISUAL_DURATION_S = 3.5;
const VISUAL_TIME_CONSTANTS = 6;

export function useViscousImpactAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: ViscousImpactParams,
  state: ViscousImpactState,
  visibility: ViscousImpactVisibility,
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
        plate: translateRef.current("viscous-impact.canvas.plate"),
        block: translateRef.current("viscous-impact.canvas.block"),
        invalid: translateRef.current("viscous-impact.canvas.invalid"),
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
        phaseRef.current = (phaseRef.current + dt) % VISUAL_DURATION_S;
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
  params: ViscousImpactParams,
  state: ViscousImpactState,
  visibility: ViscousImpactVisibility,
  phase: number,
  colors: ColorPalette,
  labels: { plate: string; block: string; invalid: string },
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  ctx.clearRect(0, 0, W, H);

  const trackY = H * 0.5;
  const marginX = W * 0.06;
  const trackLen = W - 2 * marginX;

  if (!state.valid) {
    ctx.save();
    ctx.font = "bold 13px ui-sans-serif, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = colors.point;
    ctx.fillText(labels.invalid, W / 2, trackY);
    ctx.restore();
    return;
  }

  // Scale so the whole penetration depth (plate + remaining block) fits.
  const toPx = (metres: number) =>
    marginX + (metres / state.penetrationDepth) * trackLen;

  // Plate
  ctx.save();
  ctx.fillStyle = colors.trajectory;
  ctx.fillRect(toPx(0), trackY - 26, toPx(params.plateThickness) - toPx(0), 52);
  ctx.restore();
  drawLabel(ctx, labels.plate, toPx(params.plateThickness / 2), trackY - 38, colors.axes);

  // Block (rest of the travel)
  ctx.save();
  ctx.fillStyle = colors.axes;
  ctx.globalAlpha = 0.15;
  ctx.fillRect(
    toPx(params.plateThickness),
    trackY - 26,
    toPx(state.penetrationDepth) - toPx(params.plateThickness),
    52,
  );
  ctx.restore();
  drawLabel(
    ctx,
    labels.block,
    toPx((params.plateThickness + state.penetrationDepth) / 2),
    trackY - 38,
    colors.axes,
  );

  // Track baseline
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(toPx(0), trackY + 26);
  ctx.lineTo(toPx(state.penetrationDepth), trackY + 26);
  ctx.stroke();
  ctx.restore();

  if (visibility.showBullet) {
    const normalizedT = (phase / VISUAL_DURATION_S) * VISUAL_TIME_CONSTANTS;
    const x = state.penetrationDepth * (1 - Math.exp(-normalizedT));
    const v = params.entrySpeed * Math.exp(-normalizedT);
    const px = toPx(x);

    ctx.save();
    ctx.fillStyle = colors.point;
    ctx.beginPath();
    ctx.arc(px, trackY, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();

    drawLabel(ctx, `${v.toFixed(0)} m/s`, px, trackY - 46, colors.point);

    if (visibility.showVelocityCurve) {
      drawArrow(ctx, px - 16, trackY, px + 16, trackY, colors.velocity, 2);
    }
  }

  drawLabel(
    ctx,
    `x = ${(state.penetrationDepth * 1000).toFixed(1)} mm`,
    toPx(state.penetrationDepth),
    trackY + 42,
    colors.axes,
  );
}
