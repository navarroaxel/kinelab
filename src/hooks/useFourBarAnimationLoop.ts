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
  computeFourBarInstant,
  computeFourBarState,
  fourBarLimits,
  fourBarPivotA,
} from "@/lib/fourBarKinematics";
import type {
  FourBarParams,
  FourBarState,
  FourBarVisibility,
} from "@/types/simulator";

// ---------------------------------------------------------------------------
// A planar linkage, metres: D at the origin, A the other fixed pin. The scene
// is fitted to everything the joints can reach over the whole swing, so the
// scale doesn't jump while the crank runs.
// ---------------------------------------------------------------------------

const METRICS_INTERVAL_MS = 66; // ~15 fps, same gate as the other simulators
const TRACE_SAMPLES = 64;
/** A fully rotating crank has no stops; sample a whole turn instead. */
const FULL_TURN = Math.PI * 2;

interface Labels {
  vB: string;
  vC: string;
  vE: string;
  aB: string;
  aC: string;
  aE: string;
  cir: string;
}

interface Screen {
  x: number;
  y: number;
}

export function useFourBarAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: FourBarParams,
  visibility: FourBarVisibility,
  phaseRef: MutableRefObject<number>,
  paused: boolean,
  resetCount: number,
  onMetrics: (state: FourBarState) => void,
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
        vB: tr("fb.canvas.v_b"),
        vC: tr("fb.canvas.v_c"),
        vE: tr("fb.canvas.v_e"),
        aB: tr("fb.canvas.a_b"),
        aC: tr("fb.canvas.a_c"),
        aE: tr("fb.canvas.a_e"),
        cir: tr("fb.canvas.cir"),
      };
    }

    // The swing never changes while params don't, so sample it once.
    const swing = sampleSwing(params);

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

      const state = computeFourBarState(params, phaseRef.current);

      render(
        ctx!,
        canvas!,
        swing,
        state,
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

interface Swing {
  tracePoints: { x: number; y: number }[]; // path of E over the swing
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

/** Path of E and a bounding box covering every joint across the whole swing. */
function sampleSwing(params: FourBarParams): Swing {
  const limits = fourBarLimits(params);
  const lo = limits ? limits.alphaMin : 0;
  const hi = limits ? limits.alphaMax : FULL_TURN;
  const A = fourBarPivotA(params);

  const xs = [0, A.x];
  const ys = [0, A.y];
  const tracePoints: { x: number; y: number }[] = [];
  for (let i = 0; i <= TRACE_SAMPLES; i++) {
    const alpha = lo + ((hi - lo) * i) / TRACE_SAMPLES;
    const s = computeFourBarInstant(alpha, params.omegaCD, params);
    tracePoints.push(s.E);
    xs.push(s.B.x, s.C.x);
    ys.push(s.B.y, s.C.y);
  }
  const pad = 0.15 * params.rockerLen;
  return {
    tracePoints,
    xMin: Math.min(...xs) - pad,
    xMax: Math.max(...xs) + pad,
    yMin: Math.min(...ys) - pad,
    yMax: Math.max(...ys) + pad,
  };
}

function bar(
  ctx: CanvasRenderingContext2D,
  from: Screen,
  to: Screen,
  color: string,
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
  ctx.restore();
}

function render(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  swing: Swing,
  state: FourBarState,
  visibility: FourBarVisibility,
  colors: ColorPalette,
  labels: Labels,
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  ctx.clearRect(0, 0, W, H);

  const { xMin, xMax, yMin, yMax } = swing;
  // The CIR can sit far outside the swing; it is clipped by the canvas rather
  // than allowed to shrink the scene.
  const scale = Math.min((W * 0.88) / (xMax - xMin), (H * 0.88) / (yMax - yMin));
  const originX = W / 2 - ((xMin + xMax) / 2) * scale;
  const originY = H / 2 + ((yMin + yMax) / 2) * scale;

  const toScreen = (x: number, y: number): Screen => ({
    x: originX + x * scale,
    y: originY - y * scale,
  });

  const D = toScreen(state.D.x, state.D.y);
  const C = toScreen(state.C.x, state.C.y);
  const B = toScreen(state.B.x, state.B.y);
  const A = toScreen(state.A.x, state.A.y);
  const E = toScreen(state.E.x, state.E.y);

  // --- ground line through the two fixed pins -------------------------------
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 1;
  ctx.setLineDash([2, 4]);
  ctx.beginPath();
  ctx.moveTo(A.x, A.y);
  ctx.lineTo(D.x, D.y);
  ctx.stroke();
  ctx.restore();

  // --- trace of E over the swing --------------------------------------------
  if (visibility.showTrace) {
    ctx.save();
    ctx.strokeStyle = colors.trajectory;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    swing.tracePoints.forEach((p, i) => {
      const s = toScreen(p.x, p.y);
      if (i === 0) ctx.moveTo(s.x, s.y);
      else ctx.lineTo(s.x, s.y);
    });
    ctx.stroke();
    ctx.restore();
  }

  // --- CIR of BC and the two perpendiculars that locate it -------------------
  if (visibility.showCenter && state.cir) {
    const P = toScreen(state.cir.x, state.cir.y);
    ctx.save();
    ctx.strokeStyle = colors.coriolis;
    ctx.lineWidth = 1.2;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(C.x, C.y);
    ctx.lineTo(P.x, P.y);
    ctx.moveTo(B.x, B.y);
    ctx.lineTo(P.x, P.y);
    ctx.stroke();
    ctx.restore();
    drawDot(ctx, P.x, P.y, 4, colors.coriolis);
    drawLabel(ctx, labels.cir, P.x + 14, P.y - 8, colors.coriolis);
  }

  // --- the three bars -------------------------------------------------------
  bar(ctx, D, C, colors.pole);
  bar(ctx, C, B, colors.rVector);
  bar(ctx, B, A, colors.pole);

  drawHinge(ctx, D.x, D.y, colors.axes, 1.6);
  drawHinge(ctx, A.x, A.y, colors.axes, 1.6);
  drawDot(ctx, C.x, C.y, 4, colors.axes);
  drawDot(ctx, B.x, B.y, 4, colors.axes);
  drawDot(ctx, E.x, E.y, 4, colors.point);
  drawLabel(ctx, "D", D.x + 14, D.y + 14, colors.axes);
  drawLabel(ctx, "A", A.x - 14, A.y + 14, colors.axes);
  drawLabel(ctx, "C", C.x + 12, C.y - 10, colors.axes);
  drawLabel(ctx, "B", B.x - 12, B.y - 10, colors.axes);
  drawLabel(ctx, "E", E.x, E.y - 14, colors.point);

  // --- vectors --------------------------------------------------------------
  const maxSpeed = Math.max(
    Math.hypot(state.vB.x, state.vB.y),
    Math.hypot(state.vC.x, state.vC.y),
    Math.hypot(state.vE.x, state.vE.y),
    1e-9,
  );
  const maxAccel = Math.max(
    Math.hypot(state.aB.x, state.aB.y),
    Math.hypot(state.aC.x, state.aC.y),
    Math.hypot(state.aE.x, state.aE.y),
    1e-9,
  );
  // Longest arrow ≈ 30% of the scene, so speeds and accelerations are each
  // normalised against their own peak (they have different units).
  const refLen = 0.3 * Math.max(xMax - xMin, yMax - yMin);
  const velScale = refLen / maxSpeed;
  const accScale = refLen / maxAccel;

  const arrow = (
    from: Screen,
    vx: number,
    vy: number,
    factor: number,
    color: string,
    label: string,
  ): void => {
    const tipX = from.x + vx * factor * scale;
    const tipY = from.y - vy * factor * scale;
    const len = Math.hypot(tipX - from.x, tipY - from.y);
    if (len < 3) return;
    drawArrow(ctx, from.x, from.y, tipX, tipY, color, 2.2, 9);
    drawLabelWithSubscript(
      ctx,
      label,
      tipX + ((tipX - from.x) / len) * 16,
      tipY + ((tipY - from.y) / len) * 13,
      color,
    );
  };

  if (visibility.showVelocity) {
    arrow(C, state.vC.x, state.vC.y, velScale, colors.transverseVelocity, labels.vC);
    arrow(B, state.vB.x, state.vB.y, velScale, colors.radialVelocity, labels.vB);
    arrow(E, state.vE.x, state.vE.y, velScale, colors.velocity, labels.vE);
  }
  if (visibility.showAccel) {
    arrow(C, state.aC.x, state.aC.y, accScale, colors.normalAccel, labels.aC);
    arrow(B, state.aB.x, state.aB.y, accScale, colors.energyPE, labels.aB);
    arrow(E, state.aE.x, state.aE.y, accScale, colors.acceleration, labels.aE);
  }
}
