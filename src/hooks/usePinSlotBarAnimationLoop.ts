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
  drawHinge,
  drawLabel,
  drawLabelWithSubscript,
  COLORS,
  COLORS_DARK,
  type ColorPalette,
} from "@/lib/drawing";
import {
  computePinSlotBarInstant,
  computePinSlotBarState,
  pinSlotBarLimits,
} from "@/lib/pinSlotBarKinematics";
import type {
  PinSlotBarParams,
  PinSlotBarState,
  PinSlotBarVisibility,
} from "@/types/simulator";

// ---------------------------------------------------------------------------
// A planar mechanism: C at the origin (pivot of the fixed-length arm AC) and
// O at a fixed offset (pivot of the slotted bar BO). The pin A is the point
// they share.
// ---------------------------------------------------------------------------

const METRICS_INTERVAL_MS = 66; // ~15 fps, same gate as the other simulators
/** How far the slotted bar is drawn beyond the pin, each way, in cm. */
const SLOT_OVERSHOOT = 14;
const TRACE_SAMPLES = 48;

interface Labels {
  v: string;
  vArr: string;
  vRel: string;
  a: string;
  aArr: string;
  aCor: string;
  aRel: string;
  phi: string;
  theta: string;
}

interface Screen {
  x: number;
  y: number;
}

export function usePinSlotBarAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: PinSlotBarParams,
  visibility: PinSlotBarVisibility,
  phaseRef: MutableRefObject<number>,
  paused: boolean,
  resetCount: number,
  onMetrics: (state: PinSlotBarState) => void,
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
        v: tr("psb.canvas.v"),
        vArr: tr("psb.canvas.v_arr"),
        vRel: tr("psb.canvas.v_rel"),
        a: tr("psb.canvas.a"),
        aArr: tr("psb.canvas.a_arr"),
        aCor: tr("psb.canvas.a_cor"),
        aRel: tr("psb.canvas.a_rel"),
        phi: tr("psb.canvas.phi"),
        theta: tr("psb.canvas.theta"),
      };
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

      if (!paused && dt > 0) phaseRef.current += dt;

      const state = computePinSlotBarState(params, phaseRef.current);

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

/** Bounding box in world units covering the whole swing, C, and O. */
function sceneBounds(params: PinSlotBarParams) {
  const { phiMin, phiMax } = pinSlotBarLimits(params);
  const xs = [0, params.pivotOx];
  const ys = [0, params.pivotOy];
  for (let i = 0; i <= TRACE_SAMPLES; i++) {
    const phi = phiMin + ((phiMax - phiMin) * i) / TRACE_SAMPLES;
    const s = computePinSlotBarInstant(phi, params.omegaBO, params);
    xs.push(s.ax, params.pivotOx + (s.r + SLOT_OVERSHOOT) * Math.cos(phi));
    ys.push(s.ay, params.pivotOy + (s.r + SLOT_OVERSHOOT) * Math.sin(phi));
    xs.push(params.pivotOx - SLOT_OVERSHOOT * Math.cos(phi));
    ys.push(params.pivotOy - SLOT_OVERSHOOT * Math.sin(phi));
  }
  const pad = 0.15 * params.armLength;
  return {
    xMin: Math.min(...xs) - pad,
    xMax: Math.max(...xs) + pad,
    yMin: Math.min(...ys) - pad,
    yMax: Math.max(...ys) + pad,
  };
}

