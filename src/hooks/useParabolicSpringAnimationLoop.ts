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
  drawDot,
  drawLabel,
  drawLabelWithSubscript,
  COLORS,
  COLORS_DARK,
  type ColorPalette,
} from "@/lib/drawing";
import {
  computeParabolicSpringState,
  pathEndX,
  pathY,
  rk4Step,
} from "@/lib/parabolicSpringKinematics";
import type {
  ParabolicSpringParams,
  ParabolicSpringState,
  ParabolicSpringVisibility,
} from "@/types/simulator";

// ---------------------------------------------------------------------------
// A planar scene — no 3D machinery here. World units are metres with the
// origin at the foot of the y-axis, exactly as the figure is drawn.
// ---------------------------------------------------------------------------

const CURVE_SAMPLES = 120;
const METRICS_INTERVAL_MS = 66; // ~15 fps, same gate as the other simulators

/** Simulation seconds per real second — the whole descent lasts under a second. */
const TIME_SCALE = 0.45;

interface Labels {
  weight: string;
  spring: string;
  normal: string;
  tangential: string;
  anchor: string;
  block: string;
  tangent: string;
  normalDir: string;
  contactLost: string;
}

interface Screen {
  x: number;
  y: number;
}

export function useParabolicSpringAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: ParabolicSpringParams,
  visibility: ParabolicSpringVisibility,
  motionRef: MutableRefObject<{ x: number; speed: number }>,
  paused: boolean,
  resetCount: number,
  onMetrics: (state: ParabolicSpringState) => void,
): void {
  const { t } = useLanguage();
  const translateRef = useRef(t);
  useEffect(() => {
    translateRef.current = t;
  }, [t]);

  const onMetricsRef = useRef(onMetrics);
  useEffect(() => {
    onMetricsRef.current = onMetrics;
  }, [onMetrics]);

  const lastTimeRef = useRef<number | null>(null);
  const lastMetricUpdateRef = useRef(0);
  const rafIdRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function currentLabels(): Labels {
      const tr = translateRef.current;
      return {
        weight: tr("ps.canvas.weight"),
        spring: tr("ps.canvas.spring"),
        normal: tr("ps.canvas.normal"),
        tangential: tr("ps.canvas.tangential"),
        anchor: tr("ps.canvas.anchor"),
        block: tr("ps.canvas.block"),
        tangent: tr("ps.canvas.tangent"),
        normalDir: tr("ps.canvas.normal_dir"),
        contactLost: tr("ps.canvas.contact_lost"),
      };
    }

    const endX = pathEndX(params);

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

      if (!paused && dt > 0) {
        // Sub-stepped so the integrator stays accurate regardless of the
        // browser's frame pacing.
        const steps = 4;
        const h = (dt * TIME_SCALE) / steps;
        for (let i = 0; i < steps; i++) {
          motionRef.current = rk4Step(motionRef.current, params, h);
        }
        // The block runs off the end of the path — start the descent again.
        if (motionRef.current.x >= endX) {
          motionRef.current = { x: params.startX, speed: params.startSpeed };
        }
      }

      const state = computeParabolicSpringState(
        params,
        motionRef.current.x,
        motionRef.current.speed,
      );

      render(ctx!, canvas!, params, state, visibility, colors, currentLabels());

      if (now - lastMetricUpdateRef.current > METRICS_INTERVAL_MS) {
        lastMetricUpdateRef.current = now;
        onMetricsRef.current(state);
      }

      rafIdRef.current = requestAnimationFrame(frame);
    }

    rafIdRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      lastTimeRef.current = null;
    };
  }, [params, visibility, paused, resetCount]); // eslint-disable-line react-hooks/exhaustive-deps
}

