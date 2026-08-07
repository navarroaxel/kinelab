"use client";

import { useRef, useEffect, type MutableRefObject } from "react";
import { useHoistAnimationLoop } from "@/hooks/useHoistAnimationLoop";
import { useLanguage } from "@/contexts/LanguageContext";
import type { HoistParams, HoistState, HoistVisibility } from "@/types/simulator";

interface Props {
  params: HoistParams;
  state: HoistState;
  visibility: HoistVisibility;
  phaseRef: MutableRefObject<number>;
  paused: boolean;
  resetCount: number;
}

export function HoistCanvas({
  params,
  state,
  visibility,
  phaseRef,
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

  useHoistAnimationLoop(
    canvasRef,
    params,
    state,
    visibility,
    phaseRef,
    paused,
    resetCount,
  );

  return (
    <canvas
      ref={canvasRef}
      role="img"
      style={{ width: "100%", aspectRatio: "4 / 3" }}
      className="rounded-xl border border-gray-200 dark:border-gray-700"
      aria-label={t("hoist.page.canvas_aria")}
    />
  );
}
