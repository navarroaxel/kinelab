"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type {
  DragDescentParams,
  DragDescentState,
  DragDescentVisibility,
} from "@/types/simulator";
import { computeDragDescentState } from "@/lib/dragDescentKinematics";

// Defaults match the TP reference case: v_max = 13.20 m/s, t½ = 59.44 s.
const INITIAL_PARAMS: DragDescentParams = {
  A: 0.122,
  B: 0.0007,
  tMax: 120,
};

const INITIAL_VISIBILITY: DragDescentVisibility = {
  showVelocityArrow: true,
  showDragArrow: true,
  showTrace: true,
};

export function useDragDescentSimulator() {
  const [params, setParams] = useState<DragDescentParams>(INITIAL_PARAMS);
  const [visibility, setVisibility] =
    useState<DragDescentVisibility>(INITIAL_VISIBILITY);
  const [paused, setPaused] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  // High-frequency state in refs — no re-render per frame
  const tRef = useRef(0);

  const [metrics, setMetrics] = useState<DragDescentState>(() =>
    computeDragDescentState(INITIAL_PARAMS, 0),
  );

  // Reset t when params change — old trajectory is no longer meaningful
  useEffect(() => {
    tRef.current = 0;
  }, [params.A, params.B, params.tMax]);

  const setParam = useCallback(
    <K extends keyof DragDescentParams>(
      key: K,
      value: DragDescentParams[K],
    ) => {
      setParams((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const toggleVisibility = useCallback((key: keyof DragDescentVisibility) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const reset = useCallback(() => {
    tRef.current = 0;
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
    resetCount,
    tRef,
  };
}
