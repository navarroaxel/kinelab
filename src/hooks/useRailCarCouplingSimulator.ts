"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import type {
  RailCarCouplingParams,
  RailCarCouplingVisibility,
} from "@/types/simulator";
import { computeRailCarCouplingState } from "@/lib/railCarCouplingKinematics";

const INITIAL_PARAMS: RailCarCouplingParams = {
  mass1: 40000,
  mass2: 60000,
  speed1Kmh: 2,
  couplingTime: 3,
};

const INITIAL_VISIBILITY: RailCarCouplingVisibility = {
  showForces: true,
  showVelocityLabels: true,
};

export function useRailCarCouplingSimulator() {
  const [params, setParams] = useState<RailCarCouplingParams>(INITIAL_PARAMS);
  const [visibility, setVisibility] =
    useState<RailCarCouplingVisibility>(INITIAL_VISIBILITY);
  const [paused, setPaused] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  // Animation-cycle elapsed time — the only high-frequency state; the
  // momentum/impulse results are constant for a given set of params, so
  // they're derived directly rather than threaded through a throttled RAF
  // callback.
  const phaseRef = useRef(0);

  const metrics = useMemo(
    () => computeRailCarCouplingState(params),
    [params],
  );

  const setParam = useCallback(
    <K extends keyof RailCarCouplingParams>(
      key: K,
      value: RailCarCouplingParams[K],
    ) => {
      setParams((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const toggleVisibility = useCallback(
    (key: keyof RailCarCouplingVisibility) => {
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
