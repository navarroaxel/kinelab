"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import type { AtwoodParams, AtwoodVisibility } from "@/types/simulator";
import { computeAtwoodState } from "@/lib/atwoodKinematics";

const INITIAL_PARAMS: AtwoodParams = {
  mass1: 5,
  mass2: 8,
  pulleyMomentOfInertia: 0,
  pulleyRadius: 0.1,
};

const INITIAL_VISIBILITY: AtwoodVisibility = {
  showMasses: true,
  showForces: true,
};

export function useAtwoodSimulator() {
  const [params, setParams] = useState<AtwoodParams>(INITIAL_PARAMS);
  const [visibility, setVisibility] =
    useState<AtwoodVisibility>(INITIAL_VISIBILITY);
  const [paused, setPaused] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  // The acceleration is exactly constant for a given set of params, so the
  // only thing animated frame-to-frame is a looping travel phase, kept in
  // a ref to avoid triggering re-renders at RAF frequency.
  const phaseRef = useRef(0);

  const metrics = useMemo(() => computeAtwoodState(params), [params]);

  const setParam = useCallback(
    <K extends keyof AtwoodParams>(key: K, value: AtwoodParams[K]) => {
      setParams((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const toggleVisibility = useCallback((key: keyof AtwoodVisibility) => {
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
