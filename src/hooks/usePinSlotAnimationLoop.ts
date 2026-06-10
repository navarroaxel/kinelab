"use client";

import {
  useRef,
  useEffect,
  type RefObject,
  type MutableRefObject,
} from "react";
import { computePinSlotState, pinOmega } from "@/lib/pinSlotKinematics";
import {
  drawGrid,
  drawAxes,
  drawLabel,
  drawDot,
  drawArrow,
  drawHinge,
  drawAngleArc,
  pinSlotScale,
  worldToScreenPS,
  COLORS,
  COLORS_DARK,
  type ColorPalette,
} from "@/lib/drawing";
import type {
  PinSlotParams,
  PinSlotState,
  PinSlotVisibility,
} from "@/types/simulator";

export function usePinSlotAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: PinSlotParams,
  visibility: PinSlotVisibility,
  phiRef: MutableRefObject<number>,
  onMetrics: (state: PinSlotState) => void,
  paused: boolean,
  resetCount: number,
): void {
  const lastTimeRef = useRef<number | null>(null);
  const rafIdRef = useRef<number>(0);
  const lastMetricUpdate = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (paused) {
      const colors: ColorPalette = document.documentElement.classList.contains(
        "dark",
      )
        ? COLORS_DARK
        : COLORS;
      const state = computePinSlotState(params, phiRef.current);
      renderPinSlot(ctx, canvas, state, params, visibility, colors);
      onMetrics(state);
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
        // Semi-implicit Euler: phi advances at constant rate (V0 is constant)
        phiRef.current += pinOmega(params) * dt;
        // Normalise to [0, 2π) to avoid long-run floating-point drift
        phiRef.current = phiRef.current % (2 * Math.PI);
        if (phiRef.current < 0) phiRef.current += 2 * Math.PI;
      }

      const state = computePinSlotState(params, phiRef.current);
      renderPinSlot(ctx!, canvas!, state, params, visibility, colors);

      if (now - lastMetricUpdate.current > 66) {
        onMetrics(state);
        lastMetricUpdate.current = now;
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

function renderPinSlot(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  state: PinSlotState,
  params: PinSlotParams,
  visibility: PinSlotVisibility,
  colors: ColorPalette,
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  ctx.clearRect(0, 0, W, H);

  const scale = pinSlotScale(W, params.d, params.r);

  // Convenience: screen coords helper
  const sc = (wx: number, wy: number) => worldToScreenPS(wx, wy, W, H, scale);

  const oSc = sc(0, 0); // pivot O
  const aSc = sc(params.d, 0); // slot center A
  const bSc = sc(state.bx, state.by); // pin B

  // Bar extended to C (beyond B along OB direction)
  const cLen = (params.d + params.r) * 1.35;
  const cSc = sc(cLen * Math.cos(state.theta), cLen * Math.sin(state.theta));

  // ── Background ────────────────────────────────────────────────────────────
  drawGrid(ctx, W, H, 20, colors.grid);
  drawAxes(ctx, oSc.x, oSc.y, W, H, colors.axes);
  drawLabel(ctx, "x", W - 12, oSc.y - 10, colors.axes);
  drawLabel(ctx, "y", oSc.x + 10, 12, colors.axes);

  // ── Fixed circular slot ───────────────────────────────────────────────────
  ctx.save();
  ctx.strokeStyle = colors.ring;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(aSc.x, aSc.y, params.r * scale, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.restore();

  // ── Bar OC ────────────────────────────────────────────────────────────────
  ctx.save();
  ctx.strokeStyle = colors.normalForce;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(oSc.x, oSc.y);
  ctx.lineTo(cSc.x, cSc.y);
  ctx.stroke();
  ctx.restore();

  // ── Rho segment O→B (dashed, toggleable) ─────────────────────────────────
  if (visibility.showRho) {
    ctx.save();
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = colors.rVector;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.moveTo(oSc.x, oSc.y);
    ctx.lineTo(bSc.x, bSc.y);
    ctx.stroke();
    ctx.restore();
    drawLabel(
      ctx,
      "ρ",
      (oSc.x + bSc.x) / 2 - 10,
      (oSc.y + bSc.y) / 2 - 8,
      colors.rVector,
    );
  }

  // ── Angle arcs (toggleable) ───────────────────────────────────────────────
  if (visibility.showAngles) {
    // Phi arc at A: from screen 0 (right) to direction A→B
    const phiScreen = Math.atan2(bSc.y - aSc.y, bSc.x - aSc.x);
    drawAngleArc(
      ctx,
      aSc.x,
      aSc.y,
      params.r * scale * 0.45,
      0,
      phiScreen,
      colors.radialVelocity,
      "Φ",
    );

    // Theta arc at O: from screen 0 (right) to direction O→B
    const thetaScreen = Math.atan2(bSc.y - oSc.y, bSc.x - oSc.x);
    drawAngleArc(
      ctx,
      oSc.x,
      oSc.y,
      params.d * scale * 0.28,
      0,
      thetaScreen,
      colors.acceleration,
      "θ",
    );
  }

  // ── Velocity vectors at B ─────────────────────────────────────────────────
  // Scale: vectors proportional to speed, so V0 appears as ~20% of rho_max in pixels
  const rhoMax = params.d + params.r;
  const vScale = (rhoMax * scale * 0.25) / Math.max(params.v0, 0.01);

  if (visibility.showV0) {
    // Tangent to slot circle at B: world = (-sin Phi, cos Phi)
    const tx = -Math.sin(state.phi);
    const ty = Math.cos(state.phi);
    const v0End = {
      x: bSc.x + params.v0 * vScale * tx,
      y: bSc.y - params.v0 * vScale * ty, // screen Y flipped
    };
    drawArrow(ctx, bSc.x, bSc.y, v0End.x, v0End.y, colors.velocity, 2);
    drawLabel(ctx, "V₀", v0End.x + 6, v0End.y - 6, colors.velocity);
  }

  if (visibility.showVr) {
    // Along bar direction: world = (cos theta, sin theta)
    const vrEnd = {
      x: bSc.x + state.vr * vScale * Math.cos(state.theta),
      y: bSc.y - state.vr * vScale * Math.sin(state.theta),
    };
    drawArrow(ctx, bSc.x, bSc.y, vrEnd.x, vrEnd.y, colors.radialVelocity, 2);
    drawLabel(ctx, "Vᵣ", vrEnd.x + 6, vrEnd.y - 6, colors.radialVelocity);
  }

  if (visibility.showVPerp) {
    // Perpendicular to bar: world = (-sin theta, cos theta) × sign(omega)
    const sign = state.omega >= 0 ? 1 : -1;
    const perpEnd = {
      x: bSc.x + Math.abs(state.vPerp) * vScale * -Math.sin(state.theta) * sign,
      y: bSc.y - Math.abs(state.vPerp) * vScale * Math.cos(state.theta) * sign,
    };
    drawArrow(
      ctx,
      bSc.x,
      bSc.y,
      perpEnd.x,
      perpEnd.y,
      colors.transverseVelocity,
      2,
    );
    drawLabel(
      ctx,
      "V⊥",
      perpEnd.x + 6,
      perpEnd.y - 6,
      colors.transverseVelocity,
    );
  }

  // ── Markers (drawn last so they appear on top) ────────────────────────────
  drawHinge(ctx, oSc.x, oSc.y, colors.center);
  drawLabel(ctx, "O", oSc.x - 14, oSc.y - 14, colors.center);

  drawDot(ctx, aSc.x, aSc.y, 5, colors.center);
  drawLabel(ctx, "A", aSc.x + 8, aSc.y - 10, colors.center);

  drawDot(ctx, bSc.x, bSc.y, 9, colors.point, "#fff");
  drawLabel(ctx, "B", bSc.x + 12, bSc.y - 10, colors.point);
}
