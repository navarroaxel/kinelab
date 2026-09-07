"use client";

import { useCallback, useRef, useState } from "react";
import type {
  RotatingUnbalanceParams,
  RotatingUnbalanceState,
} from "@/types/simulator";
import { computeDerived } from "@/lib/rotatingUnbalanceKinematics";

const INITIAL_PARAMS: RotatingUnbalanceParams = {
  motorMass: 25,
  springCount: 4,
  springStiffness: 196_000, // 1960 N/cm
  unbalanceMass: 0.03,
  eccentricity: 0.15,
  rpm: 1500,
  dampingRatio: 0,
};

export function useRotatingUnbalanceSimulator() {
  const [params, setParams] = useState<RotatingUnbalanceParams>(INITIAL_PARAMS);
  const [paused, setPaused] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  // Elapsed simulation time, held in a ref so the RAF loop never re-renders.
  const tRef = useRef(0);

  const [metrics, setMetrics] = useState<RotatingUnbalanceState>(() => {
    const derived = computeDerived(INITIAL_PARAMS);
    return { ...derived, t: 0, displacement: 0, rotorAngle: 0 };
  });

  const setParam = useCallback(
    <K extends keyof RotatingUnbalanceParams>(
      key: K,
      value: RotatingUnbalanceParams[K],
    ) => {
      setParams((prev) => ({ ...prev, [key]: value }));
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
    setParam,
    paused,
    togglePause,
    reset,
    resetCount,
    tRef,
    metrics,
    setMetrics,
  };
}
