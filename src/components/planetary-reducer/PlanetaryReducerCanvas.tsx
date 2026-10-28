"use client";

import { useRef, useEffect, type MutableRefObject } from "react";
import { usePlanetaryReducerAnimationLoop } from "@/hooks/usePlanetaryReducerAnimationLoop";
import { useLanguage } from "@/contexts/LanguageContext";
import type {
  PlanetaryReducerParams,
  PlanetaryReducerState,
  PlanetaryReducerVisibility,
} from "@/types/simulator";

interface Props {
  params: PlanetaryReducerParams;
  visibility: PlanetaryReducerVisibility;
  phaseRef: MutableRefObject<number>;
  timeScale: number;
  onMetrics: (state: PlanetaryReducerState) => void;
  paused: boolean;
  resetCount: number;
}

export function PlanetaryReducerCanvas({
  params,
  visibility,
  phaseRef,
  timeScale,
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

  usePlanetaryReducerAnimationLoop(
    canvasRef,
    params,
    visibility,
    phaseRef,
    timeScale,
    paused,
    resetCount,
    onMetrics,
  );

  return (
    <div className="flex flex-col gap-1">
      <canvas
        ref={canvasRef}
        role="img"
        style={{ width: "100%", aspectRatio: "16 / 9" }}
        className="rounded-xl border border-gray-200 dark:border-gray-700"
        aria-label={t("pr.page.canvas_aria")}
      />
      <p className="text-right text-[11px] text-gray-500 dark:text-gray-400">
        {t("pr.page.slow_motion").replace("{scale}", String(timeScale))}
      </p>
    </div>
  );
}
