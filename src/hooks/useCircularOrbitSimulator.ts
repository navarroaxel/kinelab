"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import type {
  CircularOrbitParams,
  CircularOrbitVisibility,
} from "@/types/simulator";
import { computeOrbit } from "@/lib/circularOrbitKinematics";

const INITIAL_PARAMS: CircularOrbitParams = {
  vKmh: 24000,
  R: 6372,
  g: 9.806,
};

const INITIAL_VISIBILITY: CircularOrbitVisibility = {
  showVelocity: true,
  showNormalAccel: true,
  showDimensions: true,
  showTrace: true,
};

export function useCircularOrbitSimulator() {
  const [params, setParams] = useState<CircularOrbitParams>(INITIAL_PARAMS);
  const [visibility, setVisibility] =
    useState<CircularOrbitVisibility>(INITIAL_VISIBILITY);
  const [paused, setPaused] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  // True anomaly — the only high-frequency state; the orbit itself
  // (r, h, T, a_n) is constant for a given (v, R, g), so it's derived
  // directly rather than threaded through a throttled RAF callback.
  const thetaRef = useRef(0);

  const metrics = useMemo(() => computeOrbit(params), [params]);

  const setParam = useCallback(
    <K extends keyof CircularOrbitParams>(
      key: K,
      value: CircularOrbitParams[K],
    ) => {
      setParams((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const toggleVisibility = useCallback((key: keyof CircularOrbitVisibility) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const reset = useCallback(() => {
    thetaRef.current = 0;
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
    thetaRef,
  };
}
