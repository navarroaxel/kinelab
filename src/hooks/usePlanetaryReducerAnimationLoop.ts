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
import { computePlanetaryReducerState } from "@/lib/planetaryReducerKinematics";
import type {
  PlanetaryReducerParams,
  PlanetaryReducerState,
  PlanetaryReducerVisibility,
} from "@/types/simulator";

// ---------------------------------------------------------------------------
// Planar, centred on the sun's axis. The ring is drawn a little beyond its
// inner radius so it reads as a fixed housing.
// ---------------------------------------------------------------------------

const METRICS_INTERVAL_MS = 66; // ~15 fps, same gate as the other simulators
const RING_THICKNESS = 0.12; // fraction of r_E
const PLANET_NAMES = ["B", "C", "D"];

interface Labels {
  vJ: string;
  vO: string;
  cir: string;
  ring: string;
}

export function usePlanetaryReducerAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: PlanetaryReducerParams,
  visibility: PlanetaryReducerVisibility,
  phaseRef: MutableRefObject<number>,
  timeScale: number,
  paused: boolean,
  resetCount: number,
  onMetrics: (state: PlanetaryReducerState) => void,
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
        vJ: tr("pr.canvas.v_j"),
        vO: tr("pr.canvas.v_o"),
        cir: tr("pr.canvas.cir"),
        ring: tr("pr.canvas.ring"),
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

      // phaseRef holds *physical* seconds, so changing the slow-motion factor
      // mid-run changes the pace without jumping the mechanism.
      if (!paused && dt > 0) phaseRef.current += dt * timeScale;

      const state = computePlanetaryReducerState(params, phaseRef.current);

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
  }, [params, visibility, timeScale, paused, resetCount]); // eslint-disable-line react-hooks/exhaustive-deps
}

function circle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
): void {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
}

function render(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  params: PlanetaryReducerParams,
  state: PlanetaryReducerState,
  visibility: PlanetaryReducerVisibility,
  colors: ColorPalette,
  labels: Labels,
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  ctx.clearRect(0, 0, W, H);

  const { sunRadius: rA, planetRadius: r } = params;
  const rE = state.ringRadius;
  const rOuter = rE * (1 + RING_THICKNESS);
  const scale = (Math.min(W, H) * 0.47) / rOuter;
  const cx = W / 2;
  const cy = H / 2;

  // y up in the world, down on screen.
  const toScreen = (p: { x: number; y: number }) => ({
    x: cx + p.x * scale,
    y: cy - p.y * scale,
  });
  // An absolute CCW angle becomes −angle on screen.
  const markEnd = (
    c: { x: number; y: number },
    radius: number,
    angle: number,
  ) => ({
    x: c.x + radius * scale * Math.cos(angle),
    y: c.y - radius * scale * Math.sin(angle),
  });

  // --- fixed ring E ----------------------------------------------------------
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, rOuter * scale, 0, Math.PI * 2);
  ctx.arc(cx, cy, rE * scale, 0, Math.PI * 2, true);
  ctx.fillStyle = colors.grid;
  ctx.globalAlpha = 0.5;
  ctx.fill("evenodd");
  ctx.globalAlpha = 1;
  ctx.clip("evenodd");
  // Hatching: the standard "this is fixed" convention.
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.5;
  const reach = rOuter * scale;
  for (let k = -reach; k < reach; k += 7) {
    ctx.beginPath();
    ctx.moveTo(cx + k - reach, cy + reach);
    ctx.lineTo(cx + k + reach, cy - reach);
    ctx.stroke();
  }
  ctx.restore();
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 2;
  circle(ctx, cx, cy, rE * scale);
  ctx.stroke();
  ctx.restore();
  drawLabel(ctx, labels.ring, cx - rOuter * scale * 0.72, cy - rOuter * scale * 0.78, colors.axes);

  // --- carrier arm -----------------------------------------------------------
  if (visibility.showCarrier) {
    ctx.save();
    ctx.strokeStyle = colors.trajectory;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.globalAlpha = 0.7;
    for (const c of state.centers) {
      const p = toScreen(c);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
    ctx.restore();
  }

  // --- sun A -----------------------------------------------------------------
  ctx.save();
  ctx.fillStyle = colors.pole;
  ctx.globalAlpha = 0.25;
  circle(ctx, cx, cy, rA * scale);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = colors.pole;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.restore();
  drawHinge(ctx, cx, cy, colors.axes, 1.2);
  drawLabel(ctx, "A", cx - 14, cy + 22, colors.pole);
  if (visibility.showMarks) {
    const end = markEnd({ x: cx, y: cy }, rA, state.sunAngle);
    ctx.save();
    ctx.strokeStyle = colors.pole;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    ctx.restore();
  }

  // --- planets B, C, D -------------------------------------------------------
  state.centers.forEach((c, i) => {
    const p = toScreen(c);
    ctx.save();
    ctx.fillStyle = colors.rVector;
    ctx.globalAlpha = 0.25;
    circle(ctx, p.x, p.y, r * scale);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = colors.rVector;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();
    if (visibility.showMarks) {
      // Same absolute spin for all three; each planet starts a third of a turn apart.
      const end = markEnd(p, r, state.planetSpin);
      ctx.save();
      ctx.strokeStyle = colors.rVector;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
      ctx.restore();
    }
    drawHinge(ctx, p.x, p.y, colors.axes, 1);
    drawLabel(ctx, PLANET_NAMES[i], p.x - 4, p.y - r * scale - 10, colors.rVector);
  });

  // --- planet B: J, O, CIR and the velocities --------------------------------
  const O = toScreen(state.centers[0]);
  const J = toScreen(state.contactSun[0]);
  const K = toScreen(state.contactRing[0]);

  drawDot(ctx, J.x, J.y, 4, colors.point);
  drawLabel(ctx, "J", J.x - 8, J.y + 16, colors.point);
  drawLabel(ctx, "O", O.x + 10, O.y + 16, colors.rVector);

  if (visibility.showVelocity) {
    const vMax = Math.max(Math.abs(state.vJ), 1e-9);
    const k = (0.45 * rE * scale) / vMax; // px per (m/s), shared so v_O is visibly half of v_J
    const arrow = (
      origin: { x: number; y: number },
      v: { x: number; y: number },
      label: string,
    ) => {
      const tip = { x: origin.x + v.x * k, y: origin.y - v.y * k };
      if (Math.hypot(tip.x - origin.x, tip.y - origin.y) < 3) return;
      drawArrow(ctx, origin.x, origin.y, tip.x, tip.y, colors.velocity, 2.4, 9);
      const len = Math.hypot(tip.x - origin.x, tip.y - origin.y) || 1;
      drawLabelWithSubscript(
        ctx,
        label,
        tip.x + ((tip.x - origin.x) / len) * 16,
        tip.y + ((tip.y - origin.y) / len) * 13,
        colors.velocity,
      );
    };
    arrow(J, state.vJVec[0], labels.vJ);
    arrow(O, state.vOVec[0], labels.vO);
  }

  // The planet's contact with the fixed ring has zero velocity: this is the
  // whole solution, so it gets the loudest marker on the canvas.
  if (visibility.showCenter) {
    ctx.save();
    ctx.strokeStyle = colors.contactLost;
    ctx.lineWidth = 2;
    circle(ctx, K.x, K.y, 10);
    ctx.stroke();
    ctx.restore();
    drawDot(ctx, K.x, K.y, 5, colors.contactLost);
    drawLabel(
      ctx,
      labels.cir,
      K.x + (K.x >= cx ? 24 : -24),
      K.y - 14,
      colors.contactLost,
      true,
    );
  }
}
