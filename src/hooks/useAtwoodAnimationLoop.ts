"use client";

import {
  useRef,
  useEffect,
  type RefObject,
  type MutableRefObject,
} from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { drawLabel, COLORS, COLORS_DARK, type ColorPalette } from "@/lib/drawing";
import type {
  AtwoodParams,
  AtwoodState,
  AtwoodVisibility,
} from "@/types/simulator";

// The acceleration is genuinely constant here (Atwood's classic result), so
// the shape of the motion really is x(τ) ∝ τ² — what's stylized is only
// the loop's total duration, rescaled to a fixed ANIMATION_PERIOD_S so the
// boxes visibly travel and reset regardless of how large or small the real
// acceleration is. The rotation hint inside the pulley (I > 0) shares the
// same period, so it completes one full turn per box-travel cycle.
const ANIMATION_PERIOD_S = 3;
const TRAVEL_DISTANCE_M = 1.2;

export function useAtwoodAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: AtwoodParams,
  state: AtwoodState,
  visibility: AtwoodVisibility,
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
        mass1: translateRef.current("atwood.canvas.mass1"),
        mass2: translateRef.current("atwood.canvas.mass2"),
        captionMassless: translateRef.current("atwood.canvas.caption_massless"),
        captionInertia: translateRef.current("atwood.canvas.caption_inertia"),
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
        phaseRef.current = (phaseRef.current + dt) % ANIMATION_PERIOD_S;
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
  params: AtwoodParams,
  state: AtwoodState,
  visibility: AtwoodVisibility,
  phase: number,
  colors: ColorPalette,
  labels: {
    mass1: string;
    mass2: string;
    captionMassless: string;
    captionInertia: string;
  },
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;
  ctx.clearRect(0, 0, W, H);

  const travelFrac = phase / ANIMATION_PERIOD_S;
  const rotationAngle = travelFrac * Math.PI * 2;
  const travelM = TRAVEL_DISTANCE_M * travelFrac ** 2;
  const showInertia = params.pulleyMomentOfInertia > 0;

  drawPanel(
    ctx,
    W * 0.5,
    W,
    H,
    colors,
    visibility,
    {
      ...labels,
      caption: showInertia ? labels.captionInertia : labels.captionMassless,
    },
    showInertia,
    rotationAngle,
    travelM,
    state,
  );
}

function drawPanel(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  W: number,
  H: number,
  colors: ColorPalette,
  visibility: AtwoodVisibility,
  labels: { mass1: string; mass2: string; caption: string },
  showInertia: boolean,
  rotationAngle: number,
  travelM: number,
  state: AtwoodState,
): void {
  const armLength = W * 0.16;
  const pulleyY = H * 0.16;
  const pulleyRadius = showInertia ? 30 : 26;
  const left = { x: centerX - armLength, y: pulleyY };
  const right = { x: centerX + armLength, y: pulleyY };

  // Ceiling + support.
  ctx.save();
  ctx.strokeStyle = colors.trajectory;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(centerX - armLength - 20, H * 0.06);
  ctx.lineTo(centerX + armLength + 20, H * 0.06);
  ctx.stroke();
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(centerX, H * 0.06);
  ctx.lineTo(centerX, pulleyY - pulleyRadius);
  ctx.stroke();
  ctx.restore();

  // Pulley.
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, pulleyY, pulleyRadius, 0, Math.PI * 2);
  if (showInertia) {
    ctx.fillStyle = "rgba(128,128,128,0.15)";
    ctx.fill();
  }
  ctx.strokeStyle = colors.rVector;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  if (showInertia) {
    drawRotationArrow(ctx, centerX, pulleyY, pulleyRadius, colors.rVector, rotationAngle);
    drawLabel(ctx, "I, R", centerX, pulleyY + pulleyRadius * 0.35, colors.axes);
  }

  if (!visibility.showMasses) return;

  const boxSize = 44;
  const m1Rises = state.acceleration >= 0; // by convention, a ≥ 0 means m2 descends
  const travelPx = (travelM / TRAVEL_DISTANCE_M) * H * 0.1;
  const baselineM1Y = H * 0.58;
  const baselineM2Y = H * 0.54;
  const m1Y = baselineM1Y + (m1Rises ? -1 : 1) * travelPx;
  const m2Y = baselineM2Y + (m1Rises ? 1 : -1) * travelPx;

  // Cable: pulley → box top.
  ctx.save();
  ctx.strokeStyle = colors.rVector;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(left.x, left.y);
  ctx.lineTo(left.x, m1Y - boxSize / 2);
  ctx.moveTo(right.x, right.y);
  ctx.lineTo(right.x, m2Y - boxSize / 2);
  ctx.stroke();
  ctx.restore();

  const isDark = colors === COLORS_DARK;
  drawMassBox(ctx, left.x, m1Y, boxSize, colors, labels.mass1, isDark);
  drawMassBox(ctx, right.x, m2Y, boxSize, colors, labels.mass2, isDark);

  if (visibility.showForces) {
    drawForceArrow(ctx, left.x - 44, m1Y, m1Rises ? -1 : 1, "a", colors.velocity);
    drawForceArrow(ctx, right.x + 44, m2Y, m1Rises ? 1 : -1, "a", colors.velocity);

    // Weight arrows exit straight down from the base of each box, centred
    // on it horizontally.
    drawForceArrow(ctx, left.x, m1Y + boxSize / 2, 1, "m₁g", colors.weight);
    drawForceArrow(ctx, right.x, m2Y + boxSize / 2, 1, "m₂g", colors.weight);
  }

  drawLabel(ctx, labels.caption, centerX, H * 0.78, colors.axes);
}

function drawMassBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  colors: ColorPalette,
  label: string,
  isDark: boolean,
): void {
  ctx.save();
  ctx.fillStyle = "rgba(128,128,128,0.15)";
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 1.5;
  ctx.fillRect(x - size / 2, y - size / 2, size, size);
  ctx.strokeRect(x - size / 2, y - size / 2, size, size);
  ctx.restore();
  drawLabel(ctx, label, x, y, isDark ? "#ffffff" : "#1f2937");
}

function drawForceArrow(
  ctx: CanvasRenderingContext2D,
  x: number,
  yStart: number,
  direction: 1 | -1,
  label: string,
  color: string,
): void {
  const length = 44;
  const yEnd = yStart + direction * length;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, yStart);
  ctx.lineTo(x, yEnd);
  ctx.stroke();

  const headLen = 7;
  ctx.beginPath();
  ctx.moveTo(x, yEnd);
  ctx.lineTo(x - headLen * 0.6, yEnd - direction * headLen);
  ctx.lineTo(x + headLen * 0.6, yEnd - direction * headLen);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  drawLabel(ctx, label, x + (direction === 1 ? 16 : 16), (yStart + yEnd) / 2, color);
}

function drawRotationArrow(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  color: string,
  rotationAngle: number,
): void {
  const startAngle = -Math.PI * 0.7 + rotationAngle;
  const endAngle = -Math.PI * 0.1 + rotationAngle;
  const r = radius * 0.55;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, r, startAngle, endAngle);
  ctx.stroke();

  const tipX = cx + r * Math.cos(endAngle);
  const tipY = cy + r * Math.sin(endAngle);
  const tangent = endAngle + Math.PI / 2;
  const headLen = 6;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(
    tipX - headLen * Math.cos(tangent - Math.PI / 6),
    tipY - headLen * Math.sin(tangent - Math.PI / 6),
  );
  ctx.lineTo(
    tipX - headLen * Math.cos(tangent + Math.PI / 6),
    tipY - headLen * Math.sin(tangent + Math.PI / 6),
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
