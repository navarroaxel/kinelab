"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type {
  QuickReturnParams,
  QuickReturnState,
  QuickReturnVisibility,
} from "@/types/simulator";
import { solve } from "@/lib/quickReturnKinematics";

// Default parameters: r=60, L2=120 → α=60°, quick-return ratio = 2:1
const INITIAL_PARAMS: QuickReturnParams = {
  omega: 1.5,
  r: 60,
  L1: 210,
  L2: 120,
};

const INITIAL_VISIBILITY: QuickReturnVisibility = {
  showVelocity: true,
  showAcceleration: true,
  showTrace: true,
  showGuides: true,
};

export function useQuickReturnSimulator() {
  const [params, setParams] = useState<QuickReturnParams>(INITIAL_PARAMS);
  const [visibility, setVisibility] =
    useState<QuickReturnVisibility>(INITIAL_VISIBILITY);
  const [paused, setPaused] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  // High-frequency state in refs — never triggers re-renders
  const phiRef = useRef(0);

  // Throttled metrics for the panel readouts
  const [metrics, setMetrics] = useState<QuickReturnState>(() =>
    solve(INITIAL_PARAMS, 0),
  );

  // Reset φ when parameters change
  useEffect(() => {
    phiRef.current = 0;
  }, [params.omega, params.r, params.L1, params.L2]);

  const setParam = useCallback(
    <K extends keyof QuickReturnParams>(
      key: K,
      value: QuickReturnParams[K],
    ) => {
      setParams((prev) => {
        const next = { ...prev, [key]: value };
        // Enforce L2 > r — clamp whichever was just changed
        const minGap = 1;
        if (next.L2 <= next.r + minGap) {
          if (key === "L2") next.L2 = next.r + minGap;
          if (key === "r") next.r = next.L2 - minGap;
        }
        return next;
      });
    },
    [],
  );

  const toggleVisibility = useCallback((key: keyof QuickReturnVisibility) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const reset = useCallback(() => {
    phiRef.current = 0;
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
    resetCount,
    phiRef,
  };
}
