"use client";

import {
  useRef,
  useEffect,
  type RefObject,
  type MutableRefObject,
} from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { drawLabel, COLORS, COLORS_DARK, type ColorPalette } from "@/lib/drawing";
import { degToRad } from "@/lib/pulleyFrictionKinematics";
import type {
  PulleyFrictionParams,
  PulleyFrictionState,
  PulleyFrictionVisibility,
} from "@/types/simulator";

// Both blocks move at the same constant speed (1:1 pulley) — the loop just
// sweeps a visual phase across a fixed track length; it carries no
// independent physical meaning, unlike the force/tension values shown,
// which are the exact closed-form results for the current parameters.
const ANIMATION_DURATION_S = 4;
const TRACK_LENGTH_M = 4;

export function usePulleyFrictionAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: PulleyFrictionParams,
  state: PulleyFrictionState,
  visibility: PulleyFrictionVisibility,
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
        blockA: translateRef.current("pulley-friction.canvas.block_a"),
        blockB: translateRef.current("pulley-friction.canvas.block_b"),
        force: translateRef.current("pulley-friction.canvas.force"),
        tension: translateRef.current("pulley-friction.canvas.tension"),
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
        phaseRef.current = (phaseRef.current + dt) % ANIMATION_DURATION_S;
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

function drawArrow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angleRad: number,
  length: number,
  color: string,
): void {
  const ex = x + Math.cos(angleRad) * length;
  const ey = y - Math.sin(angleRad) * length;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(ex, ey);
  ctx.stroke();
  const headLen = 7;
  ctx.beginPath();
  ctx.moveTo(ex, ey);
  ctx.lineTo(
    ex - headLen * Math.cos(angleRad - Math.PI / 6),
    ey + headLen * Math.sin(angleRad - Math.PI / 6),
  );
  ctx.lineTo(
    ex - headLen * Math.cos(angleRad + Math.PI / 6),
    ey + headLen * Math.sin(angleRad + Math.PI / 6),
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function render(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  params: PulleyFrictionParams,
  state: PulleyFrictionState,
  visibility: PulleyFrictionVisibility,
  phase: number,
  colors: ColorPalette,
  labels: { blockA: string; blockB: string; force: string; tension: string },
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;
  ctx.clearRect(0, 0, W, H);

  const pulley = { x: W * 0.52, y: H * 0.18 };
  const groundY = H * 0.8;
  const alpha = degToRad(params.inclineAngle);
  const theta = degToRad(params.pullAngle);

  // Flat track for A, from the left edge to the pulley's base.
  const aTrackStart = { x: W * 0.08, y: groundY };
  const aTrackEnd = { x: pulley.x, y: groundY };

  // Incline for B, rising to the right of the pulley.
  const inclineBase = { x: pulley.x, y: groundY };
  const inclineLen = W * 0.32;
  const inclineTop = {
    x: inclineBase.x + inclineLen * Math.cos(alpha),
    y: inclineBase.y - inclineLen * Math.sin(alpha),
  };

  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(aTrackStart.x, aTrackStart.y);
  ctx.lineTo(aTrackEnd.x, aTrackEnd.y);
  ctx.moveTo(inclineBase.x, inclineBase.y);
  ctx.lineTo(inclineTop.x, inclineTop.y);
  ctx.stroke();
  ctx.restore();

  // Pulley wheel.
  ctx.save();
  ctx.fillStyle = "#52525b";
  ctx.beginPath();
  ctx.arc(pulley.x, pulley.y, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  if (visibility.showBlocks) {
    const frac = phase / ANIMATION_DURATION_S;

    // Block A slides from left toward the pulley; block B slides from the
    // pulley's base up the incline — both move in lockstep (1:1 pulley).
    const aTravel = TRACK_LENGTH_M * frac;
    const bTravel = TRACK_LENGTH_M * frac;
    const scaleA = (aTrackEnd.x - aTrackStart.x) / TRACK_LENGTH_M;
    const scaleB = inclineLen / TRACK_LENGTH_M;

    const aPos = {
      x: aTrackStart.x + aTravel * scaleA,
      y: groundY,
    };
    const bPos = {
      x: inclineBase.x + bTravel * scaleB * Math.cos(alpha),
      y: inclineBase.y - bTravel * scaleB * Math.sin(alpha),
    };

    // Block A.
    ctx.save();
    ctx.fillStyle = colors.point;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.5;
    ctx.fillRect(aPos.x - 16, aPos.y - 20, 32, 20);
    ctx.strokeRect(aPos.x - 16, aPos.y - 20, 32, 20);
    ctx.restore();
    drawLabel(ctx, labels.blockA, aPos.x, aPos.y - 36, colors.point);

    // Block B.
    ctx.save();
    ctx.translate(bPos.x, bPos.y);
    ctx.rotate(-alpha);
    ctx.fillStyle = colors.velocity;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.5;
    ctx.fillRect(-12, -18, 24, 18);
    ctx.strokeRect(-12, -18, 24, 18);
    ctx.restore();
    drawLabel(ctx, labels.blockB, bPos.x, bPos.y - 26, colors.velocity);

    if (visibility.showForceSweep) {
      const arrowOriginX = aPos.x + 16;
      const arrowOriginY = aPos.y - 10;
      const arrowLen = 50;
      drawArrow(ctx, arrowOriginX, arrowOriginY, theta, arrowLen, colors.acceleration);
      drawLabel(
        ctx,
        `${labels.force} = ${state.appliedForce.toFixed(0)} N`,
        arrowOriginX + Math.cos(theta) * (arrowLen + 24),
        arrowOriginY - Math.sin(theta) * (arrowLen + 24),
        colors.acceleration,
        true,
      );

      drawArrow(ctx, bPos.x, bPos.y, alpha, 40, colors.normalAccel);
      drawLabel(
        ctx,
        `${labels.tension} = ${state.cableTension.toFixed(0)} N`,
        bPos.x + Math.cos(alpha) * 44,
        bPos.y - Math.sin(alpha) * 44 - 8,
        colors.normalAccel,
      );
    }

    // Cable: A → pulley → B.
    ctx.save();
    ctx.strokeStyle = colors.trajectory;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(aPos.x + 16, aPos.y - 10);
    ctx.lineTo(pulley.x, pulley.y);
    ctx.lineTo(bPos.x, bPos.y);
    ctx.stroke();
    ctx.restore();
  }
}
