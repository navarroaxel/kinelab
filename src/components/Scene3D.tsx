"use client";

import { useRef, useEffect, useState, type RefObject } from "react";
import type { Camera3D } from "@/types/simulator";

// ---------------------------------------------------------------------------
// Shared canvas shell for the orbitable axonometric 3D simulators: DPR-aware
// sizing, a ResizeObserver, and pointer-drag camera orbiting. The scene's own
// content is drawn by whatever animation-loop hook the consumer runs against
// the same canvasRef — this component owns none of the physics or rendering.
// ---------------------------------------------------------------------------

interface Props {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  onOrbit: (dAz: number, dEl: number) => void;
  ariaLabel: string;
  /** Radians of camera rotation per pixel dragged. */
  orbitSensitivity?: number;
}

const DEFAULT_ORBIT_SENSITIVITY = 0.008;

export function Scene3D({
  canvasRef,
  onOrbit,
  ariaLabel,
  orbitSensitivity = DEFAULT_ORBIT_SENSITIVITY,
}: Props) {
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.getContext("2d")?.scale(dpr, dpr);
  }, [canvasRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const dpr = window.devicePixelRatio || 1;
        const { width, height } = entry.contentRect;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.getContext("2d")?.scale(dpr, dpr);
      }
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [canvasRef]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    setDragging(true);
    canvas.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const last = lastPointerRef.current;
    if (!last) return;
    onOrbit(
      (e.clientX - last.x) * orbitSensitivity,
      (e.clientY - last.y) * orbitSensitivity,
    );
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    lastPointerRef.current = null;
    setDragging(false);
  };

  return (
    <canvas
      ref={canvasRef}
      role="img"
      style={{ width: "100%", aspectRatio: "16 / 9", touchAction: "none" }}
      className={`rounded-xl border border-gray-200 dark:border-gray-700 ${
        dragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      aria-label={ariaLabel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    />
  );
}

// Re-exported so consumers don't need a separate import for the camera type.
export type { Camera3D };
