"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import type {
  StagedRocketParams,
  StagedRocketVisibility,
} from "@/types/simulator";
import { computeStagedRocketState } from "@/lib/stagedRocketKinematics";

const INITIAL_PARAMS: StagedRocketParams = {
  payloadMass: 540,
  singleStageMass: 19000,
  singleStageFuelMass: 17800,
  twoStageMassEach: 9500,
  twoStageFuelMassEach: 8900,
  fuelRate: 225,
  exhaustVelocity: 3600,
};

const INITIAL_VISIBILITY: StagedRocketVisibility = {
  showSingleStage: true,
  showTwoStage: true,
};

export function useStagedRocketSimulator() {
  const [params, setParams] = useState<StagedRocketParams>(INITIAL_PARAMS);
  const [visibility, setVisibility] =
    useState<StagedRocketVisibility>(INITIAL_VISIBILITY);
  const [paused, setPaused] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  // Simulated flight-time phase — the only high-frequency state; the burn
  // times, separation speed and max speeds are constant for a given set of
  // params, so they're derived directly rather than threaded through a
  // throttled RAF callback.
  const phaseRef = useRef(0);

  const metrics = useMemo(() => computeStagedRocketState(params), [params]);

  const setParam = useCallback(
    <K extends keyof StagedRocketParams>(
      key: K,
      value: StagedRocketParams[K],
    ) => {
      setParams((prev) => {
        const next = { ...prev, [key]: value };
        // Fuel mass can't exceed the stage's total mass (dry mass would go
        // negative) — clamp whichever value would otherwise violate that.
        if (next.singleStageFuelMass > next.singleStageMass) {
          if (key === "singleStageMass") {
            next.singleStageFuelMass = next.singleStageMass;
          } else {
            next.singleStageMass = next.singleStageFuelMass;
          }
        }
        if (next.twoStageFuelMassEach > next.twoStageMassEach) {
          if (key === "twoStageMassEach") {
            next.twoStageFuelMassEach = next.twoStageMassEach;
          } else {
            next.twoStageMassEach = next.twoStageFuelMassEach;
          }
        }
        return next;
      });
    },
    [],
  );

  const toggleVisibility = useCallback(
    (key: keyof StagedRocketVisibility) => {
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
