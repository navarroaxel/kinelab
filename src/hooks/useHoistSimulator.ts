"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import type { HoistParams, HoistVisibility } from "@/types/simulator";
import { computeHoistState, maxCounterweightMass } from "@/lib/hoistKinematics";

const INITIAL_PARAMS: HoistParams = {
  loadMass: 300,
  counterweightMass: 100,
  speed: 2,
  wattmeterReading: 2200,
};

const INITIAL_VISIBILITY: HoistVisibility = {
  showLoad: true,
  showPowerFlow: true,
};

export function useHoistSimulator() {
  const [params, setParams] = useState<HoistParams>(INITIAL_PARAMS);
  const [visibility, setVisibility] =
    useState<HoistVisibility>(INITIAL_VISIBILITY);
  const [paused, setPaused] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  // Cable scroll phase — the only high-frequency state; power and efficiency
  // are constant for a given set of params, so they're derived directly
  // rather than threaded through a throttled RAF callback.
  const phaseRef = useRef(0);

  const metrics = useMemo(() => computeHoistState(params), [params]);

  const setParam = useCallback(
    <K extends keyof HoistParams>(key: K, value: HoistParams[K]) => {
      setParams((prev) => {
        const next = { ...prev, [key]: value };
        const maxCw = maxCounterweightMass(next.loadMass);
        if (next.counterweightMass > maxCw) next.counterweightMass = maxCw;
        return next;
      });
    },
    [],
  );

  const toggleVisibility = useCallback((key: keyof HoistVisibility) => {
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
