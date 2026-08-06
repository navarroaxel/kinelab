"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type {
  CableBlocksParams,
  CableBlocksState,
  CableBlocksVisibility,
} from "@/types/simulator";
import { computeCableBlocksState } from "@/lib/cableBlocksKinematics";

const INITIAL_PARAMS: CableBlocksParams = {
  aD: 5,
  cCoeff: 3,
  d0: 3,
  runsA: 2,
};

const INITIAL_VISIBILITY: CableBlocksVisibility = {
  showVelocity: true,
  showTrace: true,
};

export function useCableBlocksSimulator() {
  const [params, setParams] = useState<CableBlocksParams>(INITIAL_PARAMS);
  const [visibility, setVisibility] =
    useState<CableBlocksVisibility>(INITIAL_VISIBILITY);
  const [paused, setPaused] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  const tRef = useRef(0);

  const [metrics, setMetrics] = useState<CableBlocksState>(() =>
    computeCableBlocksState(INITIAL_PARAMS, 0),
  );

  useEffect(() => {
    tRef.current = 0;
  }, [params.aD, params.cCoeff, params.d0, params.runsA]);

  const setParam = useCallback(
    <K extends keyof CableBlocksParams>(
      key: K,
      value: CableBlocksParams[K],
    ) => {
      setParams((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const toggleVisibility = useCallback((key: keyof CableBlocksVisibility) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const reset = useCallback(() => {
    tRef.current = 0;
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
    tRef,
  };
}
