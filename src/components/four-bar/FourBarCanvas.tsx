"use client";

import { useRef, useEffect, type MutableRefObject } from "react";
import { useFourBarAnimationLoop } from "@/hooks/useFourBarAnimationLoop";
import { useLanguage } from "@/contexts/LanguageContext";
import type {
  FourBarParams,
  FourBarState,
  FourBarVisibility,
} from "@/types/simulator";

interface Props {
  params: FourBarParams;
  visibility: FourBarVisibility;
  phaseRef: MutableRefObject<number>;
  onMetrics: (state: FourBarState) => void;
  paused: boolean;
  resetCount: number;
}

export function FourBarCanvas({
  params,
  visibility,
  phaseRef,
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

  useFourBarAnimationLoop(
    canvasRef,
    params,
    visibility,
    phaseRef,
    paused,
    resetCount,
    onMetrics,
  );

  return (
    <canvas
      ref={canvasRef}
      role="img"
      style={{ width: "100%", aspectRatio: "16 / 9" }}
      className="rounded-xl border border-gray-200 dark:border-gray-700"
      aria-label={t("fb.page.canvas_aria")}
    />
  );
}
