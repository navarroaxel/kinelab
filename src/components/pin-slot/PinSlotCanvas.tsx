"use client";

import { useRef, useEffect } from "react";
import { usePinSlotAnimationLoop } from "@/hooks/usePinSlotAnimationLoop";
import { useLanguage } from "@/contexts/LanguageContext";
import type {
  PinSlotParams,
  PinSlotState,
  PinSlotVisibility,
} from "@/types/simulator";

interface Props {
  params: PinSlotParams;
  visibility: PinSlotVisibility;
  phiRef: React.MutableRefObject<number>;
  onMetrics: (state: PinSlotState) => void;
  paused: boolean;
  resetCount: number;
}

export function PinSlotCanvas({
  params,
  visibility,
  phiRef,
  onMetrics,
  paused,
  resetCount,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useLanguage();

  // Initial DPR scaling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.getContext("2d")?.scale(dpr, dpr);
  }, []);

  // Rescale on layout changes
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

  usePinSlotAnimationLoop(
    canvasRef,
    params,
    visibility,
    phiRef,
    onMetrics,
    paused,
    resetCount,
  );

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", aspectRatio: "4 / 3" }}
      className="rounded-xl border border-gray-200 dark:border-gray-700"
      aria-label={t("pin-slot.page.canvas_aria")}
    />
  );
}
