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
import type {
  ElevatorCounterweightParams,
  ElevatorCounterweightState,
  ElevatorCounterweightVisibility,
} from "@/types/simulator";

// The cars' on-screen position is the real kinematic integral
// x(t) = v0·t + ½·a·t², using the actual elevatorVelocity/elevatorAcceleration
// params — so when a decelerates the elevator (opposite sign to v0), it
// visibly slows, stops, and reverses at t* = |v0/a|, instead of always
// scrolling one direction. PX_PER_MPS is the only illustrative constant
// here, just converting real metres to a legible pixel scale; the loop
// resets every LOOP_DURATION_S so the reversal (when there is one) keeps
// replaying rather than drifting off in one direction forever.
const PX_PER_MPS = 12;
const LOOP_DURATION_S = 8;

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
        phaseRef.current = (phaseRef.current + dt) % LOOP_DURATION_S;
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

/**
 * The point on a pulley's rim, in the quadrant facing `from` — where a
 * cable coming from that direction actually meets the pulley, rather than
 * its axle. The radius matters physically (it's the torque lever arm for
 * fixed pulleys), so cables should visibly terminate at the rim.
 */
function rimPoint(
  from: { x: number; y: number },
  center: { x: number; y: number },
  radius: number,
): { x: number; y: number } {
  const dx = from.x - center.x;
  const dy = from.y - center.y;
  const dist = Math.hypot(dx, dy) || 1;
  return { x: center.x + (dx / dist) * radius, y: center.y + (dy / dist) * radius };
}

