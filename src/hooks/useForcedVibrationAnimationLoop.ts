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
  drawLabelWithSubscript,
  COLORS,
  COLORS_DARK,
  type ColorPalette,
} from "@/lib/drawing";
import {
  computeProperties,
  computeState,
  rk4Step,
  type MotionState,
} from "@/lib/forcedVibrationKinematics";
import type {
  ForcedVibrationParams,
  ForcedVibrationState,
  ForcedVibrationVisibility,
} from "@/types/simulator";

// ---------------------------------------------------------------------------
// A planar scene, drawn in screen pixels: ceiling, spring and dashpot side by
// side, and the mass sliding vertically between guides.
//
// Displacements here are millimetres against a system that is decimetres
// across, so the block's motion is drawn on its own exaggerated scale — the
// numbers in the metrics panel are the real ones.
// ---------------------------------------------------------------------------

const METRICS_INTERVAL_MS = 66; // ~15 fps, same gate as the other simulators
/** Integration sub-steps per frame — ωn = 100 rad/s needs a fine step. */
const SUBSTEPS = 12;

interface Labels {
  spring: string;
  damper: string;
  force: string;
  equilibrium: string;
  amplitude: string;
}

export function useForcedVibrationAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: ForcedVibrationParams,
  visibility: ForcedVibrationVisibility,
  motionRef: MutableRefObject<MotionState>,
  timeRef: MutableRefObject<number>,
  paused: boolean,
  resetCount: number,
  onMetrics: (state: ForcedVibrationState) => void,
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
        spring: tr("fv.canvas.spring"),
        damper: tr("fv.canvas.damper"),
        force: tr("fv.canvas.force"),
        equilibrium: tr("fv.canvas.equilibrium"),
        amplitude: tr("fv.canvas.amplitude"),
      };
    }

    const properties = computeProperties(params);

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
        const span = dt * params.slowMotion;
        const h = span / SUBSTEPS;
        for (let i = 0; i < SUBSTEPS; i++) {
          motionRef.current = rk4Step(
            motionRef.current,
            timeRef.current,
            params,
            h,
          );
          timeRef.current += h;
        }
      }

      const state = computeState(params, timeRef.current, motionRef.current);

      render(
        ctx!,
        canvas!,
        params,
        state,
        properties.steadyAmplitude,
        visibility,
        colors,
        currentLabels(),
      );

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

/** A coil spring drawn between two points on a vertical line. */
function drawSpring(
  ctx: CanvasRenderingContext2D,
  x: number,
  yTop: number,
  yBottom: number,
  color: string,
): void {
  const coils = 8;
  const amplitude = 11;
  const step = (yBottom - yTop) / (coils + 1);

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(x, yTop);
  ctx.lineTo(x, yTop + step / 2);
  for (let i = 0; i < coils; i++) {
    ctx.lineTo(
      x + (i % 2 === 0 ? amplitude : -amplitude),
      yTop + step / 2 + step * (i + 0.5),
    );
  }
  ctx.lineTo(x, yBottom - step / 2);
  ctx.lineTo(x, yBottom);
  ctx.stroke();
  ctx.restore();
}

/** A dashpot: a cylinder anchored above and a piston rod coming up from below. */
function drawDamper(
  ctx: CanvasRenderingContext2D,
  x: number,
  yTop: number,
  yBottom: number,
  color: string,
): void {
  const width = 20;
  const bodyTop = yTop + (yBottom - yTop) * 0.28;
  const bodyBottom = yTop + (yBottom - yTop) * 0.72;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, yTop);
  ctx.lineTo(x, bodyTop);
  ctx.stroke();

  // Cylinder, open at the bottom.
  ctx.beginPath();
  ctx.moveTo(x - width / 2, bodyBottom);
  ctx.lineTo(x - width / 2, bodyTop);
  ctx.lineTo(x + width / 2, bodyTop);
  ctx.lineTo(x + width / 2, bodyBottom);
  ctx.stroke();

  // Piston and its rod down to the mass.
  const piston = bodyTop + (bodyBottom - bodyTop) * 0.55;
  ctx.beginPath();
  ctx.moveTo(x - width / 2 + 2, piston);
  ctx.lineTo(x + width / 2 - 2, piston);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, piston);
  ctx.lineTo(x, yBottom);
  ctx.stroke();
  ctx.restore();
}

