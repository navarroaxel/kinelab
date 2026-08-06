"use client";

import { useRef, useEffect, useCallback, type MutableRefObject } from "react";
import {
  useRadarTrackingAnimationLoop,
  computeRadarScale,
  toScreen,
} from "@/hooks/useRadarTrackingAnimationLoop";
import { useLanguage } from "@/contexts/LanguageContext";
import type {
  RadarTrackingParams,
  RadarTrackingState,
  RadarTrackingVisibility,
} from "@/types/simulator";

interface Props {
  params: RadarTrackingParams;
  visibility: RadarTrackingVisibility;
  tRef: MutableRefObject<number>;
  loopDuration: number;
  onMetrics: (state: RadarTrackingState) => void;
  onSetRadarPosition: (x: number, y: number) => void;
  paused: boolean;
  resetCount: number;
}

const HIT_RADIUS = 16;

export function RadarTrackingCanvas({
  params,
  visibility,
  tRef,
  loopDuration,
  onMetrics,
  onSetRadarPosition,
  paused,
  resetCount,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useLanguage();
  const draggingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
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
        canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  useRadarTrackingAnimationLoop(
    canvasRef,
    params,
    visibility,
    tRef,
    loopDuration,
    onMetrics,
    paused,
    resetCount,
  );

  const toWorld = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const s = computeRadarScale(rect.width, rect.height, params);
      const screenX = clientX - rect.left;
      const screenY = clientY - rect.top;
      return {
        x: (screenX - s.originX) / s.scale,
        y: -(screenY - s.originY) / s.scale,
        screenX,
        screenY,
      };
    },
    [params],
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const s = computeRadarScale(rect.width, rect.height, params);
    const radarScreen = toScreen(0, 0, s);
    const dx = e.clientX - rect.left - radarScreen.x;
    const dy = e.clientY - rect.top - radarScreen.y;
    if (Math.sqrt(dx * dx + dy * dy) < HIT_RADIUS) {
      draggingRef.current = true;
      canvas.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!draggingRef.current) return;
    const world = toWorld(e.clientX, e.clientY);
    if (!world) return;
    onSetRadarPosition(world.x, world.y);
  };

  const handlePointerUp = () => {
    draggingRef.current = false;
  };

  return (
    <canvas
      ref={canvasRef}
      role="img"
      style={{ width: "100%", aspectRatio: "4 / 3", touchAction: "none" }}
      className="cursor-grab rounded-xl border border-gray-200 dark:border-gray-700"
      aria-label={t("radar-tracking.page.canvas_aria")}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    />
  );
}
