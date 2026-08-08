"use client";

import {
  useRef,
  useEffect,
  type RefObject,
  type MutableRefObject,
} from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  drawLabel,
  drawLabelWithSubscript,
  COLORS,
  COLORS_DARK,
  type ColorPalette,
} from "@/lib/drawing";
import { degToRad } from "@/lib/pulleyFrictionKinematics";
import type {
  PulleyFrictionParams,
  PulleyFrictionState,
  PulleyFrictionVisibility,
} from "@/types/simulator";

// A is hitched to a movable pulley (not tied directly to the cable), so it
// moves at half of B's speed: v_B = 2·v_A. The loop just sweeps a visual
// phase across a fixed track length for A — it carries no independent
// physical meaning, unlike the force/tension values shown, which are the
// exact closed-form results for the current parameters.
const ANIMATION_DURATION_S = 4;
const TRACK_LENGTH_M = 3;

export function usePulleyFrictionAnimationLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  params: PulleyFrictionParams,
  state: PulleyFrictionState,
  visibility: PulleyFrictionVisibility,
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
        blockA: translateRef.current("pulley-friction.canvas.block_a"),
        blockB: translateRef.current("pulley-friction.canvas.block_b"),
        force: translateRef.current("pulley-friction.canvas.force"),
        tension: translateRef.current("pulley-friction.canvas.tension"),
        friction: translateRef.current("pulley-friction.canvas.friction"),
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
        phaseRef.current = (phaseRef.current + dt) % ANIMATION_DURATION_S;
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