function render(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  params: ForcedVibrationParams,
  state: ForcedVibrationState,
  steadyAmplitude: number,
  visibility: ForcedVibrationVisibility,
  colors: ColorPalette,
  labels: Labels,
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  ctx.clearRect(0, 0, W, H);

  const centreX = W * 0.42;
  const ceilingY = H * 0.1;
  const restY = H * 0.52;
  const blockW = Math.min(W * 0.3, 230);
  const blockH = Math.min(H * 0.15, 68);

  // Pick the display scale from whatever the motion actually reaches, so the
  // block always uses the room available without ever leaving the frame.
  const reference = Math.max(
    Math.abs(state.displacement),
    Number.isFinite(steadyAmplitude) ? steadyAmplitude : 0,
    Math.abs(params.initialDisplacement),
    1e-4,
  );
  const pixelsPerMetre = (H * 0.15) / reference;
  const offset = state.displacement * pixelsPerMetre;
  // The block's *centre* tracks x, so the equilibrium line and the ±X band
  // read against the same point the numbers refer to.
  const blockCentreY = restY + offset;
  const blockTop = blockCentreY - blockH / 2;

  // --- ceiling -------------------------------------------------------------
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centreX - blockW * 0.75, ceilingY);
  ctx.lineTo(centreX + blockW * 0.75, ceilingY);
  ctx.stroke();
  ctx.lineWidth = 1;
  for (let x = -blockW * 0.75; x < blockW * 0.75; x += 12) {
    ctx.beginPath();
    ctx.moveTo(centreX + x, ceilingY);
    ctx.lineTo(centreX + x - 8, ceilingY - 9);
    ctx.stroke();
  }
  ctx.restore();

  // --- spring and damper ---------------------------------------------------
  const springX = centreX - blockW * 0.28;
  const damperX = centreX + blockW * 0.28;
  drawSpring(ctx, springX, ceilingY, blockTop, colors.normalForce);
  drawDamper(ctx, damperX, ceilingY, blockTop, colors.coriolis);
  drawLabel(
    ctx,
    labels.spring,
    springX - 46,
    (ceilingY + blockTop) / 2,
    colors.normalForce,
  );
  drawLabel(
    ctx,
    labels.damper,
    damperX + 42,
    (ceilingY + blockTop) / 2,
    colors.coriolis,
  );

  // --- the steady-state band and the equilibrium line ----------------------
  if (visibility.showEquilibrium) {
    ctx.save();
    ctx.strokeStyle = colors.axes;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(centreX - blockW * 0.85, restY);
    ctx.lineTo(centreX + blockW * 0.95, restY);
    ctx.stroke();
    ctx.restore();
    drawLabel(
      ctx,
      labels.equilibrium,
      centreX + blockW * 0.95 + 34,
      restY,
      colors.axes,
    );
  }

  if (visibility.showEnvelope && Number.isFinite(steadyAmplitude)) {
    const band = steadyAmplitude * pixelsPerMetre;
    ctx.save();
    ctx.strokeStyle = colors.criticalSpeed;
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 4]);
    for (const sign of [1, -1]) {
      ctx.beginPath();
      ctx.moveTo(centreX - blockW * 0.85, restY + sign * band);
      ctx.lineTo(centreX + blockW * 0.7, restY + sign * band);
      ctx.stroke();
    }
    ctx.restore();
    drawLabelWithSubscript(
      ctx,
      `${labels.amplitude} = ±${(steadyAmplitude * 1000).toFixed(2)} mm`,
      centreX - blockW * 0.85 + 78,
      restY - band - 12,
      colors.criticalSpeed,
    );
  }

  // --- side guides ---------------------------------------------------------
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 2;
  for (const sign of [-1, 1]) {
    const x = centreX + (sign * blockW) / 2 + sign * 9;
    ctx.beginPath();
    ctx.moveTo(x, restY - H * 0.2);
    ctx.lineTo(x, restY + H * 0.28);
    ctx.stroke();
  }
  ctx.restore();

  // --- the mass ------------------------------------------------------------
  ctx.save();
  ctx.fillStyle = "rgba(214,150,120,0.8)";
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.roundRect(centreX - blockW / 2, blockTop, blockW, blockH, 4);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
  drawLabelWithSubscript(
    ctx,
    `m = ${params.mass} kg`,
    centreX,
    blockTop + blockH / 2,
    "#3a2a24",
  );

  // --- forces --------------------------------------------------------------
  // Every arrow shares one scale, so their relative sizes mean something.
  const largest = Math.max(
    Math.abs(state.appliedForce),
    Math.abs(state.springForce),
    Math.abs(state.damperForce),
    1e-6,
  );
  const forceScale = (H * 0.22) / largest;

  const arrow = (
    x: number,
    y: number,
    value: number,
    color: string,
    label: string,
  ): void => {
    const tipY = y - value * forceScale;
    if (Math.abs(tipY - y) < 3) return;
    drawArrow(ctx, x, y, x, tipY, color, 2.2, 9);
    drawLabelWithSubscript(
      ctx,
      label,
      x + 30,
      tipY + Math.sign(tipY - y) * 10,
      color,
    );
  };

  if (visibility.showAppliedForce) {
    // Drawn below the block, pointing down for a positive (downward) force,
    // the sense the figure marks.
    arrow(
      centreX,
      blockTop + blockH,
      -state.appliedForce,
      colors.weight,
      `${labels.force} = ${state.appliedForce.toFixed(0)} N`,
    );
  }
  if (visibility.showSpringForce) {
    arrow(springX, blockTop, state.springForce, colors.normalForce, "F_k");
  }
  if (visibility.showDamperForce) {
    arrow(damperX, blockTop, state.damperForce, colors.coriolis, "F_c");
  }
}
