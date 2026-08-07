"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import type { EscalatorParams, EscalatorVisibility } from "@/types/simulator";
import { computeEscalatorState } from "@/lib/escalatorKinematics";

const INITIAL_PARAMS: EscalatorParams = {
  voltage: 380,
  lineCurrent: 5.365,
  powerFactor: 0.9,
  numPeople: 30,
  personMass: 75,
  height: 7,
  liftTime: 60,
};

const INITIAL_VISIBILITY: EscalatorVisibility = {
  showPassengers: true,
  showPowerFlow: true,
};

export function useEscalatorSimulator() {
  const [params, setParams] = useState<EscalatorParams>(INITIAL_PARAMS);
  const [visibility, setVisibility] =
    useState<EscalatorVisibility>(INITIAL_VISIBILITY);
  const [paused, setPaused] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  // Belt scroll phase — the only high-frequency state; power and efficiency
  // are constant for a given set of params, so they're derived directly
  // rather than threaded through a throttled RAF callback.
  const phaseRef = useRef(0);

  const metrics = useMemo(() => computeEscalatorState(params), [params]);

  const setParam = useCallback(
    <K extends keyof EscalatorParams>(key: K, value: EscalatorParams[K]) => {
      setParams((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const toggleVisibility = useCallback((key: keyof EscalatorVisibility) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const reset = useCallback(() => {
    phaseRef.current = 0;
    setResetCount((n) => n + 1);
  }, []);

  const togglePause = useCallback(() => setPaused((p) => !p), []);

  return {
    params,
    setParam,
    visibility,
    toggleVisibility,
    metrics,
    paused,
    togglePause,
    reset,
    resetCount,
    phaseRef,
  };
}