/** Zigzag between two screen points — the spring, drawn along its own axis. */
function drawSpring(
  ctx: CanvasRenderingContext2D,
  from: Screen,
  to: Screen,
  color: string,
): void {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  if (len < 1) return;
  const ux = dx / len;
  const uy = dy / len;
  const nx = -uy;
  const ny = ux;
  const coils = 10;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  for (let i = 1; i < coils; i++) {
    const frac = i / coils;
    const side = i % 2 === 0 ? 1 : -1;
    ctx.lineTo(
      from.x + ux * len * frac + nx * side * 6,
      from.y + uy * len * frac + ny * side * 6,
    );
  }
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
  ctx.restore();
}

function render(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  params: ParabolicSpringParams,
  state: ParabolicSpringState,
  visibility: ParabolicSpringVisibility,
  colors: ColorPalette,
  labels: Labels,
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  ctx.clearRect(0, 0, W, H);

  const endX = pathEndX(params);
  const worldW = endX * 1.35;
  const worldH = params.vertex * 1.3;
  const scale = Math.min((W * 0.86) / worldW, (H * 0.86) / worldH);
  const originX = W * 0.16;
  const originY = H * 0.9;

  const toScreen = (x: number, y: number): Screen => ({
    x: originX + x * scale,
    y: originY - y * scale,
  });

  // Force arrows are sized against the weight, so they stay readable whatever
  // the mass or the spring constant.
  const forceScale =
    (params.vertex * 0.5) / Math.max(params.mass * params.gravity, 1e-9);

  // --- the solid the path bounds ------------------------------------------
  const curve: Screen[] = [];
  for (let i = 0; i <= CURVE_SAMPLES; i++) {
    const x = (endX * i) / CURVE_SAMPLES;
    curve.push(toScreen(x, pathY(x, params)));
  }

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(toScreen(0, 0).x, toScreen(0, 0).y);
  for (const point of curve) ctx.lineTo(point.x, point.y);
  ctx.lineTo(toScreen(endX, 0).x, toScreen(endX, 0).y);
  ctx.closePath();
  ctx.fillStyle = "rgba(140,146,154,0.28)";
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = colors.rVector;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  curve.forEach((point, i) =>
    i === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y),
  );
  ctx.stroke();
  ctx.restore();

  // --- axes ---------------------------------------------------------------
  const origin = toScreen(0, 0);
  drawArrow(
    ctx,
    origin.x,
    origin.y,
    toScreen(endX * 1.18, 0).x,
    origin.y,
    colors.axes,
    1.2,
    7,
  );
  drawArrow(
    ctx,
    origin.x,
    origin.y,
    origin.x,
    toScreen(0, params.vertex * 1.18).y,
    colors.axes,
    1.2,
    7,
  );
  drawLabel(
    ctx,
    "x",
    toScreen(endX * 1.18, 0).x + 10,
    origin.y + 4,
    colors.axes,
  );
  drawLabel(
    ctx,
    "y",
    origin.x - 10,
    toScreen(0, params.vertex * 1.18).y,
    colors.axes,
  );

  const block = toScreen(state.x, state.y);

  // --- unit tangent and normal --------------------------------------------
  const norm = Math.sqrt(1 + state.slope * state.slope);
  // t̂ = (1, y′)/√(1+y′²); n̂ = (y′, −1)/√(1+y′²) points at the centre of
  // curvature, so the path pushes the block the other way, along −n̂.
  const tx = 1 / norm;
  const ty = state.slope / norm;
  const nx = state.slope / norm;
  const ny = -1 / norm;

  // --- osculating circle ---------------------------------------------------
  if (visibility.showCurvature && Number.isFinite(state.radiusOfCurvature)) {
    const centre = toScreen(
      state.x + nx * state.radiusOfCurvature,
      state.y + ny * state.radiusOfCurvature,
    );
    // Only the stretch of the circle that hugs the block: at these radii the
    // full circle mostly falls off the canvas and reads as stray clutter.
    const angleToBlock = Math.atan2(block.y - centre.y, block.x - centre.x);
    const span = 0.5;
    ctx.save();
    ctx.strokeStyle = colors.trajectory;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(
      centre.x,
      centre.y,
      state.radiusOfCurvature * scale,
      angleToBlock - span,
      angleToBlock + span,
    );
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(block.x, block.y);
    ctx.lineTo(centre.x, centre.y);
    ctx.stroke();
    ctx.restore();
    drawDot(ctx, centre.x, centre.y, 2.5, colors.trajectory);
    drawLabel(
      ctx,
      `ρ = ${state.radiusOfCurvature.toFixed(2)} m`,
      block.x + nx * 74,
      block.y - ny * 74,
      colors.trajectory,
    );
  }

  // --- roller guide and spring --------------------------------------------
  if (visibility.showSpring) {
    const anchor = toScreen(0, state.y);
    ctx.save();
    ctx.strokeStyle = colors.axes;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(anchor.x, anchor.y);
    ctx.lineTo(block.x, block.y);
    ctx.stroke();
    ctx.restore();

    drawSpring(ctx, anchor, block, colors.pole);
    drawDot(ctx, anchor.x, anchor.y, 4, colors.pole);
    drawLabel(ctx, labels.anchor, anchor.x - 12, anchor.y + 12, colors.pole);
  }

  // --- the block ----------------------------------------------------------
  const angle = Math.atan2(-ty, tx); // screen y grows downward
  ctx.save();
  ctx.translate(block.x, block.y);
  ctx.rotate(-angle);
  ctx.fillStyle = state.contactLost
    ? "rgba(232,89,60,0.85)"
    : "rgba(200,64,52,0.75)";
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(-13, -22, 26, 22, 3);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
  drawDot(ctx, block.x, block.y, 3, colors.point);
  drawLabel(ctx, labels.block, block.x + 22, block.y + 16, colors.point);

  // --- the t̂ / n̂ frame ----------------------------------------------------
  if (visibility.showFrame) {
    const unit = 42;
    drawArrow(
      ctx,
      block.x,
      block.y,
      block.x + tx * unit,
      block.y - ty * unit,
      colors.axes,
      1.2,
      6,
    );
    drawArrow(
      ctx,
      block.x,
      block.y,
      block.x + nx * unit,
      block.y - ny * unit,
      colors.axes,
      1.2,
      6,
    );
    drawLabel(
      ctx,
      labels.tangent,
      block.x + tx * (unit + 14),
      block.y - ty * (unit + 14),
      colors.axes,
    );
    drawLabel(
      ctx,
      labels.normalDir,
      block.x + nx * (unit + 14),
      block.y - ny * (unit + 14),
      colors.axes,
    );
  }

  // --- forces on the block -------------------------------------------------
  const arrow = (
    dx: number,
    dy: number,
    color: string,
    label: string,
  ): void => {
    const tipX = block.x + dx * scale * forceScale;
    const tipY = block.y - dy * scale * forceScale;
    if (Math.hypot(tipX - block.x, tipY - block.y) < 2) return;
    drawArrow(ctx, block.x, block.y, tipX, tipY, color, 2.2, 9);
    const len = Math.hypot(tipX - block.x, tipY - block.y) || 1;
    drawLabelWithSubscript(
      ctx,
      label,
      tipX + ((tipX - block.x) / len) * 16,
      tipY + ((tipY - block.y) / len) * 13,
      color,
    );
  };

  if (visibility.showWeight) {
    arrow(0, -params.mass * params.gravity, colors.weight, labels.weight);
  }
  if (visibility.showSpringForce) {
    // Stretched: pulls back toward B, in −x. Compressed: pushes out, in +x.
    arrow(
      -params.stiffness * state.springStretch,
      0,
      colors.radialVelocity,
      labels.spring,
    );
  }
  if (visibility.showNormal) {
    arrow(
      -nx * state.normal,
      -ny * state.normal,
      colors.normalForce,
      labels.normal,
    );
  }
  if (visibility.showTangential) {
    const magnitude = params.mass * state.tangentialAccel;
    arrow(
      tx * magnitude,
      ty * magnitude,
      colors.acceleration,
      labels.tangential,
    );
  }

  if (state.contactLost) {
    drawLabel(ctx, labels.contactLost, W * 0.5, 22, colors.point, true);
  }
}
