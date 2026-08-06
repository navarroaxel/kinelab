"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type {
  ElevatorCableParams,
  ElevatorCableState,
  ElevatorCableVisibility,
} from "@/types/simulator";
import { computeElevatorCableState } from "@/lib/elevatorCableKinematics";

const INITIAL_PARAMS: ElevatorCableParams = {
  b: 10,
  v0: 2,
  x0: 0,
};

const INITIAL_VISIBILITY: ElevatorCableVisibility = {
  showVelocity: true,
  showDrum: true,
  showTrace: true,
};

export function useElevatorCableSimulator() {
  const [params, setParams] = useState<ElevatorCableParams>(INITIAL_PARAMS);
  const [visibility, setVisibility] =
    useState<ElevatorCableVisibility>(INITIAL_VISIBILITY);
  const [paused, setPaused] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  const tauRef = useRef(0);

  const [metrics, setMetrics] = useState<ElevatorCableState>(() =>
    computeElevatorCableState(INITIAL_PARAMS, 0),
  );

  useEffect(() => {
    tauRef.current = 0;
  }, [params.b, params.v0, params.x0]);

  const setParam = useCallback(
    <K extends keyof ElevatorCableParams>(
      key: K,
      value: ElevatorCableParams[K],
    ) => {
      setParams((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const toggleVisibility = useCallback((key: keyof ElevatorCableVisibility) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const reset = useCallback(() => {
    tauRef.current = 0;
    setResetCount((n) => n + 1);
  }, []);

  const togglePause = useCallback(() => setPaused((p) => !p), []);

  const loopDuration = Math.max(10, (4 * params.b) / params.v0);

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
    resetCount,
    tauRef,
    loopDuration,
  };
}
