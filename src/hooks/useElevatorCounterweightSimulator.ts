"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import type {
  ElevatorCounterweightParams,
  ElevatorCounterweightVisibility,
} from "@/types/simulator";
import { computeElevatorCounterweightState } from "@/lib/elevatorCounterweightKinematics";

const INITIAL_PARAMS: ElevatorCounterweightParams = {
  elevatorMass: 3000,
  counterweightMass: 1000,
  elevatorVelocity: -3,
  elevatorAcceleration: 0,
};

const INITIAL_VISIBILITY: ElevatorCounterweightVisibility = {
  showCars: true,
};

export function useElevatorCounterweightSimulator() {
  const [params, setParams] =
    useState<ElevatorCounterweightParams>(INITIAL_PARAMS);
  const [visibility, setVisibility] =
    useState<ElevatorCounterweightVisibility>(INITIAL_VISIBILITY);
  const [paused, setPaused] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  // Belt-scroll phase — the only high-frequency state; motor power is
  // constant for a given set of params, so it's derived directly rather
  // than threaded through a throttled RAF callback.
  const phaseRef = useRef(0);

  const metrics = useMemo(
    () => computeElevatorCounterweightState(params),
    [params],
  );

  const setParam = useCallback(
    <K extends keyof ElevatorCounterweightParams>(
      key: K,
      value: ElevatorCounterweightParams[K],
    ) => {
      setParams((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const toggleVisibility = useCallback(
    (key: keyof ElevatorCounterweightVisibility) => {
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
