"use client";

import { memo, useEffect, useRef } from "react";
import { computeKinematics } from "@/lib/kinematics";
import {
  drawArrow,
  drawDot,
  COLORS,
  COLORS_DARK,
  type ColorPalette,
} from "@/lib/drawing";

// Purely decorative — auto-animates at a fixed rate with the pole off-centre
// so r, ṙ and rθ̇ are all visibly non-zero, echoing the polar simulator's core
// insight without pulling in its full state/controls machinery. Reuses
// computeKinematics so the vectors are physically consistent, not hand-waved.
const ANGULAR_VELOCITY_DEG = 55; // deg/s
const RADIUS_FRAC = 0.32; // of min(W, H) — world units are treated as pixels here
const POLE_OFFSET_FRAC = 0.16; // of min(W, H)

export const HomePolarPreview = memo(function HomePolarPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    let phi = 0;
    let lastTime: number | null = null;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas!.getBoundingClientRect();
      canvas!.width = Math.round(rect.width * dpr);
      canvas!.height = Math.round(rect.height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function frame(now: number) {
      const dt =
        lastTime !== null ? Math.min((now - lastTime) / 1000, 0.05) : 0;
      lastTime = now;
      phi += ((ANGULAR_VELOCITY_DEG * Math.PI) / 180) * dt;

      const colors: ColorPalette = document.documentElement.classList.contains(
        "dark",
      )
        ? COLORS_DARK
        : COLORS;

      const dpr = window.devicePixelRatio || 1;
      const W = canvas!.width / dpr;
      const H = canvas!.height / dpr;
      ctx!.clearRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H / 2;
      const R = Math.min(W, H) * RADIUS_FRAC;
      const poleOffset = Math.min(W, H) * POLE_OFFSET_FRAC;

      const state = computeKinematics(phi, ANGULAR_VELOCITY_DEG, {
        poleX: -poleOffset,
        poleY: 0,
        angularVelocity: ANGULAR_VELOCITY_DEG,
        angularAcceleration: 0,
        circleRadius: R,
      });

      // World (Y-up) → screen, with the origin at canvas centre.
      const toScreen = (wx: number, wy: number) => ({ x: cx + wx, y: cy - wy });
      const pt = toScreen(state.ptx, state.pty);
      const pole = toScreen(-poleOffset, 0);

      ctx!.save();
      ctx!.strokeStyle = colors.trajectory;
      ctx!.lineWidth = 1.5;
      ctx!.beginPath();
      ctx!.arc(cx, cy, R, 0, 2 * Math.PI);
      ctx!.stroke();
      ctx!.restore();

      // r vector: pole → point
      drawArrow(ctx!, pole.x, pole.y, pt.x, pt.y, colors.rVector, 2);

      // Polar velocity vectors, same construction as the real simulator
      // (lib/drawing.ts renderFrame): screen eᵣ = (cosθ, −sinθ), eθ = (−sinθ, −cosθ).
      // A bigger scale than the real simulator's velScale(R) — this preview's
      // canvas (and R) is much smaller, so velScale's ratio reads as barely visible.
      const vscale = R / 60;
      const cosT = Math.cos(state.theta);
      const sinT = Math.sin(state.theta);

      const rDotEnd = {
        x: pt.x + state.rDot * vscale * cosT,
        y: pt.y - state.rDot * vscale * sinT,
      };
      drawArrow(ctx!, pt.x, pt.y, rDotEnd.x, rDotEnd.y, colors.radialVelocity, 2);

      const rThetaDotEnd = {
        x: pt.x + state.rThetaDot * vscale * -sinT,
        y: pt.y - state.rThetaDot * vscale * cosT,
      };
      drawArrow(
        ctx!,
        pt.x,
        pt.y,
        rThetaDotEnd.x,
        rThetaDotEnd.y,
        colors.transverseVelocity,
        2,
      );

      drawDot(ctx!, cx, cy, 3, colors.center);
      drawDot(ctx!, pole.x, pole.y, 4, colors.center);
      drawDot(ctx!, pt.x, pt.y, 6, colors.point, "#fff");

      rafId = requestAnimationFrame(frame);
    }
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas ref={canvasRef} aria-hidden="true" className="h-full w-full" />
  );
});
