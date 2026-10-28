"use client";

import { useState, useRef, useCallback } from "react";
import type {
  PinSlotBarParams,
  PinSlotBarState,
  PinSlotBarVisibility,
} from "@/types/simulator";
import { computePinSlotBarState } from "@/lib/pinSlotBarKinematics";

// CCR N°16's own numbers: C at the origin, O = (40, 20) cm, L = CA = 20 cm,
// ω_BO = 2 rad/s clockwise. φ₀ = −135° puts A exactly at (20, 0), the
// statement's own instant, so t = 0 *is* the instant the exercise asks about.
const INITIAL_PARAMS: PinSlotBarParams = {
  pivotOx: 40,
  pivotOy: 20,
  armLength: 20,
  omegaBO: -2,
  phi0Deg: -135,
};

const INITIAL_VISIBILITY: PinSlotBarVisibility = {
  showVelocity: true,
  showVelocityParts: false,
  showAccel: true,
  showAccelParts: true,
  showAngles: true,
  showTrace: true,
};

export function usePinSlotBarSimulator() {
  const [params, setParams] = useState<PinSlotBarParams>(INITIAL_PARAMS);
  const [visibility, setVisibility] =
    useState<PinSlotBarVisibility>(INITIAL_VISIBILITY);
  const [paused, setPaused] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  const phaseRef = useRef(0);

  const [metrics, setMetrics] = useState<PinSlotBarState>(() =>
    computePinSlotBarState(INITIAL_PARAMS, 0),
  );

  const setParam = useCallback(
    <K extends keyof PinSlotBarParams>(
      key: K,
      value: PinSlotBarParams[K],
    ) => {
      setParams((prev) => ({ ...prev, [key]: value }));
      phaseRef.current = 0;
      setResetCount((n) => n + 1);
    },
    [],
  );

  const toggleVisibility = useCallback((key: keyof PinSlotBarVisibility) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const reset = useCallback(() => {
    phaseRef.current = 0;
    setResetCount((n) => n + 1);
  }, []);

  /** Freeze the mechanism on the configuration the exercise asks about. */
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
