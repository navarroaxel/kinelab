"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type {
  RadarTrackingParams,
  RadarTrackingState,
  RadarTrackingVisibility,
} from "@/types/simulator";
import {
  computeRadarTrackingState,
  timeForPhi,
} from "@/lib/radarTrackingKinematics";

const INITIAL_PARAMS: RadarTrackingParams = {
  v0: 150,
  at: 25,
  rhoTraj: 2000,
  radarX: -800,
  radarY: -600,
};

const INITIAL_VISIBILITY: RadarTrackingVisibility = {
  showVelocity: true,
  showAcceleration: true,
  showRadarLine: true,
  showTrace: true,
};

export const PHI_MAX = 1.0; // radians swept from the bottom before the loop resets

export function useRadarTrackingSimulator() {
  const [params, setParams] = useState<RadarTrackingParams>(INITIAL_PARAMS);
  const [visibility, setVisibility] =
    useState<RadarTrackingVisibility>(INITIAL_VISIBILITY);
  const [paused, setPaused] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  const tRef = useRef(0);

  const [metrics, setMetrics] = useState<RadarTrackingState>(() =>
    computeRadarTrackingState(INITIAL_PARAMS, 0),
  );

  useEffect(() => {
    tRef.current = 0;
  }, [params.v0, params.at, params.rhoTraj]);

  const setParam = useCallback(
    <K extends keyof RadarTrackingParams>(
      key: K,
      value: RadarTrackingParams[K],
    ) => {
      setParams((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const setRadarPosition = useCallback((x: number, y: number) => {
    setParams((prev) => ({ ...prev, radarX: x, radarY: y }));
  }, []);

  const toggleVisibility = useCallback((key: keyof RadarTrackingVisibility) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const reset = useCallback(() => {
    tRef.current = 0;
    setResetCount((n) => n + 1);
  }, []);

  const togglePause = useCallback(() => setPaused((p) => !p), []);

  const loopDuration = timeForPhi(PHI_MAX, params);

  return {
    params,
    setParam,
    setRadarPosition,
    visibility,
    toggleVisibility,
    metrics,
    setMetrics,
    paused,
    togglePause,
    reset,
    resetCount,
    tRef,
    loopDuration,
  };
}
