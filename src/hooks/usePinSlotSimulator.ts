"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type {
  PinSlotParams,
  PinSlotState,
  PinSlotVisibility,
} from "@/types/simulator";
import { computePinSlotState } from "@/lib/pinSlotKinematics";
import { usePreset } from "@/hooks/usePreset";

// Default reference-case values (proportions match r=12.5, d=30, V0=10 cm/s).
// World units here are cm — the canvas renderer auto-scales to fit.
const INITIAL_PARAMS: PinSlotParams = {
  r: 12.5,
  d: 30,
  v0: 10,
};

// CPM 4: the circular guide passes through O (d = r) — see AGENTS.md 3.9.
const PRESETS: Record<string, PinSlotParams> = {
  cpm4: { r: 12.5, d: 12.5, v0: 10 },
};

const INITIAL_VISIBILITY: PinSlotVisibility = {
  showV0: true,
  showVr: true,
  showVPerp: true,
  showAngles: true,
  showRho: true,
};

export function usePinSlotSimulator() {
  const presetParams = usePreset(PRESETS, INITIAL_PARAMS);
  const [params, setParams] = useState<PinSlotParams>(presetParams);
  const [visibility, setVisibility] =
    useState<PinSlotVisibility>(INITIAL_VISIBILITY);
  const [paused, setPaused] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  // High-frequency state in refs — no re-render per frame
  const phiRef = useRef(0);

  // Metrics state (throttled ~15 fps)
  const [metrics, setMetrics] = useState<PinSlotState>(() =>
    computePinSlotState(presetParams, 0),
  );

  // usePreset's return value only seeds the initial useState above — it isn't
  // re-read on its own. CPM 4 and CPM 6 both route to /particle-kinematics/pin-slot
  // (only the `?preset=` query differs), so navigating between them via
  // ExerciseNav doesn't remount this component; without this render-time sync
  // the params would keep whichever preset was active on first mount.
  const [prevPresetParams, setPrevPresetParams] = useState(presetParams);
  if (presetParams !== prevPresetParams) {
    setPrevPresetParams(presetParams);
    setParams(presetParams);
  }

  // Reset phi when params change — old trajectory is no longer meaningful
  useEffect(() => {
    phiRef.current = 0;
  }, [params.r, params.d, params.v0]);

  const setParam = useCallback(
    <K extends keyof PinSlotParams>(key: K, value: PinSlotParams[K]) => {
      setParams((prev) => {
        const next = { ...prev, [key]: value };
        // Clamp d >= r so O never ends up strictly inside the slot circle.
        // d === r is the CPM 4 degenerate case and is explicitly allowed.
        if (next.d < next.r) {
          if (key === "d") next.d = next.r;
          if (key === "r") next.r = next.d;
        }
        return next;
      });
    },
    [],
  );

  const toggleVisibility = useCallback((key: keyof PinSlotVisibility) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const reset = useCallback(() => {
    phiRef.current = 0;
    // Bump resetCount so the animation-loop effect re-runs even while paused,
    // forcing the canvas and metrics to refresh to φ = 0 immediately.
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
    phiRef,
  };
}
