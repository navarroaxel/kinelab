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
  ElevatorCounterweightParams,
  ElevatorCounterweightState,
  ElevatorCounterweightVisibility,
} from "@/types/simulator";

// The cars scroll at a fixed screen speed for legibility, in the direction
// elevatorVelocity's sign indicates — only the direction is physical here,
// the pixel rate itself is illustrative.
const SCROLL_SPEED_PX_S = 30;

export function useElevatorCounterweightAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: ElevatorCounterweightParams,
  state: ElevatorCounterweightState,
  visibility: ElevatorCounterweightVisibility,
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
        elevator: translateRef.current("elevator-counterweight.canvas.elevator"),
        counterweight: translateRef.current(
          "elevator-counterweight.canvas.counterweight",
        ),
        motor: translateRef.current("elevator-counterweight.canvas.motor"),
        driving: translateRef.current("elevator-counterweight.canvas.driving"),
        braking: translateRef.current("elevator-counterweight.canvas.braking"),
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
        const direction = Math.sign(params.elevatorVelocity) || 1;
        phaseRef.current += direction * SCROLL_SPEED_PX_S * dt;
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
  params: ElevatorCounterweightParams,
  state: ElevatorCounterweightState,
  visibility: ElevatorCounterweightVisibility,
  phase: number,
  colors: ColorPalette,
  labels: {
    elevator: string;
    counterweight: string;
    motor: string;
    driving: string;
    braking: string;
  },
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  ctx.clearRect(0, 0, W, H);

  const shaftTop = H * 0.1;
  const shaftBottom = H * 0.85;
  const travel = shaftBottom - shaftTop - 60;
  const ceilingY = shaftTop;

  // E hangs from a movable pulley with two cable segments: a left one
  // anchored directly to the ceiling, and a right one ("T") that runs up
  // over the smaller of the two ceiling-fixed pulleys and down to the
  // motor's drum — that's the segment the motor actually pulls on ("C").
  // A third, separate cable ties W to the centre (axle) of E's pulley,
  // running up over the BIGGER ceiling-fixed pulley and back down to W —
  // so three cables meet at E's pulley altogether.
  const leftAnchorX = W * 0.2;
  const motorPulley = { x: W * 0.34, y: ceilingY };
  const elevatorX = (leftAnchorX + motorPulley.x) / 2;
  const weightPulley = { x: W * 0.58, y: ceilingY };
  const counterweightX = W * 0.78;

  // Ceiling anchor + the two fixed pulleys.
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(leftAnchorX, ceilingY, 5, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(motorPulley.x, motorPulley.y, 11, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(weightPulley.x, weightPulley.y, 16, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.restore();

  let elevatorPulleyY = ceilingY + 30;
  let counterweightY = ceilingY + 30;

  if (visibility.showCars) {
    const wrapped = ((phase % travel) + travel) % travel;
    elevatorPulleyY = ceilingY + 30 + wrapped;
    counterweightY = ceilingY + 30 + (travel - wrapped);

    // E's own (movable) pulley.
    ctx.save();
    ctx.strokeStyle = colors.axes;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(elevatorX, elevatorPulleyY, 8, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();

    // Left cable: ceiling anchor → E's pulley.
    // Right cable "T": E's pulley → motor pulley (continues to the motor below).
    // Third cable: E's pulley axle → up over the weight pulley → down to W.
    ctx.save();
    ctx.strokeStyle = colors.trajectory;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(leftAnchorX, ceilingY);
    ctx.lineTo(elevatorX, elevatorPulleyY);
    ctx.moveTo(elevatorX, elevatorPulleyY);
    ctx.lineTo(motorPulley.x, motorPulley.y);
    ctx.moveTo(elevatorX, elevatorPulleyY);
    ctx.lineTo(weightPulley.x, weightPulley.y);
    ctx.moveTo(weightPulley.x, weightPulley.y);
    ctx.lineTo(counterweightX, counterweightY - 16);
    ctx.stroke();
    ctx.restore();
    drawLabel(
      ctx,
      "T",
      (elevatorX + motorPulley.x) / 2 + 10,
      (elevatorPulleyY + motorPulley.y) / 2,
      colors.trajectory,
    );

    // Elevator car, hanging just below its pulley.
    const elevatorY = elevatorPulleyY + 28;
    ctx.save();
    ctx.fillStyle = colors.rVector;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.5;
    ctx.fillRect(elevatorX - 22, elevatorY - 20, 44, 40);
    ctx.strokeRect(elevatorX - 22, elevatorY - 20, 44, 40);
    ctx.restore();
    drawLabel(ctx, labels.elevator, elevatorX, elevatorY, "#fff");
    ctx.save();
    ctx.strokeStyle = colors.trajectory;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(elevatorX, elevatorPulleyY + 8);
    ctx.lineTo(elevatorX, elevatorY - 20);
    ctx.stroke();
    ctx.restore();

    // Counterweight
    ctx.save();
    ctx.fillStyle = colors.axes;
    ctx.fillRect(counterweightX - 16, counterweightY - 16, 32, 32);
    ctx.restore();
    drawLabel(ctx, labels.counterweight, counterweightX, counterweightY, "#fff");
  }

  // Cable C: continues from the motor pulley straight down to the
  // ground-mounted motor's winch drum, as in the textbook figure — the
  // motor sits on the floor, not up at the ceiling.
  const floorY = H * 0.96;
  const drum = { x: motorPulley.x, y: floorY - 26 };
  ctx.save();
  ctx.strokeStyle = colors.trajectory;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(motorPulley.x, motorPulley.y + 11);
  ctx.lineTo(drum.x, drum.y);
  ctx.stroke();
  ctx.restore();
  drawLabel(ctx, "C", motorPulley.x - 12, (motorPulley.y + drum.y) / 2, colors.trajectory);

  // Floor.
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(drum.x - 50, floorY);
  ctx.lineTo(drum.x + 50, floorY);
  ctx.stroke();
  ctx.restore();

  // Winch drum (cable spool).
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 1.5;
  const drumHalfHeight = 10;
  const drumWidth = 16;
  ctx.strokeRect(drum.x - drumWidth / 2, drum.y - drumHalfHeight, drumWidth, drumHalfHeight * 2);
  for (let i = 1; i < 5; i++) {
    const lx = drum.x - drumWidth / 2 + (i * drumWidth) / 5;
    ctx.beginPath();
    ctx.moveTo(lx, drum.y - drumHalfHeight);
    ctx.lineTo(lx, drum.y + drumHalfHeight);
    ctx.stroke();
  }
  ctx.restore();

  // Motor body, floor-mounted next to the drum.
  const motor = { x: drum.x + drumWidth / 2 + 22, y: drum.y };
  ctx.save();
  ctx.fillStyle = "#52525b";
  ctx.fillRect(motor.x - 22, motor.y - 16, 44, 32);
  ctx.restore();
  drawLabel(ctx, labels.motor, motor.x, motor.y, "#fff");

  const powerKw = Math.abs(state.motorPower) / 1000;
  const modeLabel = state.isBraking ? labels.braking : labels.driving;
  const arrowColor = state.isBraking ? colors.acceleration : colors.velocity;
  if (state.isBraking) {
    drawArrow(ctx, motor.x + 30, motor.y - 10, motor.x + 30, motor.y - 28, arrowColor, 2);
  } else {
    drawArrow(ctx, motor.x + 30, motor.y - 28, motor.x + 30, motor.y - 10, arrowColor, 2);
  }
  drawLabel(
    ctx,
    `${modeLabel}: ${powerKw.toFixed(2)} kW`,
    motor.x + 30,
    motor.y - 40,
    arrowColor,
  );
}
