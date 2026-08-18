"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import type {
  JetClimbParams,
  JetClimbSample,
  JetClimbVisibility,
} from "@/types/simulator";
import { computeJetClimbState } from "@/lib/jetClimbKinematics";

// The statement's own numbers: 16 Mg climbing at 774 km/h at 18°, 300 kg/s
// of intake air discharged at 665 m/s relative to the aircraft.
const INITIAL_PARAMS: JetClimbParams = {
  massMg: 16,
  climbAngleDeg: 18,
  climbSpeedKmh: 774,
  massFlowRate: 300,
  exhaustVelocity: 665,
};

const INITIAL_VISIBILITY: JetClimbVisibility = {
  showVectors: true,
  showSpeedLines: true,
};

export function useJetClimbSimulator() {
  const [params, setParams] = useState<JetClimbParams>(INITIAL_PARAMS);
  const [visibility, setVisibility] =
    useState<JetClimbVisibility>(INITIAL_VISIBILITY);
  const [paused, setPaused] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  // Elapsed simulation time since leveling off — a ref so the RAF loop never
  // triggers a re-render; v(t)/a(t) come from the closed-form tanh solution.
  const timeRef = useRef(0);

  const state = useMemo(() => computeJetClimbState(params), [params]);

  const [metrics, setMetrics] = useState<JetClimbSample>(() => ({
    t: 0,
    v: state.v0,
    a: state.initialAccel,
  }));

  const restart = useCallback(() => {
    timeRef.current = 0;
    setResetCount((n) => n + 1);
  }, []);

  const setParam = useCallback(
    <K extends keyof JetClimbParams>(key: K, value: JetClimbParams[K]) => {
      setParams((prev) => ({ ...prev, [key]: value }));
      restart();
    },
    [restart],
  );

  const toggleVisibility = useCallback((key: keyof JetClimbVisibility) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const reset = useCallback(() => {
    restart();
    setPaused(false);
  }, [restart]);

  const togglePause = useCallback(() => setPaused((p) => !p), []);

  return {
    params,
    setParam,
    visibility,
    toggleVisibility,
    state,
    metrics,
    setMetrics,
    paused,
    togglePause,
    reset,
    resetCount,
    timeRef,
  };
}