function render(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  params: PinSlotBarParams,
  state: PinSlotBarState,
  visibility: PinSlotBarVisibility,
  colors: ColorPalette,
  labels: Labels,
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  ctx.clearRect(0, 0, W, H);

  const { xMin, xMax, yMin, yMax } = sceneBounds(params);
  const scale = Math.min((W * 0.88) / (xMax - xMin), (H * 0.88) / (yMax - yMin));
  const originX = W / 2 - ((xMin + xMax) / 2) * scale;
  const originY = H / 2 + ((yMin + yMax) / 2) * scale;

  const toScreen = (x: number, y: number): Screen => ({
    x: originX + x * scale,
    y: originY - y * scale,
  });

  const C = toScreen(0, 0);
  const O = toScreen(params.pivotOx, params.pivotOy);
  const A = toScreen(state.ax, state.ay);

  const er = { x: Math.cos(state.phi), y: Math.sin(state.phi) };

  // --- trace of the pin over the whole swing --------------------------------
  if (visibility.showTrace) {
    const { phiMin, phiMax } = pinSlotBarLimits(params);
    ctx.save();
    ctx.strokeStyle = colors.trajectory;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    for (let i = 0; i <= TRACE_SAMPLES; i++) {
      const phi = phiMin + ((phiMax - phiMin) * i) / TRACE_SAMPLES;
      const s = computePinSlotBarInstant(phi, params.omegaBO, params);
      const p = toScreen(s.ax, s.ay);
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
    ctx.restore();
  }

  // --- the slotted bar BO ----------------------------------------------------
  const bTip = toScreen(
    params.pivotOx + (state.r + SLOT_OVERSHOOT) * er.x,
    params.pivotOy + (state.r + SLOT_OVERSHOOT) * er.y,
  );
  const oTail = toScreen(
    params.pivotOx - SLOT_OVERSHOOT * er.x,
    params.pivotOy - SLOT_OVERSHOOT * er.y,
  );
  ctx.save();
  ctx.strokeStyle = colors.pole;
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(oTail.x, oTail.y);
  ctx.lineTo(bTip.x, bTip.y);
  ctx.stroke();
  ctx.restore();
  drawLabel(ctx, "B", bTip.x + 12, bTip.y - 8, colors.pole);

  // --- the arm AC --------------------------------------------------------
  ctx.save();
  ctx.strokeStyle = colors.rVector;
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(C.x, C.y);
  ctx.lineTo(A.x, A.y);
  ctx.stroke();
  ctx.restore();

  drawHinge(ctx, O.x, O.y, colors.axes, 1.6);
  drawHinge(ctx, C.x, C.y, colors.axes, 1.6);
  drawDot(ctx, A.x, A.y, 4, colors.point);
  drawLabel(ctx, "O", O.x + 14, O.y - 8, colors.axes);
  drawLabel(ctx, "C", C.x - 14, C.y + 12, colors.axes);
  drawLabel(ctx, "A", A.x + 8, A.y - 14, colors.point);

  // --- φ and θ arcs -----------------------------------------------------
  if (visibility.showAngles) {
    const arcRadius = Math.min(0.35 * params.armLength * scale, 46);
    ctx.save();
    ctx.strokeStyle = colors.rVector;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(O.x, O.y, arcRadius, -state.phi, 0, state.phi > 0);
    ctx.stroke();
    ctx.restore();
    drawLabel(ctx, labels.phi, O.x + arcRadius + 12, O.y - 6, colors.rVector);

    ctx.save();
    ctx.strokeStyle = colors.axes;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(C.x, C.y, arcRadius, -state.theta, 0, state.theta > 0);
    ctx.stroke();
    ctx.restore();
    drawLabel(ctx, labels.theta, C.x + arcRadius + 12, C.y - 6, colors.axes);
  }

  // --- vectors at the pin --------------------------------------------------
  const velScale = (0.4 * params.armLength) / Math.max(state.speed, 1e-9);
  const accScale = (0.4 * params.armLength) / Math.max(state.accelMag, 1e-9);

  const arrow = (
    vx: number,
    vy: number,
    factor: number,
    color: string,
    label: string,
  ): void => {
    const tipX = A.x + vx * factor * scale;
    const tipY = A.y - vy * factor * scale;
    if (Math.hypot(tipX - A.x, tipY - A.y) < 3) return;
    drawArrow(ctx, A.x, A.y, tipX, tipY, color, 2.2, 9);
    const len = Math.hypot(tipX - A.x, tipY - A.y) || 1;
    drawLabelWithSubscript(
      ctx,
      label,
      tipX + ((tipX - A.x) / len) * 16,
      tipY + ((tipY - A.y) / len) * 13,
      color,
    );
  };

  if (visibility.showVelocityParts) {
    arrow(state.vArr.x, state.vArr.y, velScale, colors.transverseVelocity, labels.vArr);
    arrow(state.vRel.x, state.vRel.y, velScale, colors.radialVelocity, labels.vRel);
  }
  if (visibility.showVelocity) {
    arrow(state.vA.x, state.vA.y, velScale, colors.velocity, labels.v);
  }
  if (visibility.showAccelParts) {
    arrow(state.aArr.x, state.aArr.y, accScale, colors.normalAccel, labels.aArr);
    arrow(state.aCor.x, state.aCor.y, accScale, colors.coriolis, labels.aCor);
    arrow(state.aRel.x, state.aRel.y, accScale, colors.energyPE, labels.aRel);
  }
  if (visibility.showAccel) {
    arrow(state.aA.x, state.aA.y, accScale, colors.acceleration, labels.a);
  }
}
