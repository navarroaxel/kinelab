"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import type {
  ForcedVibrationParams,
  ForcedVibrationState,
  ForcedVibrationVisibility,
} from "@/types/simulator";
import {
  computeProperties,
  computeState,
  type MotionState,
} from "@/lib/forcedVibrationKinematics";

// The statement's own numbers: m = 10 kg, k = 100 kN/m, c = 500 N·s/m,
// F = 1000·cos(120t) N. Starting from rest, so the transient is visible
// before the steady state takes over.
const INITIAL_PARAMS: ForcedVibrationParams = {
  mass: 10,
  stiffness: 100000,
  damping: 500,
  forceAmplitude: 1000,
  forcingOmega: 120,
  initialDisplacement: 0,
  initialVelocity: 0,
  forceEnabled: true,
  slowMotion: 0.05,
};

const INITIAL_VISIBILITY: ForcedVibrationVisibility = {
  showSpringForce: true,
  showDamperForce: true,
  showAppliedForce: true,
  showEnvelope: true,
  showEquilibrium: true,
};

export function useForcedVibrationSimulator() {
  const [params, setParams] = useState<ForcedVibrationParams>(INITIAL_PARAMS);
  const [visibility, setVisibility] =
    useState<ForcedVibrationVisibility>(INITIAL_VISIBILITY);
  const [paused, setPaused] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  // High-frequency state in refs — the integrator never triggers a re-render.
  const motionRef = useRef<MotionState>({
    x: INITIAL_PARAMS.initialDisplacement,
    v: INITIAL_PARAMS.initialVelocity,
  });
  const timeRef = useRef(0);

  const [metrics, setMetrics] = useState<ForcedVibrationState>(() =>
    computeState(INITIAL_PARAMS, 0, {
      x: INITIAL_PARAMS.initialDisplacement,
      v: INITIAL_PARAMS.initialVelocity,
    }),
  );

  const properties = useMemo(() => computeProperties(params), [params]);

  const restart = useCallback((next: ForcedVibrationParams) => {
    motionRef.current = {
      x: next.initialDisplacement,
      v: next.initialVelocity,
    };
    timeRef.current = 0;
    setResetCount((n) => n + 1);
  }, []);

  const setParam = useCallback(
    <K extends keyof ForcedVibrationParams>(
      key: K,
      value: ForcedVibrationParams[K],
    ) => {
      setParams((prev) => {
        const next = { ...prev, [key]: value };
        // Changing the system mid-swing would mix two different transients.
        if (key !== "slowMotion") restart(next);
        return next;
      });
    },
    [restart],
  );

  const toggleVisibility = useCallback(
    (key: keyof ForcedVibrationVisibility) => {
      setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    [],
  );

  const reset = useCallback(() => {
    setParams(INITIAL_PARAMS);
    restart(INITIAL_PARAMS);
    setPaused(false);
  }, [restart]);

  /** Remove the damper — the c = 0 half of the exercise. */
  const setDamping = useCallback(
    (damping: number) => {
      setParams((prev) => {
        const next = { ...prev, damping };
        restart(next);
        return next;
      });
    },
    [restart],
  );

  /** Switch to free vibration: no force, released from a visible offset. */
  const showFreeResponse = useCallback(() => {
    setParams((prev) => {
      const next = {
        ...prev,
        forceEnabled: false,
        initialDisplacement: 0.02,
        initialVelocity: 0,
      };
      restart(next);
      return next;
    });
    setPaused(false);
  }, [restart]);

  /** Back to the forced problem, starting from rest. */
  const showForcedResponse = useCallback(() => {
    setParams((prev) => {
      const next = {
        ...prev,
        forceEnabled: true,
        initialDisplacement: 0,
        initialVelocity: 0,
      };
      restart(next);
      return next;
    });
    setPaused(false);
  }, [restart]);

  const togglePause = useCallback(() => setPaused((p) => !p), []);

  return {
    params,
    setParam,
    setDamping,
    visibility,
    toggleVisibility,
    metrics,
    setMetrics,
    properties,
    paused,
    togglePause,
    reset,
    showFreeResponse,
    showForcedResponse,
    resetCount,
    motionRef,
    timeRef,
  };
}
