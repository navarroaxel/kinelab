"use client";

import { useState, useRef, useCallback } from "react";
import type {
  PlanetaryReducerParams,
  PlanetaryReducerState,
  PlanetaryReducerVisibility,
} from "@/types/simulator";
import { computePlanetaryReducerState } from "@/lib/planetaryReducerKinematics";

// CCR N°15's own numbers: sun and planets all r = 20 cm, ω_A = 1200 rpm
// counter-clockwise. Units are metres, the display layer converts to cm.
const INITIAL_PARAMS: PlanetaryReducerParams = {
  sunRadius: 0.2,
  planetRadius: 0.2,
  rpmSun: 1200,
};

// 1200 rpm is 20 rev/s — unreadable on screen. The animation runs the real
// kinematics at this fraction of real time (0.05 ⇒ the sun turns once a second).
const INITIAL_TIME_SCALE = 0.05;

const INITIAL_VISIBILITY: PlanetaryReducerVisibility = {
  showVelocity: true,
  showCenter: true,
  showCarrier: true,
  showMarks: true,
};

export function usePlanetaryReducerSimulator() {
  const [params, setParams] = useState<PlanetaryReducerParams>(INITIAL_PARAMS);
  const [visibility, setVisibility] =
    useState<PlanetaryReducerVisibility>(INITIAL_VISIBILITY);
  const [timeScale, setTimeScale] = useState(INITIAL_TIME_SCALE);
  const [paused, setPaused] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  const phaseRef = useRef(0);

  const [metrics, setMetrics] = useState<PlanetaryReducerState>(() =>
    computePlanetaryReducerState(INITIAL_PARAMS, 0),
  );

  const setParam = useCallback(
    <K extends keyof PlanetaryReducerParams>(
      key: K,
      value: PlanetaryReducerParams[K],
    ) => {
      setParams((prev) => ({ ...prev, [key]: value }));
      phaseRef.current = 0;
      setResetCount((n) => n + 1);
    },
    [],
  );

  const toggleVisibility = useCallback(
    (key: keyof PlanetaryReducerVisibility) => {
      setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    [],
  );

  const reset = useCallback(() => {
    phaseRef.current = 0;
    setResetCount((n) => n + 1);
  }, []);

  /** Back to the statement's numbers, frozen at t = 0. */
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
    timeScale,
    setTimeScale,
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
