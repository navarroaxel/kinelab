"use client";

import { useRef, useEffect, useState, type MutableRefObject } from "react";
import { useCamFollowerAnimationLoop } from "@/hooks/useCamFollowerAnimationLoop";
import { useLanguage } from "@/contexts/LanguageContext";
import type {
  Camera3D,
  CamFollowerParams,
  CamFollowerState,
  CamFollowerVisibility,
} from "@/types/simulator";

interface Props {
  params: CamFollowerParams;
  visibility: CamFollowerVisibility;
  phaseRef: MutableRefObject<number>;
  cameraRef: MutableRefObject<Camera3D>;
  onOrbit: (dAz: number, dEl: number) => void;
  onMetrics: (state: CamFollowerState) => void;
  paused: boolean;
  resetCount: number;
}

/** Radians of camera rotation per pixel dragged. */
const ORBIT_SENSITIVITY = 0.008;

export function CamFollowerCanvas({
  params,
  visibility,
  phaseRef,
  cameraRef,
  onOrbit,
  onMetrics,
  paused,
  resetCount,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.getContext("2d")?.scale(dpr, dpr);
  }, []);

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
  }, []);

  useCamFollowerAnimationLoop(
    canvasRef,
    params,
    visibility,
    phaseRef,
    cameraRef,
    paused,
    resetCount,
    onMetrics,
  );

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
      (e.clientX - last.x) * ORBIT_SENSITIVITY,
      (e.clientY - last.y) * ORBIT_SENSITIVITY,
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
      aria-label={t("cf.page.canvas_aria")}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    />
  );
}
