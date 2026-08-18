"use client";

import { useState, useRef, useCallback } from "react";
import type {
  ParabolicSpringParams,
  ParabolicSpringState,
  ParabolicSpringVisibility,
} from "@/types/simulator";
import { computeParabolicSpringState } from "@/lib/parabolicSpringKinematics";

// Hibbeler 13-74's own numbers. startX / startSpeed *are* the statement's
// x = 1 m and v = 4 m/s, so t = 0 is the instant the exercise asks about and
// Reset lands exactly on it; pressing play then slides the block on down.
const INITIAL_PARAMS: ParabolicSpringParams = {
  mass: 6,
  stiffness: 10,
  naturalLength: 0.5,
  vertex: 2,
  curvatureCoeff: 0.5,
  gravity: 9.81,
  startX: 1,
  startSpeed: 4,
};

const INITIAL_VISIBILITY: ParabolicSpringVisibility = {
  showWeight: true,
  showSpringForce: true,
  showNormal: true,
  showTangential: false,
  showFrame: true,
  showCurvature: true,
  showSpring: true,
};

export function useParabolicSpringSimulator() {
  const [params, setParams] = useState<ParabolicSpringParams>(INITIAL_PARAMS);
  const [visibility, setVisibility] =
    useState<ParabolicSpringVisibility>(INITIAL_VISIBILITY);
  // Starts paused on the statement instant — the exercise is a snapshot, and
  // the descent is there to be started deliberately.
  const [paused, setPaused] = useState(true);
  const [resetCount, setResetCount] = useState(0);

  // High-frequency state in a ref — the RK4 loop never triggers a re-render.
  const motionRef = useRef({
    x: INITIAL_PARAMS.startX,
    speed: INITIAL_PARAMS.startSpeed,
  });

  const [metrics, setMetrics] = useState<ParabolicSpringState>(() =>
    computeParabolicSpringState(
      INITIAL_PARAMS,
      INITIAL_PARAMS.startX,
      INITIAL_PARAMS.startSpeed,
    ),
  );

  const setParam = useCallback(
    <K extends keyof ParabolicSpringParams>(
      key: K,
      value: ParabolicSpringParams[K],
    ) => {
      setParams((prev) => {
        const next = { ...prev, [key]: value };
        // The statement instant moved, so put the block back on it.
        motionRef.current = { x: next.startX, speed: next.startSpeed };
        return next;
      });
      setResetCount((n) => n + 1);
    },
    [],
  );

  const toggleVisibility = useCallback(
    (key: keyof ParabolicSpringVisibility) => {
      setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    [],
  );

  const reset = useCallback(() => {
    setParams(INITIAL_PARAMS);
    motionRef.current = {
      x: INITIAL_PARAMS.startX,
      speed: INITIAL_PARAMS.startSpeed,
    };
    setPaused(true);
    setResetCount((n) => n + 1);
  }, []);

  /** Put the block back on the configured starting point and freeze it. */
  const snapToStart = useCallback(() => {
    motionRef.current = { x: params.startX, speed: params.startSpeed };
    setPaused(true);
    setResetCount((n) => n + 1);
  }, [params.startX, params.startSpeed]);

  const togglePause = useCallback(() => setPaused((p) => !p), []);

  return {
    params,
    setParam,
    visibility,
    toggleVisibility,
    metrics,
    setMetrics,
    paused,
    togglePause,
    reset,
    snapToStart,
    resetCount,
    motionRef,
  };
}
