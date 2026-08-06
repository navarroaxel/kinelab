"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type {
  StoppingDistanceParams,
  StoppingDistanceState,
  StoppingDistanceVisibility,
} from "@/types/simulator";
import { computeAllCases } from "@/lib/stoppingDistanceKinematics";

const INITIAL_PARAMS: StoppingDistanceParams = {
  speedsKmh: [40, 80, 100],
  reactionTime: 0.7,
  decelFactor: 0.5,
  obstacleDistance: 50,
};

const INITIAL_VISIBILITY: StoppingDistanceVisibility = {
  showObstacleMarker: true,
  showTrace: true,
};

export function useStoppingDistanceSimulator() {
  const [params, setParams] = useState<StoppingDistanceParams>(INITIAL_PARAMS);
  const [visibility, setVisibility] =
    useState<StoppingDistanceVisibility>(INITIAL_VISIBILITY);
  const [paused, setPaused] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  const tRef = useRef(0);

  const [metrics, setMetrics] = useState<StoppingDistanceState>(() => ({
    cases: computeAllCases(INITIAL_PARAMS),
    t: 0,
  }));

  useEffect(() => {
    tRef.current = 0;
  }, [params.speedsKmh, params.reactionTime, params.decelFactor]);

  const setSpeed = useCallback((index: 0 | 1 | 2, value: number) => {
    setParams((prev) => {
      const speedsKmh = [...prev.speedsKmh] as [number, number, number];
      speedsKmh[index] = value;
      return { ...prev, speedsKmh };
    });
  }, []);

  const setParam = useCallback(
    <K extends keyof Omit<StoppingDistanceParams, "speedsKmh">>(
      key: K,
      value: StoppingDistanceParams[K],
    ) => {
      setParams((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const toggleVisibility = useCallback(
    (key: keyof StoppingDistanceVisibility) => {
      setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    [],
  );

  const reset = useCallback(() => {
    tRef.current = 0;
    setResetCount((n) => n + 1);
  }, []);

  const togglePause = useCallback(() => setPaused((p) => !p), []);

  return {
    params,
    setSpeed,
    setParam,
    visibility,
    toggleVisibility,
    metrics,
    setMetrics,
    paused,
    togglePause,
    reset,
    resetCount,
    tRef,
  };
}
