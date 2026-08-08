"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import type {
  ParachutistParams,
  ParachutistVisibility,
} from "@/types/simulator";
import { computeParachutistState } from "@/lib/parachutistKinematics";

const INITIAL_PARAMS: ParachutistParams = {
  mass: 80,
  beta: 100,
  initialSpeed: 20,
};

const INITIAL_VISIBILITY: ParachutistVisibility = {
  showParachutist: true,
  showTerminalLine: true,
};

export function useParachutistSimulator() {
  const [params, setParams] = useState<ParachutistParams>(INITIAL_PARAMS);
  const [visibility, setVisibility] =
    useState<ParachutistVisibility>(INITIAL_VISIBILITY);
  const [paused, setPaused] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  // Elapsed fall time — the only high-frequency state; v_t and τ are
  // constant for a given set of params, so they're derived directly
  // rather than threaded through a throttled RAF callback.
  const phaseRef = useRef(0);

  const metrics = useMemo(() => computeParachutistState(params), [params]);

  const setParam = useCallback(
    <K extends keyof ParachutistParams>(
      key: K,
      value: ParachutistParams[K],
    ) => {
      setParams((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const toggleVisibility = useCallback(
    (key: keyof ParachutistVisibility) => {
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
