"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import type { SpringStopParams, SpringStopVisibility } from "@/types/simulator";
import { computeSpringStopState } from "@/lib/springStopKinematics";

const INITIAL_PARAMS: SpringStopParams = {
  packageMass: 70,
  inclineAngle: 20,
  frictionCoefficient: 0.2,
  distanceToSpring: 10,
  speedAtDistance: 6,
  springConstant: 29430,
  precompression: 0.1,
};

const INITIAL_VISIBILITY: SpringStopVisibility = {
  showPackage: true,
  showEnergyBar: true,
};

export function useSpringStopSimulator() {
  const [params, setParams] = useState<SpringStopParams>(INITIAL_PARAMS);
  const [visibility, setVisibility] =
    useState<SpringStopVisibility>(INITIAL_VISIBILITY);
  const [paused, setPaused] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  // Animation-cycle progress — the only high-frequency state; the
  // additional deformation is constant for a given set of params, so it's
  // derived directly rather than threaded through a throttled RAF callback.
  const phaseRef = useRef(0);

  const metrics = useMemo(() => computeSpringStopState(params), [params]);

  const setParam = useCallback(
    <K extends keyof SpringStopParams>(key: K, value: SpringStopParams[K]) => {
      setParams((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const toggleVisibility = useCallback((key: keyof SpringStopVisibility) => {
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
