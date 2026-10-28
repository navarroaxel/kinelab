"use client";

import { useState, useRef, useCallback } from "react";
import type {
  FourBarParams,
  FourBarState,
  FourBarVisibility,
} from "@/types/simulator";
import { computeFourBarState } from "@/lib/fourBarKinematics";

// CCR N°10's own numbers: D at the origin, CD = BC = 0.6 m, ω_CD = 6 rad/s
// CCW. |AB| = 1.2 m is inferred from the figure (not in the statement).
// α₀ = 90° puts C at (0, 0.6), the statement's own instant, so t = 0 *is* the
// instant the exercise asks about.
const INITIAL_PARAMS: FourBarParams = {
  omegaCD: 6,
  crankLen: 0.6,
  couplerLen: 0.6,
  rockerLen: 1.2,
  alpha0Deg: 90,
};

const INITIAL_VISIBILITY: FourBarVisibility = {
  showVelocity: true,
  showAccel: false,
  showCenter: true,
  showTrace: true,
};

export function useFourBarSimulator() {
  const [params, setParams] = useState<FourBarParams>(INITIAL_PARAMS);
  const [visibility, setVisibility] =
    useState<FourBarVisibility>(INITIAL_VISIBILITY);
  const [paused, setPaused] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  const phaseRef = useRef(0);

  const [metrics, setMetrics] = useState<FourBarState>(() =>
    computeFourBarState(INITIAL_PARAMS, 0),
  );

  const setParam = useCallback(
    <K extends keyof FourBarParams>(key: K, value: FourBarParams[K]) => {
      setParams((prev) => ({ ...prev, [key]: value }));
      phaseRef.current = 0;
      setResetCount((n) => n + 1);
    },
    [],
  );

  const toggleVisibility = useCallback((key: keyof FourBarVisibility) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const reset = useCallback(() => {
    phaseRef.current = 0;
    setResetCount((n) => n + 1);
  }, []);

  /** Freeze the linkage on the configuration the exercise asks about. */
  const snapToStatement = useCallback(() => {
    setParams(INITIAL_PARAMS);
    phaseRef.current = 0;
    setPaused(true);
    setResetCount((n) => n + 1);
  }, []);

  const togglePause = useCallback(() => setPaused((p) => !p), []);

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
    snapToStatement,
    resetCount,
    phaseRef,
  };
}
