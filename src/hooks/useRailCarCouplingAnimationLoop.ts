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
  speed1DuringCoupling,
  speed2DuringCoupling,
} from "@/lib/railCarCouplingKinematics";
import type {
  RailCarCouplingParams,
  RailCarCouplingState,
  RailCarCouplingVisibility,
} from "@/types/simulator";

// Fixed screen speed for the approach/depart legs — real rail-car speeds
// (well under 1 m/s here) would be imperceptible on a small canvas. The
// coupling leg's speed ramps by the *real* v_f/v1 ratio, so the slowdown
// you see is physically proportioned even though the absolute scale isn't.
const APPROACH_PX_S = 70;
const APPROACH_DURATION = 1.6;
const DEPART_DURATION = 1.6;

export function useRailCarCouplingAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: RailCarCouplingParams,
  state: RailCarCouplingState,
  visibility: RailCarCouplingVisibility,
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
        force: translateRef.current("rail-car-coupling.canvas.force"),
        coupling: translateRef.current("rail-car-coupling.canvas.coupling"),
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
        phaseRef.current += dt;
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

function render(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  params: RailCarCouplingParams,
  state: RailCarCouplingState,
  visibility: RailCarCouplingVisibility,
  phase: number,
  colors: ColorPalette,
  labels: { force: string; coupling: string },
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  ctx.clearRect(0, 0, W, H);

  const trackY = H * 0.55;
  const car1W = 60;
  const car1H = 34;
  const car2W = 74;
  const car2H = 40;
  const contactX = W * 0.5;

  const couplingTime = Math.max(params.couplingTime, 0.001);
  const totalCycle = APPROACH_DURATION + couplingTime + DEPART_DURATION;
  const t = ((phase % totalCycle) + totalCycle) % totalCycle;

  const speedRatio =
    state.speed1 > 0 ? state.finalSpeed / state.speed1 : 0;

  let car1X: number;
  let car2X: number;
  let v1Display: number;
  let v2Display: number;
  let inCoupling = false;

  if (t < APPROACH_DURATION) {
    car1X = contactX - car1W - APPROACH_PX_S * (APPROACH_DURATION - t);
    car2X = contactX;
    v1Display = state.speed1;
    v2Display = 0;
  } else if (t < APPROACH_DURATION + couplingTime) {
    inCoupling = true;
    const tc = t - APPROACH_DURATION;
    const frac = tc / couplingTime;
    // Integral of the linear speed ramp (1 → speedRatio) up to `tc`.
    const coupledDisplacement =
      APPROACH_PX_S * (tc + ((speedRatio - 1) * tc * frac) / 2);
    car1X = contactX - car1W + coupledDisplacement;
    car2X = contactX + coupledDisplacement;
    v1Display = speed1DuringCoupling(
      tc,
      state.speed1,
      state.finalSpeed,
      couplingTime,
    );
    v2Display = speed2DuringCoupling(tc, state.finalSpeed, couplingTime);
  } else {
    const td = t - APPROACH_DURATION - couplingTime;
    const couplingTotalDisplacement =
      (APPROACH_PX_S * couplingTime * (1 + speedRatio)) / 2;
    const departDisplacement = APPROACH_PX_S * speedRatio * td;
    car1X =
      contactX - car1W + couplingTotalDisplacement + departDisplacement;
    car2X = contactX + couplingTotalDisplacement + departDisplacement;
    v1Display = state.finalSpeed;
    v2Display = state.finalSpeed;
  }

  // Track
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, trackY + car1H / 2 + 6);
  ctx.lineTo(W, trackY + car1H / 2 + 6);
  ctx.stroke();
  ctx.restore();

  // Car 1 (moving car)
  ctx.save();
  ctx.fillStyle = colors.rVector;
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(car1X, trackY - car1H / 2, car1W, car1H, 5);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Car 2 (initially stationary car)
  ctx.save();
  ctx.fillStyle = colors.point;
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(car2X, trackY - car2H / 2, car2W, car2H, 5);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  if (visibility.showVelocityLabels) {
    drawLabel(
      ctx,
      `${(v1Display * 3.6).toFixed(2)} km/h`,
      car1X + car1W / 2,
      trackY - car1H / 2 - 12,
      colors.rVector,
    );
    drawLabel(
      ctx,
      `${(v2Display * 3.6).toFixed(2)} km/h`,
      car2X + car2W / 2,
      trackY - car2H / 2 - 12,
      colors.point,
    );
  }

  if (visibility.showForces && inCoupling) {
    // Pushed well above the velocity readouts and car boxes so the arrows
    // and labels never overlap them.
    const midY = trackY - Math.max(car1H, car2H) / 2 - 64;
    drawArrow(ctx, car1X + car1W + 4, midY, car1X + car1W - 14, midY, colors.acceleration, 2);
    drawArrow(ctx, car2X - 4, midY + 14, car2X + 14, midY + 14, colors.normalAccel, 2);
    drawLabelWithSubscript(
      ctx,
      `${labels.force} ≈ ${(state.avgForce / 1000).toFixed(2)} kN`,
      (car1X + car1W + car2X) / 2,
      midY - 14,
      colors.acceleration,
    );
    drawLabel(ctx, labels.coupling, (car1X + car1W + car2X) / 2, midY + 28, colors.axes);
  }
}
