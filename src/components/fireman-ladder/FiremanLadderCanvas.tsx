"use client";

import { useRef, type MutableRefObject } from "react";
import { useFiremanLadderAnimationLoop } from "@/hooks/useFiremanLadderAnimationLoop";
import { useLanguage } from "@/contexts/LanguageContext";
import { Scene3D } from "@/components/Scene3D";
import type {
  Camera3D,
  FiremanLadderParams,
  FiremanLadderState,
  FiremanLadderVisibility,
} from "@/types/simulator";

interface Props {
  params: FiremanLadderParams;
  visibility: FiremanLadderVisibility;
  phaseRef: MutableRefObject<number>;
  cameraRef: MutableRefObject<Camera3D>;
  onOrbit: (dAz: number, dEl: number) => void;
  onMetrics: (state: FiremanLadderState) => void;
  paused: boolean;
  resetCount: number;
}

export function FiremanLadderCanvas({
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
  const { t } = useLanguage();

  useFiremanLadderAnimationLoop(
    canvasRef,
    params,
    visibility,
    phaseRef,
    cameraRef,
    paused,
    resetCount,
    onMetrics,
  );

  return (
    <Scene3D
      canvasRef={canvasRef}
      onOrbit={onOrbit}
      ariaLabel={t("fl.page.canvas_aria")}
    />
  );
}
