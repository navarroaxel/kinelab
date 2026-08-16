"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import type {
  Camera3D,
  CamFollowerParams,
  CamFollowerState,
  CamFollowerVisibility,
} from "@/types/simulator";
import {
  camFollowerExtremes,
  computeCamFollowerState,
} from "@/lib/camFollowerKinematics";

// Hibbeler 13-91's own numbers.
const INITIAL_PARAMS: CamFollowerParams = {
  mass: 2,
  radius: 0.1,
  amplitude: 0.02,
  thetaDot: 5,
  gravity: 9.81,
};

const INITIAL_VISIBILITY: CamFollowerVisibility = {
  showForces: true,
  showProfile: true,
  showSlope: true,
  showAxes: true,
  showFrame: true,
};

const INITIAL_CAMERA: Camera3D = { az: 0.75, el: 0.3 };

const EL_MIN = 0.05; // ~3°, near-side elevation view
const EL_MAX = 1.35; // ~77°

export function useCamFollowerSimulator() {
  const [params, setParams] = useState<CamFollowerParams>(INITIAL_PARAMS);
  const [visibility, setVisibility] =
    useState<CamFollowerVisibility>(INITIAL_VISIBILITY);
  const [paused, setPaused] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  const phaseRef = useRef(0);
  const cameraRef = useRef<Camera3D>({ ...INITIAL_CAMERA });

  const [metrics, setMetrics] = useState<CamFollowerState>(() =>
    computeCamFollowerState(INITIAL_PARAMS, 0),
  );

  // The max/min the exercise asks for depend only on the parameters, so they
  // are derived rather than sampled out of the animation.
  const extremes = useMemo(() => camFollowerExtremes(params), [params]);

  const setParam = useCallback(
    <K extends keyof CamFollowerParams>(
      key: K,
      value: CamFollowerParams[K],
    ) => {
      setParams((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const toggleVisibility = useCallback((key: keyof CamFollowerVisibility) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const reset = useCallback(() => {
    setParams(INITIAL_PARAMS);
    phaseRef.current = 0;
    setResetCount((n) => n + 1);
  }, []);

  /** Freeze the cam on a given angle — used by the max/min shortcut buttons. */
  const goToAngle = useCallback(
    (theta: number) => {
      phaseRef.current =
        params.thetaDot !== 0 ? theta / params.thetaDot : phaseRef.current;
      setPaused(true);
      setResetCount((n) => n + 1);
    },
    [params.thetaDot],
  );

  const orbitCamera = useCallback((dAz: number, dEl: number) => {
    const camera = cameraRef.current;
    camera.az += dAz;
    camera.el = Math.min(Math.max(camera.el + dEl, EL_MIN), EL_MAX);
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
    extremes,
    paused,
    togglePause,
    reset,
    goToAngle,
    resetCount,
    phaseRef,
    cameraRef,
    orbitCamera,
    resetCamera,
  };
}
