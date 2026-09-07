"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MassReleaseParams, MassReleaseState } from "@/types/simulator";
import { computeDerived } from "@/lib/massReleaseKinematics";
import { usePreset } from "@/hooks/usePreset";

// VIB 6: M1 = 0.5 kg, M2 = 0.8 kg, k = 0.196 N/cm, undamped.
const INITIAL_PARAMS: MassReleaseParams = {
  hangingMass: 0.8,
  remainingMass: 0.5,
  stiffness: 19.6,
  damping: 0,
};

// VIB 7: the same rig, but k = 3.92 N/cm and c = 0.98 N·s/cm (ζ = 3.5).
const PRESETS: Record<string, MassReleaseParams> = {
  mv7: {
    hangingMass: 0.8,
    remainingMass: 0.5,
    stiffness: 392,
    damping: 98,
  },
};

export function useMassReleaseSimulator() {
  const presetParams = usePreset(PRESETS, INITIAL_PARAMS);
  const [params, setParams] = useState<MassReleaseParams>(presetParams);
  const [paused, setPaused] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  // Elapsed simulation time, held in a ref so the RAF loop never re-renders.
  const tRef = useRef(0);

  const [metrics, setMetrics] = useState<MassReleaseState>(() => {
    const derived = computeDerived(presetParams);
    return { ...derived, t: 0, displacement: derived.x0 };
  });

  // VIB 6 and VIB 7 both route here (only the ?preset= differs), so
  // navigating between them via ExerciseNav doesn't remount this component —
  // without this render-time sync the params would keep whichever preset
  // was active on first mount. Same pattern as usePinSlotSimulator.
  const [prevPresetParams, setPrevPresetParams] = useState(presetParams);
  if (presetParams !== prevPresetParams) {
    setPrevPresetParams(presetParams);
    setParams(presetParams);
  }

  // tRef is a ref, not state — it can't be reset during the render-time sync
  // above, so it's cleared here instead, keyed on the same presetParams
  // identity change.
  useEffect(() => {
    tRef.current = 0;
  }, [presetParams]);

  const setParam = useCallback(
    <K extends keyof MassReleaseParams>(
      key: K,
      value: MassReleaseParams[K],
    ) => {
      setParams((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const reset = useCallback(() => {
    tRef.current = 0;
    setResetCount((n) => n + 1);
  }, []);

  const togglePause = useCallback(() => setPaused((p) => !p), []);

  return {
    params,
    setParam,
    paused,
    togglePause,
    reset,
    resetCount,
    tRef,
    metrics,
    setMetrics,
  };
}
