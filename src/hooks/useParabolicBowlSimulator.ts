"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import type {
  ParabolicBowlParams,
  ParabolicBowlVisibility,
} from "@/types/simulator";
import { computeParabolicBowlState } from "@/lib/parabolicBowlKinematics";

const INITIAL_PARAMS: ParabolicBowlParams = {
  sphereMass: 1,
  sag: 2,
  span: 6,
  gLimit: 4,
};

const INITIAL_VISIBILITY: ParabolicBowlVisibility = {
  showSphere: true,
  showNormalForce: true,
};

export function useParabolicBowlSimulator() {
  const [params, setParams] = useState<ParabolicBowlParams>(INITIAL_PARAMS);
  const [visibility, setVisibility] =
    useState<ParabolicBowlVisibility>(INITIAL_VISIBILITY);
  const [paused, setPaused] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  // Animation-cycle elapsed time — the only high-frequency state; N(x) and
  // the design metrics are constant for a given set of params, so they're
  // derived directly rather than threaded through a throttled RAF callback.
  const phaseRef = useRef(0);

  const metrics = useMemo(() => computeParabolicBowlState(params), [params]);

  const setParam = useCallback(
    <K extends keyof ParabolicBowlParams>(
      key: K,
      value: ParabolicBowlParams[K],
    ) => {
      setParams((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const toggleVisibility = useCallback(
    (key: keyof ParabolicBowlVisibility) => {
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