function render(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  params: ElevatorCounterweightParams,
  state: ElevatorCounterweightState,
  visibility: ElevatorCounterweightVisibility,
  simTime: number,
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

  const isDark = colors === COLORS_DARK;
  const cableLabelColor = isDark ? "#ffffff" : colors.axes;

  // Real kinematics: x(t) = v0·t + ½·a·t², v(t) = v0 + a·t.
  const displacementM =
    params.elevatorVelocity * simTime +
    0.5 * params.elevatorAcceleration * simTime ** 2;
  const phase = displacementM * PX_PER_MPS;
  const elevatorSpeedNow =
    params.elevatorVelocity + params.elevatorAcceleration * simTime;

  const shaftTop = H * 0.1;
  const shaftBottom = H * 0.85;
  const travel = shaftBottom - shaftTop - 60;
  const ceilingY = shaftTop;

  // E hangs from a movable pulley with two cable segments: a left one
  // anchored directly to the ceiling, and a right one ("T") that runs up
  // directly to the smaller of the two fixed ceiling pulleys, which
  // continues straight down to the motor's drum below ("C"). A third,
  // separate cable ties W to the centre (axle) of E's pulley, running up
  // over the BIGGER fixed pulley and back down to W — so three cables
  // meet at E's pulley altogether.
  const leftAnchorX = W * 0.2;
  const motorPulleyBig = { x: W * 0.29, y: ceilingY };
  const motorPulleySmall = { x: W * 0.34, y: ceilingY + 42 };
  const weightPulley = { x: W * 0.58, y: ceilingY };
  const elevatorX = (leftAnchorX + motorPulleySmall.x) / 2;
  const counterweightX = weightPulley.x + 16;

  // Ceiling anchor + the fixed pulleys.
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(leftAnchorX, ceilingY, 5, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(motorPulleyBig.x, motorPulleyBig.y, 16, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(motorPulleySmall.x, motorPulleySmall.y, 9, 0, 2 * Math.PI);
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
    // Right cable "T": E's pulley → directly to the smaller motor pulley,
    // which continues straight down to the motor ("C").
    // Third cable: E's pulley axle → up over the bigger motor pulley →
    // over the weight pulley → down to W.
    // Every cable terminates at the pulley's rim, in the quadrant facing
    // where it comes from — not at the axle — since the radius is the
    // torque lever arm and matters visually.
    const elevatorPulley = { x: elevatorX, y: elevatorPulleyY };
    const leftAnchor = { x: leftAnchorX, y: ceilingY };
    const wBoxTop = { x: counterweightX, y: counterweightY - 16 };

    ctx.save();
    ctx.strokeStyle = colors.trajectory;
    ctx.lineWidth = 2;
    ctx.beginPath();

    let p1 = { x: leftAnchor.x - 5, y: leftAnchor.y };
    let p2 = rimPoint(leftAnchor, elevatorPulley, 8);
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);

    p1 = rimPoint(motorPulleySmall, elevatorPulley, 8);
    p2 = { x: motorPulleySmall.x - 9, y: motorPulleySmall.y };
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);

    p1 = rimPoint(motorPulleyBig, elevatorPulley, 8);
    p2 = { x: motorPulleyBig.x - 16, y: motorPulleyBig.y };
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);

    p1 = { x: motorPulleyBig.x, y: motorPulleyBig.y - 16 };
    p2 = { x: weightPulley.x, y: weightPulley.y - 16 };
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);

    p1 = { x: weightPulley.x + 16, y: weightPulley.y };
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(wBoxTop.x, wBoxTop.y);

    ctx.stroke();
    ctx.restore();
    drawLabelWithSubscript(
      ctx,
      "T_C",
      (elevatorX + motorPulleySmall.x) / 2 + 10,
      (elevatorPulleyY + motorPulleySmall.y) / 2,
      cableLabelColor,
    );
    drawLabelWithSubscript(
      ctx,
      "T_W",
      (elevatorX + motorPulleyBig.x) / 2 - 12,
      (elevatorPulleyY + motorPulleyBig.y) / 2,
      cableLabelColor,
    );
    drawLabelWithSubscript(
      ctx,
      "T_W",
      weightPulley.x + 26,
      (weightPulley.y + wBoxTop.y) / 2,
      cableLabelColor,
    );
    drawLabelWithSubscript(
      ctx,
      "T_W",
      (motorPulleyBig.x + weightPulley.x) / 2,
      motorPulleyBig.y - 26,
      cableLabelColor,
    );

    // Elevator car, hanging just below its pulley.
    const elevatorY = elevatorPulleyY + 28;
    ctx.save();
    ctx.fillStyle = colors.point;
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
    drawLabel(
      ctx,
      `v ≈ ${elevatorSpeedNow >= 0 ? "+" : ""}${elevatorSpeedNow.toFixed(2)} m/s`,
      elevatorX,
      elevatorY + 30,
      colors.point,
    );

    // Counterweight — coupled 1:1 to E, so it moves at the same speed,
    // opposite sign.
    ctx.save();
    ctx.fillStyle = colors.velocity;
    ctx.fillRect(counterweightX - 16, counterweightY - 16, 32, 32);
    ctx.restore();
    drawLabel(ctx, labels.counterweight, counterweightX, counterweightY, "#fff");
    drawLabel(
      ctx,
      `v ≈ ${-elevatorSpeedNow >= 0 ? "+" : ""}${(-elevatorSpeedNow).toFixed(2)} m/s`,
      counterweightX,
      counterweightY + 26,
      colors.velocity,
    );
  }

  // Cable C: continues from the smaller motor pulley straight down to the
  // ground-mounted motor's winch drum, as in the textbook figure — the
  // motor sits on the floor, not up at the ceiling.
  const floorY = H * 0.96;
  const drum = { x: motorPulleySmall.x + 9, y: floorY - 26 };
  ctx.save();
  ctx.strokeStyle = colors.trajectory;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(motorPulleySmall.x + 9, motorPulleySmall.y);
  ctx.lineTo(drum.x, drum.y);
  ctx.stroke();
  ctx.restore();
  drawLabel(ctx, "C", drum.x + 12, (motorPulleySmall.y + drum.y) / 2, cableLabelColor);

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