function drawArrow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angleRad: number,
  length: number,
  color: string,
): void {
  const ex = x + Math.cos(angleRad) * length;
  const ey = y - Math.sin(angleRad) * length;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(ex, ey);
  ctx.stroke();
  const headLen = 7;
  ctx.beginPath();
  ctx.moveTo(ex, ey);
  ctx.lineTo(
    ex - headLen * Math.cos(angleRad - Math.PI / 6),
    ey + headLen * Math.sin(angleRad - Math.PI / 6),
  );
  ctx.lineTo(
    ex - headLen * Math.cos(angleRad + Math.PI / 6),
    ey + headLen * Math.sin(angleRad + Math.PI / 6),
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawPulley(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, 1.5, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function render(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  params: PulleyFrictionParams,
  state: PulleyFrictionState,
  visibility: PulleyFrictionVisibility,
  phase: number,
  colors: ColorPalette,
  labels: {
    blockA: string;
    blockB: string;
    force: string;
    tension: string;
    friction: string;
  },
): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.width / dpr;
  const H = canvas.height / dpr;
  ctx.clearRect(0, 0, W, H);

  const alpha = degToRad(params.inclineAngle);
  const theta = degToRad(params.pullAngle);
  const groundY = H * 0.82;

  // Two fixed pulleys stacked on a frame: the cable from B goes over the
  // top one — mounted above the point where the incline meets the mast —
  // down to the lower one, then straight across to A's movable pulley.
  // A fixed anchor point sits at the frame's base.
  const PULLEY1_R = 10;
  const PULLEY2_R = 9;
  const pulley2 = { x: W * 0.5, y: groundY - 50 };
  const mastX = pulley2.x -18;
  const anchor = { x: mastX, y: groundY - 20 };

  // Incline for B, rising up-left from the frame's mast — its horizontal
  // extent stops at the mast.
  const inclineBase = { x: W * 0.06, y: groundY };
  const inclineLen = (mastX - inclineBase.x) / Math.cos(alpha);
  const inclineTop = {
    x: inclineBase.x + inclineLen * Math.cos(alpha),
    y: inclineBase.y - inclineLen * Math.sin(alpha),
  };

  // The pulley's axle can't sit right on the incline/mast intersection —
  // it's mounted above it. Its RIGHT edge lines up with pulley2's LEFT
  // edge, since the cable between them runs edge-to-edge (a vertical
  // tangent), not axle-to-axle.
  const pulley1 = {
    x: pulley2.x - PULLEY2_R - PULLEY1_R,
    y: inclineTop.y - 14,
  };

  ctx.save();
  ctx.strokeStyle = colors.axes;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(inclineBase.x, inclineBase.y);
  ctx.lineTo(inclineTop.x, inclineTop.y);
  // Flat ground for A.
  ctx.moveTo(W * 0.3, groundY);
  ctx.lineTo(W * 0.95, groundY);
  // Frame holding the two fixed pulleys + anchor — starts right where the
  // incline crosses it, since there's nothing above that.
  ctx.moveTo(mastX, inclineTop.y);
  ctx.lineTo(mastX, groundY);
  ctx.stroke();
  ctx.restore();

  drawPulley(ctx, pulley1.x, pulley1.y, PULLEY1_R, colors.axes);
  drawPulley(ctx, pulley2.x, pulley2.y, PULLEY2_R, colors.axes);
  ctx.save();
  ctx.fillStyle = colors.axes;
  ctx.fillRect(anchor.x - 5, anchor.y - 5, 10, 10);
  ctx.restore();

  // Cable segment between the two fixed pulleys: edge-to-edge (the shared
  // vertical tangent), not axle-to-axle.
  ctx.save();
  ctx.strokeStyle = colors.trajectory;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 4]);
  ctx.beginPath();
  ctx.moveTo(pulley1.x + PULLEY1_R, pulley1.y);
  ctx.lineTo(pulley2.x - PULLEY2_R, pulley2.y);
  ctx.stroke();
  ctx.restore();

  if (visibility.showBlocks) {
    const frac = phase / ANIMATION_DURATION_S;

    // A is hitched to a movable pulley, so it travels at half of B's
    // speed: v_B = 2·v_A.
    const aTravel = TRACK_LENGTH_M * frac;
    const bTravel = 2 * aTravel;
    const scaleB = inclineLen > 0 ? (inclineLen * 0.7) / (2 * TRACK_LENGTH_M) : 0;

    const aX = W * 0.62 + aTravel * (W * 0.06);
    const aPos = { x: aX, y: groundY };
    const movablePulley = { x: aX - 46, y: aPos.y - 34 };

    const bPos = {
      x: inclineBase.x + bTravel * scaleB * Math.cos(alpha),
      y: inclineBase.y - bTravel * scaleB * Math.sin(alpha),
    };
    // The cable is tied to B's far top corner (up-slope, on top of the
    // block), not its base — otherwise it doesn't run parallel to the
    // incline. Local corner (12, -18) rotated by -alpha, same as the
    // block's own draw transform below.
    const bCableAnchor = {
      x: bPos.x + 12 * Math.cos(alpha) - 18 * Math.sin(alpha),
      y: bPos.y - 12 * Math.sin(alpha) - 18 * Math.cos(alpha),
    };

    // Cable: B → pulley1 (the pulley1 → pulley2 hop is drawn as a static
    // edge-to-edge segment above) → pulley2 → movable pulley (top
    // segment) and anchor → movable pulley (bottom segment) — both at
    // tension T, both pulling on A's pulley, hence the 2T load on A.
    ctx.save();
    ctx.strokeStyle = colors.trajectory;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(bCableAnchor.x, bCableAnchor.y);
    ctx.lineTo(pulley1.x, pulley1.y);
    ctx.moveTo(pulley2.x, pulley2.y + PULLEY2_R);
    ctx.lineTo(movablePulley.x, movablePulley.y - 8);
    ctx.moveTo(anchor.x, anchor.y);
    ctx.lineTo(movablePulley.x, movablePulley.y + 8);
    ctx.stroke();
    ctx.restore();

    drawPulley(ctx, movablePulley.x, movablePulley.y, 10, colors.normalAccel);
    // Short rigid link from the movable pulley to A.
    ctx.save();
    ctx.strokeStyle = colors.axes;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(movablePulley.x + 10, movablePulley.y);
    ctx.lineTo(aPos.x - 16, aPos.y - 17);
    ctx.stroke();
    ctx.restore();

    drawLabel(
      ctx,
      `2${labels.tension}`,
      movablePulley.x - 22,
      movablePulley.y,
      colors.normalAccel,
    );

    // Block A.
    ctx.save();
    ctx.fillStyle = colors.point;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.5;
    ctx.fillRect(aPos.x - 16, aPos.y - 34, 32, 34);
    ctx.strokeRect(aPos.x - 16, aPos.y - 34, 32, 34);
    ctx.restore();
    drawLabel(ctx, labels.blockA, aPos.x, aPos.y - 50, colors.point);

    // Block B.
    ctx.save();
    ctx.translate(bPos.x, bPos.y);
    ctx.rotate(-alpha);
    ctx.fillStyle = colors.velocity;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.5;
    ctx.fillRect(-12, -18, 24, 18);
    ctx.strokeRect(-12, -18, 24, 18);
    ctx.restore();
    drawLabel(ctx, labels.blockB, bPos.x - 20, bPos.y - 36, colors.velocity);

    if (visibility.showForceSweep) {
      const arrowOriginX = aPos.x + 16;
      const arrowOriginY = aPos.y - 17;
      const arrowLen = 50;
      drawArrow(ctx, arrowOriginX, arrowOriginY, theta, arrowLen, colors.acceleration);
      drawLabel(
        ctx,
        `${labels.force} = ${state.appliedForce.toFixed(0)} N`,
        arrowOriginX + Math.cos(theta) * (arrowLen + 24),
        arrowOriginY - Math.sin(theta) * (arrowLen + 24),
        colors.acceleration,
        true,
      );

      // The tension arrow shares the cable's actual line of action —
      // starting at the same point the cable is tied to, pointing exactly
      // toward pulley1 — rather than an arrow floating along the
      // incline's nominal angle from the block's base.
      const tensionAngle = Math.atan2(
        bCableAnchor.y - pulley1.y,
        pulley1.x - bCableAnchor.x,
      );
      drawArrow(ctx, bCableAnchor.x, bCableAnchor.y, tensionAngle, 40, colors.normalAccel);
      drawLabel(
        ctx,
        `${labels.tension} = ${state.cableTension.toFixed(0)} N`,
        bCableAnchor.x + Math.cos(tensionAngle) * 44,
        bCableAnchor.y - Math.sin(tensionAngle) * 44 - 20,
        colors.normalAccel,
      );

      // Friction on A opposes its rightward motion; friction on B opposes
      // its up-slope motion — both drawn at the blocks' contact surface.
      const frictionColor = "#ef4444";
      drawArrow(ctx, aPos.x - 16, aPos.y - 2, Math.PI, 34, frictionColor);
      drawLabelWithSubscript(
        ctx,
        `${labels.friction}_A ≈ ${(params.frictionCoefficient * (params.weightA - state.appliedForce * Math.sin(theta))).toFixed(0)} N`,
        aPos.x - 34,
        aPos.y + 14,
        frictionColor,
      );

      drawArrow(ctx, bPos.x, bPos.y, Math.PI + alpha, 30, frictionColor);
      drawLabelWithSubscript(
        ctx,
        `${labels.friction}_B ≈ ${(params.frictionCoefficient * params.weightB * Math.cos(alpha)).toFixed(0)} N`,
        bPos.x - Math.cos(alpha) * 34 + 20,
        bPos.y + Math.sin(alpha) * 34 + 26,
        frictionColor,
      );
    }
  }
}
