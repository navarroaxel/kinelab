"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import type {
  HelicopterLiftParams,
  HelicopterLiftVisibility,
} from "@/types/simulator";
import { computeHelicopterLiftState } from "@/lib/helicopterLiftKinematics";

const INITIAL_PARAMS: HelicopterLiftParams = {
  exhaustVelocity: 80,
  wakeDiameter: 30,
  heliWeight: 3500,
  airDensity: 0.076,
};

const INITIAL_VISIBILITY: HelicopterLiftVisibility = {
  showAirflow: true,
  showForces: true,
};

export function useHelicopterLiftSimulator() {
  const [params, setParams] = useState<HelicopterLiftParams>(INITIAL_PARAMS);
  const [visibility, setVisibility] =
    useState<HelicopterLiftVisibility>(INITIAL_VISIBILITY);
  const [paused, setPaused] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  // Downwash scroll phase — the only high-frequency state; thrust and load
  // are constant for a given set of params, so they're derived directly
  // rather than threaded through a throttled RAF callback.
  const phaseRef = useRef(0);

  const metrics = useMemo(() => computeHelicopterLiftState(params), [params]);

  const setParam = useCallback(
    <K extends keyof HelicopterLiftParams>(
      key: K,
      value: HelicopterLiftParams[K],
    ) => {
      setParams((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const toggleVisibility = useCallback(
    (key: keyof HelicopterLiftVisibility) => {
      setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    [],
  );

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
