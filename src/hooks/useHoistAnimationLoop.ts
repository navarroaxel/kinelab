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

    function currentLabels() {
      return {
        pElec: translateRef.current("hoist.canvas.p_elec"),
        pMech: translateRef.current("hoist.canvas.p_mech"),
        motor: translateRef.current("hoist.canvas.motor_short"),
        wattmeter: translateRef.current("hoist.canvas.wattmeter_short"),
        notPossible: translateRef.current("hoist.canvas.warn.not_possible"),
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
  const PULLEY_R = 9;
  const fixedPulley = { x: W * 0.46, y: H * 0.1 };
  // The ground-level pulley that redirects the motor's cable, horizontally
  // aligned with the motor (same y). Its RIGHT edge lines up with the
  // fixed (ceiling) pulley's LEFT edge, since the counterweight's cable
  // runs edge-to-edge between them (a shared vertical tangent), not
  // axle-to-axle — the counterweight itself hangs centred on that line.
  const motorPulley = { x: fixedPulley.x - 2 * PULLEY_R, y: motor.y };
  const counterweightX = fixedPulley.x - PULLEY_R;
  // A second ceiling pulley, at the same height, redirects the load's
  // cord — fixedPulley only handles the counterweight side.
  const loadPulley = { x: fixedPulley.x + 55, y: fixedPulley.y };
  // The movable pulley is rigidly fixed to the load's top edge — it's
  // "movable" only in the sense that it isn't bolted to the ceiling like
  // the other pulleys; it rides up and down with the load itself, so its
  // height tracks the load's rise directly rather than staying fixed.
  const loadW = 34;
  const loadH = 68;
  const loadBottomY = groundY - 20 - loadH;
  const loadTravelTopY = H * 0.16;
  const loadTravel = loadBottomY - loadTravelTopY;
  const loadD = phase % loadTravel;
  const loadY = visibility.showLoad ? loadBottomY - loadD : loadBottomY;
  // Both cord segments at the movable pulley run edge-to-edge, and both
  // need to be vertical — so the movable pulley's x is set from
  // loadPulley's right edge plus both radii, and the ceiling anchor's x
  // is set from the movable pulley's right edge plus its own radius,
  // rather than picked independently.
  const MOVABLE_PULLEY_R = 11;
  const movablePulley = {
    x: loadPulley.x + PULLEY_R + MOVABLE_PULLEY_R,
    y: loadY - 10,
  };
  const ceilingAnchor = {
    x: movablePulley.x + MOVABLE_PULLEY_R,
    y: fixedPulley.y - 36,
  };
  const counterweightHeight = H * 0.09;
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

  // Motor A — a fixed dark fill regardless of theme, since colors.center
  // (light gray in dark mode) doesn't contrast well against the white label.
  ctx.save();
  ctx.fillStyle = "#52525b";
  ctx.beginPath();
  ctx.arc(motor.x, motor.y, 16, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
  drawLabel(ctx, labels.motor, motor.x, motor.y, "#fff");

  // A single shelter-shaped bracket spans both ceiling pulleys: one roof
  // beam with a support leg down to each pulley, rather than two separate
  // brackets.
  const roofY = fixedPulley.y - 16;
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(fixedPulley.x - 14, roofY);
  ctx.lineTo(loadPulley.x + 14, roofY);
  ctx.moveTo(fixedPulley.x - 14, roofY);
  ctx.lineTo(fixedPulley.x - 14, fixedPulley.y);
  ctx.moveTo(loadPulley.x + 14, roofY);
  ctx.lineTo(loadPulley.x + 14, loadPulley.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(fixedPulley.x, fixedPulley.y, PULLEY_R, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(loadPulley.x, loadPulley.y, PULLEY_R, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.restore();

  // Horizontal cable: fixedPulley's top edge → loadPulley's top edge.
  ctx.save();
  ctx.strokeStyle = colors.trajectory;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(fixedPulley.x, fixedPulley.y - PULLEY_R);
  ctx.lineTo(loadPulley.x, loadPulley.y - PULLEY_R);
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

  // Cable: motor → ground pulley's BOTTOM edge (the motor/wattmeter side).
  // Hooked lower on the motor, level with the pulley's bottom edge, so the
  // cable runs parallel to the ground instead of sloping down to it.
  ctx.save();
  ctx.strokeStyle = colors.trajectory;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(motor.x + 16, motorPulley.y + PULLEY_R);
  ctx.lineTo(motorPulley.x, motorPulley.y + PULLEY_R);
  ctx.stroke();
  ctx.restore();

  // Cable: ground pulley's RIGHT edge → bottom of the counterweight.
  ctx.save();
  ctx.strokeStyle = colors.trajectory;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(motorPulley.x + PULLEY_R, motorPulley.y);
  ctx.lineTo(counterweightX, counterweightBottomY);
  ctx.stroke();
  ctx.restore();

  // Cable: top of the counterweight → fixed (ceiling) pulley's LEFT edge.
  ctx.save();
  ctx.strokeStyle = colors.trajectory;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(counterweightX, counterweightTopY);
  ctx.lineTo(fixedPulley.x - PULLEY_R, fixedPulley.y);
  ctx.stroke();
  ctx.restore();

  // Counterweight, descending at 2× the load's speed as it rises
  if (visibility.showLoad) {
    ctx.save();
    ctx.fillStyle = colors.axes;
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.roundRect(
      counterweightX - 12,
      counterweightTopY,
      24,
      counterweightHeight,
      3,
    );
    ctx.fill();
    ctx.restore();
    drawLabel(
      ctx,
      `${params.counterweightMass} kg`,
      counterweightX - 46,
      (counterweightTopY + counterweightBottomY) / 2,
      colors.velocity,
    );
    drawArrow(
      ctx,
      counterweightX + 24,
      counterweightTopY + 8,
      counterweightX + 24,
      counterweightTopY + 22,
      colors.velocity,
      2,
    );
  }

  // Ceiling anchor, tucked in above the pulley shelter
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

  // Cord: loadPulley → movable pulley → ceiling anchor (the two strands
  // sharing the load's weight)
  ctx.save();
  ctx.strokeStyle = colors.trajectory;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(loadPulley.x + PULLEY_R, loadPulley.y);
  ctx.lineTo(movablePulley.x - MOVABLE_PULLEY_R, movablePulley.y);
  ctx.moveTo(movablePulley.x + MOVABLE_PULLEY_R, movablePulley.y);
  ctx.lineTo(ceilingAnchor.x, ceilingAnchor.y);
  ctx.stroke();
  ctx.restore();

  // Movable pulley, riding on the load
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(movablePulley.x, movablePulley.y, MOVABLE_PULLEY_R, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.restore();

  // Load ("300 kg"), rising from the ground and looping — its top edge is
  // exactly loadY, which the movable pulley (above) is rigidly fixed to.
  if (visibility.showLoad) {
    const y = loadY;

    ctx.save();
    ctx.strokeStyle = colors.trajectory;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(movablePulley.x, movablePulley.y + MOVABLE_PULLEY_R);
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
      y + loadH + 14,
      colors.point,
    );
    drawArrow(
      ctx,
      movablePulley.x + 30,
      y + loadH * 0.7,
      movablePulley.x + 30,
      y + loadH * 0.3,
      colors.velocity,
      2,
    );
    drawLabel(
      ctx,
      `${params.speed} m/s`,
      movablePulley.x + 56,
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
      movablePulley.x + 30,
      movablePulley.y + 20,
      movablePulley.x + 30,
      movablePulley.y - 6,
      colors.normalAccel,
      2,
    );
    drawLabel(
      ctx,
      `${labels.pMech} ${(state.mechanicalPower / 1000).toFixed(2)} kW`,
      movablePulley.x + 70,
      movablePulley.y,
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
