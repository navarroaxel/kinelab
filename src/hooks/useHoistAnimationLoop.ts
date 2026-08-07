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
import { COUNTERWEIGHT_SPEED_RATIO } from "@/lib/hoistKinematics";
import type { HoistParams, HoistState, HoistVisibility } from "@/types/simulator";

// The load scrolls at a fixed screen speed for legibility — the real
// lifting speed (2 m/s in the default problem) would cross this small
// canvas in well under a second, too fast to read. The counterweight moves
// at exactly twice this rate (COUNTERWEIGHT_SPEED_RATIO), same as physically.
const RISE_SPEED_PX_S = 26;

export function useHoistAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: HoistParams,
  state: HoistState,
  visibility: HoistVisibility,
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

    const labels = {
      pElec: translateRef.current("hoist.canvas.p_elec"),
      pMech: translateRef.current("hoist.canvas.p_mech"),
      motor: translateRef.current("hoist.canvas.motor_short"),
      wattmeter: translateRef.current("hoist.canvas.wattmeter_short"),
      notPossible: translateRef.current("hoist.canvas.warn.not_possible"),
    };

    if (paused) {
      const colors: ColorPalette = document.documentElement.classList.contains(
        "dark",
      )
        ? COLORS_DARK
        : COLORS;
      render(ctx, canvas, params, state, visibility, phaseRef.current, colors, labels);
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
        phaseRef.current += RISE_SPEED_PX_S * dt;
      }

      render(
        ctx!,
        canvas!,
        params,
        state,
        visibility,
        phaseRef.current,
        colors,
        labels,
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
  params: HoistParams,
  state: HoistState,
  visibility: HoistVisibility,
  phase: number,
  colors: ColorPalette,
  labels: {
    pElec: string;
    pMech: string;
    motor: string;
    wattmeter: string;
    notPossible: string;
  },
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  ctx.clearRect(0, 0, W, H);

  const groundY = H * 0.92;
  const motor = { x: W * 0.22, y: groundY - 14 };
  const wattmeter = { x: W * 0.08, y: groundY - 16 };
  const fixedPulley = { x: W * 0.46, y: H * 0.1 };
  // The ground-level pulley that redirects the motor's cable: horizontally
  // aligned with the motor (same y), vertically aligned with the fixed
  // pulley up on the ceiling (same x) — exactly as in the source diagram.
  const motorPulley = { x: fixedPulley.x, y: motor.y };
  const ceilingAnchor = { x: W * 0.82, y: H * 0.06 };
  const movablePulley = { x: W * 0.66, y: H * 0.38 };
  const counterweightHeight = H * 0.12;
  const counterweightTravelTop = fixedPulley.y + 20;
  const counterweightTravelBottom = motorPulley.y - 20 - counterweightHeight;
  const counterweightTravel =
    counterweightTravelBottom - counterweightTravelTop;
  const counterweightTopY =
    counterweightTravelTop +
    (visibility.showLoad
      ? (phase * COUNTERWEIGHT_SPEED_RATIO) % counterweightTravel
      : 0);
  const counterweightBottomY = counterweightTopY + counterweightHeight;

  // Ground
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W * 0.02, groundY);
  ctx.lineTo(W * 0.96, groundY);
  ctx.stroke();
  ctx.restore();

  // Wattmeter B: a small dial box, wired to the motor
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(wattmeter.x + 14, wattmeter.y + 6);
  ctx.quadraticCurveTo(motor.x - 30, wattmeter.y + 24, motor.x - 20, motor.y + 6);
  ctx.stroke();
  ctx.beginPath();
  ctx.roundRect(wattmeter.x - 14, wattmeter.y - 12, 28, 22, 3);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(wattmeter.x, wattmeter.y, 7, Math.PI * 0.75, Math.PI * 0.25);
  ctx.stroke();
  ctx.restore();
  drawLabel(ctx, labels.wattmeter, wattmeter.x, wattmeter.y - 22, colors.axes);

  // Motor A
  ctx.save();
  ctx.fillStyle = colors.center;
  ctx.beginPath();
  ctx.arc(motor.x, motor.y, 16, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
  drawLabel(ctx, labels.motor, motor.x, motor.y, "#fff");

  // Fixed pulley bracket, top-left
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(fixedPulley.x, fixedPulley.y - 16);
  ctx.lineTo(fixedPulley.x - 14, fixedPulley.y - 16);
  ctx.lineTo(fixedPulley.x - 14, fixedPulley.y);
  ctx.moveTo(fixedPulley.x, fixedPulley.y - 16);
  ctx.lineTo(fixedPulley.x + 14, fixedPulley.y - 16);
  ctx.lineTo(fixedPulley.x + 14, fixedPulley.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(fixedPulley.x, fixedPulley.y, 9, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.restore();

  // Ground-level pulley, redirecting the motor's cable straight up
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(motorPulley.x, motorPulley.y, 9, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.restore();

  // Cable: motor → ground pulley → bottom of the counterweight
  ctx.save();
  ctx.strokeStyle = colors.trajectory;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(motor.x + 16, motor.y);
  ctx.lineTo(motorPulley.x, motorPulley.y);
  ctx.lineTo(motorPulley.x, counterweightBottomY);
  ctx.stroke();
  ctx.restore();

  // Cable: top of the counterweight → fixed (ceiling) pulley
  ctx.save();
  ctx.strokeStyle = colors.trajectory;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(fixedPulley.x, counterweightTopY);
  ctx.lineTo(fixedPulley.x, fixedPulley.y);
  ctx.stroke();
  ctx.restore();

  // Counterweight, descending at 2× the load's speed as it rises
  if (visibility.showLoad) {
    ctx.save();
    ctx.fillStyle = colors.axes;
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.roundRect(
      fixedPulley.x - 16,
      counterweightTopY,
      32,
      counterweightHeight,
      3,
    );
    ctx.fill();
    ctx.restore();
    drawLabel(
      ctx,
      `${params.counterweightMass} kg`,
      fixedPulley.x - 46,
      (counterweightTopY + counterweightBottomY) / 2,
      colors.axes,
    );
    drawArrow(
      ctx,
      fixedPulley.x + 24,
      counterweightTopY + 8,
      fixedPulley.x + 24,
      counterweightTopY + 22,
      colors.velocity,
      2,
    );
  }

  // Ceiling anchor, top-right
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.fillStyle = colors.axes;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ceilingAnchor.x - 14, ceilingAnchor.y - 10);
  ctx.lineTo(ceilingAnchor.x + 14, ceilingAnchor.y - 10);
  ctx.lineTo(ceilingAnchor.x + 8, ceilingAnchor.y);
  ctx.lineTo(ceilingAnchor.x - 8, ceilingAnchor.y);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Cord: fixed pulley → movable pulley → ceiling anchor (the two strands
  // sharing the load's weight)
  ctx.save();
  ctx.strokeStyle = colors.trajectory;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(fixedPulley.x, fixedPulley.y);
  ctx.lineTo(movablePulley.x, movablePulley.y);
  ctx.lineTo(ceilingAnchor.x, ceilingAnchor.y);
  ctx.stroke();
  ctx.restore();

  // Movable pulley, riding on the load
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(movablePulley.x, movablePulley.y, 8, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.restore();

  // Load ("300 kg"), rising from the ground and looping
  if (visibility.showLoad) {
    const loadTop = movablePulley.y + 10;
    const travel = groundY - 20 - loadTop;
    const d = phase % travel;
    const y = groundY - 20 - d;
    const loadW = 34;
    const loadH = 56;

    ctx.save();
    ctx.strokeStyle = colors.trajectory;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(movablePulley.x, movablePulley.y + 8);
    ctx.lineTo(movablePulley.x, y);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = colors.point;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(movablePulley.x - loadW / 2, y, loadW, loadH, 4);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    drawLabel(
      ctx,
      `${params.loadMass} kg`,
      movablePulley.x,
      y - 14,
      colors.point,
    );
    drawArrow(
      ctx,
      movablePulley.x + loadW / 2 + 18,
      y + loadH * 0.7,
      movablePulley.x + loadW / 2 + 18,
      y + loadH * 0.3,
      colors.velocity,
      2,
    );
    drawLabel(
      ctx,
      `${params.speed} m/s`,
      movablePulley.x + loadW / 2 + 44,
      y + loadH * 0.5,
      colors.velocity,
    );
  }

  // Power flow: electrical input into the motor, mechanical output up the cable
  if (visibility.showPowerFlow) {
    drawArrow(
      ctx,
      motor.x - 46,
      motor.y + 26,
      motor.x - 18,
      motor.y + 8,
      colors.acceleration,
      2,
    );
    drawLabel(
      ctx,
      `${labels.pElec} ${(state.electricalPower / 1000).toFixed(2)} kW`,
      motor.x - 36,
      motor.y + 40,
      colors.acceleration,
    );

    drawArrow(
      ctx,
      movablePulley.x - 30,
      movablePulley.y + 30,
      movablePulley.x - 30,
      movablePulley.y + 4,
      colors.normalAccel,
      2,
    );
    drawLabel(
      ctx,
      `${labels.pMech} ${(state.mechanicalPower / 1000).toFixed(2)} kW`,
      movablePulley.x - 30,
      movablePulley.y + 44,
      colors.normalAccel,
    );
  }

  // Efficiency badge, or a warning when the inputs are physically inconsistent
  ctx.save();
  ctx.font = "bold 14px ui-sans-serif, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = colors.point;
  const badge = state.exceedsInput
    ? labels.notPossible
    : `η ≈ ${(state.efficiency * 100).toFixed(1)}%`;
  ctx.fillText(badge, W * 0.5, H * 0.06);
  ctx.restore();
}
