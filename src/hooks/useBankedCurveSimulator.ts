"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import type {
  BankedCurveParams,
  BankedCurveState,
  BankedCurveVisibility,
  Camera3D,
} from "@/types/simulator";
import {
  bankedCurveLimits,
  computeBankedCurveState,
  idealSpeed,
} from "@/lib/bankedCurveKinematics";

// Hibbeler 13-53 / 13-54's own numbers. The car starts at the frictionless
// ideal speed, the one point on the whole range where the bank does all the
// work and the friction arrow disappears.
const INITIAL_PARAMS: BankedCurveParams = {
  mass: 1700,
  bankDeg: 20,
  radius: 100,
  mu: 0.2,
  gravity: 9.81,
  speed: idealSpeed(100, 9.81, 20),
};

const INITIAL_VISIBILITY: BankedCurveVisibility = {
  showForces: true,
  showNet: true,
  showTrack: true,
  showPath: true,
  showAxes: true,
};

const INITIAL_CAMERA: Camera3D = { az: 0.6, el: 0.34 };

const EL_MIN = 0.04; // ~2°, almost a cross-section view of the bank
const EL_MAX = 1.4; // ~80°, almost a plan view

export function useBankedCurveSimulator() {
  const [params, setParams] = useState<BankedCurveParams>(INITIAL_PARAMS);
  const [visibility, setVisibility] =
    useState<BankedCurveVisibility>(INITIAL_VISIBILITY);
  const [paused, setPaused] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  const phaseRef = useRef(0);
  const cameraRef = useRef<Camera3D>({ ...INITIAL_CAMERA });

  const [metrics, setMetrics] = useState<BankedCurveState>(() =>
    computeBankedCurveState(INITIAL_PARAMS),
  );

  const limits = useMemo(() => bankedCurveLimits(params), [params]);

  const setParam = useCallback(
    <K extends keyof BankedCurveParams>(
      key: K,
      value: BankedCurveParams[K],
    ) => {
      setParams((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const toggleVisibility = useCallback((key: keyof BankedCurveVisibility) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const reset = useCallback(() => {
    setParams(INITIAL_PARAMS);
    phaseRef.current = 0;
    setPaused(false);
    setResetCount((n) => n + 1);
  }, []);

  /** Drive at one of the three speeds the exercise is about. */
  const setSpeed = useCallback((speed: number) => {
    setParams((prev) => ({ ...prev, speed }));
  }, []);

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
    limits,
    paused,
    togglePause,
    reset,
    setSpeed,
    resetCount,
    phaseRef,
    cameraRef,
    orbitCamera,
    resetCamera,
  };
}
