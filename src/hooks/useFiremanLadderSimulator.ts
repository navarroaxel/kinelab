"use client";

import { useState, useRef, useCallback } from "react";
import type {
  Camera3D,
  FiremanLadderParams,
  FiremanLadderState,
  FiremanLadderVisibility,
} from "@/types/simulator";
import { computeFiremanLadderState } from "@/lib/firemanLadderKinematics";

// CCR N°14's own numbers. Because s₀ and θ₂₀ *are* the statement's s and θ₂,
// t = 0 is exactly the instant the exercise asks about — so "reset" and
// "statement instant" are the same operation, and the animation simply carries
// on from there.
const INITIAL_PARAMS: FiremanLadderParams = {
  omega1: 0.8,
  omega2: 0.5,
  sDot: 1.5,
  s0: 10,
  theta20Deg: 30,
};

const INITIAL_VISIBILITY: FiremanLadderVisibility = {
  showVelocity: true,
  showVelocityParts: false,
  showAccel: true,
  showAccelParts: true,
  showTrace: true,
  showAxes: true,
  showGrid: true,
  showTruck: true,
};

const INITIAL_CAMERA: Camera3D = { az: 0.62, el: 0.42 };

const EL_MIN = 0.09; // ~5°
const EL_MAX = 1.48; // ~85°

export function useFiremanLadderSimulator() {
  const [params, setParams] = useState<FiremanLadderParams>(INITIAL_PARAMS);
  const [visibility, setVisibility] =
    useState<FiremanLadderVisibility>(INITIAL_VISIBILITY);
  const [paused, setPaused] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  // High-frequency state in refs — neither the clock nor the camera should
  // ever trigger a React re-render.
  const phaseRef = useRef(0);
  const cameraRef = useRef<Camera3D>({ ...INITIAL_CAMERA });

  const [metrics, setMetrics] = useState<FiremanLadderState>(() =>
    computeFiremanLadderState(INITIAL_PARAMS, 0),
  );

  const setParam = useCallback(
    <K extends keyof FiremanLadderParams>(
      key: K,
      value: FiremanLadderParams[K],
    ) => {
      setParams((prev) => ({ ...prev, [key]: value }));
      phaseRef.current = 0;
      setResetCount((n) => n + 1);
    },
    [],
  );

  const toggleVisibility = useCallback((key: keyof FiremanLadderVisibility) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const reset = useCallback(() => {
    phaseRef.current = 0;
    setResetCount((n) => n + 1);
  }, []);

  /** Freeze the scene on the configuration the exercise asks about. */
  const snapToStatement = useCallback(() => {
    setParams(INITIAL_PARAMS);
    phaseRef.current = 0;
    setPaused(true);
    setResetCount((n) => n + 1);
  }, []);

  const orbitCamera = useCallback((dAz: number, dEl: number) => {
    const cam = cameraRef.current;
    cam.az += dAz;
    cam.el = Math.min(Math.max(cam.el + dEl, EL_MIN), EL_MAX);
  }, []);

  const resetCamera = useCallback(() => {
    cameraRef.current = { ...INITIAL_CAMERA };
  }, []);

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
    snapToStatement,
    resetCount,
    phaseRef,
    cameraRef,
    orbitCamera,
    resetCamera,
  };
}
