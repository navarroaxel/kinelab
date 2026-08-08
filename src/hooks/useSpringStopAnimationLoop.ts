"use client";

import {
  useRef,
  useEffect,
  type RefObject,
  type MutableRefObject,
} from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { drawLabel, COLORS, COLORS_DARK, type ColorPalette } from "@/lib/drawing";
import { degToRad, remainingEnergyAt, G } from "@/lib/springStopKinematics";
import type {
  SpringStopParams,
  SpringStopState,
  SpringStopVisibility,
} from "@/types/simulator";

// The package's travel is swept over a fixed visual duration rather than
// real elapsed time — real speed/acceleration along the incline would make
// for an oddly-paced loop. The speed shown at any instant is still the
// exact energy-conservation value for that position; only the pacing of
// *reaching* that position is stylized.
//
// A single constant-screen-speed sweep over the whole distance makes the
// spring-compression part of the trip (a few tens of cm) fly by in a tiny
// fraction of the cycle when distanceToSpring is large — the compression
// and the Ec indicator barely register before the loop resets. Instead the
// cycle is split into three fixed-duration legs regardless of physical
// distances: an approach leg, a compression leg, and a hold at max
// compression so the final state is actually visible before it loops.
const ANIMATION_DURATION_S = 6;
const APPROACH_FRACTION = 0.5;
const COMPRESSION_FRACTION = 0.3;
// remaining fraction (0.2) is the hold at max compression

// Coordinate convention used throughout render(): x = 0 at the point the
// package first touches the (already precompressed) spring, x > 0 further
// up the incline (where the package starts, at x = distanceToSpring),
// x < 0 into the spring (compression = −x, bottoming out at x = −δ).

export function useSpringStopAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: SpringStopParams,
  state: SpringStopState,
  visibility: SpringStopVisibility,
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
        invalid: translateRef.current("spring-stop.canvas.invalid"),
        marker: translateRef.current("spring-stop.canvas.marker"),
        kinetic_energy: translateRef.current("spring-stop.canvas.kinetic_energy"),
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

