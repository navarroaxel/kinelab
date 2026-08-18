"use client";

import {
  useRef,
  useEffect,
  type RefObject,
  type MutableRefObject,
} from "react";
import { accelAtTime, speedAtTime } from "@/lib/jetClimbKinematics";
import {
  drawArrow,
  drawLabel,
  COLORS,
  COLORS_DARK,
  type ColorPalette,
} from "@/lib/drawing";
import type {
  JetClimbParams,
  JetClimbSample,
  JetClimbState,
  JetClimbVisibility,
} from "@/types/simulator";

// Simulation time runs faster than the wall clock so the ~20 s approach to
// terminal speed plays out in a legible ~15 s of real animation.
const TIME_SCALE = 5;
const SPEED_LINE_SPACING = 32;
// The pilot's level-off is (idealized as) instantaneous — during the climb
// a = 0 and it stays 0 for the whole maneuver, only jumping to a₀ once the
// aircraft is level. ROTATE_DURATION is purely a visualization aid (real
// seconds, not simulation time) so the eye can follow the pitch change.
const ROTATE_DURATION = 1.1;

export function useJetClimbAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: JetClimbParams,
  state: JetClimbState,
  visibility: JetClimbVisibility,
  timeRef: MutableRefObject<number>,
  onMetrics: (sample: JetClimbSample) => void,
  paused: boolean,
  resetCount: number,
): void {
  const lastTimeRef = useRef<number | null>(null);
  const rafIdRef = useRef<number>(0);
  const lastMetricUpdate = useRef(0);
  const scrollRef = useRef(0);
  // Real elapsed seconds since the level-off maneuver started — drives only
  // the visual pitch, never the physics clock (timeRef).
  const rotationRef = useRef(0);

  // Reset the maneuver's clock whenever the simulation restarts (Reset
  // button or a param change), independent of pause/visibility toggles.
  useEffect(() => {
    rotationRef.current = 0;
  }, [resetCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mass = params.massMg * 1000;

    function sample(rotationT: number) {
      const rotDone = rotationT >= ROTATE_DURATION;
      if (!rotDone) {
        // Still climbing at a constant speed: ΣF = 0 along the path.
        return { v: state.v0, a: 0, rotT: rotationT };
      }
      const v = speedAtTime(timeRef.current, state);
      const a = accelAtTime(timeRef.current, state, mass);
      return { v, a, rotT: ROTATE_DURATION };
    }

    if (paused) {
      const colors: ColorPalette = document.documentElement.classList.contains(
        "dark",
      )
        ? COLORS_DARK
        : COLORS;
      const { v, a, rotT } = sample(rotationRef.current);
      render(
        ctx,
        canvas,
        params,
        state,
        visibility,
        v,
        a,
        rotT,
        scrollRef.current,
        colors,
      );
      onMetrics({ t: timeRef.current, v, a });
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

      const wasRotating = rotationRef.current < ROTATE_DURATION;
      if (dt > 0) rotationRef.current += dt;
      const rotDone = rotationRef.current >= ROTATE_DURATION;

      // Only start the physics clock the instant the level-off completes —
      // that's t = 0 for m·dv/dt = T − k·v², where a jumps to a₀. Every
      // frame after that one advances it normally.
      if (dt > 0 && rotDone && wasRotating) {
        timeRef.current = 0;
      } else if (dt > 0 && rotDone) {
        timeRef.current += dt * TIME_SCALE;
      }

      const { v, a, rotT } = sample(rotationRef.current);

      if (dt > 0 && visibility.showSpeedLines) {
        scrollRef.current += v * 0.15 * dt;
      }

      render(
        ctx!,
        canvas!,
        params,
        state,
        visibility,
        v,
        a,
        rotT,
        scrollRef.current,
        colors,
      );

      if (now - lastMetricUpdate.current > 66) {
        onMetrics({ t: timeRef.current, v, a });
        lastMetricUpdate.current = now;
      }

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
  params: JetClimbParams,
  state: JetClimbState,
  visibility: JetClimbVisibility,
  v: number,
  a: number,
  rotT: number,
  scroll: number,
  colors: ColorPalette,
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;

  ctx.clearRect(0, 0, W, H);

  const level = { x: W * 0.5, y: H * 0.45 };
  const angle = (params.climbAngleDeg * Math.PI) / 180;

  // Speed lines: scrolling background streaks to the left of the aircraft,
  // spacing shrinks as v grows so the flow visibly speeds up.
  if (visibility.showSpeedLines) {
    ctx.save();
    ctx.strokeStyle = colors.trajectory;
    ctx.lineWidth = 2;
    const offset = scroll % SPEED_LINE_SPACING;
    for (let x = level.x - 60 - offset; x > -20; x -= SPEED_LINE_SPACING) {
      ctx.beginPath();
      ctx.moveTo(x, level.y - 4);
      ctx.lineTo(x - 18, level.y - 4);
      ctx.moveTo(x, level.y + 4);
      ctx.lineTo(x - 18, level.y + 4);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Climb path: dashed incline leading up to the level-off point
  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.setLineDash([5, 5]);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(level.x - 130, level.y + 130 * Math.tan(angle));
  ctx.lineTo(level.x, level.y);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(level.x, level.y);
  ctx.lineTo(W - 40, level.y);
  ctx.stroke();
  ctx.restore();
  drawLabel(ctx, `θ = ${params.climbAngleDeg.toFixed(0)}°`, level.x - 90, level.y + 40, colors.axes);

  // Aircraft: a simple triangular fuselage, nose pitched up at the climb
  // angle and easing down to level over ROTATE_DURATION (real seconds).
  const settle = Math.max(0, 1 - rotT / ROTATE_DURATION);
  const eased = settle * settle * (3 - 2 * settle); // smoothstep
  const pitch = angle * eased;
  ctx.save();
  ctx.translate(level.x, level.y);
  ctx.rotate(-pitch);
  ctx.fillStyle = colors.center;
  ctx.beginPath();
  ctx.moveTo(22, 0);
  ctx.lineTo(-16, -8);
  ctx.lineTo(-16, 8);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Thrust / drag vectors along the flight path
  if (visibility.showVectors) {
    const drag = state.dragCoeff * v * v;
    const scale = 46 / Math.max(state.thrust, 1);

    drawArrow(
      ctx,
      level.x + 24,
      level.y,
      level.x + 24 + state.thrust * scale,
      level.y,
      colors.acceleration,
      2,
    );
    drawLabel(
      ctx,
      `T ≈ ${(state.thrust / 1000).toFixed(1)} kN`,
      level.x + 24 + state.thrust * scale + 10,
      level.y - 12,
      colors.acceleration,
    );

    drawArrow(
      ctx,
      level.x - 20,
      level.y,
      level.x - 20 - drag * scale,
      level.y,
      colors.normalAccel,
      2,
    );
    drawLabel(
      ctx,
      `D ≈ ${(drag / 1000).toFixed(1)} kN`,
      level.x - 20 - drag * scale - 10,
      level.y - 12,
      colors.normalAccel,
    );
  }

  // Live speed / acceleration readout
  ctx.save();
  ctx.font = "bold 14px ui-sans-serif, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = colors.point;
  ctx.fillText(
    `v ≈ ${(v * 3.6).toFixed(0)} km/h    a ≈ ${a.toFixed(2)} m/s²`,
    level.x,
    level.y - 40,
  );
  ctx.restore();
}
