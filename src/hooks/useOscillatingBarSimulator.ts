"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import type {
  OscillatingBarParams,
  OscillatingBarState,
  OscillatingBarVisibility,
} from "@/types/simulator";
import {
  barAngleLimits,
  computeOscillatingBarState,
  crankAngleFor,
} from "@/lib/oscillatingBarKinematics";

// The statement's own numbers: b = 1 m, OB = 2b, ω = 3 rad/s, asked at θ = 20°.
const INITIAL_PARAMS: OscillatingBarParams = {
  barLength: 1,
  separation: 2,
  omega: 3,
  targetThetaDeg: 20,
};

const INITIAL_VISIBILITY: OscillatingBarVisibility = {
  showVelocity: true,
  showVelocityParts: true,
  showAccel: false,
  showAccelParts: false,
  showAngles: true,
  showTrace: true,
};

/** Keeps OB clear of OA, where φ = 0 turns singular. */
const MIN_SEPARATION_RATIO = 1.05;

function startingPhase(params: OscillatingBarParams): number {
  const phi = crankAngleFor((params.targetThetaDeg * Math.PI) / 180, params);
  return phi === null ? 0 : phi / Math.max(params.omega, 1e-9);
}

export function useOscillatingBarSimulator() {
  const [params, setParams] = useState<OscillatingBarParams>(INITIAL_PARAMS);
  const [visibility, setVisibility] =
    useState<OscillatingBarVisibility>(INITIAL_VISIBILITY);
  // Opens frozen on the configuration the exercise asks about.
  const [paused, setPaused] = useState(true);
  const [resetCount, setResetCount] = useState(0);

  // The clock is a ref, so turning the crank never triggers a re-render.
  const phaseRef = useRef(startingPhase(INITIAL_PARAMS));

  const [metrics, setMetrics] = useState<OscillatingBarState>(() =>
    computeOscillatingBarState(
      INITIAL_PARAMS,
      INITIAL_PARAMS.omega * startingPhase(INITIAL_PARAMS),
    ),
  );

  const limits = useMemo(() => barAngleLimits(params), [params]);

  const setParam = useCallback(
    <K extends keyof OscillatingBarParams>(
      key: K,
      value: OscillatingBarParams[K],
    ) => {
      setParams((prev) => {
        const next = { ...prev, [key]: value };
        // OB has to stay comfortably longer than OA.
        const floor = next.barLength * MIN_SEPARATION_RATIO;
        if (next.separation < floor) {
          if (key === "separation")
            next.barLength = next.separation / MIN_SEPARATION_RATIO;
          else next.separation = floor;
        }
        phaseRef.current = startingPhase(next);
        return next;
      });
      setResetCount((n) => n + 1);
    },
    [],
  );

  const toggleVisibility = useCallback(
    (key: keyof OscillatingBarVisibility) => {
      setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    [],
  );

  const reset = useCallback(() => {
    setParams(INITIAL_PARAMS);
    phaseRef.current = startingPhase(INITIAL_PARAMS);
    setPaused(true);
    setResetCount((n) => n + 1);
  }, []);

  /** Freeze the mechanism on the configuration the exercise asks about. */
  const snapToStatement = useCallback(() => {
    phaseRef.current = startingPhase(params);
    setPaused(true);
    setResetCount((n) => n + 1);
  }, [params]);

  const togglePause = useCallback(() => setPaused((p) => !p), []);

  return {
    params,
    setParam,
    visibility,
    toggleVisibility,
    metrics,
    setMetrics,
    limits,
    paused,
    togglePause,
    reset,
    snapToStatement,
    resetCount,
    phaseRef,
  };
}