function drawSpring(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
): void {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const coils = 8;
  const ux = len > 0 ? dx / len : 1;
  const uy = len > 0 ? dy / len : 0;
  const nx = -uy;
  const ny = ux;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  for (let i = 1; i < coils; i++) {
    const frac = i / coils;
    const side = i % 2 === 0 ? 1 : -1;
    const px = x1 + ux * len * frac + nx * side * 6;
    const py = y1 + uy * len * frac + ny * side * 6;
    ctx.lineTo(px, py);
  }
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

/** Speed at position x (see the coordinate convention above), via energy conservation. */
function speedAtPosition(
  x: number,
  params: SpringStopParams,
  g: number,
): number {
  let ke: number;
  if (x >= 0) {
    const theta = degToRad(params.inclineAngle);
    const travelled = params.distanceToSpring - x;
    ke =
      0.5 * params.packageMass * params.speedAtDistance ** 2 +
      params.packageMass * g * Math.sin(theta) * travelled -
      params.frictionCoefficient *
        params.packageMass *
        g *
        Math.cos(theta) *
        travelled;
  } else {
    ke = remainingEnergyAt(-x, params, g);
  }
  return Math.sqrt((2 * Math.max(ke, 0)) / params.packageMass);
}

function render(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  params: SpringStopParams,
  state: SpringStopState,
  visibility: SpringStopVisibility,
  phase: number,
  colors: ColorPalette,
  labels: { invalid: string; marker: string; kinetic_energy: string },
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  ctx.clearRect(0, 0, W, H);

  if (!state.valid) {
    ctx.save();
    ctx.font = "bold 13px ui-sans-serif, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = colors.point;
    ctx.fillText(labels.invalid, W / 2, H / 2);
    ctx.restore();
    return;
  }

  const inclineRad = degToRad(Math.min(params.inclineAngle, 35)); // visually capped, not physically
  const delta = state.additionalDeformation;
  const totalSpan = params.distanceToSpring + delta + 0.4; // +0.4 m of visual clearance beyond the spring anchor
  const topLeft = { x: W * 0.08, y: H * 0.2 };
  const availableW = W * 0.84;
  const availableH = H * 0.55;
  const scale = Math.min(
    availableW / totalSpan,
    Math.sin(inclineRad) > 0
      ? availableH / (totalSpan * Math.sin(inclineRad))
      : Infinity,
  );

  // Map coordinate x (see convention above) to screen space; the incline
  // starts top-left where the package begins (x = distanceToSpring) and
  // descends down-right to the spring anchor 0.4 m beyond max compression.
  const toScreen = (x: number) => {
    const distFromTop = params.distanceToSpring - x;
    return {
      x: topLeft.x + distFromTop * Math.cos(inclineRad) * scale,
      y: topLeft.y + distFromTop * Math.sin(inclineRad) * scale,
    };
  };

  const top = toScreen(params.distanceToSpring);
  const anchor = toScreen(-delta - 0.4);
  const contactPoint = toScreen(0);

  // Incline
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y);
  ctx.lineTo(top.x, top.y);
  ctx.stroke();
  ctx.restore();

  const marker = toScreen(0);
  drawLabel(ctx, labels.marker, marker.x, marker.y - 16, colors.axes);

  if (visibility.showPackage) {
    const approachDuration = ANIMATION_DURATION_S * APPROACH_FRACTION;
    const compressionDuration = ANIMATION_DURATION_S * COMPRESSION_FRACTION;

    let x: number; // from +L down to −δ, see coordinate convention above
    if (phase < approachDuration) {
      x = params.distanceToSpring * (1 - phase / approachDuration);
    } else if (phase < approachDuration + compressionDuration) {
      const frac = (phase - approachDuration) / compressionDuration;
      x = -frac * delta;
    } else {
      x = -delta; // hold at max compression so the final state is visible
    }
    const pos = toScreen(x);
    const springFreeEnd = toScreen(Math.min(x, 0));

    drawSpring(ctx, anchor.x, anchor.y, springFreeEnd.x, springFreeEnd.y, colors.trajectory);

    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.rotate(inclineRad);
    ctx.fillStyle = colors.point;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.5;
    ctx.fillRect(-14, -20, 28, 20);
    ctx.strokeRect(-14, -20, 28, 20);
    ctx.restore();

    const v = speedAtPosition(x, params, G);
    drawLabel(ctx, `v ≈ ${v.toFixed(2)} m/s`, pos.x, pos.y - 34, colors.velocity);

    if (visibility.showEnergyBar) {
      const referenceKE = 0.5 * params.packageMass * params.speedAtDistance ** 2;
      const ke = 0.5 * params.packageMass * v ** 2;
      drawEnergyBar(ctx, W, referenceKE > 0 ? ke / referenceKE : 0, labels.kinetic_energy);
    }
  } else {
    drawSpring(ctx, anchor.x, anchor.y, contactPoint.x, contactPoint.y, colors.trajectory);
  }

  drawLabel(
    ctx,
    `δ ≈ ${(delta * 100).toFixed(1)} cm`,
    (anchor.x + contactPoint.x) / 2,
    (anchor.y + contactPoint.y) / 2 - 36,
    colors.point,
  );

  drawLabel(
    ctx,
    `δ₀ = ${(params.precompression * 100).toFixed(1)} cm`,
    anchor.x,
    anchor.y + 18,
    colors.acceleration,
  );
}

function drawEnergyBar(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  fraction: number,
  label: string,
): void {
  const barX = 16;
  const barY = 16;
  const barW = Math.min(160, canvasWidth * 0.35);
  const barH = 10;
  const clamped = Math.min(Math.max(fraction, 0), 1);

  ctx.save();
  ctx.fillStyle = "rgba(128,128,128,0.25)";
  ctx.fillRect(barX, barY, barW, barH);
  ctx.fillStyle = "#3b82f6";
  ctx.fillRect(barX, barY, barW * clamped, barH);
  ctx.strokeStyle = "rgba(128,128,128,0.5)";
  ctx.lineWidth = 1;
  ctx.strokeRect(barX, barY, barW, barH);
  ctx.font = "11px sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  ctx.fillStyle = "rgba(128,128,128,0.9)";
  ctx.fillText(label, barX, barY - 3);
  ctx.restore();
}
