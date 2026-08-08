"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import type {
  PulleyFrictionParams,
  PulleyFrictionVisibility,
} from "@/types/simulator";
import {
  cableTension,
  appliedForce,
  optimalAngle,
  minimumForce,
} from "@/lib/pulleyFrictionKinematics";

const INITIAL_PARAMS: PulleyFrictionParams = {
  weightA: 1000,
  weightB: 200,
  frictionCoefficient: 0.25,
  inclineAngle: 37,
  pullAngle: 20,
};

const INITIAL_VISIBILITY: PulleyFrictionVisibility = {
  showBlocks: true,
  showForceSweep: true,
};

export function usePulleyFrictionSimulator() {
  const [params, setParams] = useState<PulleyFrictionParams>(INITIAL_PARAMS);
  const [visibility, setVisibility] =
    useState<PulleyFrictionVisibility>(INITIAL_VISIBILITY);
  const [paused, setPaused] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  // Both blocks move at constant velocity in this exercise — the only
  // animated quantity is a looping phase driving the blocks along their
  // paths, so it's kept in a ref rather than triggering re-renders.
  const phaseRef = useRef(0);

  const metrics = useMemo(() => {
    const T = cableTension(params);
    return {
      cableTension: T,
      appliedForce: appliedForce(params.pullAngle, params),
      optimalAngle: optimalAngle(params),
      minimumForce: minimumForce(params),
    };
  }, [params]);

  const setParam = useCallback(
    <K extends keyof PulleyFrictionParams>(
      key: K,
      value: PulleyFrictionParams[K],
    ) => {
      setParams((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const toggleVisibility = useCallback(
    (key: keyof PulleyFrictionVisibility) => {
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
