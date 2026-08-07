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
  COLORS,
  COLORS_DARK,
  type ColorPalette,
} from "@/lib/drawing";
import type {
  VehiclePowerParams,
  VehiclePowerState,
  VehiclePowerVisibility,
} from "@/types/simulator";

// The car scrolls at a fixed screen speed for legibility — the real speeds
// (60-90 km/h) would cross this small canvas in a fraction of a second.
const DRIVE_SPEED_PX_S = 34;

// Drawn steeper than most real grades (5° here) so the incline reads clearly
// on a small canvas — purely illustrative, the actual angle used in the
// physics comes from params.gradeDeg, not this constant.
const DRAWN_INCLINE_DEG = 18;

export function useVehiclePowerAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: VehiclePowerParams,
  state: VehiclePowerState,
  visibility: VehiclePowerVisibility,
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
        flat: translateRef.current("vehicle-power.canvas.flat"),
        slope: translateRef.current("vehicle-power.canvas.slope"),
        drive: translateRef.current("vehicle-power.canvas.drive"),
        resist: translateRef.current("vehicle-power.canvas.resist"),
        grade: translateRef.current("vehicle-power.canvas.grade"),
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
        phaseRef.current += DRIVE_SPEED_PX_S * dt;
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

function drawCar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  colors: ColorPalette,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = colors.point;
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(-20, -10, 40, 16, 4);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = colors.axes;
  ctx.beginPath();
  ctx.arc(-11, 8, 5, 0, 2 * Math.PI);
  ctx.arc(11, 8, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
}

function render(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  params: VehiclePowerParams,
  state: VehiclePowerState,
  visibility: VehiclePowerVisibility,
  phase: number,
  colors: ColorPalette,
  labels: {
    flat: string;
    slope: string;
    drive: string;
    resist: string;
    grade: string;
  },
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  ctx.clearRect(0, 0, W, H);

  const marginX = W * 0.06;
  const roadLen = W - 2 * marginX;

  // --- Flat lane -----------------------------------------------------
  const flatY = H * 0.28;
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(marginX, flatY);
  ctx.lineTo(marginX + roadLen, flatY);
  ctx.stroke();
  ctx.restore();

  const flatX = marginX + ((phase % roadLen) + roadLen) % roadLen;
  drawCar(ctx, flatX, flatY - 10, 0, colors);
  drawLabel(
    ctx,
    `${labels.flat}: ${params.targetSpeedKmh} km/h`,
    marginX + roadLen / 2,
    flatY - 58,
    colors.point,
  );
  drawLabel(
    ctx,
    `P ≈ ${(state.targetPowerFlat / 1000).toFixed(2)} kW`,
    marginX + roadLen / 2,
    flatY - 44,
    colors.point,
  );

  if (visibility.showForces) {
    drawArrow(ctx, flatX + 26, flatY - 10, flatX + 44, flatY - 10, colors.velocity, 2);
    drawLabel(ctx, labels.drive, flatX + 60, flatY - 22, colors.velocity);
    drawArrow(ctx, flatX - 26, flatY - 10, flatX - 44, flatY - 10, colors.acceleration, 2);
    drawLabel(ctx, labels.resist, flatX - 78, flatY - 22, colors.acceleration);
  }

  // --- Inclined lane ---------------------------------------------------
  const inclineRad = (DRAWN_INCLINE_DEG * Math.PI) / 180;
  const inclineBottom = { x: marginX, y: H * 0.88 };
  const inclineTop = {
    x: marginX + roadLen * Math.cos(inclineRad),
    y: inclineBottom.y - roadLen * Math.sin(inclineRad),
  };

  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(inclineBottom.x, inclineBottom.y);
  ctx.lineTo(inclineTop.x, inclineTop.y);
  ctx.stroke();
  ctx.restore();

  const d = ((phase % roadLen) + roadLen) % roadLen;
  const carX = inclineBottom.x + d * Math.cos(inclineRad);
  const carY = inclineBottom.y - d * Math.sin(inclineRad);
  drawCar(ctx, carX, carY - 10, -inclineRad, colors);

  const labelX = (inclineBottom.x + inclineTop.x) / 2;
  const labelY = Math.min(inclineBottom.y, inclineTop.y) - 34;
  drawLabel(
    ctx,
    `${labels.slope}: ${params.slopeSpeedKmh} km/h, ${params.gradeDeg}°`,
    labelX,
    labelY,
    colors.point,
  );
  drawLabel(
    ctx,
    `P ≈ ${(state.targetPowerSlope / 1000).toFixed(2)} kW`,
    labelX,
    labelY + 14,
    colors.point,
  );

  if (visibility.showForces) {
    const ux = Math.cos(inclineRad);
    const uy = -Math.sin(inclineRad);
    drawArrow(
      ctx,
      carX + ux * 26,
      carY + uy * 26 - 10,
      carX + ux * 44,
      carY + uy * 44 - 10,
      colors.velocity,
      2,
    );
    drawArrow(
      ctx,
      carX - ux * 26,
      carY - uy * 26 - 10,
      carX - ux * 44,
      carY - uy * 44 - 10,
      colors.acceleration,
      2,
    );
    if (visibility.showGradeForce) {
      drawArrow(
        ctx,
        carX - ux * 46,
        carY - uy * 46 - 10,
        carX - ux * 68,
        carY - uy * 68 - 10,
        colors.normalAccel,
        2,
      );
      drawLabel(
        ctx,
        labels.grade,
        carX - ux * 68 - 12,
        carY - uy * 68 - 22,
        colors.normalAccel,
      );
    }
  }
}
