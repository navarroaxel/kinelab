"use client";

import { useRef, useEffect, type MutableRefObject } from "react";
import { useStoppingDistanceAnimationLoop } from "@/hooks/useStoppingDistanceAnimationLoop";
import { useLanguage } from "@/contexts/LanguageContext";
import type {
  StoppingDistanceParams,
  StoppingDistanceState,
  StoppingDistanceVisibility,
} from "@/types/simulator";

interface Props {
  params: StoppingDistanceParams;
  visibility: StoppingDistanceVisibility;
  tRef: MutableRefObject<number>;
  onMetrics: (state: StoppingDistanceState) => void;
  paused: boolean;
  resetCount: number;
}

export function StoppingDistanceCanvas({
  params,
  visibility,
  tRef,
  onMetrics,
  paused,
  resetCount,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

  useStoppingDistanceAnimationLoop(
    canvasRef,
    params,
    visibility,
    tRef,
    onMetrics,
    paused,
    resetCount,
  );

  return (
    <canvas
      ref={canvasRef}
      role="img"
      style={{ width: "100%", aspectRatio: "16 / 9" }}
      className="rounded-xl border border-gray-200 dark:border-gray-700"
      aria-label={t("stopping-distance.page.canvas_aria")}
    />
  );
}
