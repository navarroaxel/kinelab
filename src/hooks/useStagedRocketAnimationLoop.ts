"use client";

import {
  useRef,
  useEffect,
  type RefObject,
  type MutableRefObject,
} from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { drawLabel, COLORS, COLORS_DARK, type ColorPalette } from "@/lib/drawing";
import { velocityAtTime } from "@/lib/stagedRocketKinematics";
import type {
  StagedRocketParams,
  StagedRocketState,
  StagedRocketVisibility,
} from "@/types/simulator";

// Real burns run ~80 s — this compresses simulated flight-time into a
// watchable loop. The physics (v(t) at any instant) uses the real,
// unscaled flight-time; only the wall-clock pacing is sped up.
const SPEED_MULTIPLIER = 8;
const COAST_EXTENSION_S = 15;

export function useStagedRocketAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: StagedRocketParams,
  state: StagedRocketState,
  visibility: StagedRocketVisibility,
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

    const totalBurn = state.twoStage.burnTimeA + state.twoStage.burnTimeB;
    const cycleDuration = Math.max(state.singleStage.burnTime, totalBurn) + COAST_EXTENSION_S;

    function currentLabels() {
      return {
        single: translateRef.current("staged-rocket.canvas.single"),
        twoStage: translateRef.current("staged-rocket.canvas.two_stage"),
        separation: translateRef.current("staged-rocket.canvas.separation"),
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
        phaseRef.current =
          (phaseRef.current + SPEED_MULTIPLIER * dt) % cycleDuration;
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

function drawRocket(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  thrusting: boolean,
  color: string,
  flameColor: string,
  bodyHeight = 24,
): void {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - 20);
  ctx.lineTo(x - 8, y);
  ctx.lineTo(x + 8, y);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(x - 8, y, 16, bodyHeight);
  ctx.restore();

  if (thrusting) {
    ctx.save();
    ctx.fillStyle = flameColor;
    ctx.beginPath();
    ctx.moveTo(x - 6, y + bodyHeight);
    ctx.lineTo(x + 6, y + bodyHeight);
    ctx.lineTo(x, y + bodyHeight + 14);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

// Two-stage body split into an upper-stage segment and a lower booster
// segment, taller overall than the single-stage rocket so the separation
// line between the two sections reads clearly before staging occurs.
const UPPER_STAGE_HEIGHT = 26;
const BOOSTER_HEIGHT = 26;
const TWO_STAGE_BODY_HEIGHT = UPPER_STAGE_HEIGHT + BOOSTER_HEIGHT;

// 0 = full stack (booster + upper stage still joined), 1 = booster jettisoned
// (upper stage alone, still under thrust or coasting on it), 2 = upper
// stage's own spent structure jettisoned too — only the payload nose flies on.
type TwoStageStack = 0 | 1 | 2;

function drawTwoStageRocket(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  thrusting: boolean,
  stack: TwoStageStack,
  color: string,
  flameColor: string,
  sectionColor: string,
): void {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - 20);
  ctx.lineTo(x - 8, y);
  ctx.lineTo(x + 8, y);
  ctx.closePath();
  ctx.fill();

  let bodyHeight = 0;
  if (stack === 0) {
    bodyHeight = TWO_STAGE_BODY_HEIGHT;
    ctx.fillRect(x - 8, y, 16, bodyHeight);
    ctx.strokeStyle = sectionColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - 8, y + UPPER_STAGE_HEIGHT);
    ctx.lineTo(x + 8, y + UPPER_STAGE_HEIGHT);
    ctx.stroke();
  } else if (stack === 1) {
    bodyHeight = UPPER_STAGE_HEIGHT;
    ctx.fillRect(x - 8, y, 16, bodyHeight);
  }
  // stack === 2: bare payload nose, no body left to draw.
  ctx.restore();

  if (thrusting) {
    const flameY = y + bodyHeight;
    ctx.save();
    ctx.fillStyle = flameColor;
    ctx.beginPath();
    ctx.moveTo(x - 6, flameY);
    ctx.lineTo(x + 6, flameY);
    ctx.lineTo(x, flameY + 14);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

// A jettisoned casing (either the booster after stage separation, or the
// spent upper-stage structure after burnout) falling away and fading out.
function drawFallingCasing(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  dt: number,
  color: string,
): void {
  const casingY = y + 30 + Math.min(dt * 4, 60);
  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = Math.max(1 - dt / 8, 0);
  ctx.fillRect(x - 8, casingY, 16, 16);
  ctx.restore();
}

function render(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  params: StagedRocketParams,
  state: StagedRocketState,
  visibility: StagedRocketVisibility,
  phase: number,
  cycleDuration: number,
  colors: ColorPalette,
  labels: { single: string; twoStage: string; separation: string },
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  ctx.clearRect(0, 0, W, H);

  const groundY = H * 0.92;
  const topY = H * 0.1;
  const progress = Math.min(phase / cycleDuration, 1);

  // Ground
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(W, groundY);
  ctx.stroke();
  ctx.restore();

  if (visibility.showSingleStage) {
    const cx = W * 0.3;
    const y = groundY - progress * (groundY - topY);
    const burning = phase < state.singleStage.burnTime;
    const v = velocityAtTime(
      Math.min(phase, state.singleStage.burnTime),
      state.singleStage.initialMass,
      params.fuelRate,
      params.exhaustVelocity,
    );
    const vNow = burning
      ? v
      : state.singleStage.maxSpeed -
        9.81 * (phase - state.singleStage.burnTime);

    drawLabel(ctx, labels.single, cx, topY - 16, colors.rVector);
    drawRocket(
      ctx,
      cx,
      y,
      burning,
      colors.rVector,
      colors.point,
      TWO_STAGE_BODY_HEIGHT,
    );
    drawLabel(
      ctx,
      `v ≈ ${vNow.toFixed(0)} m/s`,
      cx,
      y + TWO_STAGE_BODY_HEIGHT + 20,
      colors.rVector,
    );
  }

  if (visibility.showTwoStage) {
    const cx = W * 0.7;
    const y = groundY - progress * (groundY - topY);
    const totalBurn = state.twoStage.burnTimeA + state.twoStage.burnTimeB;
    const burning = phase < totalBurn;
    const separated = phase >= state.twoStage.burnTimeA;

    let vNow: number;
    if (phase < state.twoStage.burnTimeA) {
      vNow = velocityAtTime(
        phase,
        state.twoStage.initialMass,
        params.fuelRate,
        params.exhaustVelocity,
      );
    } else if (phase < totalBurn) {
      vNow = velocityAtTime(
        phase - state.twoStage.burnTimeA,
        state.twoStage.massAfterSeparation,
        params.fuelRate,
        params.exhaustVelocity,
        state.twoStage.speedAtSeparation,
      );
    } else {
      vNow = state.twoStage.maxSpeed - 9.81 * (phase - totalBurn);
    }

    const burnedOut = phase >= totalBurn;
    const stack: TwoStageStack = burnedOut ? 2 : separated ? 1 : 0;

    drawLabel(ctx, labels.twoStage, cx, topY - 36, colors.point);
    drawTwoStageRocket(
      ctx,
      cx,
      y,
      burning,
      stack,
      colors.point,
      colors.acceleration,
      colors.axes,
    );

    if (separated) {
      const dt = phase - state.twoStage.burnTimeA;
      drawFallingCasing(ctx, cx, y, dt, colors.axes);
      if (dt < 2) {
        drawLabel(ctx, labels.separation, cx + 54, y + 20, colors.axes);
      }
    }

    if (burnedOut) {
      const dt = phase - totalBurn;
      drawFallingCasing(ctx, cx, y, dt, colors.axes);
      if (dt < 2) {
        drawLabel(ctx, labels.separation, cx + 54, y + 20, colors.axes);
      }
    }

    drawLabel(
      ctx,
      `v ≈ ${vNow.toFixed(0)} m/s`,
      cx,
      y + TWO_STAGE_BODY_HEIGHT + 20,
      colors.point,
    );
  }
}
