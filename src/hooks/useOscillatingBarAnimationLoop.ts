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
  accelerationTerms,
  computeOscillatingBarState,
} from "@/lib/oscillatingBarKinematics";
import type {
  OscillatingBarParams,
  OscillatingBarState,
  OscillatingBarVisibility,
} from "@/types/simulator";

// ---------------------------------------------------------------------------
// A planar mechanism: O at the origin, B a distance d along +x, and the pin A
// riding on the circle of radius b about O while bar BC pivots about B.
// ---------------------------------------------------------------------------

const METRICS_INTERVAL_MS = 66; // ~15 fps, same gate as the other simulators
/** Simulation seconds per real second — 3 rad/s is brisk on screen. */
const TIME_SCALE = 0.35;

interface Labels {
  pinVelocity: string;
  slide: string;
  across: string;
  pinAccel: string;
  euler: string;
  centripetal: string;
  coriolis: string;
  relative: string;
  omega: string;
  theta: string;
}

interface Screen {
  x: number;
  y: number;
}

export function useOscillatingBarAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: OscillatingBarParams,
  visibility: OscillatingBarVisibility,
  phaseRef: MutableRefObject<number>,
  paused: boolean,
  resetCount: number,
  onMetrics: (state: OscillatingBarState) => void,
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
        pinVelocity: tr("ob.canvas.v_a"),
        slide: tr("ob.canvas.slide"),
        across: tr("ob.canvas.across"),
        pinAccel: tr("ob.canvas.a_a"),
        euler: tr("ob.canvas.euler"),
        centripetal: tr("ob.canvas.centripetal"),
        coriolis: tr("ob.canvas.coriolis"),
        relative: tr("ob.canvas.relative"),
        omega: tr("ob.canvas.omega"),
        theta: tr("ob.canvas.theta"),
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

      if (!paused && dt > 0) phaseRef.current += dt * TIME_SCALE;

      const state = computeOscillatingBarState(
        params,
        params.omega * phaseRef.current,
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

function render(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  params: OscillatingBarParams,
  state: OscillatingBarState,
  visibility: OscillatingBarVisibility,
  colors: ColorPalette,
  labels: Labels,
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  ctx.clearRect(0, 0, W, H);

  const b = params.barLength;
  const d = params.separation;

  const xMin = -1.7 * b;
  const xMax = d + 1.2 * b;
  const yMin = -0.9 * b;
  const yMax = 1.7 * b;
  const scale = Math.min((W * 0.9) / (xMax - xMin), (H * 0.9) / (yMax - yMin));
  const originX = W / 2 - ((xMin + xMax) / 2) * scale;
  const originY = H / 2 + ((yMin + yMax) / 2) * scale;

  const toScreen = (x: number, y: number): Screen => ({
    x: originX + x * scale,
    y: originY - y * scale,
  });

  const O = toScreen(0, 0);
  const B = toScreen(d, 0);
  const A = toScreen(state.ax, state.ay);

  // Unit vectors of the frame attached to BC: û from B toward A, p̂ across it.
  const ux = (state.ax - d) / state.reach;
  const uy = state.ay / state.reach;

  // --- baseline, ground and the circle the pin sweeps ----------------------
  if (visibility.showAngles) {
    ctx.save();
    ctx.strokeStyle = colors.axes;
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.moveTo(O.x, O.y);
    ctx.lineTo(B.x, B.y);
    ctx.stroke();
    ctx.restore();
  }

  if (visibility.showTrace) {
    ctx.save();
    ctx.strokeStyle = colors.trajectory;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(O.x, O.y, b * scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // --- bar BC, running from B through A and out to C -----------------------
  const overshoot = (d + b) * 1.12;
  const C = toScreen(d + ux * overshoot, uy * overshoot);
  ctx.save();
  ctx.strokeStyle = colors.pole;
  ctx.lineWidth = 7;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(B.x, B.y);
  ctx.lineTo(C.x, C.y);
  ctx.stroke();
  ctx.restore();
  drawLabel(ctx, "C", C.x - 12, C.y - 10, colors.pole);

  // --- bar OA --------------------------------------------------------------
  ctx.save();
  ctx.strokeStyle = colors.rVector;
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(O.x, O.y);
  ctx.lineTo(A.x, A.y);
  ctx.stroke();
  ctx.restore();

  // --- the sliding block at A ----------------------------------------------
  const blockAngle = Math.atan2(-uy, ux);
  ctx.save();
  ctx.translate(A.x, A.y);
  ctx.rotate(blockAngle);
  ctx.fillStyle = "rgba(214,150,120,0.75)";
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(-20, -13, 40, 26, 3);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  drawHinge(ctx, O.x, O.y, colors.axes, 1.6);
  drawHinge(ctx, B.x, B.y, colors.axes, 1.6);
  drawDot(ctx, A.x, A.y, 4, colors.point);
  drawLabel(ctx, "O", O.x - 16, O.y - 6, colors.axes);
  drawLabel(ctx, "B", B.x + 18, B.y - 6, colors.axes);
  drawLabel(ctx, "A", A.x + 6, A.y - 22, colors.point);

  // --- the θ and ω arcs ----------------------------------------------------
  if (visibility.showAngles) {
    const arcRadius = Math.min(0.5 * b * scale, 60);
    ctx.save();
    ctx.strokeStyle = colors.axes;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    // From the baseline pointing back toward O, up to the bar. barAngle is a
    // world-space angle; toScreen flips y, so the screen-space bearing of BA
    // is π + barAngle, not π − barAngle.
    ctx.arc(
      B.x,
      B.y,
      arcRadius,
      Math.PI + state.barAngle,
      Math.PI,
      state.barAngle > 0,
    );
    ctx.stroke();
    ctx.restore();
    drawLabel(
      ctx,
      labels.theta,
      B.x - arcRadius - 16,
      B.y - (arcRadius * state.barAngle) / 2 - 6,
      colors.axes,
    );

    const omegaRadius = Math.min(0.42 * b * scale, 52);
    // Trails behind OA's current bearing, so it visibly spins with the crank
    // instead of sitting fixed on screen.
    const crankAngle = Math.atan2(A.y - O.y, A.x - O.x);
    const omegaSweep = Math.PI / 3;
    ctx.save();
    ctx.strokeStyle = colors.rVector;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(O.x, O.y, omegaRadius, crankAngle - omegaSweep, crankAngle);
    ctx.stroke();
    ctx.restore();
    const labelAngle = crankAngle - omegaSweep / 2;
    drawLabel(
      ctx,
      labels.omega,
      O.x + Math.cos(labelAngle) * (omegaRadius + 14),
      O.y + Math.sin(labelAngle) * (omegaRadius + 14),
      colors.rVector,
    );
  }

  // --- vectors at the pin ---------------------------------------------------
  const velScale = (0.42 * b) / Math.max(state.pinSpeed, 1e-9);
  const accScale = (0.5 * b) / Math.max(state.pinAccel, 1e-9);

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

  // v_A is perpendicular to OA, in the sense of ω.
  const vax = -params.omega * state.ay;
  const vay = params.omega * state.ax;

  if (visibility.showVelocityParts) {
    // Split into sliding along BC and swinging across it.
    arrow(
      ux * state.reachRate,
      uy * state.reachRate,
      velScale,
      colors.radialVelocity,
      labels.slide,
    );
    const acrossX = -uy * state.barOmega * state.reach;
    const acrossY = ux * state.barOmega * state.reach;
    arrow(acrossX, acrossY, velScale, colors.transverseVelocity, labels.across);
  }
  if (visibility.showVelocity) {
    arrow(vax, vay, velScale, colors.velocity, labels.pinVelocity);
  }

  if (visibility.showAccelParts) {
    const terms = accelerationTerms(state, params);
    arrow(terms.euler.x, terms.euler.y, accScale, colors.euler, labels.euler);
    arrow(
      terms.centripetal.x,
      terms.centripetal.y,
      accScale,
      colors.normalAccel,
      labels.centripetal,
    );
    arrow(
      terms.coriolis.x,
      terms.coriolis.y,
      accScale,
      colors.coriolis,
      labels.coriolis,
    );
    arrow(
      terms.relative.x,
      terms.relative.y,
      accScale,
      colors.energyPE,
      labels.relative,
    );
  }
  if (visibility.showAccel) {
    arrow(
      -params.omega * params.omega * state.ax,
      -params.omega * params.omega * state.ay,
      accScale,
      colors.acceleration,
      labels.pinAccel,
    );
  }
}
